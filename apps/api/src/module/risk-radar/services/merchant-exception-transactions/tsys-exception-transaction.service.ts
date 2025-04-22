import { Injectable } from '@nestjs/common';
import {
  format,
  getDay,
  getHours,
  setHours,
  setMinutes,
  setSeconds,
  subDays,
} from 'date-fns';

import type { RiskRadarExceptionsJeffEntity } from '@/finance-db/entities';
import {
  DailyDetailRepository,
  RiskRadarBatchRepository,
} from '@/finance-db/repositories';
import type {
  TransactionResult,
  TSYSBatchAuthDates,
  TSYSTransactionFromBatch,
  TSYSTransactionFromDailyDetail,
} from '@/shared/response';

@Injectable()
export class TsysExceptionTransactionService {
  public constructor(
    private readonly batchRepository: RiskRadarBatchRepository,
    private readonly dailyDetailRepository: DailyDetailRepository
  ) {}

  public async getTSYSTransactionsForException(
    e: RiskRadarExceptionsJeffEntity,
    binSearch?: string
  ) {
    const { dtStartAuth, dtEndAuth } = this.determineAuthTimes(e.createdAt);

    const batches = await this.getCycleFileBatches(
      e.mid,
      format(e.fundingDate, 'EEE'), // Short day of the week (Mon, Tue, etc)
      e.achFundingTime,
      e.fundingDate
    );
    const batchIds = batches.map((b) => b.batchId);

    // We run in parallel to speed up the process
    const res = await Promise.all([
      this.getTSYSTransactionFromBatches(batchIds, binSearch),
      this.getTSYSTransactionsForAuthDates(
        e.mid,
        dtStartAuth,
        dtEndAuth,
        binSearch
      ),
    ]);

    const transactions = res.flat();

    return transactions;
  }

