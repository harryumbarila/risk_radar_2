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
    e: RiskRadarExceptionsJeffEntity
  ): Promise<TransactionResult[]> {
    const transactions = await this.getFSPTransactions(
      e.mid,
      e.fundingDate,
      e.achFundingTime
    );

    return transactions;
  }

  private async getFSPTransactions(
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
    if (!exceptionType || !(exceptionType in ExceptionTypeToNumber)) {
      return '';
    }

    return ExceptionTypeToNumber[exceptionType] ?? '';
  }
}
