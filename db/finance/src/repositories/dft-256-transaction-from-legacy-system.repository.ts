import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DFT256TransactionFromLegacySystem } from '../entities';

@Injectable()
export class DFT256TransactionFromLegacySystemRepository extends Repository<DFT256TransactionFromLegacySystem> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DFT256TransactionFromLegacySystem, dataSource.createEntityManager());
  }
}
