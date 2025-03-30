import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { MoreThan, Repository } from 'typeorm';

import { DFT256TransactionFromLegacySystem } from '../entities';

@Injectable()
export class DFT256TransactionFromLegacySystemRepository extends Repository<DFT256TransactionFromLegacySystem> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DFT256TransactionFromLegacySystem, dataSource.createEntityManager());
  }

  public async getTransactionsForCard(
    first6Digits: string,
    last4Digits: string
  ): Promise<DFT256TransactionFromLegacySystem[]> {
    // Calculate the date 366 days ago
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 366);

    const legacyTransactions = await this.find({
      where: {
        cardFirstSix: first6Digits,
        cardLastFour: last4Digits,
        transactionDate: MoreThan(pastDate),
      },
    });

    return legacyTransactions;
  }
}
