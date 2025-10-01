 
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { getUTCDateString } from '@/api/utils/date-formatter';
import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories';
import { LeadRepository } from '@/iris-db/repositories';

import type { ExceptionListInputDto } from './dto/exception-list-input.dto';
import { SortColumn, SortDirection } from './dto/exception-list-input.dto';

@Injectable()
export class ExceptionsListService {
  public constructor(
    @InjectPinoLogger(ExceptionsListService.name)
    private readonly logger: Logger,
    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository,
    private readonly leadsRepository: LeadRepository
  ) {}

  public async getExceptionList(data: ExceptionListInputDto) {
    const {
      startDate,
      endDate,
      categories,
      status,
      merchantId,
      dbaNameOrSIC,
      pageSize,
      page,
      viewAllExceptions,
      assignedToUser,
      processor,
    } = data;

    // If no categories are provided nor merchantId, return an empty array
    if ((!categories || !categories.length) && !merchantId) {
      return {
        pageSize,
        page,
        totalRecords: 0,
        data: [],
      };
    }

    // Use the query builder to get the query with all joins
    let query = this.buildFullQuery(data);

    // Apply initial filters
    query = this.applyFilters(query, {
      startDate,
      endDate,
      viewAllExceptions,
      processor,
      categories,
      merchantId,
      dbaNameOrSIC,
      status,
      assignedToUser,
    });

    // Create count query before applying sorting and pagination
    const countQuery = query
      .clone()
      .select('COUNT(DISTINCT exception.pkRiskRadarExceptions)', 'count');

    // Apply sorting to main query
    query = this.applySorting(query, data);

    // Pagination
    const limit = pageSize || 25;
    const offset = ((page || 1) - 1) * limit;
    query.limit(limit).offset(offset);

    // Both calls are executed in parallel to speed up the process
    const [exceptions, total] = await Promise.all([
      query.getRawMany(),
      countQuery.getRawOne<{ count: number }>(),
    ]);

    const totalRecords = total?.count || 0;

    // Fallback to leads if no merchant exceptions are found (Merchant is always needed if id is provided)
    if (exceptions.length === 0 && merchantId) {
      const merchantFromLeads = await this.leadsRepository
        .createQueryBuilder('lead')
        .select(['lead.id', 'lead.irisMId', 'lead.leadName'])
        .where('lead.irisMId = CAST(:merchantId AS varchar(16))', {
          merchantId,
        })
        .getMany();

      return {
        pageSize,
        page,
        totalRecords,
        data: merchantFromLeads,
      };
    }

    // Return the exceptions with total count
    return {
      pageSize,
      page,
      totalRecords,
      data: exceptions,
    };
  }

