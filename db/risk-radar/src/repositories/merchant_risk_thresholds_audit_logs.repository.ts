import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { MerchanRiskThresholdsAuditLogsEntity } from '../entities/merchant_risk_thresholds_audit_logs';

@Injectable()
export class MerchantRiskThresholdsAuditLogsRepository extends Repository<MerchanRiskThresholdsAuditLogsEntity> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(MerchanRiskThresholdsAuditLogsEntity, dataSource.createEntityManager());
  }
}
