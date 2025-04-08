import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  format,
  getDay,
  getHours,
  parse,
  setHours,
  setMinutes,
  setSeconds,
  subDays,
} from 'date-fns';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import {
  CLXReportingSearchAVSResponseLookup,
  CLXReportingSearchPaymentMethodLookup,
} from '@/data-warehouse-db/entities';
import { ClxReportingRepository } from '@/data-warehouse-db/repositories';
import {
  DailyDetailRepository,
  RiskRadarBatchRepository,
  RiskRadarExceptionsJeffRepository,
} from '@/finance-db/repositories';

import type { MerchantExceptionTransactionsInputDto } from './dto/merchant-exception-transactions.dto';

type TransactionResult = {
  transactionDate: Date; // Transaction date
  transactionAmount: number; // Transaction amount
  posEntryMode: string; // POS entry mode
  avsResponseCode: string; // AVS response code
  authCode: string; // Authorization code
  cardNumber: string; // Card number (masked)
  debitNetworkIdentifier: string; // Debit network identifier
  transactionId: string; // Transaction ID
  authAmount: number; // Authorization amount
  exceptionList: string; // List of exception codes
  exceptionTitle: string; // Exception title
  authResponseDescription: string; // Authorization response description
  binSearchMatchFlag: boolean; // BIN search match flag
  id?: string;
};

type TransactionFromBatch = {
  transactionDate: Date;
  posEntryMode: string;
  sPOSEntryMode: string;
  avsResponseCode: string;
  diavsResponseCode: string;
  authCode: string;
  sCardNumF6: string;
  sCardNumL4: string;
  sDebitNetworkIdentifier: string;
  sTransID: string;
  dAuthAmt: number;
  iATPoints: number;
  iChbkExceedPoints: number;
  iDuplBINPoints: number;
  iDuplCardPoints: number;
  iFgnkeyedTransPoints: number;
  iKeyedPoints: number;
  iLatePostTransPoints: number;
  iMotoIoAVSPoints: number;
  iNoAuthTransPoints: number;
  iAuthCaptureAmtLargeVariationPoints: number;
};

type TransactionFromDailyDetail = {
  transdate?: Date;
  transamount?: number;
  posmode?: string;
  sPOSEntryMode?: string;
  authnum?: string;
  cardnum_truncated?: string;
  transactionid?: string;
  authamt?: number;
  Definition?: string;
  avsResponseCode?: string;
  debitNetworkIdentifier?: string;
};

type FSPTransaction = {
  TransactionDate: Date;
  Amount: number;
  sPaymentMethodDesc: string;
  sAVSRespDesc: string;
  AuthCode: string | null;
  First6: string;
  Last4: string;
  Network: string;
  txnID: string;
  sExceptionType: string;
};

type AuthDates = {
  dtStartAuth: Date;
  dtEndAuth: Date;
};

@Injectable()
export class MerchantExceptionTransactionsService {
  public constructor(
    @InjectPinoLogger(MerchantExceptionTransactionsService.name)
    private readonly logger: Logger,
    private readonly batchRepository: RiskRadarBatchRepository,
    private readonly dailyDetailRepository: DailyDetailRepository,
    private readonly riskRadarExceptionsJeff: RiskRadarExceptionsJeffRepository,
    private readonly clxReportingRepository: ClxReportingRepository
  ) {}

