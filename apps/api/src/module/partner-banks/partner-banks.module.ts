import { Module } from '@nestjs/common';
import { AWSModule } from '@/api/shared/aws/aws.module';
import { PartnerBanksService } from './partner-banks.service';
import { PartnerBanksController } from './partner-banks.controller';
import { BufferUtilsService } from '@/api/shared/buffer/buffer-utils.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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

import { MSPMerchantMonthlyBillingRepository } from '@/finance-db/repositories';

import { MSPMerchantMonthlyBilling } from '@/finance-db/entities';

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
  ],
  providers: [
    PartnerBanksService,
    BufferUtilsService,
    MSPMerchantMonthlyBillingRepository,
  ],
  controllers: [PartnerBanksController],
})
export class PartnerBanksModule {}
