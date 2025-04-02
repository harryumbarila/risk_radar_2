import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories';
import { LeadRepository } from '@/iris-db/repositories';

import type { ExceptionListInputDto } from './dto/exception-list-input.dto';

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
    let query = this.buildFullQuery();

    // Apply initial filters
    query
      .where('exception.bHidden = :isHidden', { isHidden: false })
      .andWhere('exception.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (!viewAllExceptions) {
      query.andWhere('exception.iTotalPoints > 20'); // Only after 20 is considered relevant
    }

    if (processor) {
      switch (processor) {
        case 1:
          query.andWhere(
            'SUBSTRING(exception.sMID, 1, 4) IN (:...processorType1)',
            {
              processorType1: ['5611', '7905'],
            }
          );
          break;
        case 2:
          query.andWhere(
            'SUBSTRING(exception.sMID, 1, 4) IN (:...processorType2)',
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
      query.andWhere('exception.sMID = :merchantId', {
        merchantId,
      });
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

      if (dbaNameOrSIC) {
        query.andWhere(
          '(exception.sDBA LIKE :dbaFilter OR leadsInfo.DBAName LIKE :dbaFilter OR leadsInfo.MccCode LIKE :sicFilter)',
          {
            dbaFilter: `%${dbaNameOrSIC}%`,
            sicFilter: `%${dbaNameOrSIC}%`,
          }
        );
      }
    }

    const limit = pageSize || 25;
    const offset = (page - 1) * limit;
    query.orderBy('exception.iTotalPoints', 'ASC');
    query.limit(limit).offset(offset);

    const countQuery = query.clone().select('COUNT(exception.sMID)');
    const [exceptions, totalCount] = await Promise.all([
      query.getRawMany(),
      countQuery.getCount(),
    ]);

    // Fallback to leads if no merchant exceptions are found (Merchant is always needed if id is provided)
    if (exceptions.length === 0 && merchantId) {
      const merchantFromLeads = await this.leadsRepository.find({
        select: ['id', 'irisMId', 'leadName'],
        where: {
          irisMId: merchantId,
        },
      });

      return {
        pageSize,
        page,
        totalRecords: totalCount,
        data: merchantFromLeads,
      };
    }

    // Return the exceptions with total count (if calculated)
    return {
      pageSize,
      page,
      totalRecords: totalCount,
      data: exceptions,
    };
  }

  // Helper method to build a full query with all joins
  private buildFullQuery() {
    return (
      this.exceptionsJeffRepository
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
          "(SELECT CASE WHEN p.bDivert = 1 THEN 'Yes' ELSE NULL END FROM tblRiskRadarMerchAdjParam p WHERE p.sMID = exception.sMID)",
          'bDivert'
        )
        .addSelect('partners.sChannel', 'sChannel')
        .addSelect('partners.sReseller', 'sReseller')
        .addSelect('partners.sReferralPartner', 'sReferralPartner')
        .addSelect('partners.sSolutionConsultant', 'sSolutionConsultant')
        .addSelect('partners.sISV', 'sISV')
        .addSelect(
          "(SELECT CASE WHEN TOP_BATCH.sAMEXOptBlueInd = 'Y' THEN 'Yes' ELSE NULL END FROM (SELECT TOP 1 batch.sAMEXOptBlueInd FROM tblRiskRadarBatch batch WHERE batch.sMID = exception.sMID ORDER BY batch.pkDFT256Batch DESC) AS TOP_BATCH)",
          'sAMEXOptBlueInd'
        )
        .addSelect('leadsInfo.DBAName', 'DBAName')
        .addSelect('leadsInfo.MccCode', 'MccCode')
        // Left join to connector..tblSnapShotvwLeadsStatusActive
        .leftJoin(
          'connector..tblSnapShotvwLeadsStatusActive',
          'leadsStatus',
          'leadsStatus.sMID = exception.sMID AND leadsStatus.iOrder = 1'
        )
        // Left join to connector..tblSnapShotvwNetSettlementBalanceActive
        .leftJoin(
          'connector..tblSnapShotvwNetSettlementBalanceActive',
          'netSettlement',
          'netSettlement.sMID = exception.sMID AND netSettlement.iOrder = 1'
        )
        // Left join to iris..tblAutoApproval and iris..leads
        .leftJoin(
          'iris..leads',
          'irisLeads',
          'irisLeads.IrisMId = exception.sMID AND irisLeads.IsArchived = 0'
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
          'merchParam.sMID = exception.sMID'
        )
        // Left join to iris..tblPartnerAndSalesAgentIdentification
        .leftJoin(
          'iris..tblPartnerAndSalesAgentIdentification',
          'partners',
          'partners.sMID = exception.sMID'
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
        )
    );
  }
}
