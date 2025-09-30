import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';
import { DataSource } from 'typeorm';

import type { RiskRadarExceptionsListDto } from '@/api/module/risk-radar-exceptions/dto/risk-radar-exception-list.dto';
import type { RiskRadarExceptionsListResultDto } from '@/api/module/risk-radar-exceptions/dto/risk-radar-exceptions-list-result.dto';
import type { PaginatedRiskRadarExceptionsDto } from '@/api/module/risk-radar-exceptions/dto/risk-radar-exceptions-pagination.dto';
import {
  RiskRadarBatchRepository,
  RiskRadarExceptionsJeffRepository,
  RiskRadarMerchAdjParamRepository,
  RiskRadarUserRepository,
} from '@/finance-db/repositories';
import { PartnerAndSalesAgentIdentificationRepository } from '@/iris-db/repositories';

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class RiskRadarExceptionsService {
  public constructor(
    @InjectPinoLogger(RiskRadarExceptionsService.name)
    private readonly logger: Logger,
    @InjectDataSource('iris') private readonly irisDataSource: DataSource,
    @InjectDataSource('connector')
    private readonly connectorDataSource: DataSource,
    private readonly exceptionsRepo: RiskRadarExceptionsJeffRepository,
    private readonly merchAdjParamRepo: RiskRadarMerchAdjParamRepository,
    private readonly batchRepo: RiskRadarBatchRepository,
    private readonly userRepo: RiskRadarUserRepository,
    private readonly partnerRepo: PartnerAndSalesAgentIdentificationRepository
  ) {}

  /**
   * Get risk radar exceptions list with filtering and sorting
   * TypeORM implementation of uspRiskRadarExceptionsListVer1 stored procedure
   */
  public async getExceptionsList(
    params: RiskRadarExceptionsListDto
  ): Promise<PaginatedRiskRadarExceptionsDto> {
    // Start profiling
    const profileStart = Date.now();
    const profile: Record<string, number> = {};

    this.logger.info('PROFILING: Starting getExceptionsList method');

    // Parse exception list
    const exceptionTypes = (params.sExceptionList || '')
      .split(',')
      .map(Number)
      .filter((n: number) => !Number.isNaN(n));

    // Add one day to end date to match SQL Server behavior
    const endDate = new Date(params.dtEnd);
    endDate.setDate(endDate.getDate() + 1);

    profile['1-Setup'] = Date.now() - profileStart;
    this.logger.info(`PROFILING: 1-Setup complete in ${profile['1-Setup']}ms`);

    // 1. First, fetch data from all three databases in parallel for better performance
    type QryResult = {
      sMID: string;
      dtActivated: string;
      dSettlementBalance: string;
      IrisMId: string;
      dtIrisUpdated: string;
    };

    const dbQueryStart = Date.now();
    const queryResult = await Promise.all<[QryResult, QryResult, QryResult]>([
      // Get connector activated data
      this.connectorDataSource.query(`
        SELECT DISTINCT sMID, dtActivated 
        FROM tblSnapShotvwLeadsStatusActive 
        WHERE iOrder = 1
      `),
      // Get connector settlement data
      this.connectorDataSource.query(`
        SELECT sMID, dSettlementBalance 
        FROM tblSnapShotvwNetSettlementBalanceActive 
        WHERE iOrder = 1
      `),
      // Get iris auto approval data
      this.irisDataSource.query(`
        SELECT l.IrisMId, aa.dtIrisUpdated 
        FROM tblAutoApproval aa
        JOIN leads l ON l.id = aa.LeadId AND l.IsArchived = 0
        JOIN LeadsBusinessInformation lbi ON lbi.LeadId = l.Id
        WHERE aa.dtIrisUpdated IS NOT NULL
      `),
    ]);

    const [
      connectorActivatedData,
      connectorSettlementData,
      irisAutoApprovalData,
    ] = queryResult;

    profile['2-ParallelDBQueries'] = Date.now() - dbQueryStart;
    this.logger.info(
      `PROFILING: 2-ParallelDBQueries complete in ${profile['2-ParallelDBQueries']}ms`
    );

    // 2. Build QueryBuilder for exceptions
    const queryBuildStart = Date.now();
    const query = this.exceptionsRepo
      .createQueryBuilder('e')
      .leftJoinAndSelect(
        this.userRepo.metadata.tableName,
        'u',
        'u.pkRiskRadarUser = e.fkRiskRadarUserAssigned'
      )
      .leftJoinAndSelect('tblRiskRadarMerchAdjParam', 'p', 'p.sMID = e.sMID')
      .where('e.dtCreated BETWEEN :dtStart AND :dtEnd', {
        dtStart: params.dtStart,
        dtEnd: endDate,
      })
      .andWhere('e.bHidden = :hidden', { hidden: false });

    // 3. Apply processor filter
    if (params.iProcessor === 1) {
      query.andWhere(
        'LEFT(CAST(e.sMID AS varchar(16)), 4) IN (:...processors)',
        {
          processors: ['5611', '7905'],
        }
      );
    } else if (params.iProcessor === 2) {
      query.andWhere('LEFT(CAST(e.sMID AS varchar(16)), 4) = :processor', {
        processor: '8152',
      });
    } else if (params.iProcessor === 3) {
      query.andWhere('e.iAccountType = :accountType', { accountType: 1 });
    }

    // 4. Apply search conditions
    const hasSearch =
      (params.sMIDSearch && params.sMIDSearch.trim().length > 0) ||
      (params.sGeneralSearch && params.sGeneralSearch.trim().length > 0);

    if (hasSearch) {
      if (
        params.sMIDSearch &&
        params.sMIDSearch.trim().length > 0 &&
        params.sMIDSearch !== 'undefined' &&
        params.sMIDSearch !== 'null'
      ) {
        query.andWhere('e.sMID LIKE CAST(:midSearch AS varchar(20))', {
          midSearch: `%${params.sMIDSearch}%`,
        });
      }
      // Note: For sGeneralSearch (DBA and SIC), we would need to join with the iris database
      // This is handled separately in the results processing
    }

    // Apply status and user filters when not searching
    if (params.pkRiskRadarExceptionStatus !== 0) {
      query.andWhere('e.fkRiskRadarExceptionStatus = :statusId', {
        statusId: params.pkRiskRadarExceptionStatus,
      });

      if (params.pkRiskRadarUserAssigned !== 0) {
        query.andWhere('e.fkRiskRadarUserAssigned = :userId', {
          userId: params.pkRiskRadarUserAssigned,
        });
      }
    }

    profile['3-QueryBuilder'] = Date.now() - queryBuildStart;
    this.logger.info(
      `PROFILING: 3-QueryBuilder complete in ${profile['3-QueryBuilder']}ms`
    );

    // 5. Execute the query
    const queryExecStart = Date.now();

    // Add limit to query to retrieve only 100 records for better performance
    query.take(100);
    this.logger.info('PROFILING: Limited query to 100 records');

    const exceptions = await query.getMany();

    profile['4-QueryExecution'] = Date.now() - queryExecStart;
    this.logger.info(
      `PROFILING: 4-QueryExecution complete in ${profile['4-QueryExecution']}ms (found ${exceptions.length} exceptions, limited to 10)`
    );
    // Return the raw exceptions directly to avoid processing issues

    // 6. Create a map for faster lookups
    const mapCreationStart = Date.now();
    const activatedMap = new Map(
      connectorActivatedData.map((item) => [item.sMID, item.dtActivated])
    );

    const settlementMap = new Map(
      connectorSettlementData.map((item) => [
        item.sMID,
        item.dSettlementBalance,
      ])
    );

    const autoApprovalMap = new Map(
      irisAutoApprovalData.map((item) => [item.IrisMId, item.dtIrisUpdated])
    );

    profile['5-MapCreation'] = Date.now() - mapCreationStart;

    this.logger.info(
      `PROFILING: 5-MapCreation complete in ${profile['5-MapCreation']}ms`
    );
    // 7. Process and transform the results
    const transformStart = Date.now();

    let results = await Promise.all(
      exceptions.map(async (exception) => {
        // Check for AMEX OptBlue indicator
        profile['5.4-MapCreation'] = Date.now() - mapCreationStart;

        this.logger.info(
          `PROFILING: 5.4-MapCreation complete in ${profile['5.4-MapCreation']}ms`
        );

        const hasAmexOptBlue = await this.batchRepo.hasAMEXOptBlue(
          exception.mid
        );

        this.logger.info(
          `PROFILING: 5.5-MapCreation complete in ${profile['5.5-MapCreation']}ms`
        );

        // Calculate total points based on exception flags
        const totalPoints =
          (exception.transactionsAboveLimit || 0) +
          (exception.numberOfKeyedTransactionsAboveLimit || 0) +
          (exception.batchVolumeAboveLimit || 0) +
          (exception.duplicateCards || 0) +
          (exception.duplicateBins || 0) +
          (exception.latePostTransactions || 0) +
          (exception.foreignKeyedTransactions || 0) +
          (exception.unauthorizedTransactions || 0) +
          (exception.chargebackOrIRR || 0) +
          (exception.authCaptureAmountLargeVariation || 0) +
          (exception.averageBatch || 0) +
          (exception.negativeDailyBatches || 0) +
          (exception.motoToIoAVS || 0) +
          (exception.authDeclines || 0) +
          (exception.transactionsAboveHighTicketLimit || 0) +
          (exception.creditRule || 0) +
          (exception.salesChannelRule || 0) +
          (exception.autoHold || 0);

        const result: RiskRadarExceptionsListResultDto = {
          pkRiskRadarExceptions: exception.id,
          dNetDepAmt: exception.netDepositAmount,
          sDBA: exception.dba ? exception.dba.substring(0, 30) : null,
          sSolutionConsultant: null, // This comes from iris database via uspPartnerAndSalesAgentIdentification
          bSelfGen: exception.isSelfGenerated ? 'Yes' : null,
          iTransAmtAboveLimit:
            exception.transactionsAboveLimit !== 0
              ? exception.transactionsAboveLimit
              : null,
          iNumOfKeyedTransAboveLimit:
            exception.numberOfKeyedTransactionsAboveLimit !== 0
              ? exception.numberOfKeyedTransactionsAboveLimit
              : null,
          iBatchVolAboveLimit:
            exception.batchVolumeAboveLimit !== 0
              ? exception.batchVolumeAboveLimit
              : null,
          iDupCard:
            exception.duplicateCards !== 0 ? exception.duplicateCards : null,
          bNewAcct: exception.isNewAccount ? 'Yes' : null,
          iDupBin:
            exception.duplicateBins !== 0 ? exception.duplicateBins : null,
          iLatePostTrans:
            exception.latePostTransactions !== 0
              ? exception.latePostTransactions
              : null,
          iFgnkeyedTrans:
            exception.foreignKeyedTransactions !== 0
              ? exception.foreignKeyedTransactions
              : null,
          iNoAuthTrans:
            exception.unauthorizedTransactions !== 0
              ? exception.unauthorizedTransactions
              : null,
          iChbkOrIRR:
            exception.chargebackOrIRR !== 0 ? exception.chargebackOrIRR : null,
          bNextDayFundingAcct: exception.isNextDayFundingAccount ? 'Yes' : null,
          sMID: exception.mid,
          sNTUserID: exception.assignedUserId
            ? (await this.userRepo.findOneBy({ id: exception.assignedUserId }))
                ?.ntUserId
            : null,
          dtTransmission: exception.transmissionDate,
          bDivert: null, // Will be populated from merchAdjParam
          sAMEXOptBlueInd: hasAmexOptBlue ? 'Yes' : null,
          iAuthCaptureAmtLargeVariation:
            exception.authCaptureAmountLargeVariation !== 0
              ? exception.authCaptureAmountLargeVariation
              : null,
          bRiskWatch: null, // Will be populated from merchAdjParam
          dSettlementBalance: Number(settlementMap.get(exception.mid)) || null,
          iAvgBatch:
            exception.averageBatch !== 0 ? exception.averageBatch : null,
          iNegDailyBatches:
            exception.negativeDailyBatches !== 0
              ? exception.negativeDailyBatches
              : null,
          iMototIoAVS:
            exception.motoToIoAVS !== 0 ? exception.motoToIoAVS : null,
          iAuthDecline:
            exception.authDeclines !== 0 ? exception.authDeclines : null,
          iTotalPoints: totalPoints > 0 ? totalPoints : null,
          dAuthDeclineAmt: exception.authDeclineAmount || 0,
          sUserReviewed: exception.userReviewed,
          dtActivated: activatedMap.get(exception.mid)
            ? new Date(
                activatedMap.get(exception.mid) as string | number | Date
              )
            : null,
          dtCreated: new Date(exception.createdAt),
          sChannel: '', // These come from iris database via uspPartnerAndSalesAgentIdentification
          iAutoHold: exception.autoHold !== 0 ? exception.autoHold : null,
          dtAutoApproved: autoApprovalMap.get(exception.mid)
            ? new Date(
                autoApprovalMap.get(exception.mid) as string | number | Date
              )
            : null,
          iTransAmtAboveHighTicketLimit:
            exception.transactionsAboveHighTicketLimit !== 0
              ? exception.transactionsAboveHighTicketLimit
              : null,
          iCreditRule: exception.creditRule !== 0 ? exception.creditRule : null,
          iSalesChannelRule:
            exception.salesChannelRule !== 0
              ? exception.salesChannelRule
              : null,
          iFundingExclusionAndException: exception.fundingExclusionAndException,
          dAuthNonDeclinedAmt: exception.authNonDeclinedAmount || 0,
          sReseller: '', // From iris database
          sReferralPartner: '', // From iris database
          sISV: '', // From iris database
        };
        // Get additional merchant parameters
        const merchParams = await this.merchAdjParamRepo.findByMerchantId(
          exception.mid
        );
        if (merchParams) {
          result.bDivert = merchParams.isDivert ? 'Yes' : null;
          result.bRiskWatch = merchParams.isRiskWatch ? 'Yes' : null;
        }

        return result;
      })
    );

    profile['6-ResultsTransformation'] = Date.now() - transformStart;
    this.logger.info(
      `PROFILING: 6-ResultsTransformation complete in ${profile['6-ResultsTransformation']}ms`
    );

    // 8. Get partner and sales agent information from Iris
    // Replace stored procedure call with direct repository query
    const partnerInfoStart = Date.now();
    if (results.length > 0) {
      const mids = results.map((r) => r.sMID);

      // Use the repository to get partner information
      const partnerInfo = await this.partnerRepo.findForMerchants(mids);

      // Map partner info to results
      const partnerMap = new Map(partnerInfo.map((info) => [info.mid, info]));

      profile['6.5-PartnerInfo'] = Date.now() - partnerInfoStart;
      this.logger.info(
        `PROFILING: 6.5-PartnerInfo complete in ${profile['6.5-PartnerInfo']}ms`
      );

      results = results.map((result) => {
        const info = partnerMap.get(result.sMID);
        let newResult = { ...result };

        if (info) {
          newResult = {
            ...result,
            sChannel: info.channel || '',
            sReseller: info.reseller || '',
            sReferralPartner: info.referralPartner || '',
            sSolutionConsultant: info.solutionConsultant || '',
            sISV: info.isv || '',
          };
        }
        return newResult;
      });
    }

    profile['7-PartnerInfo'] = Date.now() - partnerInfoStart;
    this.logger.info(
      `PROFILING: 7-PartnerInfo complete in ${profile['7-PartnerInfo']}ms`
    );

    // 9. Filter results based on exception types
    const filterStart = Date.now();
    if (exceptionTypes.length > 0) {
      const beforeFilterCount = results.length;
      results = results.filter((result) => {
        if (exceptionTypes.includes(1) && result.sAMEXOptBlueInd === 'Yes') {
          return true;
        }
        if (exceptionTypes.includes(2) && result.iTransAmtAboveLimit !== null) {
          return true;
        }
        if (exceptionTypes.includes(3) && result.iAuthDecline !== null) {
          return true;
        }
        if (exceptionTypes.includes(4) && result.iAvgBatch !== null) {
          return true;
        }
        if (exceptionTypes.includes(5) && result.iChbkOrIRR !== null) {
          return true;
        }
        if (exceptionTypes.includes(6) && result.bDivert === 'Yes') return true;
        if (exceptionTypes.includes(7) && result.iDupBin !== null) return true;
        if (exceptionTypes.includes(8) && result.iDupCard !== null) return true;
        if (exceptionTypes.includes(9) && result.iFgnkeyedTrans !== null) {
          return true;
        }
        if (
          exceptionTypes.includes(10) &&
          result.iNumOfKeyedTransAboveLimit !== null
        ) {
          return true;
        }
        if (exceptionTypes.includes(11) && result.iLatePostTrans !== null) {
          return true;
        }
        if (exceptionTypes.includes(12) && result.iMototIoAVS !== null) {
          return true;
        }
        if (
          exceptionTypes.includes(13) &&
          result.iBatchVolAboveLimit !== null
        ) {
          return true;
        }
        if (exceptionTypes.includes(14) && result.iNegDailyBatches !== null) {
          return true;
        }
        if (
          exceptionTypes.includes(15) &&
          result.dSettlementBalance !== null &&
          result.dSettlementBalance !== 0
        ) {
          return true;
        }
        if (exceptionTypes.includes(16) && result.bNewAcct === 'Yes') {
          return true;
        }
        if (
          exceptionTypes.includes(17) &&
          result.bNextDayFundingAcct === 'Yes'
        ) {
          return true;
        }
        if (exceptionTypes.includes(18) && result.iNoAuthTrans !== null) {
          return true;
        }
        if (exceptionTypes.includes(19) && result.bRiskWatch === 'Yes') {
          return true;
        }
        if (exceptionTypes.includes(20) && result.iSalesChannelRule !== null) {
          return true;
        }
        if (
          exceptionTypes.includes(21) &&
          result.iAuthCaptureAmtLargeVariation !== null
        ) {
          return true;
        }
        if (exceptionTypes.includes(22) && result.iAutoHold !== null) {
          return true;
        }
        if (
          exceptionTypes.includes(23) &&
          result.iTransAmtAboveHighTicketLimit !== null
        ) {
          return true;
        }
        if (exceptionTypes.includes(24) && result.iCreditRule !== null) {
          return true;
        }
        if (
          exceptionTypes.includes(25) &&
          result.iFundingExclusionAndException !== null
        ) {
          return true;
        }

        return false;
      });
      this.logger.info(
        `PROFILING: Exception types filter reduced results from ${beforeFilterCount} to ${results.length}`
      );
    }

    // 10. Apply the final view filters
    const beforeViewFilterCount = results.length;
    results = results.filter((result) => {
      // If not using all view or the specific MID search matches
      return (
        params.bViewAll ||
        result.iNegDailyBatches !== null ||
        (result.iTotalPoints && result.iTotalPoints > 20) ||
        (params.sMIDSearch && result.sMID === params.sMIDSearch)
      );
    });

    profile['8-Filtering'] = Date.now() - filterStart;
    this.logger.info(
      `PROFILING: 8-Filtering complete in ${profile['8-Filtering']}ms (view filter reduced from ${beforeViewFilterCount} to ${results.length})`
    );

    // 11. Apply sorting
    const sortStart = Date.now();
    const sortField = Math.abs(params.iSortBy);
    const sortDirection = params.iSortBy >= 0 ? 'ASC' : 'DESC';

    const getSortValue = (
      result: RiskRadarExceptionsListResultDto,
      field: number
    ) => {
      switch (field) {
        case 1:
          return result.dNetDepAmt || 0;
        case 2:
          return result.sDBA || '';
        case 3:
          return result.sSolutionConsultant || '';
        case 4:
          return result.bSelfGen || '';
        case 5:
          return result.iTransAmtAboveLimit || 0;
        case 6:
          return result.iNumOfKeyedTransAboveLimit || 0;
        case 7:
          return result.iBatchVolAboveLimit || 0;
        case 8:
          return result.iDupCard || 0;
        case 9:
          return result.bNewAcct || '';
        case 10:
          return result.iDupBin || 0;
        case 11:
          return result.iLatePostTrans || 0;
        case 12:
          return result.iFgnkeyedTrans || 0;
        case 13:
          return result.iNoAuthTrans || 0;
        case 14:
          return result.iChbkOrIRR || 0;
        case 15:
          return result.bNextDayFundingAcct || '';
        case 16:
          return result.sMID;
        case 17:
          return result.sNTUserID || '';
        case 18:
          return result.dtTransmission || new Date(0);
        case 19:
          return result.bDivert || '';
        case 20:
          return result.sAMEXOptBlueInd || '';
        case 21:
          return result.iAuthCaptureAmtLargeVariation || 0;
        case 22:
          return result.iMototIoAVS || 0;
        case 23:
          return result.dSettlementBalance || 0;
        case 24:
          return result.bRiskWatch || '';
        case 25:
          return result.iAvgBatch || 0;
        case 26:
          return result.iAuthDecline || 0;
        case 27:
          return result.iNegDailyBatches || 0;
        case 28:
          return result.iTotalPoints || 0;
        case 29:
          return result.dAuthDeclineAmt || 0;
        case 30:
          return result.sUserReviewed || '';
        case 31:
          return result.dtActivated || new Date(0);
        case 32:
          return result.dtCreated;
        case 33:
          return result.sChannel || '';
        case 34:
          return result.iAutoHold || 0;
        case 35:
          return result.dtAutoApproved || new Date(0);
        case 36:
          return result.iTransAmtAboveHighTicketLimit || 0;
        case 37:
          return result.iCreditRule || 0;
        case 38:
          return result.iSalesChannelRule || 0;
        case 39:
          return result.iFundingExclusionAndException || 0;
        case 40:
          return result.dAuthNonDeclinedAmt || 0;
        case 41:
          return result.sReseller || '';
        case 42:
          return result.sReferralPartner || '';
        case 43:
          return result.sISV || '';
        default:
          return 0;
      }
    };

    results.sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'ASC'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'ASC'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'ASC' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    profile['9-Sorting'] = Date.now() - sortStart;
    this.logger.info(
      `PROFILING: 9-Sorting complete in ${profile['9-Sorting']}ms (sorted by field ${sortField} in ${sortDirection} order)`
    );

    // Set default pagination values if not provided
    const recordsPerPage = params.recordsPerPage || 25;
    const currentPage = params.currentPage || 1;

    // Calculate pagination metadata
    const totalRecords = results.length;
    const lastPage = Math.ceil(totalRecords / recordsPerPage);
    const from = (currentPage - 1) * recordsPerPage + 1;
    const to = Math.min(currentPage * recordsPerPage, totalRecords);

    // Apply pagination to results
    const paginatedResults = results.slice(from - 1, to);

    // Total execution time
    const totalTime = Date.now() - profileStart;
    this.logger.info('PROFILING SUMMARY:');
    this.logger.info(`Total execution time: ${totalTime}ms`);
    this.logger.info('Breakdown:');

    // Calculate percentages and log summary
    Object.entries(profile).forEach(([step, time]) => {
      const percentage = ((time / totalTime) * 100).toFixed(2);
      this.logger.info(`- ${step}: ${time}ms (${percentage}%)`);
    });

    return {
      data: paginatedResults,
      meta: {
        records_per_page: recordsPerPage,
        current_page: currentPage,
        last_page: lastPage,
        from_record: from,
        to_record: to,
      },
    };
  }
}
