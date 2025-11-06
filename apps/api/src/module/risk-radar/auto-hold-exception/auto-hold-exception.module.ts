import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import * as entities from '@/risk-radar-db/entities';
import { AutoHoldExceptionSummaryRepository } from '@/risk-radar-db/repositories';

import { AutoHoldExceptionSummariesController } from './auto-hold-exception.controller';
import { AutoHoldExceptionSummariesService } from './auto-hold-exception.service';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities), 'risk-radar')],
  controllers: [AutoHoldExceptionSummariesController],
  providers: [
    AutoHoldExceptionSummariesService,
    AutoHoldExceptionSummaryRepository,
  ],
})
export class AutoHoldExceptionSummariesModule {}
