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
  RiskRadarExceptionsJeffRepository,
  RiskRadarIssuingBankRepository,
  RiskRadarMerchAdjParamRepository,
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { LeadEntity, LeadsBusinessInformationEntity } from '@/iris-db/entities';
import {
  DivertQueueFSPRepository,
  DivertQueueRepository,
  LeadRepository,
} from '@/iris-db/repositories/';
import { LeadsBusinessInformationRepository } from '@/iris-db/repositories/leads-business-information.repository';

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';
import { AssignExceptionReviewService } from './services/assign-exception-review/assign-exception-review.service';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { RiskRadarSaveService } from './services/risk-radar-save/risk-radar-save.service';

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
    RiskRadarExceptionsJeffRepository,
    RiskRadarNotesRepository,
    RiskRadarMerchAdjParamRepository,
    RiskRadarExceptionsJeffRepository,
    RiskRadarNotesRepository,
    TSYSDivertFlagUpdateRepository,
    DivertQueueRepository,
    DivertQueueFSPRepository,
    // Services
    RiskRadarService,
    MerchantCardNumHistoryService,
    AssignExceptionReviewService,
    RiskRadarSaveService,
  ],
})
export class RiskRadarModule {}