  public async getExceptionsTrans(
    input: MerchantExceptionTransactionsInputDto
  ): Promise<TransactionResult[] | unknown[]> {
    const { riskRadarExceptionId } = input;

    const exception = await this.riskRadarExceptionsJeff.findOne({
      where: {
        id: riskRadarExceptionId,
      },
    });

    if (!exception) {
      throw new NotFoundException(
        `Exception with ID ${riskRadarExceptionId} not found`
      );
    }

    const first4Mid = exception.mid.slice(0, 4);
    const isTSYS = ['5611', '7905'].includes(first4Mid);
    const isFSP = ['8152'].includes(first4Mid);

    if (isTSYS) {
      const { dtStartAuth, dtEndAuth } = this.determineAuthTimes(
        exception.createdAt
      );

      const batches = await this.getCycleFileBatches(
        exception.mid,
        format(exception.fundingDate, 'EEE'), // Short day of the week (Mon, Tue, etc)
        exception.achFundingTime,
        exception.fundingDate
      );
      const batchIds = batches.map((b) => b.batchId);

      // We run in parallel to speed up the process
      const res = await Promise.all([
        this.getTSYSTransactionFromBatches(batchIds),
        this.getTSYSTransactionsForAuthDates(
          exception.mid,
          dtStartAuth,
          dtEndAuth
        ),
      ]);

      const transactions = res.flat();

      // TODO: Add sort by from input
      return this.sortTransactionsBy(transactions, 'authAmount', 'desc');
    }

    if (isFSP) {
      const transactions = await this.getFSPTransactions(
        exception.mid,
        exception.fundingDate,
        exception.achFundingTime
      );

      return this.sortTransactionsBy(transactions, 'transactionAmount', 'desc');
    }

    throw new BadRequestException(
      `Invalid merchant for exception ${exception.mid}`
    );
  }

