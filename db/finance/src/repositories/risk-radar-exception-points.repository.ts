import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { FSPRiskRadarExceptionPoints } from '../entities/risk-radar-exception-points.entity';

@Injectable()
export class FSPRiskRadarExceptionPointsRepository extends Repository<FSPRiskRadarExceptionPoints> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(FSPRiskRadarExceptionPoints, dataSource.createEntityManager());
  }
}
