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

type LoggableError = {
  message: string;
  stack?: string;
  name?: string;
};

@Injectable()
export class MerchantCardNumHistoryService {
  public constructor(
    private readonly dft256TransactionRepository: DFT256TransactionRepository,
    private readonly clxReportingSearchRepository: ClxReportingRepository,
    private readonly legacyTransactionRepository: DFT256TransactionFromLegacySystemRepository,
    @InjectPinoLogger(MerchantCardNumHistoryService.name)
    private readonly logger: Logger
  ) {}

  public async getMerchantCardNumHistory({
    cardNumber,
    sortBy,
    sortType,
  }: MerchantCardNumHistoryQueryDto): Promise<TransactionData[]> {
    try {
      const maskedCardNumber = `${cardNumber.slice(0, 6)}******${cardNumber.slice(-4)}`;
      this.logger.info(
        { cardNumber: maskedCardNumber },
        'Fetching card transaction history'
      );

      const first6Digits = cardNumber.slice(0, 6);
      const last4Digits = cardNumber.slice(-4);

      this.logger.info(
        'Fetching transactions from DFT256TransactionRepository'
      );
      let transactionData: DFT256Transaction[] = [];
      try {
        transactionData =
          await this.dft256TransactionRepository.getTransactionsForCard(
            first6Digits,
            last4Digits
          );
        this.logger.info(
          { count: transactionData.length },
          'DFT256 transactions fetched'
        );
      } catch (error) {
        const logError = this.formatError(error);
        this.logger.error(
          { error: logError },
          'Error fetching DFT256 transactions'
        );
        transactionData = [];
      }

      this.logger.info('Fetching reporting search data');
      let reportingSearch: CLXReportingSearch[] = [];
      try {
        reportingSearch =
          await this.clxReportingSearchRepository.getReportingForCard(
            first6Digits,
            last4Digits
          );
        this.logger.info(
          { count: reportingSearch.length },
          'Reporting search data fetched'
        );
      } catch (error) {
        const logError = this.formatError(error);
        this.logger.error(
          { error: logError },
          'Error fetching reporting search data'
        );
        reportingSearch = [];
      }

      this.logger.info('Fetching legacy transactions');
      let legacyTransactions: DFT256TransactionFromLegacySystem[] = [];
      try {
        legacyTransactions =
          await this.legacyTransactionRepository.getTransactionsForCard(
            first6Digits,
            last4Digits
          );
        this.logger.info(
          { count: legacyTransactions.length },
          'Legacy transactions fetched'
        );
      } catch (error) {
        const logError = this.formatError(error);
        this.logger.error(
          { error: logError },
          'Error fetching legacy transactions'
        );
        legacyTransactions = [];
      }

      // Format data to keep consistency
      this.logger.info('Starting to format DFT256 transactions');
      const formattedTransactions = transactionData
        .map((t) => {
          try {
            return this.formatTransaction(t, maskedCardNumber);
          } catch (error) {
            const logError = this.formatError(error);
            this.logger.error(
              {
                error: logError,
                transactionId: t.id,
                mid: t.batch?.merchantId,
              },
              'Error formatting DFT256 transaction'
            );
            return null;
          }
        })
        .filter((t): t is TransactionData => t !== null);

      this.logger.info(
        { count: formattedTransactions.length },
        'DFT256 transactions formatted'
      );

      this.logger.info('Starting to format reporting search data');
      const formattedReportings = reportingSearch
        .map((rs) => {
          try {
            return this.formatReportingSearch(rs);
          } catch (error) {
            const logError = this.formatError(error);
            this.logger.error(
              { error: logError, siteId: rs.siteId },
              'Error formatting reporting search data'
            );
            return null;
          }
        })
        .filter((r): r is TransactionData => r !== null);

      this.logger.info(
        { count: formattedReportings.length },
        'Reporting search data formatted'
      );

      this.logger.info('Starting to format legacy transactions');
      const formattedLegacyTransaction = legacyTransactions
        .map((lt) => {
          try {
            return this.formatLegacyTransaction(lt, maskedCardNumber);
          } catch (error) {
            const logError = this.formatError(error);
            this.logger.error(
              { error: logError, mid: lt.merchantId },
              'Error formatting legacy transaction'
            );
            return null;
          }
        })
        .filter((l): l is TransactionData => l !== null);

      this.logger.info(
        { count: formattedLegacyTransaction.length },
        'Legacy transactions formatted'
      );

      // Sort transactions
      const groupedTransactions = [
        ...formattedTransactions,
        ...formattedReportings,
        ...formattedLegacyTransaction,
      ];

      this.logger.info(
        {
          totalCount: groupedTransactions.length,
          dft256Count: formattedTransactions.length,
          reportingCount: formattedReportings.length,
          legacyCount: formattedLegacyTransaction.length,
        },
        'Successfully processed card transaction history'
      );

      return this.sortTransactions(groupedTransactions, sortBy, sortType);
    } catch (error) {
      const logError = this.formatError(error);
      this.logger.error(
        { error: logError },
        'Error in getMerchantCardNumHistory'
      );
      return [];
    }
  }

  private formatError(error: unknown): LoggableError {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }
    return { message: String(error) };
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
  ): TransactionData[] {
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
