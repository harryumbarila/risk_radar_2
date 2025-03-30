import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarBatch } from '../entities/risk-radar-batch.entity';

@Injectable()
export class RiskRadarBatchRepository extends Repository<RiskRadarBatch> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarBatch, dataSource.createEntityManager());
  }

  /**
   * Check if a merchant has AMEX OptBlue indicator
   */
  public async hasAMEXOptBlue(merchantId: string): Promise<boolean> {
    const batch = await this.createQueryBuilder('batch')
      .select('batch.amexOptBlueInd')
      .where('batch.merchantId = :merchantId', { merchantId })
      .andWhere('batch.amexOptBlueInd = :indicator', { indicator: 'Y' })
      .orderBy('batch.id', 'DESC')
      .take(1)
      .getOne();
    return !!batch;
  }

  public async getMultipleAMEXOptBlue(
    merchantIds: string[]
  ): Promise<string[]> {
    const merchants = await this.createQueryBuilder('batch')
      .select('DISTINCT batch.merchantId', 'merchantId')
      .where('batch.merchantId IN (:...merchantIds)', { merchantIds })
      .andWhere('batch.amexOptBlueInd = :indicator', { indicator: 'Y' })
      .getRawMany();
    return merchants.map((m: { merchantId: string }) => m.merchantId);
  }
}