  private applyFilters(
    query: any,
    {
      startDate,
      endDate,
      viewAllExceptions,
      processor,
      categories,
      merchantId,
      dbaNameOrSIC,
      status,
      assignedToUser,
    }: any
  ) {
    // Convert startDate and endDate to America/Chicago time, then adjust to UTC
    const startDateSQL = getUTCDateString(new Date(startDate)); // '2025-03-24 00:00:00'
    const nextDaySQL = getUTCDateString(
      new Date(endDate.setUTCDate(endDate.getUTCDate() + 1))
    );

    // Apply the filters in your query
    query
      .where('exception.bHidden = :isHidden', { isHidden: false })
      .andWhere(
        `exception.dtCreated >= CAST(:startDate AS DATETIME) AND exception.dtCreated < CAST(:endDate AS DATETIME)`,
        {
          startDate: startDateSQL,
          endDate: nextDaySQL,
        }
      );

    if (!viewAllExceptions) {
      query.andWhere(
        '(exception.iTotalPoints > 20 OR (exception.iNegDailyBatches IS NOT NULL AND exception.iNegDailyBatches > 0))'
      );
    }

    if (processor) {
      switch (processor) {
        case 1:
          query.andWhere(
            'SUBSTRING(CAST(exception.sMID AS varchar(16)), 1, 4) IN (:...processorType1)',
            {
              processorType1: ['5611', '7905'],
            }
          );
          break;
        case 2:
          query.andWhere(
            'SUBSTRING(CAST(exception.sMID AS varchar(16)), 1, 4) IN (:...processorType2)',
            {
              processorType2: ['8152'],
            }
          );
          break;
        case 3:
          query.andWhere('exception.iAccountType = :type', {
            type: 1,
          });
          break;
        default:
          break;
      }
    }

    // Apply category filters
    query = this.exceptionsJeffRepository.applyCategoriesFilter2(
      query,
      categories
    );

    // OR assignments
    if (merchantId) {
      query.andWhere('exception.sMID = CAST(:merchantId AS varchar(16))', {
        merchantId,
      });
    } else if (dbaNameOrSIC) {
      query.andWhere(
        '(CAST(exception.sDBA AS varchar(50)) LIKE CAST(:dbaFilter AS varchar(50)) OR CAST(leadsInfo.DBAName AS varchar(150)) LIKE CAST(:dbaFilter AS varchar(50)) OR CAST(leadsInfo.MccCode AS varchar(4)) LIKE CAST(:sicFilter AS varchar(50)))',
        {
          dbaFilter: `%${dbaNameOrSIC}%`,
          sicFilter: `%${dbaNameOrSIC}%`,
        }
      );
    } else {
      if (status) {
        query.andWhere('exception.fkRiskRadarExceptionStatus = :status', {
          status,
        });
      }

      if (assignedToUser) {
        query.andWhere('exception.fkRiskRadarUserAssigned = :assignedToUser', {
          assignedToUser,
        });
      }
    }

    return query;
  }

  private applySorting(query: any, params?: ExceptionListInputDto) {
    if (params?.sortBy) {
      const direction = params.sortDirection || SortDirection.DESC;

      // Handle special cases for joined fields
      switch (params.sortBy) {
        case SortColumn.ACTIVATION_DATE:
          query.orderBy('leadsStatus.dtActivated', direction);
          break;
        case SortColumn.CHANNEL:
        case SortColumn.RESELLER:
        case SortColumn.REFERRAL_PARTNER:
        case SortColumn.SOLUTION_CONSULTANT:
          query.orderBy(`partners.${params.sortBy}`, direction);
          break;
        case SortColumn.AUTO_APPROVED:
          query.orderBy('autoApproval.dtIrisUpdated', direction);
          break;
        case SortColumn.RISK_WATCH:
          query.orderBy(
            'CASE WHEN merchParam.bRiskWatch = 1 THEN 1 ELSE 0 END',
            direction
          );
          break;
        case SortColumn.DIVERT:
          query.orderBy(
            'CASE WHEN exception.bDivert = 1 THEN 1 ELSE 0 END',
            direction
          );
          break;
        case SortColumn.AMEX_OPT_BLUE:
          query.orderBy(
            "CASE WHEN amexBatch.sAMEXOptBlueInd = 'Y' THEN 1 ELSE 0 END",
            direction
          );
          break;
        default:
          query.orderBy(`exception.${params.sortBy}`, direction);
      }

      // Add secondary sort by ID to ensure consistent ordering
      // Only add iTotalPoints as secondary sort if we're not already sorting by it
      if (params.sortBy !== SortColumn.TOTAL_POINTS) {
        query.addOrderBy('exception.iTotalPoints', 'DESC');
      }
      query.addOrderBy('exception.pkRiskRadarExceptions', 'DESC');
    } else {
      // Default sorting
      query
        .orderBy('exception.iTotalPoints', 'DESC')
        .addOrderBy('exception.pkRiskRadarExceptions', 'DESC');
    }

    return query;
  }

