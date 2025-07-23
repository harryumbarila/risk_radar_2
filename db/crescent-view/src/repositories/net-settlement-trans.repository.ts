/* eslint-disable class-methods-use-this */
import type { NetSettlementTransactionRow } from '@denali/shared';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { NetSettlementTrans } from '../entities';

@Injectable()
export class NetSettlementTransRepository extends Repository<NetSettlementTrans> {
  public constructor(
    @InjectDataSource('crescent-view') dataSource: DataSource
  ) {
    super(NetSettlementTrans, dataSource.createEntityManager());
  }

  public async getNetSettlementTransactionsSummary(
    mid: string
  ): Promise<NetSettlementTransactionRow[]> {
    const result = await this.query<NetSettlementTransactionRow[]>(
      `
      SELECT 
        t.pkTrans,
        t.fkTransParent,
        ISNULL(clu.sTransCategory, '') + 
          CASE WHEN t.sReturnCode IS NULL THEN '' ELSE ' ( ' + ISNULL(t.sReturnCode, '') + ' )' END AS category,
        CONVERT(VARCHAR(12), t.dtTrans, 101) AS dtTrans,

        -- Transaction Amount
        SUM(
          CASE WHEN t.fkTransType = 1 THEN 1 ELSE -1 END * 
          CASE WHEN ws.bMain = 1 THEN ws.dAmt ELSE 0 END
        ) AS dTransAmt,

        -- Balance Amount
        SUM(
          CASE WHEN ws.fkTransType = 1 THEN 1 ELSE -1 END *
          CASE 
            WHEN ws.fkTransCategory != 8 THEN ws.dAmt
            WHEN ws.fkTrans_Reference IS NULL 
              AND ws.dtUnCollected IS NULL AND ws.bACHVoided = 0 
              AND ${this.pastDueACHCondition('ws')} THEN ws.dAmt
            WHEN ws.fkTrans_Reference IS NOT NULL 
              AND wsr.dtUnCollected IS NULL AND wsr.bACHVoided = 0 
              AND ${this.pastDueACHCondition('wsr')} THEN ws.dAmt
            ELSE 0
          END
        ) AS dBalanceAmt,

        -- Pending Amount
        SUM(
          CASE WHEN ws.fkTransType = 1 THEN 1 ELSE -1 END *
          CASE 
            WHEN ws.fkTransCategory = 8 
              AND ws.bACHVoided = 0 AND ws.dtUnCollected IS NULL 
              AND ${this.pendingACHCondition('ws')} THEN ws.dAmt
            WHEN ws.fkTrans_Reference IS NOT NULL 
              AND wsr.fkTransCategory = 8 AND wsr.bACHVoided = 0 
              AND wsr.dtUnCollected IS NULL AND ${this.pendingACHCondition('wsr')} THEN ws.dAmt
            ELSE 0
          END
        ) AS dPendingAmt,

        -- Write Off Amount
        SUM(
          CASE WHEN ws.fkTransType = 1 THEN 1 ELSE -1 END * 
          CASE WHEN ws.fkTransCategory IN (9, 11) AND ws.dtACHSent1 IS NULL THEN ws.dAmt ELSE 0 END
        ) AS dWriteOffAmt,

        MAX(rlu.sTransDivertReason) AS sTransDivertReason,
        t.dtCreated,
        COALESCE(t.fkTransSourceReferenceKey, ws.fkACHDetail1) AS fkSourceKey,
        t.sCreatedBy

      FROM tblNetSettlementTrans t
      JOIN tblNetSettlementTransWorkSheet ws ON ws.fkTrans = t.pkTrans
      JOIN tblNetSettlementTransCategory_LookUp clu ON clu.pkTransCategory = t.fkTransCategory
      LEFT JOIN tblNetSettlementTransWorkSheet wsr ON wsr.fkTrans = ws.fkTrans_Reference AND wsr.bMain = 1
      LEFT JOIN tblNetSettlementTransDivertReason_LookUp rlu ON rlu.pkTransDivertReason = ws.fkTransDivertReason
      WHERE t.sMID = @0 AND t.bHidden = 0 AND ws.bHidden = 0
      GROUP BY 
        t.pkTrans, t.fkTransParent, clu.sTransCategory, t.fkTransCategory,
        t.sReturnCode, t.dtTrans, t.dAmt, t.dtCreated,
        COALESCE(t.fkTransSourceReferenceKey, ws.fkACHDetail1), t.sCreatedBy
      ORDER BY t.dtTrans, t.dtCreated
      `,
      [mid]
    );

    return result;
  }

  private pastDueACHCondition(alias: string): string {
    return `(
      (${alias}.fkACHDetail3 IS NOT NULL AND ${alias}.dtACHSent3 IS NOT NULL AND ${alias}.dtACHReturned3 IS NULL AND DATEDIFF(DAY, ${alias}.dtACHSent3, GETDATE()) > 7)
      OR (${alias}.fkACHDetail2 IS NOT NULL AND ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NULL AND DATEDIFF(DAY, ${alias}.dtACHSent2, GETDATE()) > 7)
      OR (${alias}.fkACHDetail1 IS NOT NULL AND ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NULL AND DATEDIFF(DAY, ${alias}.dtACHSent1, GETDATE()) > 7)
    )`;
  }

