import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarMerchantAdjParamEntity } from '../entities';

@Injectable()
export class RiskRadarMerchAdjParamRepository extends Repository<RiskRadarMerchantAdjParamEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarMerchantAdjParamEntity, dataSource.createEntityManager());
  }

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(
    merchantId: string
  ): Promise<RiskRadarMerchantAdjParamEntity | null> {
    return this.findOne({
      where: { mid: merchantId },
    });
  }
}