  // Helper method to build a full query with all joins
  private buildFullQuery(params?: ExceptionListInputDto) {
    const query = this.exceptionsJeffRepository
      .createQueryBuilder('exception')
      // Select all columns from the exception table to ensure no conflicts with joined fields
      .select([
        'exception.pkRiskRadarExceptions AS pkRiskRadarExceptions',
        'exception.fkRiskRadarExceptionStatus AS fkRiskRadarExceptionStatus',
        'exception.fkRiskRadarUserAssigned AS fkRiskRadarUserAssigned',
        'exception.sBankNum AS sBankNum',
        'exception.dtFunding AS dtFunding',
        'exception.sACHFundingTime AS sACHFundingTime',
        'exception.dtTransmission AS dtTransmission',
        'exception.iTransmissionNum AS iTransmissionNum',
        'exception.dNetDepAmt AS dNetDepAmt',
        'exception.sMID AS sMID',
        'exception.sDBA AS sDBA',
        'exception.dtActivated AS exception_dtActivated',
        'exception.sISA AS sISA',
        'exception.bSelfGen AS bSelfGen',
        'exception.iTransAmtAboveLimit AS iTransAmtAboveLimit',
        'exception.iNumOfKeyedTransAboveLimit AS iNumOfKeyedTransAboveLimit',
        'exception.bBatchVolAboveLimit AS bBatchVolAboveLimit',
        'exception.iDupCard AS iDupCard',
        'exception.bNewAcct AS bNewAcct',
        'exception.iDupBin AS iDupBin',
        'exception.iLatePostTrans AS iLatePostTrans',
        'exception.iFgnkeyedTrans AS iFgnkeyedTrans',
        'exception.iNoAuthTrans AS iNoAuthTrans',
        'exception.bChbkOrIRR AS bChbkOrIRR',
        'exception.bHidden AS bHidden',
        'exception.dtCreated AS dtCreated',
        'exception.bAuthCaptureAmtLargeVariation AS bAuthCaptureAmtLargeVariation',
        'exception.bNextDayFundingAcct AS bNextDayFundingAcct',
        'exception.iMototIoAVS AS iMototIoAVS',
        'exception.dSettlementBalance AS exception_dSettlementBalance',
        'exception.bRiskWatch AS exception_bRiskWatch',
        'exception.iAvgBatch AS iAvgBatch',
        'exception.iAuthDecline AS iAuthDecline',
        'exception.iNegDailyBatches AS iNegDailyBatches',
        'exception.iBatchVolAboveLimit AS iBatchVolAboveLimit',
        'exception.iChbkOrIRR AS iChbkOrIRR',
        'exception.iAuthCaptureAmtLargeVariation AS iAuthCaptureAmtLargeVariation',
        'exception.bDivert AS exception_bDivert',
        'exception.dAuthDeclineAmt AS dAuthDeclineAmt',
        'exception.sUserReviewed AS sUserReviewed',
        'exception.iAutoHold AS iAutoHold',
        'exception.iTransAmtAboveHighTicketLimit AS iTransAmtAboveHighTicketLimit',
        'exception.iCreditRule AS iCreditRule',
        'exception.iSalesChannelRule AS iSalesChannelRule',
        'exception.iFundingExclusionAndException AS iFundingExclusionAndException',
        'exception.dAuthNonDeclinedAmt AS dAuthNonDeclinedAmt',
        'exception.iAccountType AS iAccountType',
        'exception.iTotalPoints AS iTotalPoints',
      ])
      .addSelect('leadsStatus.dtActivated', 'dtActivated')
      .addSelect('netSettlement.dSettlementBalance', 'dSettlementBalance')
      .addSelect('autoApproval.dtIrisUpdated', 'dtAutoApproved')
      .addSelect('user.pkRiskRadarUser', 'riskRadarUserId')
      .addSelect('user.sNTUserID', 'sNTUserID')
      .addSelect(
        'CASE WHEN merchParam.bRiskWatch = 1 THEN 1 ELSE 0 END',
        'bRiskWatch'
      )
      .addSelect(
        "(SELECT CASE WHEN p.bDivert = 1 THEN 'Yes' ELSE NULL END FROM tblRiskRadarMerchAdjParam p WHERE p.sMID = CAST(exception.sMID AS varchar(16)))",
        'bDivert'
      )
      .addSelect('partners.sChannel', 'sChannel')
      .addSelect('partners.sReseller', 'sReseller')
      .addSelect('partners.sReferralPartner', 'sReferralPartner')
      .addSelect('partners.sSolutionConsultant', 'sSolutionConsultant')
      .addSelect('partners.sISV', 'sISV')
      .addSelect(
        "(SELECT CASE WHEN TOP_BATCH.sAMEXOptBlueInd = 'Y' THEN 'Yes' ELSE NULL END FROM (SELECT TOP 1 batch.sAMEXOptBlueInd FROM tblRiskRadarBatch batch WHERE batch.sMID = CAST(exception.sMID AS varchar(16)) ORDER BY batch.pkDFT256Batch DESC) AS TOP_BATCH)",
        'sAMEXOptBlueInd'
      )
      .addSelect('leadsInfo.DBAName', 'DBAName')
      .addSelect('leadsInfo.MccCode', 'MccCode')
      // Left join to connector..tblSnapShotvwLeadsStatusActive
      .leftJoin(
        'connector..tblSnapShotvwLeadsStatusActive',
        'leadsStatus',
        'leadsStatus.sMID = CAST(exception.sMID AS varchar(16)) AND leadsStatus.iOrder = 1'
      )
      // Left join to connector..tblSnapShotvwNetSettlementBalanceActive
      .leftJoin(
        'connector..tblSnapShotvwNetSettlementBalanceActive',
        'netSettlement',
        'netSettlement.sMID = CAST(exception.sMID AS varchar(16)) AND netSettlement.iOrder = 1'
      )
      // Left join to iris..tblAutoApproval and iris..leads
      .leftJoin(
        'iris..leads',
        'irisLeads',
        'irisLeads.IrisMId = CAST(exception.sMID AS varchar(16)) AND irisLeads.IsArchived = 0'
      )
      .leftJoin(
        'iris..tblAutoApproval',
        'autoApproval',
        'autoApproval.LeadId = irisLeads.id AND autoApproval.dtIrisUpdated IS NOT NULL'
      )
      // Left join to tblRiskRadarUser
      .leftJoin(
        'tblRiskRadarUser',
        'user',
        'user.pkRiskRadarUser = exception.fkRiskRadarUserAssigned'
      )
      // Left join to tblRiskRadarMerchAdjParam for RiskWatch and Divert
      .leftJoin(
        'tblRiskRadarMerchAdjParam',
        'merchParam',
        'merchParam.sMID = CAST(exception.sMID AS varchar(16))'
      )
      // Left join to iris..tblPartnerAndSalesAgentIdentification
      .leftJoin(
        'iris..tblPartnerAndSalesAgentIdentification',
        'partners',
        'partners.sMID = CAST(exception.sMID AS varchar(16))'
      )
      // Left join to get AMEX Opt Blue indicator
      .leftJoin(
        (qb) => {
          return qb
            .select('sMID')
            .addSelect('sAMEXOptBlueInd')
            .from('tblRiskRadarBatch', 'batch')
            .where("batch.sAMEXOptBlueInd = 'Y'")
            .orderBy('batch.pkDFT256Batch', 'DESC')
            .limit(1);
        },
        'amexBatch',
        'amexBatch.sMID = exception.sMID'
      )
      // Left join to iris for DBA Name and MCC Code
      .leftJoin(
        'iris..leads',
        'leads',
        'leads.IrisMId = exception.sMID AND leads.IsArchived = 0'
      )
      .leftJoin(
        'iris..LeadsBusinessInformation',
        'leadsInfo',
        'leadsInfo.LeadId = leads.Id'
      );

    return query;
  }
}
