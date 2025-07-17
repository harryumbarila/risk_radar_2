import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BufferUtilsService } from '@/api/shared/buffer/buffer-utils.service';
import {
  NetSettlementLabelType,
  NetSettlementTrans,
} from '@/crescent-view-db/entities';
import {
  NetSettlementLabelTypeRepository,
  NetSettlementMidLabelRepository,
  NetSettlementTransRepository,
  NetSettlementTransWorkSheetRepository,
} from '@/crescent-view-db/repositories';
import { RiskRadarMerchAdjParamEntity } from '@/finance-db/entities';
import {
  RiskRadarMerchAdjParamRepository,
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  DivertQueueEntity,
  DivertQueueFSPEntity,
  LeadEntity,
  SubscriptionQueueRequestEventJsonSourceEntity,
} from '@/iris-db/entities';
import {
  DivertQueueFSPRepository,
  DivertQueueRepository,
  LeadRepository,
  MerchantMemoUploadRepository,
  SubscriptionQueueRequestEventJsonSourceRepository,
} from '@/iris-db/repositories';

import { NetSettlementsController } from './net-settlement.controller';
import { NetSettlementsService } from './net-settlement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [NetSettlementTrans, NetSettlementLabelType],
      'crescent-view'
    ),
    TypeOrmModule.forFeature(
      [
        LeadEntity,
        SubscriptionQueueRequestEventJsonSourceEntity,
        DivertQueueEntity,
        DivertQueueFSPEntity,
      ],
      'iris'
    ),
    TypeOrmModule.forFeature([RiskRadarMerchAdjParamEntity], 'finance'),
  ],
  providers: [
    NetSettlementsService,
    BufferUtilsService,

    NetSettlementLabelTypeRepository,
    NetSettlementTransRepository,
    SubscriptionQueueRequestEventJsonSourceRepository,
    RiskRadarNotesRepository,
    TSYSDivertFlagUpdateRepository,
    DivertQueueRepository,
    DivertQueueFSPRepository,
    RiskRadarMerchAdjParamRepository,

    NetSettlementTransWorkSheetRepository,
    LeadRepository,
    MerchantMemoUploadRepository,
    NetSettlementMidLabelRepository,
  ],
  controllers: [NetSettlementsController],
})
export class NetSettlementsModule {}
