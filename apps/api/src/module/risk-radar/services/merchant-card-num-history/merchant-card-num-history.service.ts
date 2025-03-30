import { Injectable } from '@nestjs/common';

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
    private readonly legacyTransactionRepository: DFT256TransactionFromLegacySystemRepository
  ) {}

  public async getMerchantCardNumHistory({
    cardNumber,
    sortBy,
    sortType,
  }: MerchantCardNumHistoryQueryDto): Promise<TransactionData[]> {
    const first6Digits = cardNumber.slice(0, 6);
    const last4Digits = cardNumber.slice(-4);

    const transactionData =
      await this.dft256TransactionRepository.getTransactionsForCard(
        first6Digits,
        last4Digits
      );

    const reportingSearch =
      await this.clxReportingSearchRepository.getReportingForCard(
        first6Digits,
        last4Digits
      );

    const legacyTransactions =
      await this.legacyTransactionRepository.getTransactionsForCard(
        first6Digits,
        last4Digits
      );

    // Format data to keep consistency
    const maskedCardNumber = `${first6Digits}******${last4Digits}`;
    const formattedTransactions = transactionData.map((t) =>
      this.formatTransaction(t, maskedCardNumber)
    );

    const formattedReportings = reportingSearch.map((rs) =>
      this.formatReportingSearch(rs)
    );

    const formattedLegacyTransaction = legacyTransactions.map((lt) =>
      this.formatLegacyTransaction(lt, maskedCardNumber)
    );

    // Sort transactions
    const groupedTransactions = [
      ...formattedTransactions,
      ...formattedReportings,
      ...formattedLegacyTransaction,
    ];

    return this.sortTransactions(groupedTransactions, sortBy, sortType);
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
