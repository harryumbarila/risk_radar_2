import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClxReportingRepository } from '@/data-warehouse-db/repositories';
import {
  RiskRadarEmailTemplateEntity,
  RiskRadarUserEntity,
  RiskRadarExceptionsJeffEntity,
  RiskRadarMerchantAdjParamEntity,
  ChargeBacksEntity,
  RiskRadarExceptionListLookupEntity,
  RiskRadarBatch
} from '@/finance-db/entities';
import { 
  RiskRadarEmailTemplateRepository,
  RiskRadarUserRepository,
  RiskRadarExceptionsJeffRepository,
  MerchantExceptionDetailRepository,
  RiskRadarMerchAdjParamRepository,
  RiskRadarBatchRepository,
  RiskRadarNotesRepository
} from '@/finance-db/repositories';

import { 
  LeadEntity, 
  LeadsBusinessInformationEntity,
  LeadsServicesEntity,
  LeadsUnderwritingEntity,
  LeadsFinancialProfileEntity,
  SourceEntity,
  LeadsOwnerEntity,
  PartnerAndSalesAgentIdentificationEntity
} from '@/iris-db/entities';
import { 
  LeadRepository,
  LeadsBusinessInformationRepository,
  LeadsServicesRepository,
  LeadsUnderwritingRepository,
  LeadsFinancialProfileRepository,
  SourceRepository,
  LeadsOwnerRepository,
  PartnerAndSalesAgentIdentificationRepository
} from '@/iris-db/repositories';

import { GetSubscriptionsQueueService } from './services/get-subscriptions-queue.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';
import {
  DFT256BatchRepository,
  DFT256TransactionFromLegacySystemRepository,
  DFT256TransactionRepository,
  RiskRadarIssuingBankRepository,
} from '@/finance-db/repositories';

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';
import { AssignExceptionReviewService } from './services/assign-exception-review/assign-exception-review.service';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { RiskRadarExceptionsService } from './services/risk-radar-exceptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RiskRadarUserEntity, 
        RiskRadarEmailTemplateEntity,
        RiskRadarExceptionsJeffEntity,
        RiskRadarMerchantAdjParamEntity,
        ChargeBacksEntity,
        RiskRadarExceptionListLookupEntity,
        RiskRadarBatch
      ],
      'finance'
    ),
    TypeOrmModule.forFeature(
      [
        LeadEntity, 
        LeadsBusinessInformationEntity,
        LeadsServicesEntity,
        LeadsUnderwritingEntity,
        LeadsFinancialProfileEntity,
        SourceEntity,
        LeadsOwnerEntity,
        PartnerAndSalesAgentIdentificationEntity
      ],
      'iris'
    ),
    TypeOrmModule.forFeature([], 'connector'),
  ],
  controllers: [RiskRadarController],
  providers: [
    // Entity repos
    LeadRepository,
    LeadsBusinessInformationRepository,
    LeadsServicesRepository,
    LeadsUnderwritingRepository,
    LeadsFinancialProfileRepository,
    SourceRepository,
    LeadsOwnerRepository,
    PartnerAndSalesAgentIdentificationRepository,
    
    RiskRadarUserRepository,
    RiskRadarEmailTemplateRepository,
    RiskRadarExceptionsJeffRepository,
    MerchantExceptionDetailRepository,
    RiskRadarMerchAdjParamRepository,
    RiskRadarBatchRepository,
    RiskRadarNotesRepository,
    
    RiskRadarService,
    GetSubscriptionsQueueService,
    MerchantExceptionDetailService,
    LeadsBusinessInformationRepository,
    RiskRadarIssuingBankRepository,
    ClxReportingRepository,
    DFT256BatchRepository,
    DFT256TransactionRepository,
    DFT256TransactionFromLegacySystemRepository,
    RiskRadarExceptionsJeffRepository,
    RiskRadarNotesRepository,
    // Services
    RiskRadarService,
    MerchantCardNumHistoryService,
    AssignExceptionReviewService,
    RiskRadarExceptionsService,
  ],
})
export class RiskRadarModule {}
