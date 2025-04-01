import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, Logger } from 'nestjs-pino';

import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories';
import { LeadRepository } from '@/iris-db/repositories';

import type { ExceptionListInputDto } from './dto/exception-list-input.dto';

@Injectable()
export class ExceptionsListService {
  public constructor(
    @InjectPinoLogger(ExceptionsListService.name) logger: Logger,
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
      recordsPerPage,
      currentPage,
      viewAllExceptions,
      assignedToUser,
      processor,
    } = data;

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

    // Apply pagination
    const limit = recordsPerPage || 25;
    const offset = currentPage > 1 ? currentPage * limit : 0; // First page offset is 0
    query.limit(limit).offset(offset);

    // Retrieve data from the query
    const exceptions = await query.getRawMany();

    // Fallback to leads if no merchant exceptions are found (Merchant is always needed if id is provided)
    if (exceptions.length === 0 && merchantId) {
      const merchantFromLeads = await this.leadsRepository.find({
        select: ['id', 'irisMId', 'leadName'],
        where: {
          irisMId: merchantId,
        },
      });

      return {
        page: 0,
        recordsPerPage: 25,
        data: merchantFromLeads,
      };
    }

    // Return the exceptions
    return {
      page: 0,
      recordsPerPage: 25,
      data: exceptions,
    };
  }

  // Helper method to build a full query with all joins
  private buildFullQuery() {
    return (
      this.exceptionsJeffRepository
        .createQueryBuilder('exception')
        .select(['exception.*'])
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
