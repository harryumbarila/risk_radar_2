import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  RiskRadarBatch,
  RiskRadarExceptionsJeffEntity,
  RiskRadarMerchAdjParam,
  RiskRadarUserEntity,
} from '@/finance-db/entities';
import {
  RiskRadarBatchRepository,
  RiskRadarMerchAdjParamRepository,
} from '@/finance-db/repositories';
import { PartnerAndSalesAgentIdentification } from '@/iris-db/entities';
import { PartnerAndSalesAgentIdentificationRepository } from '@/iris-db/repositories';

import { RiskRadarExceptionsController } from './risk-radar-exceptions.controller';
import { RiskRadarExceptionsService } from './risk-radar-exceptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RiskRadarExceptionsJeffEntity,
        RiskRadarMerchAdjParam,
        RiskRadarBatch,
        RiskRadarUserEntity,
      ],
      'finance'
    ),
    TypeOrmModule.forFeature([PartnerAndSalesAgentIdentification], 'iris'),
    TypeOrmModule.forFeature([], 'connector'),
  ],
  controllers: [RiskRadarExceptionsController],
  providers: [
    RiskRadarExceptionsService,
    RiskRadarBatchRepository,
    RiskRadarMerchAdjParamRepository,
    PartnerAndSalesAgentIdentificationRepository,
  ],
  exports: [RiskRadarExceptionsService],
})
export class RiskRadarExceptionsModule {}
