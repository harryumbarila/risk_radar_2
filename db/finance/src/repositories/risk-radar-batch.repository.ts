import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { In, Repository } from 'typeorm';

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
      .where('batch.sMID = :merchantId', { merchantId })
      .andWhere('batch.sAMEXOptBlueInd = :indicator', { indicator: 'Y' })
      .orderBy('batch.pkDFT256Batch', 'DESC')
      .take(1)
      .getOne();
    return !!batch;
  }

  public async getMultipleAMEXOptBlue(
    merchantIds: string[]
  ): Promise<string[]> {
    const merchants = await this.createQueryBuilder('batch')
      .select('DISTINCT batch.sMID', 'merchantId')
      .where('batch.sMID IN (:...merchantIds)', { merchantIds })
      .andWhere('batch.sAMEXOptBlueInd = :indicator', { indicator: 'Y' })
      .getRawMany();
    return merchants.map((m: { merchantId: string }) => m.merchantId);
  }

  public async getBatchIdsForDatesAndCycles(
    mid: string,
    dates: Date[],
    cycles: string[]
  ): Promise<RiskRadarBatch[]> {
    const batches = await this.find({
      select: ['pkDFT256Batch'],
      where: {
        sMID: mid,
        dtTransmission: In(dates),
        sCycle: In(cycles),
      },
    });

    return batches;
  }

  public async getBatches(batchesIds: number[]): Promise<RiskRadarBatch[]> {
    return this.find({
      where: {
        pkDFT256Batch: In(batchesIds),
      },
    });
  }
}
