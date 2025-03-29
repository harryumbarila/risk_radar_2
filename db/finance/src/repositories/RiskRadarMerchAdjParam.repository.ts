import { Injectable } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarMerchAdjParam } from '../entities/RiskRadarMerchAdjParam.entity';

@Injectable()
export class RiskRadarMerchAdjParamRepository extends Repository<RiskRadarMerchAdjParam> {
  public constructor(dataSource: DataSource) {
    super(RiskRadarMerchAdjParam, dataSource.createEntityManager());
  }

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(merchantId: string): Promise<RiskRadarMerchAdjParam | null> {
    return this.findOne({
      where: { merchantId }
    });
  }
} 