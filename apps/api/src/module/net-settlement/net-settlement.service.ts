import { Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { DataSource } from 'typeorm';

import {
  NetSettlementLabelTypeRepository,
  NetSettlementTransRepository,
} from '@/crescent-view-db/repositories';
import {
  RiskRadarMerchAdjParamRepository,
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  DivertQueueFSPRepository,
  DivertQueueRepository,
  SubscriptionQueueRequestEventJsonSourceRepository,
} from '@/iris-db/repositories';
import type {
  NetSettlementSummary,
  NetSettlementSummaryHeader,
} from '@/shared/response';

import type { HandleDiverAddDto } from './dto/handle-divert-add.dto';
import type { HandleDiverRemovedDto } from './dto/handle-divert-removed.dto copy';

@Injectable()
export class NetSettlementsService {
  public constructor(
    @InjectDataSource('crescent-view')
    private readonly crescentViewDataSource: DataSource,
    @InjectPinoLogger(NetSettlementsService.name)
    private readonly logger: Logger,
    private readonly subscriptionQueueRequestEventJsonSourceRepository: SubscriptionQueueRequestEventJsonSourceRepository,
    private readonly netSettlementTransRepository: NetSettlementTransRepository,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository,
    private readonly tSYSDivertFlagUpdateRepository: TSYSDivertFlagUpdateRepository,
    private readonly netSettlementLabelTypeRepository: NetSettlementLabelTypeRepository,
    private readonly divertQueueFSPRepository: DivertQueueFSPRepository,
    private readonly divertQueueRepository: DivertQueueRepository,
    private readonly riskRadarMerchAdjParamRepository: RiskRadarMerchAdjParamRepository
  ) {}

  public async getNetSettlementSummaryByMID(
    mid: string
  ): Promise<NetSettlementSummary> {
    try {
      const uwNewAccountHoldAllowRiskToEdit =
        await this.subscriptionQueueRequestEventJsonSourceRepository.checkUwNewAccountHoldAllowRiskToEdit(
          mid
        );

      const { manager } = this.crescentViewDataSource;

      // await manager.query(
      //   `OPEN SYMMETRIC KEY SymmetricKey2 DECRYPTION BY CERTIFICATE Certificate2`
      // );

      const headerResult = await manager.query<
        Partial<NetSettlementSummaryHeader>[]
      >(
        `SELECT
        @0 AS sMID16Exist,
        lbi.dbaname AS sDBA,
        lfp.CreditRoutingNumber AS sMerchantBankRoutingNumber,
        CONVERT(VARCHAR(MAX), DECRYPTBYKEY(lfp.CreditDDANumber)) AS sMerchantBankAccountNumber,
        lbi.FederalTaxId AS sTIN
      FROM iris..leads l
      JOIN iris..LeadsBusinessInformation lbi ON lbi.LeadId = l.Id
      LEFT JOIN iris..LeadsFinancialProfile lfp ON lfp.LeadId = l.Id
      WHERE l.IrisMId = @0 AND l.IsArchived = 0`,
        [mid]
      );

      // await manager.query(`CLOSE SYMMETRIC KEY SymmetricKey2`);

      const header = headerResult[0] || {};

      const labelType = await manager.query<
        { fkNetSettlementLabelType?: string }[]
      >(
        `SELECT fkNetSettlementLabelType FROM tblNetSettlementMIDLabel WHERE sMID = @0`,
        [mid]
      );

      const divertFlag1 =
        await this.tSYSDivertFlagUpdateRepository.findValidByMid(mid);
      const divertFlag2 =
        await this.divertQueueFSPRepository.findMaxDivertIdByMid(mid);

      let divertReason: string | null = null;
      const hasDivert = !!divertFlag1 || !!divertFlag2;

      if (hasDivert) {
        divertReason =
          await this.riskRadarNotesRepository.findLatestNoteByMID(mid);
      }

      if (!header?.sDBA) {
        const fallbackDBA = await manager.query<{ dbaname?: string }[]>(
          `SELECT TOP 1 dbaname FROM ezenroll..gen_account WHERE mid16 = @0`,
          [mid]
        );
        header.sDBA = fallbackDBA[0]?.dbaname || null;
      }

      if (!header?.sDBA) {
        const fallbackDBA = await manager.query<{ dbaname?: string }[]>(
          `SELECT TOP 1 dbaname FROM ezenroll_pcc..gen_account WHERE mid16 = @0`,
          [mid]
        );
        header.sDBA = fallbackDBA[0]?.dbaname || null;
      }

      const matchingMIDs = await manager.query<{ sMID: string }[]>(
        `SELECT l.IrisMId AS sMID FROM iris..leads l 
       JOIN iris..LeadsBusinessInformation lbi ON lbi.LeadId = l.Id 
       WHERE l.IsArchived = 0 AND LEN(l.IrisMId) = 16 
       AND lbi.FederalTaxId = @0 AND l.IrisMId != @1 
       ORDER BY l.IrisMId`,
        [header.sTIN, mid]
      );

      if (matchingMIDs.length > 0) {
        matchingMIDs.unshift({ sMID: 'Match Found' });
      }

      const transactions =
        await this.netSettlementTransRepository.getNetSettlementTransactionsSummary(
          mid
        );

      const labels = await this.netSettlementLabelTypeRepository.find({
        where: {
          hidden: false,
        },
        order: {
          name: 'ASC',
        },
        select: ['id', 'name'],
      });

      return {
        header: {
          sMID16Exist: header.sMID16Exist,
          sDBA: header.sDBA,
          sMerchantBankRoutingNumber: header.sMerchantBankRoutingNumber,
          sMerchantBankAccountNumber: header.sMerchantBankAccountNumber,
          sTIN: header.sTIN,
          divertFlag: hasDivert,
          divertReason,
          netSettlementLabelTypeId:
            labelType[0]?.fkNetSettlementLabelType || null,
          uwNewAccountHoldAllowRiskToEdit,
        },
        transactions,
        matchingMIDs: matchingMIDs.map((m) => m.sMID),
        labels,
      };
    } catch (error) {
      this.logger.error('Error getting net settlement summary');
      this.logger.error(error);
      throw new RuntimeException(`Error getting net settlement summary`);
    }
  }

  public async handleDivertAdd(payload: HandleDiverAddDto): Promise<void> {
    try {
      const { mid, note, user } = payload;
      const existingFlag = await this.tSYSDivertFlagUpdateRepository.findOne({
        where: {
          mid,
          isHidden: false,
        },
        select: ['mid'],
      });

      if (!existingFlag) {
        await this.tSYSDivertFlagUpdateRepository.insert({
          mid,
          createdAt: () => 'GETDATE()',
        });
      }

      if (['5611', '7905'].some((prefix) => mid.startsWith(prefix))) {
        const latestDivert = await this.divertQueueRepository
          .createQueryBuilder('dq')
          .select('MAX(dq.Id)', 'maxId')
          .where('dq.MerchantId = :mid', { mid })
          .getRawOne<{ maxId: number }>();

        if (latestDivert?.maxId) {
          const lastRecord = await this.divertQueueRepository.findOne({
            where: { id: latestDivert.maxId },
          });

          if (!lastRecord || !lastRecord.isDiverted) {
            await this.divertQueueRepository.insert({
              merchantId: Number(mid),
              isDiverted: true,
              divertFlagNotes: 'Manual put on divert via NetSettlement',
              createDate: () => 'GETDATE()',
              createdBy: user,
            });
          }
        } else {
          await this.divertQueueRepository.insert({
            merchantId: Number(mid),
            isDiverted: true,
            divertFlagNotes: 'Manual put on divert via NetSettlement',
            createDate: () => 'GETDATE()',
            createdBy: user,
          });
        }
      }

      if (mid.startsWith('8152')) {
        const latestDivertFSP = await this.divertQueueFSPRepository
          .createQueryBuilder('dqf')
          .select('MAX(dqf.Id)', 'maxId')
          .where('dqf.MerchantId = :mid', { mid })
          .getRawOne<{ maxId: number }>();

        if (latestDivertFSP?.maxId) {
          const lastRecord = await this.divertQueueFSPRepository.findOne({
            where: { id: latestDivertFSP.maxId },
          });

          if (!lastRecord || !lastRecord.isDiverted) {
            await this.divertQueueFSPRepository.insert({
              merchantId: Number(mid),
              isDiverted: true,
              divertFlagNotes: 'Manual put on divert via NetSettlement',
              createDate: () => 'GETDATE()',
              createdBy: user,
            });
          }
        } else {
          await this.divertQueueFSPRepository.insert({
            merchantId: Number(mid),
            isDiverted: true,
            divertFlagNotes: 'Manual put on divert via NetSettlement',
            createDate: () => 'GETDATE()',
            createdBy: user,
          });
        }
      }

      await this.riskRadarNotesRepository.insert({
        mid,
        notes: note,
        notesTypeId: 5,
        userCreated: user,
      });

      await this.riskRadarMerchAdjParamRepository.update(
        { mid },
        { isDivert: true }
      );
    } catch (error) {
      this.logger.error(`Error adding divert note for MID: ${payload.mid}`);
      this.logger.error(error);
      throw new RuntimeException(
        `Error adding divert note for MID: ${payload.mid}`
      );
    }
  }

  public async handleDivertRemove(
    payload: HandleDiverRemovedDto
  ): Promise<void> {
    const { mid, user } = payload;
    const existingActiveFlag =
      await this.tSYSDivertFlagUpdateRepository.findOne({
        where: {
          mid,
          isHidden: false,
        },
      });

    if (existingActiveFlag) {
      await this.tSYSDivertFlagUpdateRepository.update(
        { mid, isHidden: false },
        {
          isHidden: true,
          removeDate: () => 'GETDATE()',
        }
      );
    }

    if (['5611', '7905'].some((prefix) => mid.startsWith(prefix))) {
      const latestDivert = await this.divertQueueRepository
        .createQueryBuilder('dq')
        .select('MAX(dq.Id)', 'maxId')
        .where('dq.MerchantId = :mid', { mid })
        .getRawOne<{ maxId: number }>();

      if (latestDivert?.maxId) {
        const lastRecord = await this.divertQueueRepository.findOne({
          where: { id: latestDivert.maxId },
        });

        if (lastRecord?.isDiverted) {
          await this.divertQueueRepository.insert({
            merchantId: Number(mid),
            isDiverted: true,
            divertFlagNotes: 'Manual remove from divert via NetSettlement',
            createDate: () => 'GETDATE()',
            createdBy: user,
          });
        }
      }
    }

    if (mid.startsWith('8152')) {
      const latestDivertFSP = await this.divertQueueFSPRepository
        .createQueryBuilder('dqf')
        .select('MAX(dqf.Id)', 'maxId')
        .where('dqf.MerchantId = :mid', { mid })
        .getRawOne<{ maxId: number }>();

      if (latestDivertFSP?.maxId) {
        const lastRecord = await this.divertQueueFSPRepository.findOne({
          where: { id: latestDivertFSP.maxId },
        });

        if (lastRecord?.isDiverted) {
          await this.divertQueueFSPRepository.insert({
            merchantId: Number(mid),
            isDiverted: true,
            divertFlagNotes: 'Manual remove from divert via NetSettlement',
            createDate: () => 'GETDATE()',
            createdBy: user,
          });
        }
      }
    }

    await this.riskRadarNotesRepository.insert({
      mid,
      notes: 'Account removed from divert',
      notesTypeId: 5,
      userCreated: user,
    });
    await this.riskRadarMerchAdjParamRepository.update(
      { mid },
      { isDivert: false }
    );
  }
}
