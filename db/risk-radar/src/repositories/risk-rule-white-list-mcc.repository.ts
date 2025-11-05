import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRuleWhiteListMccEntity } from '../entities/risk-rule-white-list-mcc.entity';

@Injectable()
export class RiskRuleWhiteListMccRepository extends Repository<RiskRuleWhiteListMccEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(RiskRuleWhiteListMccEntity, dataSource.createEntityManager());
  }
}
