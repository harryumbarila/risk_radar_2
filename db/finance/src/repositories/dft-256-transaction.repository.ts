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
}
