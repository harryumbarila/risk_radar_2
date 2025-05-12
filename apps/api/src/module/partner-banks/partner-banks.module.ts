import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '@/api/shared/aws/aws.module';
import { BufferUtilsService } from '@/api/shared/buffer/buffer-utils.service';
import { EmailModule } from '@/api/shared/email/email.module';
import { MSPMerchantMonthlyBilling } from '@/finance-db/entities';
import { MSPMerchantMonthlyBillingRepository } from '@/finance-db/repositories';
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

import { PartnerBanksController } from './partner-banks.controller';
import { PartnerBanksService } from './partner-banks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MSPMerchantMonthlyBilling], 'finance'),
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
    AWSModule,
    EmailModule,
  ],
  providers: [
    PartnerBanksService,
    BufferUtilsService,
    MSPMerchantMonthlyBillingRepository,
  ],
  controllers: [PartnerBanksController],
})
export class PartnerBanksModule {}
