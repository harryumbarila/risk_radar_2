import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CrescentViewEntity, MerchantTIN } from '@/crescent-view-db/entities';
import { FinanceEntity } from '@/finance-db/entities';
import { RiskRadarMerchantTaxIdRepository } from '@/crescent-view-db/repositories';
import { RiskRadarExceptionStatusRepository } from '@/finance-db/repositories';

import { ExampleMultiDbController } from './example-multi-db.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrescentViewEntity], 'crescent-view'),
    TypeOrmModule.forFeature([FinanceEntity], 'finance'),
    TypeOrmModule.forFeature([MerchantTIN], 'crescent-view')
  ],
  providers: [
    RiskRadarMerchantTaxIdRepository,
    RiskRadarExceptionStatusRepository,
  ],
  controllers: [ExampleMultiDbController],
})
export class ExampleMultiDbModule {}
