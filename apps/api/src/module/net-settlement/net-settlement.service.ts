import { Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { DataSource } from 'typeorm';

import {
  NetSettlementLabelTypeRepository,
  NetSettlementTransRepository,
  NetSettlementTransWorkSheetRepository,
} from '@/crescent-view-db/repositories';
import {
  RiskRadarMerchAdjParamRepository,
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  DivertQueueFSPRepository,
  DivertQueueRepository,
  LeadRepository,
  MerchantMemoUploadRepository,
  SubscriptionQueueRequestEventJsonSourceRepository,
} from '@/iris-db/repositories';
import type {
  NetSettlementSummary,
  NetSettlementSummaryHeader,
} from '@/shared/response';

import type { NetSettlementBaseDto } from './dto/handle-action.dto';
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
    private readonly riskRadarMerchAdjParamRepository: RiskRadarMerchAdjParamRepository,
    private readonly netSettlementTransWorkSheetRepository: NetSettlementTransWorkSheetRepository,
    private readonly leadRepository: LeadRepository,
    private readonly merchantMemoUploadRepository: MerchantMemoUploadRepository
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

  public async handleDivertAdd(
    payload: HandleDiverAddDto
  ): Promise<NetSettlementSummary> {
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

      return await this.getNetSettlementSummaryByMID(mid);
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
  ): Promise<NetSettlementSummary> {
    try {
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
              isDiverted: false,
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
              isDiverted: false,
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
      return await this.getNetSettlementSummaryByMID(mid);
    } catch (error) {
      this.logger.error(`Error adding divert note for MID: ${payload.mid}`);
      this.logger.error(error);
      throw new RuntimeException(
        `Error adding divert note for MID: ${payload.mid}`
      );
    }
  }

  public async releaseFunds(
    payload: NetSettlementBaseDto
  ): Promise<NetSettlementSummary> {
    try {
      const { mid, amount, note, user } = payload;
      const now = new Date();
      const mid6 = mid.slice(0, 4);
      const midRight6 = mid.slice(-6);

      if (!amount || amount <= 0) {
        return await this.getNetSettlementSummaryByMID(mid);
      }

      const trans = await this.netSettlementTransRepository.save(
        this.netSettlementTransRepository.create({
          sourceId: 4,
          categoryId: 8,
          typeId: 2,
          bankNumber: mid6,
          mid6: midRight6,
          mid,
          dba: null,
          amount,
          createdBy: user,
        })
      );

      const transId = trans?.id;
      if (!transId) return await this.getNetSettlementSummaryByMID(mid);

      await this.netSettlementTransRepository.update(
        { id: transId },
        { groupId: transId }
      );

      await this.netSettlementTransWorkSheetRepository.save(
        this.netSettlementTransWorkSheetRepository.create({
          transactionId: transId,
          transactionCategoryId: 8,
          transactionTypeId: 2,
          transactionDate: now,
          amount,
          notes: note,
          isMain: true,
          createdBy: user,
        })
      );

      await this.riskRadarNotesRepository.insert({
        mid,
        notes: `Released ${amount}`,
        notesTypeId: 11,
        userCreated: user,
        irisMemoRequestDate: () => 'GETDATE()',
      });

      const lead = await this.leadRepository.findOne({
        where: { irisMId: mid },
      });

      if (lead) {
        await this.merchantMemoUploadRepository.save(
          this.merchantMemoUploadRepository.create({
            irisLeadId: lead.irisLeadId,
            irisMerchantId: mid,
            memo: `Net Settlement Note: Released ${amount} - ${user} - ${now.toLocaleString()}`,
            isProcessed: false,
            isVisible: false,
          })
        );
      }
      return await this.getNetSettlementSummaryByMID(mid);
    } catch (error) {
      this.logger.error(`Error releaseFunds for MID: ${payload.mid}`);
      this.logger.error(error);
      throw new RuntimeException(`Error releaseFunds for MID: ${payload.mid}`);
    }
  }

  // withdraw
  public async withDraw(
    payload: NetSettlementBaseDto
  ): Promise<NetSettlementSummary> {
    try {
      const { mid, user, amount, note } = payload;
      const now = new Date();

      const trans = await this.netSettlementTransRepository.save(
        this.netSettlementTransRepository.create({
          sourceId: 4,
          categoryId: 8,
          typeId: 1,
          transactionDate: now,
          bankNumber: mid.substring(0, 4),
          mid6: mid.substring(mid.length - 6),
          mid,
          dba: null,
          amount,
          createdBy: user,
        })
      );

      await this.netSettlementTransRepository.update(
        { id: trans.id },
        { groupId: trans.id }
      );

      await this.netSettlementTransWorkSheetRepository.save(
        this.netSettlementTransWorkSheetRepository.create({
          transactionId: trans.id,
          transactionCategoryId: trans.categoryId,
          transactionTypeId: trans.typeId,
          transactionDate: trans.transactionDate,
          amount: trans.amount,
          notes: note,
          isMain: true,
          createdBy: user,
          createdDate: now,
        })
      );
      return await this.getNetSettlementSummaryByMID(mid);
    } catch (error) {
      this.logger.error(`Error withDraw for MID: ${payload.mid}`);
      this.logger.error(error);
      throw new RuntimeException(`Error withDraw for MID: ${payload.mid}`);
    }
  }

  // apply
  public async applyCheckToNetSettlement(
    payload: NetSettlementBaseDto
  ): Promise<NetSettlementSummary> {
    try {
      const { mid, amount, note, checkType, user } = payload;
      const now = new Date();

      const transTypeId = checkType === 'payed' ? 2 : 1;

      const trans = await this.netSettlementTransRepository.save(
        this.netSettlementTransRepository.create({
          sourceId: 6,
          categoryId: 10,
          typeId: transTypeId,
          transactionDate: now,
          bankNumber: mid.substring(0, 4),
          mid6: mid.substring(mid.length - 6),
          mid,
          dba: null,
          amount,
          createdBy: user,
        })
      );

      await this.netSettlementTransRepository.update(
        { id: trans.id },
        { groupId: trans.id }
      );

      await this.netSettlementTransWorkSheetRepository.save(
        this.netSettlementTransWorkSheetRepository.create({
          transactionId: trans.id,
          transactionCategoryId: trans.categoryId,
          transactionTypeId: trans.typeId,
          transactionDate: trans.transactionDate,
          amount: trans.amount,
          notes: note,
          isMain: true,
          createdBy: user,
          createdDate: now,
        })
      );
      return await this.getNetSettlementSummaryByMID(mid);
    } catch (error) {
      this.logger.error(
        `Error applyCheckToNetSettlement for MID: ${payload.mid}`
      );
      this.logger.error(error);
      throw new RuntimeException(
        `Error applyCheckToNetSettlement for MID: ${payload.mid}`
      );
    }
  }

  // write off
  public async writeOffNetSettlement(
    payload: NetSettlementBaseDto
  ): Promise<NetSettlementSummary> {
    try {
      const { mid, amount, note, writeOffType, user } = payload;

      const now = new Date();

      const [{ maxEligibleWriteOff = 0 }] =
        await this.netSettlementTransRepository.getEligibleWriteOffSum(mid);

      if (Math.abs(amount) <= 0 || Math.abs(maxEligibleWriteOff) <= 0) {
        return await this.getNetSettlementSummaryByMID(mid);
      }

      const trans = await this.netSettlementTransRepository.save(
        this.netSettlementTransRepository.create({
          sourceId: 7,
          categoryId: writeOffType === 'risk' ? 11 : 9,
          typeId: maxEligibleWriteOff < 0 ? 1 : 2,
          bankNumber: mid.substring(0, 4),
          mid6: mid.substring(mid.length - 6),
          mid,
          dba: null,
          transactionDate: now,
          amount: Math.abs(amount),
          createdBy: user,
        })
      );

      await this.netSettlementTransRepository.update(
        { id: trans.id },
        { groupId: trans.id }
      );

      await this.netSettlementTransWorkSheetRepository.save(
        this.netSettlementTransWorkSheetRepository.create({
          transactionId: trans.id,
          transactionCategoryId: trans.categoryId,
          transactionTypeId: trans.typeId,
          transactionDate: trans.transactionDate,
          amount: trans.amount,
          notes: note,
          isMain: true,
          createdBy: user,
          createdDate: now,
        })
      );

      return await this.getNetSettlementSummaryByMID(mid);
    } catch (error) {
      this.logger.error(`Error withDraw for MID: ${payload.mid}`);
      this.logger.error(error);
      throw new RuntimeException(`Error withDraw for MID: ${payload.mid}`);
    }
  }

  // transfer
  public async applyCheckDivertTransfer(
    mid: string,
    amount: number,
    notes: string,
    user: string
  ): Promise<number> {
    const now = new Date();

    const trans = await this.netSettlementTransRepository.save(
      this.netSettlementTransRepository.create({
        sourceId: 8, // Check Divert Transfer Source
        categoryId: 12, // Check Divert Category
        typeId: 1, // Assuming 'withdrawal'
        bankNumber: mid.substring(0, 4),
        mid6: mid.substring(mid.length - 6),
        mid,
        transactionDate: now,
        amount,
        createdBy: user,
      })
    );

    trans.groupId = trans.id;
    await this.netSettlementTransRepository.save(trans);

    await this.netSettlementTransWorkSheetRepository.save(
      this.netSettlementTransWorkSheetRepository.create({
        transactionId: trans.id,
        transactionCategoryId: trans.categoryId,
        transactionTypeId: trans.typeId,
        transactionDate: trans.transactionDate,
        amount: trans.amount,
        notes: `Transferred from Check Divert ${notes ?? ''}`,
        isMain: true,
        createdBy: user,
        createdDate: now,
      })
    );

    return trans.id;
  }

  public async applyTransferToAnotherMID(
    mid: string,
    midXfer: string,
    amount: number,
    futureBalanceAmt: number,
    notes: string,
    user: string
  ): Promise<void> {
    if (!midXfer?.trim()) {
      return;
    }

    const now = new Date();

    // Determine transaction types
    const typeTo = futureBalanceAmt > 0 ? 2 : 1; // Deposit if futureBalance > 0
    const typeFrom = futureBalanceAmt > 0 ? 1 : 2; // Withdraw if futureBalance > 0

    // Entry #1 — FROM sMID (withdraw or deposit)
    const trans = await this.netSettlementTransRepository.save(
      this.netSettlementTransRepository.create({
        sourceId: 8,
        categoryId: 13,
        typeId: typeTo,
        bankNumber: mid.substring(0, 4),
        mid6: mid.slice(-6),
        mid,
        transactionDate: now,
        amount,
        createdBy: user,
      })
    );

    trans.groupId = trans.id;
    await this.netSettlementTransRepository.save(trans);

    const workSheetFrom = this.netSettlementTransWorkSheetRepository.create({
      transactionId: trans.id,
      transactionCategoryId: trans.categoryId,
      transactionTypeId: trans.typeId,
      transactionDate: trans.transactionDate,
      amount: trans.amount,
      notes: `Transferred to MID ${midXfer} ${notes ?? ''}`,
      isMain: true,
      createdBy: user,
      createdDate: now,
    });

    await this.netSettlementTransWorkSheetRepository.save(workSheetFrom);

    // Entry #2 — TO sMIDXFER (opposite type)
    const transTo = await this.netSettlementTransRepository.save(
      this.netSettlementTransRepository.create({
        sourceId: 8,
        categoryId: 13,
        typeId: typeFrom,
        bankNumber: midXfer.substring(0, 4),
        mid6: midXfer.slice(-6),
        mid: midXfer,
        transactionDate: now,
        amount,
        createdBy: user,
      })
    );

    transTo.groupId = transTo.id;
    await this.netSettlementTransRepository.save(transTo);

    const workSheetTo = this.netSettlementTransWorkSheetRepository.create({
      transactionId: transTo.id,
      transactionCategoryId: transTo.categoryId,
      transactionTypeId: transTo.typeId,
      transactionDate: transTo.transactionDate,
      amount: transTo.amount,
      notes: `Transferred from MID ${mid} ${notes ?? ''}`,
      isMain: true,
      createdBy: user,
      createdDate: now,
    });

    await this.netSettlementTransWorkSheetRepository.save(workSheetTo);
  }
}
