import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RiskRadarMerchAdjParam } from '../entities/RiskRadarMerchAdjParam.entity';

@Injectable()
export class RiskRadarMerchAdjParamRepository {
  public constructor(
    @InjectRepository(RiskRadarMerchAdjParam, 'finance')
    private readonly repository: Repository<RiskRadarMerchAdjParam>
  ) {}

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(merchantId: string): Promise<RiskRadarMerchAdjParam | null> {
    return this.repository.findOne({
      where: { merchantId },
    });
  }
}
