import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRuleWhiteListMccAuditLogEntity } from '../entities/risk-rule-white-list-mcc-audit-log.entity';

@Injectable()
export class RiskRuleWhiteListMccRepositoryAuditLog extends Repository<RiskRuleWhiteListMccAuditLogEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(RiskRuleWhiteListMccAuditLogEntity, dataSource.createEntityManager());
  }
}
