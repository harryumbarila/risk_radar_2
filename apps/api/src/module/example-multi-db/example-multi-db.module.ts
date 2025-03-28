import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RiskRadarExceptionListService } from '@/api/module/finance/services/risk-radar-exception-list.service';
import { RiskRadarExceptionsService } from '@/api/module/finance/services/risk-radar-exceptions.service';
import { RiskRadarExceptionsReviewService } from '@/api/module/finance/services/risk-radar-exceptions-review.service';
import { CrescentViewEntity, MerchantTIN } from '@/crescent-view-db/entities';
import { RiskRadarMerchantTaxIdRepository } from '@/crescent-view-db/repositories';
import { RiskRadarUserEntity } from '@/finance-db/entities/risk-radar-user.entity';
import { RiskRadarExceptionStatusRepository } from '@/finance-db/repositories';

import { ExampleMultiDbController } from './example-multi-db.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrescentViewEntity], 'crescent-view'),
    TypeOrmModule.forFeature([MerchantTIN], 'crescent-view'),
    TypeOrmModule.forFeature([RiskRadarUserEntity], 'finance'),
  ],
  providers: [
    RiskRadarMerchantTaxIdRepository,
    RiskRadarExceptionStatusRepository,
    RiskRadarExceptionListService,
    RiskRadarExceptionsReviewService,
    RiskRadarExceptionsService,
  ],
  controllers: [ExampleMultiDbController],
})
export class ExampleMultiDbModule {}
