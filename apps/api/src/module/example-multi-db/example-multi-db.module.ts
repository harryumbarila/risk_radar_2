import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CrescentViewEntity, MerchantTIN } from '@/crescent-view-db/entities';
import { RiskRadarMerchantTaxIdRepository } from '@/crescent-view-db/repositories';
import { RiskRadarExceptionListLookupEntity } from '@/finance-db/entities';
import { RiskRadarUserEntity } from '@/finance-db/entities/risk-radar-user.entity';

import { ExampleMultiDbController } from './example-multi-db.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrescentViewEntity], 'crescent-view'),
    TypeOrmModule.forFeature([MerchantTIN], 'crescent-view'),
    TypeOrmModule.forFeature([RiskRadarUserEntity], 'finance'),
    TypeOrmModule.forFeature([RiskRadarExceptionListLookupEntity], 'finance'),
  ],
  providers: [RiskRadarMerchantTaxIdRepository],
  controllers: [ExampleMultiDbController],
})
export class ExampleMultiDbModule {}
