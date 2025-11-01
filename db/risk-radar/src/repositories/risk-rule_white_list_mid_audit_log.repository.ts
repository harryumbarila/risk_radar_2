import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRuleWhiteListMidAuditLogEntity } from '../entities/risk-rule_white_list_mid_audit_log.entity';

@Injectable()
export class RiskRuleWhiteListMidRepositoryAuditLog extends Repository<RiskRuleWhiteListMidAuditLogEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(RiskRuleWhiteListMidAuditLogEntity, dataSource.createEntityManager());
  }
}
