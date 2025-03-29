import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RiskRadarBatch } from '../entities/RiskRadarBatch.entity';

@Injectable()
export class RiskRadarBatchRepository {
  public constructor(
    @InjectRepository(RiskRadarBatch, 'finance')
    private readonly repository: Repository<RiskRadarBatch>
  ) {}

  /**
   * Check if a merchant has AMEX OptBlue indicator
   */
  public async hasAMEXOptBlue(merchantId: string): Promise<boolean> {
    const batch = await this.repository
      .createQueryBuilder('batch')
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
    const merchants = await this.repository
      .createQueryBuilder('batch')
      .select('DISTINCT batch.merchantId', 'merchantId')
      .where('batch.merchantId IN (:...merchantIds)', { merchantIds })
      .andWhere('batch.amexOptBlueInd = :indicator', { indicator: 'Y' })
      .getRawMany();
    return merchants.map((m: { merchantId: string }) => m.merchantId);
  }
}