  private pendingACHCondition(alias: string): string {
    return `(
      (${alias}.dtACHSent1 IS NULL AND ${alias}.dtACHReturned1 IS NULL AND ${alias}.dtACHSent2 IS NULL AND ${alias}.dtACHReturned2 IS NULL AND ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL)
      OR (${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND ${alias}.dtACHSent2 IS NULL)
      OR (${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NULL AND DATEDIFF(DAY, ${alias}.dtACHSent2, GETDATE()) <= 7)
      OR (${alias}.dtACHSent3 IS NOT NULL AND ${alias}.dtACHReturned3 IS NULL AND DATEDIFF(DAY, ${alias}.dtACHSent3, GETDATE()) <= 7)
    )`;
  }

  public async getEligibleWriteOffSum(
    mid: string
  ): Promise<{ maxEligibleWriteOff: number }[]> {
    return this.manager.query(
      `
      SELECT
        SUM(x.dBalanceAmt + CASE WHEN x.dPendingAmt < 0 THEN x.dPendingAmt ELSE 0 END) AS maxEligibleWriteOff
      FROM (
        SELECT
          SUM(
            CASE WHEN ws.fkTransType = 1 THEN 1 ELSE -1 END *
              CASE
                WHEN ws.fkTransCategory != 8 THEN ws.dAmt
                WHEN ws.fkTrans_Reference IS NULL AND ws.dtUnCollected IS NULL AND ws.bACHVoided = 0 AND ${this.pastDueACH('ws')} THEN ws.dAmt
                WHEN ws.fkTrans_Reference IS NOT NULL AND wsr.dtUnCollected IS NULL AND wsr.bACHVoided = 0 AND ${this.pastDueACH('wsr')} THEN ws.dAmt
                ELSE 0
              END
          ) AS dBalanceAmt,
          SUM(
            CASE WHEN ws.fkTransType = 1 THEN 1 ELSE -1 END *
              CASE
                WHEN ws.fkTransCategory = 8 AND ws.dtUnCollected IS NULL AND ws.bACHVoided = 0 AND ${this.pendingACH('ws')} THEN ws.dAmt
                WHEN ws.fkTrans_Reference IS NOT NULL AND wsr.fkTransCategory = 8 AND wsr.dtUnCollected IS NULL AND wsr.bACHVoided = 0 AND ${this.pendingACH('wsr')} THEN ws.dAmt
                ELSE 0
              END
          ) AS dPendingAmt
        FROM tblNetSettlementTrans t
        JOIN tblNetSettlementTransWorkSheet ws ON ws.fkTrans = t.pkTrans
        LEFT JOIN tblNetSettlementTransWorkSheet wsr ON wsr.fkTrans = ws.fkTrans_Reference AND wsr.bMain = 1
        WHERE t.sMID = @0 AND t.bHidden = 0 AND ws.bHidden = 0
      ) AS x
    `,
      [mid]
    );
  }

  private pastDueACH(alias: string): string {
    return `
    (
      (
        ${alias}.fkACHDetail1 IS NOT NULL AND ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.fkACHDetail2 IS NOT NULL AND ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NOT NULL AND
        ${alias}.fkACHDetail3 IS NOT NULL AND ${alias}.dtACHSent3 IS NOT NULL AND ${alias}.dtACHReturned3 IS NULL AND
        DATEDIFF(DAY, ${alias}.dtACHSent3, GETDATE()) > 7
      ) OR (
        ${alias}.fkACHDetail1 IS NOT NULL AND ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.fkACHDetail2 IS NOT NULL AND ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NULL AND
        ${alias}.fkACHDetail3 IS NULL AND ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL AND
        DATEDIFF(DAY, ${alias}.dtACHSent2, GETDATE()) > 7
      ) OR (
        ${alias}.fkACHDetail1 IS NOT NULL AND ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NULL AND
        ${alias}.fkACHDetail2 IS NULL AND ${alias}.dtACHSent2 IS NULL AND ${alias}.dtACHReturned2 IS NULL AND
        ${alias}.fkACHDetail3 IS NULL AND ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL AND
        DATEDIFF(DAY, ${alias}.dtACHSent1, GETDATE()) > 7
      )
    )
  `;
  }

  private pendingACH(alias: string): string {
    return `
    (
      (
        ${alias}.dtACHSent1 IS NULL AND ${alias}.dtACHReturned1 IS NULL AND
        ${alias}.dtACHSent2 IS NULL AND ${alias}.dtACHReturned2 IS NULL AND
        ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL
      ) OR (
        ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.dtACHSent2 IS NULL AND ${alias}.dtACHReturned2 IS NULL AND
        ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL
      ) OR (
        ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NOT NULL AND
        ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL
      ) OR (
        ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NOT NULL AND
        ${alias}.dtACHSent3 IS NOT NULL AND ${alias}.dtACHReturned3 IS NOT NULL
      ) OR (
        ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NOT NULL AND
        ${alias}.dtACHSent3 IS NOT NULL AND ${alias}.dtACHReturned3 IS NULL AND
        DATEDIFF(DAY, ${alias}.dtACHSent3, GETDATE()) <= 7
      ) OR (
        ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NOT NULL AND
        ${alias}.dtACHSent2 IS NOT NULL AND ${alias}.dtACHReturned2 IS NULL AND
        ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL AND
        DATEDIFF(DAY, ${alias}.dtACHSent2, GETDATE()) <= 7
      ) OR (
        ${alias}.dtACHSent1 IS NOT NULL AND ${alias}.dtACHReturned1 IS NULL AND
        ${alias}.dtACHSent2 IS NULL AND ${alias}.dtACHReturned2 IS NULL AND
        ${alias}.dtACHSent3 IS NULL AND ${alias}.dtACHReturned3 IS NULL AND
        DATEDIFF(DAY, ${alias}.dtACHSent1, GETDATE()) <= 7
      )
    )
  `;
  }
}
