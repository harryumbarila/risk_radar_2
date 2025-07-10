import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BufferUtilsService } from '@/api/shared/buffer/buffer-utils.service';
import { NetSettlementTrans } from '@/crescent-view-db/entities';
import { NetSettlementTransRepository } from '@/crescent-view-db/repositories';
import {
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  LeadEntity,
  SubscriptionQueueRequestEventJsonSourceEntity,
} from '@/iris-db/entities';
import {
  DivertQueueFSPRepository,
  SubscriptionQueueRequestEventJsonSourceRepository,
} from '@/iris-db/repositories';

import { NetSettlementsController } from './net-settlement.controller';
import { NetSettlementsService } from './net-settlement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NetSettlementTrans], 'crescent-view'),
    TypeOrmModule.forFeature(
      [LeadEntity, SubscriptionQueueRequestEventJsonSourceEntity],
      'iris'
    ),
  ],
  providers: [
    NetSettlementsService,
    BufferUtilsService,

    NetSettlementTransRepository,
    SubscriptionQueueRequestEventJsonSourceRepository,
    RiskRadarNotesRepository,
    TSYSDivertFlagUpdateRepository,
    DivertQueueFSPRepository,
  ],
  controllers: [NetSettlementsController],
})
export class NetSettlementsModule {}
