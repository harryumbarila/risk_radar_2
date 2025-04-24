import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { ChargeBacksEntity } from '../entities/charge-backs.entity';
import { ChargebacksAndRetrievalReasonCodeLookupEntity } from '../entities/chargebacks-and-retrieval-reason-code-lookup.entity';

type ChargebackTransaction = {
  dtTrans: Date;
  dAmt: number;
  sCardNum: string;
  dtReceived: Date;
  sReferenceNum: string;
  ReasonCodeDescription: string;
  dtCreated: Date;
  sPaymentType: string;
  sCaseNumber: string;
  bP2ChargebacksExists: boolean;
};

type P2ChargebackCount = {
  count: number;
};

type ChargebackWithoutP2 = Omit<ChargebackTransaction, 'bP2ChargebacksExists'>;

@Injectable()
export class ChargebacksAndRetrievalReasonCodeLookupRepository extends Repository<ChargebacksAndRetrievalReasonCodeLookupEntity> {
  private readonly dataSource: DataSource;

  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(
      ChargebacksAndRetrievalReasonCodeLookupEntity,
      dataSource.createEntityManager()
    );
    this.dataSource = dataSource;
  }

  /**
   * @migrated dbo.uspRiskRadarChgBkTransaction.StoredProcedure.sql
   */
  public async getChargebackTransactions(
    mid: string
  ): Promise<ChargebackTransaction[]> {
    if (mid.startsWith('8152')) {
      // Query for 8152 MIDs from DataWarehouse
      return this.dataSource
        .createQueryBuilder()
        .select([
          'CONVERT(datetime, TransactionDate) as dtTrans',
          'COALESCE(RepresentedCBAmount, TransactionAmount) as dAmt',
          'CardNumber as sCardNum',
          'CONVERT(datetime, ReportDate) as dtReceived',
          'ReferenceNumber as sReferenceNum',
          'ReasonCodeDescription',
          'CreatedDate as dtCreated',
          'CardTypeDescription as sPaymentType',
          'CBSequenceNumber as sCaseNumber',
          '0 as bP2ChargebacksExists',
        ])
        .from('DataWarehouse.AccessOne.ChargebackDataPull', 'cdp')
        .where('MerchantNumber = CAST(:mid AS varchar(16))', { mid })
        .orderBy('ReportDate', 'DESC')
        .limit(100)
        .getRawMany<ChargebackTransaction>();
    }

    // Query for other MIDs from finance.tblChargeBacks
    const chargebacks = await this.dataSource
      .createQueryBuilder()
      .select([
        'cb.dtTrans',
        'cb.dAmt',
        'cb.sCardNum',
        'cb.dtReceived',
        'cb.sReferenceNum',
        `cb.sReasonCode + ' ' + COALESCE(
          (SELECT STUFF((
            SELECT ',' + ISNULL(rc.sDescription, '')
            FROM finance..tblChargeBacksAndRetrievalReasonCode_LookUp rc
            WHERE rc.sReasonCode = cb.sReasonCode
            AND LEFT(rc.sCardType, 1) = LEFT(cb.sPaymentType, 1)
            FOR XML PATH('')
          ), 1, 1, '')),
          ''
        ) as ReasonCodeDescription`,
        'cb.dtCreated',
        'cb.sPaymentType',
        'cb.sCaseNumber',
      ])
      .from(ChargeBacksEntity, 'cb')
      .where('cb.sMID = CAST(:mid AS varchar(16))', { mid })
      .orderBy('cb.dtReceived', 'DESC')
      .limit(100)
      .getRawMany<ChargebackWithoutP2>();

    // Check for P2 chargebacks
    const p2ChargebacksCount = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('connector..tblProlificP2Chargebacks', 'p2')
      .where('p2.be_merch_num = CAST(:merchNum AS varchar(20))', {
        merchNum: `848700${mid.slice(-8)}`,
      })
      .getRawOne<P2ChargebackCount>();

    const p2ChargebacksWorkedCount = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('connector..tblProlificP2ChargebacksWorked', 'p2w')
      .where('p2w.be_merch_num = CAST(:merchNum AS varchar(20))', {
        merchNum: `848700${mid.slice(-8)}`,
      })
      .getRawOne<P2ChargebackCount>();

    const p2ChargebacksAdjustmentCount = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('connector..tblProlificP2ChargebacksAdjustment', 'p2a')
      .where('p2a.be_merch_num = CAST(:merchNum AS varchar(20))', {
        merchNum: `848700${mid.slice(-8)}`,
      })
      .getRawOne<P2ChargebackCount>();

    const hasP2Chargebacks = Boolean(
      (p2ChargebacksCount?.count ?? 0) > 0 ||
        (p2ChargebacksWorkedCount?.count ?? 0) > 0 ||
        (p2ChargebacksAdjustmentCount?.count ?? 0) > 0
    );

    return chargebacks.map((cb: ChargebackWithoutP2) => ({
      ...cb,
      bP2ChargebacksExists: hasP2Chargebacks,
    }));
  }
}
