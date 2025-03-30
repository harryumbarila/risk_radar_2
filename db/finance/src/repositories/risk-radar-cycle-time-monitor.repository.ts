import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarCycleTimeMonitor } from '../entities/risk-radar-cycle-time-monitor.entity';

@Injectable()
export class RiskRadarCycleTimeMonitorRepository extends Repository<RiskRadarCycleTimeMonitor> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarCycleTimeMonitor, dataSource.createEntityManager());
  }
}
