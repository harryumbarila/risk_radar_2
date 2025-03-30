import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarMerchAdjParam } from '../entities/risk-radar-merch-adj-param.entity';

@Injectable()
export class RiskRadarMerchAdjParamRepository extends Repository<RiskRadarMerchAdjParam> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarMerchAdjParam, dataSource.createEntityManager());
  }

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(
    merchantId: string
  ): Promise<RiskRadarMerchAdjParam | null> {
    return this.findOne({
      where: { merchantId },
    });
  }
}
