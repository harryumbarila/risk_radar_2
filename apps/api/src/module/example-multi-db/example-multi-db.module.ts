import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CrescentViewEntity } from '@/crescent-view-db/entities';
import { FinanceEntity } from '@/finance-db/entities';

import { ExampleMultiDbController } from './example-multi-db.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrescentViewEntity], 'crescent-view'),
    TypeOrmModule.forFeature([FinanceEntity], 'finance'),
  ],
  providers: [],
  controllers: [ExampleMultiDbController],
})
export class ExampleMultiDbModule {}
