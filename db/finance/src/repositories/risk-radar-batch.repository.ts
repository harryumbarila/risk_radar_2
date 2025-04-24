import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { In, MssqlParameter, Repository } from 'typeorm';

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
      .select('batch.sAMEXOptBlueInd')
      .where('batch.sMID = :merchantId', {
        merchantId: new MssqlParameter(merchantId, 'varchar', 16),
      })
      .andWhere('batch.sAMEXOptBlueInd = :indicator', { indicator: 'Y' })
      .orderBy('batch.pkDFT256Batch', 'DESC')
      .take(1)
      .getOne();
    return !!batch;
  }

  public async getMultipleAMEXOptBlue(
    merchantIds: string[]
  ): Promise<string[]> {
    // For multiple merchants, we'll handle array parameters differently
    // Each value in the array will be properly typed when used in the query
    const merchants = await this.createQueryBuilder('batch')
      .select('DISTINCT batch.sMID', 'merchantId')
      .where('batch.sMID IN (:...merchantIds)', {
        merchantIds: merchantIds.map(
          (mid) => new MssqlParameter(mid, 'varchar', 16)
        ),
      })
      .andWhere('batch.sAMEXOptBlueInd = :indicator', { indicator: 'Y' })
      .getRawMany();
    return merchants.map((m: { merchantId: string }) => m.merchantId);
  }

  public async getBatchIdsForDatesAndCycles(
    mid: string,
    dates: Date[],
    cycles: string[]
  ): Promise<RiskRadarBatch[]> {
    return this.createQueryBuilder('batch')
      .select('batch.pkDFT256Batch')
      .where('batch.sMID = :mid', {
        mid: new MssqlParameter(mid, 'varchar', 16),
      })
      .andWhere('batch.dtTransmission IN (:...dates)', { dates })
      .andWhere('batch.sCycle IN (:...cycles)', { cycles })
      .getMany();
  }

  public async getBatches(batchesIds: number[]): Promise<RiskRadarBatch[]> {
    return this.find({
      where: {
        pkDFT256Batch: In(batchesIds),
      },
    });
  }
}
