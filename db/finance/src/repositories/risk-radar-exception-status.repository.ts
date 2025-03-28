import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarExceptionStatusEntity } from '../entities/risk-radar-exception-status.entity';

@Injectable()
export class RiskRadarExceptionStatusRepository extends Repository<RiskRadarExceptionStatusEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarExceptionStatusEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarExceptionStatus.StoredProcedure.sql
   */
  public async getActiveExceptionStatuses(): Promise<
    Pick<RiskRadarExceptionStatusEntity, 'id' | 'description'>[]
  > {
    return this.createQueryBuilder('status')
      .select(['status.id', 'status.description'])
      .where('status.isHidden = :isHidden', { isHidden: false })
      .orderBy('status.sortOrder', 'ASC')
      .getMany();
  }
}
