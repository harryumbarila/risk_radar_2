import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRuleWhiteListMidEntity } from '../entities/risk-rule-white-list-mid.entity';

@Injectable()
export class RiskRuleWhiteListMidRepository extends Repository<RiskRuleWhiteListMidEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(RiskRuleWhiteListMidEntity, dataSource.createEntityManager());
  }
}
