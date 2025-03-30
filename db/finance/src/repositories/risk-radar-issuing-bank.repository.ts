import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarIssuingBank } from '../entities/risk-radar-issuing-banks.entity';

@Injectable()
export class RiskRadarIssuingBankRepository extends Repository<RiskRadarIssuingBank> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarIssuingBank, dataSource.createEntityManager());
  }
}
