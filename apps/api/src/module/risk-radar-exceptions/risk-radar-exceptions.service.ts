import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { 
  RiskRadarExceptionsJeff, 
  RiskRadarMerchAdjParam,
  RiskRadarBatch,
  RiskRadarUser 
} from '@/finance-db/entities';
import { PartnerAndSalesAgentIdentification } from '@/iris-db/entities';
import { RiskRadarBatchRepository } from '@/finance-db/repositories';
import type { RiskRadarExceptionsListParams, RiskRadarExceptionsListResult } from '@/finance-db/queries/risk-radar-exceptions-list';

@Injectable()
export class RiskRadarExceptionsService {
  public constructor(
    @InjectDataSource('finance') private readonly financeDataSource: DataSource,
    @InjectDataSource('iris') private readonly irisDataSource: DataSource,
    @InjectDataSource('connector') private readonly connectorDataSource: DataSource,
    
    @InjectRepository(RiskRadarExceptionsJeff, 'finance')
    private readonly exceptionsRepo: Repository<RiskRadarExceptionsJeff>,
    
    @InjectRepository(RiskRadarMerchAdjParam, 'finance')
    private readonly merchAdjParamRepo: Repository<RiskRadarMerchAdjParam>,
    
    private readonly batchRepo: RiskRadarBatchRepository,
    
    @InjectRepository(RiskRadarUser, 'finance')
    private readonly userRepo: Repository<RiskRadarUser>,
    
    @InjectRepository(PartnerAndSalesAgentIdentification, 'iris')
    private readonly partnerRepo: Repository<PartnerAndSalesAgentIdentification>
  ) {}

