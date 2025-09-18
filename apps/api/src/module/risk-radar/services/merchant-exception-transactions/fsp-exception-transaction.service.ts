import { Injectable } from '@nestjs/common';
import { parse, subDays } from 'date-fns';

import {
  CLXReportingSearchAVSResponseLookup,
  CLXReportingSearchPaymentMethodLookup,
} from '@/data-warehouse-db/entities';
import { ClxReportingRepository } from '@/data-warehouse-db/repositories';
import type { RiskRadarExceptionsJeffEntity } from '@/finance-db/entities';
import type { FSPTransaction, TransactionResult } from '@/shared/response';
import { ExceptionTypeToNumber } from '@/shared/response';

@Injectable()
export class FspExceptionTransactionService {
  public constructor(
    private readonly clxReportingRepository: ClxReportingRepository
  ) {}

  public async getFSPTransactionsForException(
    e: RiskRadarExceptionsJeffEntity,
    binSearch?: string
  ): Promise<TransactionResult[]> {
    const transactions = await this.getFSPTransactions(
      e.mid,
      e.fundingDate,
      e.achFundingTime,
      binSearch
    );

    return transactions;
  }

  private async getFSPTransactions(
    mid: string,
    dtFunding: Date,
    sACHFundingTime: string,
    binSearch?: string
  ): Promise<TransactionResult[]> {
    // Dates
    const dtFundingString = dtFunding.toISOString().split('T')[0]; // Only need date part (YYYY-MM-DD)

    const dtAuthEnd = parse(
      `${dtFundingString} ${sACHFundingTime}`,
      'yyyy-MM-dd h:mm a',
      new Date()
    );

    const dtAuthStart = parse(
      `${subDays(new Date(dtFundingString), 1).toISOString().split('T')[0]} ${sACHFundingTime}`,
      'yyyy-MM-dd h:mm a',
      new Date()
    );

    const rawTransactions = await this.clxReportingRepository
      .createQueryBuilder('s')
      .select([
        's.id AS exceptionId',
        's.type AS type',
        's.TransactionDateTime AS TransactionDate',
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
        'ep.Id = s.id AND ep.sMID = CAST(s.SiteID AS varchar(16)) AND ep.dtExceptionRunDate = :dtFunding AND ep.sExceptionRunTime = :sACHFundingTime'
      )
      .where('s.siteId = CAST(:mid AS varchar(16))', { mid })
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
      rawTransactions.reduce<
        Record<string, TransactionResult & { exceptionListArray: string[] }>
      >((acc, t) => {
        const key = t.exceptionId;

        if (!acc[key]) {
          acc[key] = {
            id: t.exceptionId,
            transactionDate: t.TransactionDate,
            transactionAmount: t.type === 'Return' ? t.Amount * -1 : t.Amount,
            posEntryMode: t.sPaymentMethodDesc,
            avsResponseCode: t.sAVSRespDesc,
            authCode: t.AuthCode,
            cardNumber: `${t.First6}******${t.Last4}`,
            debitNetworkIdentifier: t.Network,
            transactionId: t.txnID,
            authAmount: t.Amount,
            exceptionList: '',
            exceptionTitle: '',
            exceptionListArray: [t.sExceptionType],
            authResponseDescription: '',
            binSearchMatchFlag: binSearch
              ? t.First6.startsWith(binSearch)
              : false,
          };
        } else if (t.sExceptionType) {
          acc[key].exceptionListArray.push(t.sExceptionType);
        }

        return acc;
      }, {})
    ).map<TransactionResult>((t) => ({
      ...t,

      exceptionList: Array.from(new Set(t.exceptionListArray.filter(Boolean)))
        .map((e) => this.getExceptionTypeNumber(e))
        .join(' - '),

      exceptionTitle: Array.from(
        new Set(t.exceptionListArray.filter(Boolean))
      ).join(' - '),
    }));

    return grouped;
  }

  private getExceptionTypeNumber(exceptionType: string): string {
    if (!exceptionType || !(exceptionType in ExceptionTypeToNumber)) {
      return '';
    }

    return ExceptionTypeToNumber[exceptionType] ?? '';
  }
}