  private determineAuthTimes(dtExceptionCreated: Date): TSYSBatchAuthDates {
    const day = getDay(dtExceptionCreated); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = getHours(dtExceptionCreated);
    let dtStartAuth: Date;
    let dtEndAuth: Date;

    // Tuesday, Wednesday, Thursday, Friday (2,3,4,5) and hours between 8 and 16
    if ([2, 3, 4, 5].includes(day) && hour >= 8 && hour <= 16) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 1), 20), 45),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 59),
        0
      );
    }
    // Monday (1) and hours between 8 and 16
    else if (day === 1 && hour >= 8 && hour <= 16) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 1), 7), 30),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 59),
        0
      );
    }
    // Sunday (0)
    else if (day === 0) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 2), 20), 45),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 29),
        0
      );
    }
    // Mon, Tue, Wed, Thu, Fri (1,2,3,4,5) and hours between 17 and 19
    else if ([1, 2, 3, 4, 5].includes(day) && hour >= 17 && hour <= 19) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 8), 0),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 17), 49),
        0
      );
    }
    // Mon, Tue, Wed, Thu, Fri (1,2,3,4,5) and hours between 20 and 23
    else if ([1, 2, 3, 4, 5].includes(day) && hour >= 20 && hour <= 23) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 17), 50),
        0
      );
      dtEndAuth = setMinutes(setHours(dtExceptionCreated, 20), 44);
    } else {
      throw new Error(
        `No matching condition found for date: ${dtExceptionCreated.toISOString()}`
      );
    }

    return { dtStartAuth, dtEndAuth };
  }

  private async getCycleFileBatches(
    mid: string,
    dayOfTheFunding: string,
    achFundingTime: string,
    fundingDate: Date
  ): Promise<{ batchId: number }[]> {
    const result = await this.batchRepository
      .createQueryBuilder('batch')
      .innerJoin(
        'tblRiskRadarCycleTimeMonitor',
        'monitor',
        `batch.sCycle = monitor.sCycle AND batch.dtTransmission = DATEADD(DAY, monitor.iDateDiffFundingVsTransmissionCycle, :fundingDate)`
      )
      .innerJoin(
        'tblRiskRadarMerchAdjParam',
        'param',
        `param.sMID = batch.sMID AND (
          (monitor.iAccountType = 0) OR
          (monitor.iAccountType = 1 AND param.bNextDayFundingAcct = 0) OR
          (monitor.iAccountType = 2 AND param.bNextDayFundingAcct = 1)
        )`
      )
      .where('batch.sMID = :mid', { mid })
      .andWhere('monitor.sDayOfTheFunding = :dayOfTheFunding', {
        dayOfTheFunding,
      })
      .andWhere('monitor.sACHFundingTime = :achFundingTime', {
        achFundingTime,
      })
      .setParameter('fundingDate', fundingDate)
      .select('batch.pkDFT256Batch', 'batchId')
      .getRawMany<{ batchId: number }>();

    return result;
  }

  private async getTSYSTransactionFromBatches(
    batchIds: number[],
    binSearch?: string
  ): Promise<TransactionResult[]> {
    if (batchIds.length === 0) {
      return [];
    }
    const transactions = await this.batchRepository
      .createQueryBuilder('b')
      .select([
        't.dtTrans AS transactionDate',
        't.dTransAmt AS transactionAmount',
        't.sPOSEntryMode AS posEntryMode',
        'pos.sPOSEntryMode AS sPOSEntryMode',
        't.sAVSRespCode AS avsResponseCode',
        't.sDIAVSResponseCode AS diavsResponseCode',
        't.sAuthCode AS authCode',
        't.sCardNumF6 AS sCardNumF6',
        't.sCardNumL4 AS sCardNumL4',
        't.sDebitNetworkIdentifier AS sDebitNetworkIdentifier',
        't.sTransID AS sTransID',
        't.dAuthAmt AS dAuthAmt',
        't.iATPoints AS iATPoints',
        'b.iChbkExceedPoints AS iChbkExceedPoints',
        't.iDuplBINPoints AS iDuplBINPoints',
        't.iDuplCardPoints AS iDuplCardPoints',
        't.iFgnkeyedTransPoints AS iFgnkeyedTransPoints',
        'b.iKeyedPoints AS iKeyedPoints',
        't.iLatePostTransPoints AS iLatePostTransPoints',
        't.iMotoIoAVSPoints AS iMotoIoAVSPoints',
        't.iNoAuthTransPoints AS iNoAuthTransPoints',
        't.iAuthCaptureAmtLargeVariationPoints AS iAuthCaptureAmtLargeVariationPoints',
        't.fkDFT256Batch AS fkDFT256Batch',
      ])
      .leftJoin(
        'tblRiskRadarTransaction',
        't',
        't.fkDFT256Batch = b.pkDFT256Batch'
      )
      .leftJoin(
        'tblPOSEntryModesDFT',
        'pos',
        'pos.sPOSEntryCode = t.sPOSEntryMode'
      )
      .where('b.pkDFT256Batch IN (:...batchIds)', { batchIds })
      .getRawMany<TSYSTransactionFromBatch>();

    const transformed = transactions.map<TransactionResult>((t) => ({
      transactionDate: t.transactionDate,
      transactionAmount: Number(t.transactionAmount ?? 0),
      posEntryMode: `${t.posEntryMode.slice(0, 2)} ${t.sPOSEntryMode}`.trim(),
      avsResponseCode: t.avsResponseCode ?? t.diavsResponseCode ?? '',
      authCode: String(t.authCode) ?? '',
      cardNumber: `${t.sCardNumF6}******${t.sCardNumL4}`,
      debitNetworkIdentifier: t.sDebitNetworkIdentifier ?? '',
      transactionId: t.sTransID.slice(-4) ?? '',
      authAmount: Number(t.dAuthAmt ?? 0),
      exceptionList: this.getExceptionList(t),
      exceptionTitle: this.getExceptionTitle(t),
      authResponseDescription: '',
      binSearchMatchFlag: binSearch
        ? t.sCardNumL4.startsWith(binSearch)
        : false,
    }));

    return transformed;
  }

  private async getTSYSTransactionsForAuthDates(
    mid: string,
    dtStartAuth: Date,
    dtEndAuth: Date,
    binSearch?: string
  ): Promise<TransactionResult[]> {
    const transactions = await this.dailyDetailRepository
      .createQueryBuilder('dd')
      .select([
        'dd.transdate AS transactionDate',
        'dd.transamount AS transamount',
        'dd.posmode AS posmode',
        'pos.sPOSEntryMode as sPOSEntryMode',
        'dd.authnum AS authnum',
        'dd.cardnum_truncated AS cardnum_truncated',
        'dd.transactionid AS transactionid',
        'dd.authamt AS authamt',
        'lu.Definition AS Definition',
      ])
      .leftJoin(
        'dailydetail_authresp_lookup',
        'lu',
        'lu.code = dd.authrespcode'
      )
      .leftJoin(
        'tblPOSEntryModesADF',
        'pos',
        'pos.sPOSEntryCode = LEFT(dd.posmode, 2)'
      )
      .where('dd.MID = :sMID', { sMID: mid })
      .andWhere('dd.transdate BETWEEN :dtStartAuth AND :dtEndAuth', {
        dtStartAuth,
        dtEndAuth,
      })
      .andWhere("dd.authrespcode != '00'")
      .andWhere("dd.cardnum_truncated != ''")
      .andWhere(
        `(
          ISNULL(dd.iGT2AuthDeclOnDiffCardPoints, 0) > 0 OR
          ISNULL(dd.iGT1AuthDeclOnSameCardPoints, 0) > 0 OR
          ISNULL(dd.i1AuthDeclOnSpecificReasonPoints, 0) > 0
        )`
      )
      .getRawMany<TSYSTransactionFromDailyDetail>();

    const transformed = transactions.map<TransactionResult>((t) => ({
      transactionDate: t.transactionDate,
      transactionAmount: Number(t.transamount ?? 0),
      posEntryMode: `${t.posmode.slice(0, 2)} ${t.sPOSEntryMode}`.trim() ?? '',
      avsResponseCode: '',
      authCode: String(t.authnum) ?? '',
      cardNumber: t.cardnum_truncated.replace('x', '*') ?? '',
      debitNetworkIdentifier: '',
      transactionId: t.transactionid.slice(-4) ?? '',
      authAmount: Number(t.authamt ?? 0),
      exceptionList: '3',
      exceptionTitle: 'Auth Decl',
      authResponseDescription: t.Definition ?? '',
      binSearchMatchFlag: binSearch
        ? t.cardnum_truncated.startsWith(binSearch)
        : false,
    }));

    return transformed;
  }

  private getExceptionList(e: TSYSTransactionFromBatch): string {
    let result = '';

    if (e.iATPoints > 0) {
      result += '2 ';
    }

    if (e.iChbkExceedPoints > 0) {
      result += '5 ';
    }

    if (e.iDuplBINPoints > 0) {
      result += '7 ';
    }

    if (e.iDuplCardPoints > 0) {
      result += '8 ';
    }

    if (e.iFgnkeyedTransPoints > 0) {
      result += '9 ';
    }

    if (e.iKeyedPoints > 0) {
      result += '10 ';
    }

    if (e.iLatePostTransPoints > 0) {
      result += '11 ';
    }

    if (e.iMotoIoAVSPoints > 0) {
      result += '12 ';
    }

    if (e.iNoAuthTransPoints > 0) {
      result += '18 ';
    }

    if (e.iAuthCaptureAmtLargeVariationPoints > 0) {
      result += '21';
    }

    return result.trim();
  }

  private getExceptionTitle(e: TSYSTransactionFromBatch): string {
    let result = '';

    if (e.iATPoints > 0) {
      result = 'AT';
    }

    if (e.iChbkExceedPoints > 0) {
      result = 'CB/RR';
    }

    if (e.iDuplBINPoints > 0) {
      result = 'Dupl BIN';
    }

    if (e.iDuplCardPoints > 0) {
      result = 'Dupl Card';
    }

    if (e.iFgnkeyedTransPoints > 0) {
      result = 'Foreign Keyed';
    }

    if (e.iKeyedPoints > 0) {
      result = 'Keyed %';
    }

    if (e.iLatePostTransPoints > 0) {
      result = 'Late Post';
    }

    if (e.iMotoIoAVSPoints > 0) {
      result = 'MOTO AVS';
    }

    if (e.iNoAuthTransPoints > 0) {
      result = 'No Auth';
    }

    if (e.iAuthCaptureAmtLargeVariationPoints > 0) {
      result = 'Settle Amt more than 20% of Auth Amt';
    }

    return result;
  }
}
