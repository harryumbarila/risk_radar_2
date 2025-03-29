import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RiskRadarExceptionsController } from './risk-radar-exceptions.controller';
import { RiskRadarExceptionsService } from './risk-radar-exceptions.service';

import { 
  RiskRadarExceptionsJeff,
  RiskRadarMerchAdjParam,
  RiskRadarBatch,
  RiskRadarUser
} from '@/finance-db/entities';
import { PartnerAndSalesAgentIdentification } from '@/iris-db/entities';
import { RiskRadarBatchRepository, RiskRadarMerchAdjParamRepository } from '@/finance-db/repositories';
import { PartnerAndSalesAgentIdentificationRepository } from '@/iris-db/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RiskRadarExceptionsJeff,
      RiskRadarMerchAdjParam,
      RiskRadarBatch,
      RiskRadarUser
    ], 'finance'),
    TypeOrmModule.forFeature([
      PartnerAndSalesAgentIdentification
    ], 'iris'),
    TypeOrmModule.forFeature([], 'connector')
  ],
  controllers: [RiskRadarExceptionsController],
  providers: [
    RiskRadarExceptionsService,
    RiskRadarBatchRepository,
    RiskRadarMerchAdjParamRepository,
    PartnerAndSalesAgentIdentificationRepository
  ],
  exports: [RiskRadarExceptionsService]
})
export class RiskRadarExceptionsModule {} 