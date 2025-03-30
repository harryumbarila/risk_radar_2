import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { RiskRadarMerchAdjParamEntity } from '../entities/risk-radar-merch-adj-param.entity';

@Injectable()
export class RiskRadarMerchAdjParamRepository {
  public constructor(
    @InjectRepository(RiskRadarMerchAdjParamEntity, 'finance')
    private readonly repository: Repository<RiskRadarMerchAdjParamEntity>
  ) {}

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(
    merchantId: string
  ): Promise<RiskRadarMerchAdjParamEntity | null> {
    return this.repository.findOne({
      where: { mid: merchantId },
    });
  }
}
