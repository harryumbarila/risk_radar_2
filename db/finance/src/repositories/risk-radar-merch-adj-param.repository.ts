import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { RiskRadarMerchAdjParam } from '../entities/risk-radar-merch-adj-param.entity';

@Injectable()
export class RiskRadarMerchAdjParamRepository {
  public constructor(
    @InjectRepository(RiskRadarMerchAdjParam, 'finance')
    private readonly repository: Repository<RiskRadarMerchAdjParam>
  ) {}

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(
    merchantId: string
  ): Promise<RiskRadarMerchAdjParam | null> {
    return this.repository.findOne({
      where: { merchantId },
    });
  }
}
