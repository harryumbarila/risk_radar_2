import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRuleWhiteListMccAuditLogEntity } from '../entities/risk-rule_white_list_mcc_audit_log.entity';

@Injectable()
export class RiskRuleWhiteListMccRepositoryAuditLog extends Repository<RiskRuleWhiteListMccAuditLogEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(RiskRuleWhiteListMccAuditLogEntity, dataSource.createEntityManager());
  }
}
