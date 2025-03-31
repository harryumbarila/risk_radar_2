import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { In, Repository } from 'typeorm';

import { RiskRadarTransaction } from '../entities';

@Injectable()
export class RiskRadarTransactionRepository extends Repository<RiskRadarTransaction> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarTransaction, dataSource.createEntityManager());
  }

  public async getTransactionForBatchIds(
    batchIds: number[]
  ): Promise<RiskRadarTransaction[]> {
    return this.find({
      where: { batchId: In(batchIds) },
    });
  }
}
