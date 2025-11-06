import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { MerchanRiskThresholdsEntity } from '../entities/merchant-risk-thresholds';

@Injectable()
export class MerchantRiskThresholdsRepository extends Repository<MerchanRiskThresholdsEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(MerchanRiskThresholdsEntity, dataSource.createEntityManager());
  }
}
