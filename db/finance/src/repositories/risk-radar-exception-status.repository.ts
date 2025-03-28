import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskRadarExceptionStatusEntity } from '../entities/risk-radar-exception-status.entity';

@Injectable()
export class RiskRadarExceptionStatusRepository extends Repository<RiskRadarExceptionStatusEntity> {
  constructor(dataSource: DataSource) {
    super(RiskRadarExceptionStatusEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarExceptionStatus.StoredProcedure.sql
   */
  async getActiveExceptionStatuses(): Promise<
    Pick<RiskRadarExceptionStatusEntity, 'id' | 'description'>[]
  > {
    return this.createQueryBuilder('status')
      .select(['status.id', 'status.description'])
      .where('status.isHidden = :isHidden', { isHidden: false })
      .orderBy('status.sortOrder', 'ASC')
      .getMany();
  }
}
