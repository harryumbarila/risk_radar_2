import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  RiskRadarBatch,
  RiskRadarExceptionsJeffEntity,
  RiskRadarMerchAdjParamEntity,
  RiskRadarUserEntity,
} from '@/finance-db/entities';
import {
  RiskRadarBatchRepository,
  RiskRadarExceptionsJeffRepository,
  RiskRadarMerchAdjParamRepository,
  RiskRadarUserRepository,
} from '@/finance-db/repositories';
import { PartnerAndSalesAgentIdentificationEntity } from '@/iris-db/entities';
import { PartnerAndSalesAgentIdentificationRepository } from '@/iris-db/repositories';

import { RiskRadarExceptionsController } from './risk-radar-exceptions.controller';
import { RiskRadarExceptionsService } from './risk-radar-exceptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RiskRadarExceptionsJeffEntity,
        RiskRadarMerchAdjParamEntity,
        RiskRadarBatch,
        RiskRadarUserEntity,
      ],
      'finance'
    ),
    TypeOrmModule.forFeature([PartnerAndSalesAgentIdentificationEntity], 'iris'),
    TypeOrmModule.forFeature([], 'connector'),
  ],
  controllers: [RiskRadarExceptionsController],
  providers: [
    RiskRadarExceptionsService,
    RiskRadarBatchRepository,
    RiskRadarExceptionsJeffRepository,
    RiskRadarUserRepository,
    RiskRadarMerchAdjParamRepository,
    PartnerAndSalesAgentIdentificationRepository,
  ],
  exports: [RiskRadarExceptionsService],
})
export class RiskRadarExceptionsModule {}