  public determineAuthTimes(dtExceptionCreated: Date): AuthDates {
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

  public async getCycleFileBatches(
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

  public getExceptionList(e: TransactionFromBatch): string {
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

  public getExceptionTitle(e: TransactionFromBatch): string {
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

  public async getTSYSTransactionFromBatches(
    batchIds: number[]
  ): Promise<TransactionResult[]> {
    const transactions = await this.batchRepository
      .createQueryBuilder('b')
      .select([
        't.dtTrans AS transactionDate',
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
      .getRawMany<TransactionFromBatch>();

    const transformed = transactions.map<TransactionResult>((t) => ({
      transactionDate: t.transactionDate,
      transactionAmount: Number(t.dAuthAmt ?? 0),
      posEntryMode: `${t.posEntryMode.slice(0, 2)} ${t.sPOSEntryMode}`.trim(),
      avsResponseCode: t.avsResponseCode ?? t.diavsResponseCode ?? '',
      authCode: String(t.authCode) ?? '',
      cardNumber: `${t.sCardNumF6}******${t.sCardNumL4}`,
      debitNetworkIdentifier: t.sDebitNetworkIdentifier ?? '',
      transactionId: t.sTransID ?? '',
      authAmount: Number(t.dAuthAmt ?? 0),
      exceptionList: this.getExceptionList(t),
      exceptionTitle: this.getExceptionTitle(t),
      authResponseDescription: '',
      binSearchMatchFlag: false,
    }));

    return transformed;
  }

  public async getTSYSTransactionsForAuthDates(
    mid: string,
    dtStartAuth: Date,
    dtEndAuth: Date
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
      .getRawMany<TransactionFromDailyDetail>();

    const transformed = transactions.map<TransactionResult>((t) => ({
      transactionDate: t.transdate,
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
      binSearchMatchFlag: false,
    }));

    return transformed;
  }

  public async getFSPTransactions(
    mid: string,
    dtFunding: Date,
    sACHFundingTime: string
  ): Promise<TransactionResult[]> {
    // Dates
    const dtFundingString = dtFunding.toISOString().split('T')[0]; // Only need date part (YYYY-MM-DD)

    const dtAuthEnd = parse(
      `${dtFundingString} ${sACHFundingTime}`,
      'yyyy-MM-dd h:mm a',
      new Date()
    );

    const dtAuthStart = subDays(dtAuthEnd, 1);

    const rawTransactions = await this.clxReportingRepository
      .createQueryBuilder('s')
      .select([
        's.TransactionDate AS TransactionDate',
        's.Amount AS Amount ',
        'pm.sPaymentMethodDesc AS sPaymentMethodDesc',
        'avs.sAVSRespDesc AS sAVSRespDesc',
        's.AuthCode AS AuthCode',
        's.First6 AS First6',
        's.Last4 AS Last4',
        's.Network AS Network',
        's.txnID AS txnID',
        'ep.sExceptionType AS sExceptionType',
      ])
      .leftJoin(
        CLXReportingSearchPaymentMethodLookup,
        'pm',
        'pm.iPaymentMethodKey = s.PaymentMethodKey'
      )
      .leftJoin(
        CLXReportingSearchAVSResponseLookup,
        'avs',
        'avs.iAVSResp = s.AVSResponseKey'
      )
      .leftJoin(
        'finance..tblFSPRiskRadarExceptionPoints',
        'ep',
        'ep.Id = s.id AND ep.sMID = s.SiteID AND ep.dtExceptionRunDate = :dtFunding AND ep.sExceptionRunTime = :sACHFundingTime'
      )
      .where('s.siteId = :mid', { mid })
      .andWhere(
        '(s.TransactionDateTime BETWEEN :start AND :end OR ep.Id IS NOT NULL)'
      )
      .setParameters({
        mid,
        dtFunding,
        sACHFundingTime,
        start: dtAuthStart,
        end: dtAuthEnd,
      })
      .getRawMany<FSPTransaction>();

    // Group transactions by transaction ID using map to join exception types to create list & title
    const grouped = Object.values(
      rawTransactions.reduce<Record<string, TransactionResult>>((acc, t) => {
        const key = t.txnID;

        if (!acc[key]) {
          acc[key] = {
            id: t.txnID,
            transactionDate: t.TransactionDate,
            transactionAmount: t.Amount,
            posEntryMode: t.sPaymentMethodDesc,
            avsResponseCode: t.sAVSRespDesc,
            authCode: t.AuthCode,
            cardNumber: `${t.First6}******${t.Last4}`,
            debitNetworkIdentifier: t.Network,
            transactionId: t.txnID,
            authAmount: t.Amount,
            exceptionList: this.getExceptionTypeNumber(t.sExceptionType) ?? '',
            exceptionTitle: t.sExceptionType ?? '',
            authResponseDescription: '',
            binSearchMatchFlag: false,
          };
        } else if (t.sExceptionType) {
          acc[key].exceptionTitle += ` - ${t.sExceptionType}`;
          acc[key].exceptionList +=
            ` - ${this.getExceptionTypeNumber(t.sExceptionType)}`;
        }

        return acc;
      }, {})
    );

    return grouped;
  }

  private getExceptionTypeNumber(exceptionType: string): string {
    switch (exceptionType) {
      case 'AVGTKT':
        return '2';
      case 'AUTHDECL':
        return '3';
      case 'AUTHDECLSAMECARD':
        return '25';
      case 'AUTHDECLSPECIFICREASON':
        return '26';
      case 'AUTHDECLGT5IN30MIN':
        return '27';
      case 'DUPBIN':
        return '7';
      case 'DUPCARD':
        return '8';
      case 'DUPCARDIN30DAYS':
        return '28';
      case 'DUPCARDSWIPETHENKEYEDIN30DAYS':
        return '29';
      case 'FOREIGNKEYED':
        return '9';
      case 'KEYEDTRANSAMTABVLIMIT':
        return '10';
      case 'MOTOIOAAVS':
        return '12';
      case 'AVGBAT':
        return '4';
      default:
        return '';
    }
  }

  private sortTransactionsBy(
    transactions: TransactionResult[],
    sortBy: keyof TransactionResult = 'transactionDate',
    order: 'asc' | 'desc' = 'asc'
  ): TransactionResult[] {
    return [...transactions].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      let comparison = 0;

      if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime();
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        if (valueA === valueB) {
          comparison = 0;
        } else {
          comparison = valueA ? 1 : -1;
        }
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }
}
