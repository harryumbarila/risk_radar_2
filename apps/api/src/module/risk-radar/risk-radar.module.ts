import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClxReportingRepository } from '@/data-warehouse-db/repositories';
import {
  RiskRadarEmailTemplateEntity,
  RiskRadarUserEntity,
} from '@/finance-db/entities';
import {
  DFT256BatchRepository,
  DFT256TransactionFromLegacySystemRepository,
  DFT256TransactionRepository,
  RiskRadarIssuingBankRepository,
} from '@/finance-db/repositories';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { LeadEntity, LeadsBusinessInformationEntity } from '@/iris-db/entities';
import { LeadRepository } from '@/iris-db/repositories/';
import { LeadsBusinessInformationRepository } from '@/iris-db/repositories/leads-business-information.repository';

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [RiskRadarUserEntity, RiskRadarEmailTemplateEntity],
      'finance'
    ),
    TypeOrmModule.forFeature(
      [LeadEntity, LeadsBusinessInformationEntity],
      'iris'
    ),
  ],
  controllers: [RiskRadarController],
  providers: [
    // Entity repos
    LeadRepository,
    RiskRadarUserRepository,
    RiskRadarEmailTemplateRepository,
    LeadsBusinessInformationRepository,
    RiskRadarIssuingBankRepository,
    ClxReportingRepository,
    DFT256BatchRepository,
    DFT256TransactionRepository,
    DFT256TransactionFromLegacySystemRepository,
    // Services
    RiskRadarService,
    MerchantCardNumHistoryService,
  ],
})
export class RiskRadarModule {}
