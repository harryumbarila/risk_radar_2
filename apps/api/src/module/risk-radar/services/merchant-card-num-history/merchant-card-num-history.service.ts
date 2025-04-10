import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import type { CLXReportingSearch } from '@/data-warehouse-db/entities';
import { ClxReportingRepository } from '@/data-warehouse-db/repositories';
import type {
  DFT256Transaction,
  DFT256TransactionFromLegacySystem,
} from '@/finance-db/entities';
import {
  DFT256TransactionFromLegacySystemRepository,
  DFT256TransactionRepository,
} from '@/finance-db/repositories';
import { SortType } from '@/shared/request';
import type {
  MerchantCardHistorySortBy,
  TransactionData,
} from '@/shared/response/risk-radar/merchant-card-num-history';

import type { MerchantCardNumHistoryQueryDto } from './dto/get-merchant-card-num.dto';

@Injectable()
export class MerchantCardNumHistoryService {
  public constructor(
    private readonly dft256TransactionRepository: DFT256TransactionRepository,
    private readonly clxReportingSearchRepository: ClxReportingRepository,
    private readonly legacyTransactionRepository: DFT256TransactionFromLegacySystemRepository,
    @InjectPinoLogger(MerchantCardNumHistoryService.name) private readonly logger: Logger
  ) {}

  public async getMerchantCardNumHistory({
    cardNumber,
    sortBy,
    sortType,
  }: MerchantCardNumHistoryQueryDto): Promise<TransactionData[]> {
    try {
      this.logger.info({ cardNumber: `${cardNumber.slice(0, 6)}******${cardNumber.slice(-4)}` } as const, 'Fetching card transaction history');
      
      const first6Digits = cardNumber.slice(0, 6);
      const last4Digits = cardNumber.slice(-4);

      this.logger.info('Fetching transactions from DFT256TransactionRepository');
      let transactionData: DFT256Transaction[] = [];
      try {
        transactionData = await this.dft256TransactionRepository.getTransactionsForCard(
          first6Digits,
          last4Digits
        );
        this.logger.info({ count: transactionData.length } as const, 'DFT256 transactions fetched');
      } catch (error: unknown) {
        this.logger.error({ error } as const, 'Error fetching DFT256 transactions');
        transactionData = [];
      }

      this.logger.info('Fetching reporting search data');
      let reportingSearch: CLXReportingSearch[] = [];
      try {
        reportingSearch = await this.clxReportingSearchRepository.getReportingForCard(
          first6Digits,
          last4Digits
        );
        this.logger.info({ count: reportingSearch.length } as const, 'Reporting search data fetched');
      } catch (error: unknown) {
        this.logger.error({ error } as const, 'Error fetching reporting search data');
        reportingSearch = [];
      }

      this.logger.info('Fetching legacy transactions');
      let legacyTransactions: DFT256TransactionFromLegacySystem[] = [];
      try {
        legacyTransactions = await this.legacyTransactionRepository.getTransactionsForCard(
          first6Digits,
          last4Digits
        );
        this.logger.info({ count: legacyTransactions.length } as const, 'Legacy transactions fetched');
      } catch (error: unknown) {
        this.logger.error({ error } as const, 'Error fetching legacy transactions');
        legacyTransactions = [];
      }

      // Format data to keep consistency
      const maskedCardNumber = `${first6Digits}******${last4Digits}`;
      this.logger.info('Starting to format DFT256 transactions');
      const formattedTransactions = transactionData.map((t) => {
        try {
          return this.formatTransaction(t, maskedCardNumber);
        } catch (error) {
          this.logger.error(
            { 
              error, 
              transactionId: t.id, 
              mid: t.batch?.merchantId 
            } as const, 
            'Error formatting DFT256 transaction'
          );
          return null;
        }
      }).filter(Boolean) as TransactionData[];
      this.logger.info({ count: formattedTransactions.length } as const, 'DFT256 transactions formatted');

      this.logger.info('Starting to format reporting search data');
      const formattedReportings = reportingSearch.map((rs) => {
        try {
          return this.formatReportingSearch(rs);
        } catch (error) {
          this.logger.error(
            { 
              error, 
              siteId: rs.siteId 
            } as const, 
            'Error formatting reporting search data'
          );
          return null;
        }
      }).filter(Boolean) as TransactionData[];
      this.logger.info({ count: formattedReportings.length } as const, 'Reporting search data formatted');

      this.logger.info('Starting to format legacy transactions');
      const formattedLegacyTransaction = legacyTransactions.map((lt) => {
        try {
          return this.formatLegacyTransaction(lt, maskedCardNumber);
        } catch (error) {
          this.logger.error(
            { 
              error, 
              mid: lt.merchantId 
            } as const, 
            'Error formatting legacy transaction'
          );
          return null;
        }
      }).filter(Boolean) as TransactionData[];
      this.logger.info({ count: formattedLegacyTransaction.length } as const, 'Legacy transactions formatted');

      // Sort transactions
      const groupedTransactions = [
        ...formattedTransactions,
        ...formattedReportings,
        ...formattedLegacyTransaction,
      ];

      this.logger.info({ 
        totalCount: groupedTransactions.length,
        dft256Count: formattedTransactions.length,
        reportingCount: formattedReportings.length,
        legacyCount: formattedLegacyTransaction.length
      } as const, 'Successfully processed card transaction history');

      return this.sortTransactions(groupedTransactions, sortBy, sortType);
    } catch (error: unknown) {
      this.logger.error({ error } as const, 'Error in getMerchantCardNumHistory');
      return [];
    }
  }

  private formatTransaction(
    transaction: DFT256Transaction,
    cardNumber: string
  ): TransactionData {
    return {
      mid: transaction.batch.merchantId,
      transmissionDate: transaction.batch.transmissionDate,
      transactionDate: transaction.transactionDate,
      amount: transaction.transactionAmount,
      posEntryMode: transaction.posEntryMode,
      avsResponseCode: transaction.avsResponseCode,
      authCode: transaction.authorizationCode,
      cardNumber,
      debitNetworkIdentifier: transaction.debitNetworkIdentifier,
      netDepositAmount: transaction.batch.netDepositAmount,
    };
  }

  private formatReportingSearch(search: CLXReportingSearch): TransactionData {
    return {
      mid: search.siteId,
      transmissionDate: null,
      transactionDate: search.transactionDateTime,
      amount: search.amount,
      posEntryMode: search.posData,
      avsResponseCode: null,
      authCode: search.authorizationCode,
      cardNumber: search.accountNumber,
      debitNetworkIdentifier: search.drdNetwork,
      netDepositAmount: 0,
    };
  }

  private formatLegacyTransaction(
    transaction: DFT256TransactionFromLegacySystem,
    cardNumber: string
  ): TransactionData {
    return {
      mid: transaction.merchantId,
      transmissionDate: transaction.transmissionDate,
      transactionDate: transaction.transactionDate,
      amount: transaction.transactionAmount,
      posEntryMode: transaction.posEntryMode,
      avsResponseCode: transaction.avsResponseCode,
      authCode: transaction.authorizationCode,
      cardNumber,
      debitNetworkIdentifier: transaction.debitNetworkIdentifier,
      netDepositAmount: transaction.netDepositAmount,
    };
  }

  private sortTransactions(
    transactions: TransactionData[],
    sortBy: MerchantCardHistorySortBy,
    sortType: SortType
  ) {
    if (!sortBy) return transactions;

    return transactions.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (valueA < valueB) return sortType === SortType.DESC ? 1 : -1;
      if (valueA > valueB) return sortType === SortType.DESC ? -1 : 1;
      return 0;
    });
  }
}
