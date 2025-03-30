import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  RiskRadarEmailTemplateEntity,
  RiskRadarUserEntity,
  RiskRadarExceptionsJeffEntity,
  RiskRadarMerchantAdjParamEntity,
  ChargeBacksEntity,
  RiskRadarExceptionListLookupEntity
} from '@/finance-db/entities';
import { 
  RiskRadarEmailTemplateRepository,
  RiskRadarUserRepository,
  RiskRadarExceptionsJeffRepository,
  MerchantExceptionDetailRepository,
  RiskRadarMerchantAdjParamRepository
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

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';
import { GetSubscriptionsQueueService } from './services/get-subscriptions-queue.service';
import { MerchantExceptionDetailController } from './controllers/merchant-exception-detail.controller';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RiskRadarUserEntity, 
        RiskRadarEmailTemplateEntity,
        RiskRadarExceptionsJeffEntity,
        RiskRadarMerchantAdjParamEntity,
        ChargeBacksEntity,
        RiskRadarExceptionListLookupEntity
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
  ],
  controllers: [RiskRadarController, MerchantExceptionDetailController],
  providers: [
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
    RiskRadarMerchantAdjParamRepository,
    
    RiskRadarService,
    GetSubscriptionsQueueService,
    MerchantExceptionDetailService,
  ],
})
export class RiskRadarModule {}