  /**
   * Get risk radar exceptions list with filtering and sorting
   * TypeORM implementation of uspRiskRadarExceptionsListVer1 stored procedure
   */
  public async getExceptionsList(params: RiskRadarExceptionsListParams): Promise<RiskRadarExceptionsListResult[]> {
    // Start profiling
    const profileStart = Date.now();
    const profile: Record<string, number> = {};
    
    console.log('PROFILING: Starting getExceptionsList method');
    
    // Parse exception list
    const exceptionTypes = params.sExceptionList
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n));

    // Add one day to end date to match SQL Server behavior
    const endDate = new Date(params.dtEnd);
    endDate.setDate(endDate.getDate() + 1);
    
    profile['1-Setup'] = Date.now() - profileStart;
    console.log(`PROFILING: 1-Setup complete in ${profile['1-Setup']}ms`);
    
    // 1. First, fetch data from all three databases in parallel for better performance
    const dbQueryStart = Date.now();
    const [connectorActivatedData, connectorSettlementData, irisAutoApprovalData] = await Promise.all([
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
      `)
    ]);
    
    profile['2-ParallelDBQueries'] = Date.now() - dbQueryStart;
    console.log(`PROFILING: 2-ParallelDBQueries complete in ${profile['2-ParallelDBQueries']}ms`);

    // 2. Build QueryBuilder for exceptions
    const queryBuildStart = Date.now();
    const query = this.exceptionsRepo.createQueryBuilder('e')
      .leftJoinAndSelect(
        this.userRepo.metadata.tableName,
        'u',
        'u.pkRiskRadarUser = e.fkRiskRadarUserAssigned'
      )
      .leftJoinAndSelect(
        this.merchAdjParamRepo.metadata.tableName,
        'p',
        'p.sMID = e.sMID'
      )
      .where('e.dtCreated BETWEEN :dtStart AND :dtEnd', {
        dtStart: params.dtStart,
        dtEnd: endDate
      })
      .andWhere('e.bHidden = :hidden', { hidden: false });    

    // 3. Apply processor filter
    if (params.iProcessor === 1) {
      query.andWhere('LEFT(e.sMID, 4) IN (:...processors)', { processors: ['5611', '7905'] });
    } else if (params.iProcessor === 2) {
      query.andWhere('LEFT(e.sMID, 4) = :processor', { processor: '8152' });
    } else if (params.iProcessor === 3) {
      query.andWhere('e.iAccountType = :accountType', { accountType: 1 });
    }

    // 4. Apply search conditions
    const hasSearch = 
      (params.sMIDSearch && params.sMIDSearch.trim().length > 0) || 
      (params.sGeneralSearch && params.sGeneralSearch.trim().length > 0);

    if (hasSearch) {
      if (params.sMIDSearch && params.sMIDSearch.trim().length > 0 && params.sMIDSearch !== 'undefined' && params.sMIDSearch !== 'null') {
          query.andWhere('e.sMID LIKE :midSearch', { midSearch: `%${params.sMIDSearch}%` });
      }
      // Note: For sGeneralSearch (DBA and SIC), we would need to join with the iris database
      // This is handled separately in the results processing
    } else {
      // Apply status and user filters when not searching
      if (params.pkRiskRadarExceptionStatus !== 0) {
        query.andWhere('e.fkRiskRadarExceptionStatus = :statusId', { 
          statusId: params.pkRiskRadarExceptionStatus 
        });
        
        if (params.pkRiskRadarUserAssigned !== 0) {
          query.andWhere('e.fkRiskRadarUserAssigned = :userId', { 
            userId: params.pkRiskRadarUserAssigned 
          });
        }
      }
    }
    
    profile['3-QueryBuilder'] = Date.now() - queryBuildStart;
    console.log(`PROFILING: 3-QueryBuilder complete in ${profile['3-QueryBuilder']}ms`);

    // 5. Execute the query
    const queryExecStart = Date.now();
    
    // Add limit to query to retrieve only 100 records for better performance
    //query.take(10);
    console.log('PROFILING: Limited query to 100 records');
    
    const exceptions = await query.getMany();   
    
    profile['4-QueryExecution'] = Date.now() - queryExecStart;
    console.log(`PROFILING: 4-QueryExecution complete in ${profile['4-QueryExecution']}ms (found ${exceptions.length} exceptions, limited to 100)`);

    // 6. Create a map for faster lookups
    const mapCreationStart = Date.now();
    const activatedMap = new Map(
      connectorActivatedData.map(item => [item.sMID, item.dtActivated])
    );
    
    const settlementMap = new Map(
      connectorSettlementData.map(item => [item.sMID, item.dSettlementBalance])
    );
    
    const autoApprovalMap = new Map(
      irisAutoApprovalData.map(item => [item.IrisMId, item.dtIrisUpdated])
    );
    
    profile['5-MapCreation'] = Date.now() - mapCreationStart;
    
    console.log(`PROFILING: 5-MapCreation complete in ${profile['5-MapCreation']}ms`);
    // 7. Process and transform the results
    const transformStart = Date.now();
    let results = await Promise.all(exceptions.map(async exception => {
      // Check for AMEX OptBlue indicator
      const hasAmexOptBlue = await this.batchRepo.hasAMEXOptBlue(exception.merchantId);

      // Calculate total points based on exception flags
      const totalPoints = (
        (exception.transAmountAboveLimit || 0) +
        (exception.numOfKeyedTransAboveLimit || 0) +
        (exception.batchVolAboveLimit || 0) +
        (exception.duplicateCard || 0) +
        (exception.duplicateBin || 0) +
        (exception.latePostTrans || 0) +
        (exception.foreignKeyedTrans || 0) +
        (exception.noAuthTrans || 0) +
        (exception.chargebackOrIRR || 0) +
        (exception.authCaptureAmtLargeVariation || 0) +
        (exception.averageBatch || 0) +
        (exception.negDailyBatches || 0) +
        (exception.mototIoAVS || 0) +
        (exception.authDecline || 0) +
        (exception.transAmtAboveHighTicketLimit || 0) +
        (exception.creditRule || 0) +
        (exception.salesChannelRule || 0) +
        (exception.autoHold || 0)
      );

      const result: RiskRadarExceptionsListResult = {
        pkRiskRadarExceptions: exception.id,
        dNetDepAmt: exception.netDepositAmount,
        sDBA: exception.dba ? exception.dba.substring(0, 30) : null,
        sSolutionConsultant: null, // This comes from iris database via uspPartnerAndSalesAgentIdentification
        bSelfGen: exception.isSelfGenerated ? 'Yes' : null,
        iTransAmtAboveLimit: exception.transAmountAboveLimit !== 0 ? exception.transAmountAboveLimit : null,
        iNumOfKeyedTransAboveLimit: exception.numOfKeyedTransAboveLimit !== 0 ? exception.numOfKeyedTransAboveLimit : null,
        iBatchVolAboveLimit: exception.batchVolAboveLimit !== 0 ? exception.batchVolAboveLimit : null,
        iDupCard: exception.duplicateCard !== 0 ? exception.duplicateCard : null,
        bNewAcct: exception.isNewAccount ? 'Yes' : null,
        iDupBin: exception.duplicateBin !== 0 ? exception.duplicateBin : null,
        iLatePostTrans: exception.latePostTrans !== 0 ? exception.latePostTrans : null,
        iFgnkeyedTrans: exception.foreignKeyedTrans !== 0 ? exception.foreignKeyedTrans : null,
        iNoAuthTrans: exception.noAuthTrans !== 0 ? exception.noAuthTrans : null,
        iChbkOrIRR: exception.chargebackOrIRR !== 0 ? exception.chargebackOrIRR : null,
        bNextDayFundingAcct: exception.isNextDayFundingAccount ? 'Yes' : null,
        sMID: exception.merchantId,
        sNTUserID: exception.userAssignedId ? (await this.userRepo.findOneBy({ id: exception.userAssignedId }))?.ntUserId : null,
        dtTransmission: exception.transmissionDate,
        bDivert: null, // Will be populated from merchAdjParam
        sAMEXOptBlueInd: hasAmexOptBlue ? 'Yes' : null,
        iAuthCaptureAmtLargeVariation: exception.authCaptureAmtLargeVariation !== 0 ? exception.authCaptureAmtLargeVariation : null,
        bRiskWatch: null, // Will be populated from merchAdjParam
        dSettlementBalance: Number(settlementMap.get(exception.merchantId)) || null,
        iAvgBatch: exception.averageBatch !== 0 ? exception.averageBatch : null,
        iNegDailyBatches: exception.negDailyBatches !== 0 ? exception.negDailyBatches : null,
        iMototIoAVS: exception.mototIoAVS !== 0 ? exception.mototIoAVS : null,
        iAuthDecline: exception.authDecline !== 0 ? exception.authDecline : null,
        iTotalPoints: totalPoints > 0 ? totalPoints : null,
        dAuthDeclineAmt: exception.authDeclineAmount || 0,
        sUserReviewed: exception.userReviewed,
        dtActivated: activatedMap.get(exception.merchantId) ? new Date(activatedMap.get(exception.merchantId) as string | number | Date) : null,
        dtCreated: new Date(exception.createdDate),
        sChannel: '', // These come from iris database via uspPartnerAndSalesAgentIdentification
        iAutoHold: exception.autoHold !== 0 ? exception.autoHold : null,
        dtAutoApproved: autoApprovalMap.get(exception.merchantId) ? new Date(autoApprovalMap.get(exception.merchantId) as string | number | Date) : null,
        iTransAmtAboveHighTicketLimit: exception.transAmtAboveHighTicketLimit !== 0 ? exception.transAmtAboveHighTicketLimit : null,
        iCreditRule: exception.creditRule !== 0 ? exception.creditRule : null,
        iSalesChannelRule: exception.salesChannelRule !== 0 ? exception.salesChannelRule : null,
        iFundingExclusionAndException: exception.fundingExclusionAndException,
        dAuthNonDeclinedAmt: exception.authNonDeclinedAmount || 0,
        sReseller: '', // From iris database
        sReferralPartner: '', // From iris database
        sISV: '' // From iris database
      };
      // Get additional merchant parameters
      const merchParams = await this.merchAdjParamRepo.findOne({
        where: { merchantId: exception.merchantId }
      });
      if (merchParams) {
        result.bDivert = merchParams.isDivert ? 'Yes' : null;
        result.bRiskWatch = merchParams.isRiskWatch ? 'Yes' : null;
      }

      return result;
    }));
    
    profile['6-ResultsTransformation'] = Date.now() - transformStart;
    console.log(`PROFILING: 6-ResultsTransformation complete in ${profile['6-ResultsTransformation']}ms`);

    // 8. Get partner and sales agent information from Iris
    // Replace stored procedure call with direct repository query
    const partnerInfoStart = Date.now();
    if (results.length > 0) {
      const mids = results.map(r => r.sMID);
      
      // Use the repository to get partner information
      const partnerInfo = await this.partnerRepo.find({
        where: {
          merchantId: In(mids)
        }
      });

      // Map partner info to results
      const partnerMap = new Map(
        partnerInfo.map(info => [info.merchantId, info])
      );

      results = results.map(result => {
        const info = partnerMap.get(result.sMID);
        if (info) {
          result.sChannel = info.channel || '';
          result.sReseller = info.reseller || '';
          result.sReferralPartner = info.referralPartner || '';
          result.sSolutionConsultant = info.solutionConsultant || '';
          result.sISV = info.isv || '';
        }
        return result;
      });
    }
    
    profile['7-PartnerInfo'] = Date.now() - partnerInfoStart;
    console.log(`PROFILING: 7-PartnerInfo complete in ${profile['7-PartnerInfo']}ms`);

    // 9. Filter results based on exception types
    const filterStart = Date.now();
    if (exceptionTypes.length > 0) {
      const beforeFilterCount = results.length;
      results = results.filter(result => {
        if (exceptionTypes.includes(1) && result.sAMEXOptBlueInd === 'Yes') return true;
        if (exceptionTypes.includes(2) && result.iTransAmtAboveLimit !== null) return true;
        if (exceptionTypes.includes(3) && result.iAuthDecline !== null) return true;
        if (exceptionTypes.includes(4) && result.iAvgBatch !== null) return true;
        if (exceptionTypes.includes(5) && result.iChbkOrIRR !== null) return true;
        if (exceptionTypes.includes(6) && result.bDivert === 'Yes') return true;
        if (exceptionTypes.includes(7) && result.iDupBin !== null) return true;
        if (exceptionTypes.includes(8) && result.iDupCard !== null) return true;
        if (exceptionTypes.includes(9) && result.iFgnkeyedTrans !== null) return true;
        if (exceptionTypes.includes(10) && result.iNumOfKeyedTransAboveLimit !== null) return true;
        if (exceptionTypes.includes(11) && result.iLatePostTrans !== null) return true;
        if (exceptionTypes.includes(12) && result.iMototIoAVS !== null) return true;
        if (exceptionTypes.includes(13) && result.iBatchVolAboveLimit !== null) return true;
        if (exceptionTypes.includes(14) && result.iNegDailyBatches !== null) return true;
        if (exceptionTypes.includes(15) && result.dSettlementBalance !== null && result.dSettlementBalance !== 0) return true;
        if (exceptionTypes.includes(16) && result.bNewAcct === 'Yes') return true;
        if (exceptionTypes.includes(17) && result.bNextDayFundingAcct === 'Yes') return true;
        if (exceptionTypes.includes(18) && result.iNoAuthTrans !== null) return true;
        if (exceptionTypes.includes(19) && result.bRiskWatch === 'Yes') return true;
        if (exceptionTypes.includes(20) && result.iSalesChannelRule !== null) return true;
        if (exceptionTypes.includes(21) && result.iAuthCaptureAmtLargeVariation !== null) return true;
        if (exceptionTypes.includes(22) && result.iAutoHold !== null) return true;
        if (exceptionTypes.includes(23) && result.iTransAmtAboveHighTicketLimit !== null) return true;
        if (exceptionTypes.includes(24) && result.iCreditRule !== null) return true;
        if (exceptionTypes.includes(25) && result.iFundingExclusionAndException !== null) return true;
        
        return false;
      });
      console.log(`PROFILING: Exception types filter reduced results from ${beforeFilterCount} to ${results.length}`);
    }

    // 10. Apply the final view filters
    const beforeViewFilterCount = results.length;
    results = results.filter(result => {
      // If not using all view or the specific MID search matches
      return (
        params.bViewAll || 
        (result.iNegDailyBatches !== null || (result.iTotalPoints !== null && result.iTotalPoints > 20)) ||
        (params.sMIDSearch && result.sMID === params.sMIDSearch)
      );
    });
    
    profile['8-Filtering'] = Date.now() - filterStart;
    console.log(`PROFILING: 8-Filtering complete in ${profile['8-Filtering']}ms (view filter reduced from ${beforeViewFilterCount} to ${results.length})`);

    // 11. Apply sorting
    const sortStart = Date.now();
    const sortField = Math.abs(params.iSortBy);
    const sortDirection = params.iSortBy >= 0 ? 'ASC' : 'DESC';
    
    const getSortValue = (result: RiskRadarExceptionsListResult, field: number) => {
      switch (field) {
        case 1: return result.dNetDepAmt || 0;
        case 2: return result.sDBA || '';
        case 3: return result.sSolutionConsultant || '';
        case 4: return result.bSelfGen || '';
        case 5: return result.iTransAmtAboveLimit || 0;
        case 6: return result.iNumOfKeyedTransAboveLimit || 0;
        case 7: return result.iBatchVolAboveLimit || 0;
        case 8: return result.iDupCard || 0;
        case 9: return result.bNewAcct || '';
        case 10: return result.iDupBin || 0;
        case 11: return result.iLatePostTrans || 0;
        case 12: return result.iFgnkeyedTrans || 0;
        case 13: return result.iNoAuthTrans || 0;
        case 14: return result.iChbkOrIRR || 0;
        case 15: return result.bNextDayFundingAcct || '';
        case 16: return result.sMID;
        case 17: return result.sNTUserID || '';
        case 18: return result.dtTransmission || new Date(0);
        case 19: return result.bDivert || '';
        case 20: return result.sAMEXOptBlueInd || '';
        case 21: return result.iAuthCaptureAmtLargeVariation || 0;
        case 22: return result.iMototIoAVS || 0;
        case 23: return result.dSettlementBalance || 0;
        case 24: return result.bRiskWatch || '';
        case 25: return result.iAvgBatch || 0;
        case 26: return result.iAuthDecline || 0;
        case 27: return result.iNegDailyBatches || 0;
        case 28: return result.iTotalPoints || 0;
        case 29: return result.dAuthDeclineAmt || 0;
        case 30: return result.sUserReviewed || '';
        case 31: return result.dtActivated || new Date(0);
        case 32: return result.dtCreated;
        case 33: return result.sChannel || '';
        case 34: return result.iAutoHold || 0;
        case 35: return result.dtAutoApproved || new Date(0);
        case 36: return result.iTransAmtAboveHighTicketLimit || 0;
        case 37: return result.iCreditRule || 0;
        case 38: return result.iSalesChannelRule || 0;
        case 39: return result.iFundingExclusionAndException || 0;
        case 40: return result.dAuthNonDeclinedAmt || 0;
        case 41: return result.sReseller || '';
        case 42: return result.sReferralPartner || '';
        case 43: return result.sISV || '';
        default: return 0;
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
        return sortDirection === 'ASC' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
    
    profile['9-Sorting'] = Date.now() - sortStart;
    console.log(`PROFILING: 9-Sorting complete in ${profile['9-Sorting']}ms (sorted by field ${sortField} in ${sortDirection} order)`);
    
    // Total execution time
    const totalTime = Date.now() - profileStart;
    console.log('PROFILING SUMMARY:');
    console.log(`Total execution time: ${totalTime}ms`);
    console.log('Breakdown:');
    
    // Calculate percentages and log summary
    Object.entries(profile).forEach(([step, time]) => {
      const percentage = ((time / totalTime) * 100).toFixed(2);
      console.log(`- ${step}: ${time}ms (${percentage}%)`);
    });
    
    return results;
  }
} 