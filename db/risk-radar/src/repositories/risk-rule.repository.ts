import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRule } from '../entities';

@Injectable()
export class RiskRuleRepository extends Repository<RiskRule> {
  public constructor(@InjectDataSource('RiskRadar') dataSource: DataSource) {
    super(RiskRule, dataSource.createEntityManager());
  }
}
