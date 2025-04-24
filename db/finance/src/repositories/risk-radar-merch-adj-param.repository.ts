import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { MssqlParameter, Repository } from 'typeorm';

import { RiskRadarMerchAdjParamEntity } from '../entities/risk-radar-merch-adj-param.entity';

@Injectable()
export class RiskRadarMerchAdjParamRepository extends Repository<RiskRadarMerchAdjParamEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarMerchAdjParamEntity, dataSource.createEntityManager());
  }

  /**
   * Find merchant parameters by MID
   */
  public async findByMerchantId(
    merchantId: string
  ): Promise<RiskRadarMerchAdjParamEntity | null> {
    return this.createQueryBuilder('merchAdjParam')
      .where('merchAdjParam.mid = :mid', {
        mid: new MssqlParameter(merchantId, 'varchar', 16),
      })
      .getOne();
  }
}
