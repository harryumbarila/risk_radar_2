import { Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { DataSource } from 'typeorm';

import { NetSettlementTransRepository } from '@/crescent-view-db/repositories';
import {
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  DivertQueueFSPRepository,
  SubscriptionQueueRequestEventJsonSourceRepository,
} from '@/iris-db/repositories';
import type {
  NetSettlementSummary,
  NetSettlementSummaryHeader,
} from '@/shared/response';

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
    private readonly divertQueueFSPRepository: DivertQueueFSPRepository
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
      };
    } catch (error) {
      this.logger.error('Error getting net settlement summary');
      this.logger.error(error);
      throw new RuntimeException(`Error getting net settlement summary`);
    }
  }
}
