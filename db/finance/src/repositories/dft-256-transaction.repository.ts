import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DFT256Transaction } from '../entities/dft-256-transaction';

@Injectable()
export class DFT256TransactionRepository extends Repository<DFT256Transaction> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DFT256Transaction, dataSource.createEntityManager());
  }

  public async getTransactionsForCard(
    first6Digits: string,
    last4Digits: string
  ): Promise<DFT256Transaction[]> {
    return this.find({
      where: {
        cardLast4Digits: last4Digits,
        cardFirst6Digits: first6Digits,
      },
      relations: {
        batch: true,
      },
    });
  }
}
