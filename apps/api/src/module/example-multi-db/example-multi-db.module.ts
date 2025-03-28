import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RiskRadarExceptionListService } from '@/api/module/finance/services/risk-radar-exception-list.service';
import { RiskRadarExceptionsService } from '@/api/module/finance/services/risk-radar-exceptions.service';
import { RiskRadarExceptionsReviewService } from '@/api/module/finance/services/risk-radar-exceptions-review.service';
import { CrescentViewEntity } from '@/crescent-view-db/entities';
import { RiskRadarUserEntity } from '@/finance-db/entities/risk-radar-user.entity';

import { ExampleMultiDbController } from './example-multi-db.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrescentViewEntity], 'crescent-view'),
    TypeOrmModule.forFeature([RiskRadarUserEntity], 'finance'),
  ],
  providers: [
    RiskRadarExceptionListService,
    RiskRadarExceptionsReviewService,
    RiskRadarExceptionsService,
  ],
  controllers: [ExampleMultiDbController],
})
export class ExampleMultiDbModule {}
