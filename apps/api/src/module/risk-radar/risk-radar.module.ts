import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '@/api/shared/aws/aws.module';
import { EmailModule } from '@/api/shared/email/email.module';
import { IrisModule } from '@/api/shared/module/iris/iris.module';
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
  RiskRadarAssignExceptionsRepository,
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
  LeadsMerchantLead,
  LeadsOwnerEntity,
  LeadsPartnerEntity,
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
  LeadsMerchantLeadRepository,
  LeadsOwnerRepository,
  LeadsPartnerRepository,
  LeadsServicesRepository,
  LeadsUnderwritingRepository,
  PartnerAndSalesAgentIdentificationRepository,
  SourceRepository,
} from '@/iris-db/repositories';
import { SnapPccSalesConfirmationRepository } from '@/snap-pcc-db/repositories';

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';
import { AssignExceptionsService } from './services/assign-exceptions/assign-exceptions.service';
import { ExceptionsListService } from './services/exceptions-list/exceptions-list.service';
import { GetSubscriptionsQueueService } from './services/get-subscriptions-queue.service';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';
import { FspExceptionTransactionService } from './services/merchant-exception-transactions/fsp-exception-transaction.service';
import { MerchantExceptionTransactionsService } from './services/merchant-exception-transactions/merchant-exception-transactions.service';
import { TsysExceptionTransactionService } from './services/merchant-exception-transactions/tsys-exception-transaction.service';
import { MerchantWithSameTaxIdService } from './services/merchant-with-same-tax-id/merchant-with-same-tax-id.service';
import { PushNoteToIrisService } from './services/push-note-to-iris/push-note-to-iris.service';
import { ReviewExceptionService } from './services/review-exception/review-exception.service';
import { RiskRadarEmailTemplateService } from './services/risk-radar-email-template/risk-radar-email-template.service';
import { RiskRadarExceptionsService } from './services/risk-radar-exceptions.service';
import { RiskRadarNotesService } from './services/risk-radar-notes/risk-radar-notes.service';
import { RiskRadarSaveService } from './services/risk-radar-save/risk-radar-save.service';
import { RiskRadarUserService } from './services/risk-radar-user/risk-radar-user.service';

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
        LeadsPartnerEntity,
        LeadsBusinessInformationEntity,
        LeadsMerchantLead,
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
    IrisModule,
    AWSModule,
    EmailModule,
  ],
  controllers: [RiskRadarController],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  providers: [
    // Entity repos
    LeadRepository,
    LeadsBusinessInformationRepository,
    LeadsMerchantLeadRepository,
    LeadsPartnerRepository,
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
    RiskRadarAssignExceptionsRepository,

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
    RiskRadarNotesRepository,
    // Services
    RiskRadarService,
    MerchantCardNumHistoryService,
    AssignExceptionsService,
    RiskRadarExceptionsService,
    RiskRadarSaveService,
    MerchantExceptionTransactionsService,
    ExceptionsListService,
    RiskRadarEmailTemplateService,
    MerchantWithSameTaxIdService,
    ReviewExceptionService,
    RiskRadarNotesService,
    RiskRadarUserService,
    FspExceptionTransactionService,
    TsysExceptionTransactionService,
    PushNoteToIrisService,
  ],
  exports: [RiskRadarNotesService, RiskRadarUserService],
})
export class RiskRadarModule {}
