import { BadRequestException, Injectable } from '@nestjs/common';
import { MoreThan } from 'typeorm';

import type { CLXReportingSearch } from '@/data-warehouse-db/entities';
import { ClxReportingRepository } from '@/data-warehouse-db/repositories';
import type {
  DFT256Transaction,
  DFT256TransactionFromLegacySystem,
} from '@/finance-db/entities';
import {
  DFT256TransactionFromLegacySystemRepository,
  DFT256TransactionRepository,
  RiskRadarIssuingBankRepository,
} from '@/finance-db/repositories';

import type { MerchantCardNumHistoryQueryDto } from './dto/get-merchant-card-num.dto';

type TransactionData = {
  mid: string;
  transmissionDate?: Date | string;
  transactionDate?: Date | string;
  amount: number;
  posEntryMode?: string;
  avsResponseCode?: string;
  authCode: string;
  cardNumber: string;
  debitNetworkIdentifier?: string;
  netDepositAmount?: number;
};

@Injectable()
export class MerchantCardNumHistoryService {
  public constructor(
    private readonly issuingBanksRepository: RiskRadarIssuingBankRepository,
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

    const issuingBank = await this.issuingBanksRepository.findBy({
      bin: first6Digits,
    });

    if (!issuingBank.length) {
      throw new BadRequestException('Issuing bank not found');
    }

    const transactionData = await this.dft256TransactionRepository.find({
      where: {
        cardLast4Digits: last4Digits,
        cardFirst6Digits: first6Digits,
      },
      relations: {
        batch: true,
      },
    });

    if (!transactionData.length) {
      throw new BadRequestException(
        'No transaction or batch data found for the card'
      );
    }

    // We use raw Query Builder due to the TypeORM limitations ()
    const reportingSearch = await this.clxReportingSearchRepository
      .createQueryBuilder('clx')
      .where('clx.accountNumber LIKE :sCardNumF6', {
        sCardNumF6: `${first6Digits}%`,
      })
      .andWhere('clx.accountNumber LIKE :sCardNumL4', {
        sCardNumL4: `%${last4Digits}`,
      })
      .getMany();

    if (!reportingSearch.length) {
      throw new BadRequestException('Reporting search not found');
    }

    // Calculate the date 366 days ago
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 366);

    const legacyTransactions = await this.legacyTransactionRepository.find({
      where: {
        cardFirstSix: first6Digits,
        cardLastFour: last4Digits,
        // @ts-expect-error Fix
        transactionDate: MoreThan(pastDate),
      },
    });

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

    return this.sortTransactions(
      [
        ...formattedTransactions,
        ...formattedReportings,
        ...formattedLegacyTransaction,
      ],
      sortBy,
      sortType
    );
  }

  private formatTransaction(
    transaction: DFT256Transaction,
    cardNumber: string
  ): TransactionData {
    return {
      ...transaction,
      mid: transaction.batch.merchantId,
      transmissionDate: transaction.batch.transmissionDate,
      amount: transaction.transactionAmount,
      authCode: transaction.authorizationCode,
      netDepositAmount: transaction.batch.netDepositAmount,
      cardNumber,
    };
  }

  private formatReportingSearch(search: CLXReportingSearch): TransactionData {
    return {
      ...search,
      mid: search.siteId,
      transmissionDate: null,
      transactionDate: search.transactionDateTime,
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
      ...transaction,
      cardNumber,
      mid: transaction.merchantId,
      amount: transaction.transactionAmount,
      authCode: transaction.authorizationCode,
    };
  }

  private sortTransactions(
    transactions: TransactionData[],
    sortBy: number,
    sortType: 'ASC' | 'DESC'
  ) {
    // Mapping of sort keys to object properties
    const sortKeys: Record<number, keyof TransactionData> = {
      1: 'mid',
      2: 'transactionDate',
      3: 'amount',
      4: 'posEntryMode',
      5: 'avsResponseCode',
      6: 'authCode',
      7: 'cardNumber',
      8: 'debitNetworkIdentifier',
      9: 'transmissionDate',
      10: 'netDepositAmount',
    };

    const key = sortKeys[Math.abs(sortBy)];

    if (!key) return transactions;

    return transactions.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) return sortType === 'DESC' ? 1 : -1;
      if (valueA > valueB) return sortType === 'DESC' ? -1 : 1;
      return 0;
    });
  }
}
