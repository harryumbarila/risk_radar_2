import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ClxReportingRepository,
  CLXReportingSearchAVSResponseLookupRepository,
  CLXReportingSearchPaymentMethodLookupRepository,
} from '@/data-warehouse-db/repositories';
import { DSMSalesConfirmationRepository } from '@/dsm-db/repositories';
import { EZEnrollGenAccountRepository } from '@/ez-enroll-db/repositories';
import { EZEnrollPccGenAccountRepository } from '@/ez-enroll-pcc-db/repositories';
import {
  ChargeBacksEntity,
  RiskRadarBatch,
  RiskRadarEmailTemplateEntity,
  RiskRadarExceptionListLookupEntity,
  RiskRadarExceptionsJeffEntity,
  RiskRadarExceptionStatusEntity,
  RiskRadarMerchantAdjParamEntity,
  RiskRadarUserEntity,
} from '@/finance-db/entities';
import {
  AuthResponseLookupRepository,
  ChargebacksAndRetrievalReasonCodeLookupRepository,
  DailyDetailRepository,
  DFT256BatchRepository,
  DFT256TransactionFromLegacySystemRepository,
  DFT256TransactionRepository,
  FSPRiskRadarExceptionPointsRepository,
  MerchantExceptionDetailRepository,
  POSEntryModesADFRepository,
  RiskRadarBatchRepository,
  RiskRadarCycleTimeMonitorRepository,
  RiskRadarEmailTemplateRepository,
  RiskRadarExceptionsJeffRepository,
  RiskRadarExceptionStatusRepository,
  RiskRadarIssuingBankRepository,
  RiskRadarMerchAdjParamRepository,
  RiskRadarNotesRepository,
  RiskRadarTransactionRepository,
  RiskRadarUserRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  LeadEntity,
  LeadsBusinessInformationEntity,
  LeadsFinancialProfileEntity,
  LeadsOwnerEntity,
  LeadsServicesEntity,
  LeadsUnderwritingEntity,
  PartnerAndSalesAgentIdentificationEntity,
  SourceEntity,
} from '@/iris-db/entities';
import {
  DivertQueueFSPRepository,
  DivertQueueRepository,
  LeadRepository,
  LeadsBusinessInformationRepository,
  LeadsFinancialProfileRepository,
  LeadsOwnerRepository,
  LeadsServicesRepository,
  LeadsUnderwritingRepository,
  PartnerAndSalesAgentIdentificationRepository,
  SourceRepository,
} from '@/iris-db/repositories';
import { SnapPccSalesConfirmationRepository } from '@/snap-pcc-db/repositories';

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';
import { AssignExceptionReviewService } from './services/assign-exception-review/assign-exception-review.service';
import { ExceptionsListService } from './services/exceptions-list/exceptions-list.service';
import { GetSubscriptionsQueueService } from './services/get-subscriptions-queue.service';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';
import { MerchantExceptionTransactionsService } from './services/merchant-exception-transactions/merchant-exception-transactions2.service';
import { MerchantWithSameTaxIdService } from './services/merchant-with-same-tax-id/merchant-with-same-tax-id.service';
import { RiskRadarEmailTemplateService } from './services/risk-radar-email-template/risk-radar-email-template.service';
import { RiskRadarExceptionsService } from './services/risk-radar-exceptions.service';
import { RiskRadarSaveService } from './services/risk-radar-save/risk-radar-save.service';

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
        RiskRadarBatch,
        RiskRadarExceptionStatusEntity,
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
        PartnerAndSalesAgentIdentificationEntity,
      ],
      'iris'
    ),
    TypeOrmModule.forFeature([], 'connector'),
    TypeOrmModule.forFeature([], 'crescent-view'),
  ],
  controllers: [RiskRadarController],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    ChargebacksAndRetrievalReasonCodeLookupRepository,

    RiskRadarUserRepository,
    RiskRadarEmailTemplateRepository,
    RiskRadarExceptionsJeffRepository,
    MerchantExceptionDetailRepository,
    RiskRadarMerchAdjParamRepository,
    RiskRadarBatchRepository,
    RiskRadarNotesRepository,
    RiskRadarExceptionStatusRepository,

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
    RiskRadarMerchAdjParamRepository,
    RiskRadarExceptionsJeffRepository,
    RiskRadarNotesRepository,
    TSYSDivertFlagUpdateRepository,
    DivertQueueRepository,
    DivertQueueFSPRepository,
    EZEnrollGenAccountRepository,
    EZEnrollPccGenAccountRepository,
    DSMSalesConfirmationRepository,
    SnapPccSalesConfirmationRepository,
    CLXReportingSearchAVSResponseLookupRepository,
    CLXReportingSearchPaymentMethodLookupRepository,
    AuthResponseLookupRepository,
    DailyDetailRepository,
    POSEntryModesADFRepository,
    RiskRadarCycleTimeMonitorRepository,
    FSPRiskRadarExceptionPointsRepository,
    RiskRadarTransactionRepository,
    // Services
    RiskRadarService,
    MerchantCardNumHistoryService,
    AssignExceptionReviewService,
    RiskRadarExceptionsService,
    RiskRadarSaveService,
    MerchantExceptionTransactionsService,
    ExceptionsListService,
    RiskRadarEmailTemplateService,
    MerchantWithSameTaxIdService,
  ],
})
export class RiskRadarModule {}
