import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarUserEntity } from '../entities/risk-radar-user.entity';

@Injectable()
export class RiskRadarUserRepository extends Repository<RiskRadarUserEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarUserEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarUser.StoredProcedure.sql
   */
  public async getActiveUsers(): Promise<RiskRadarUserEntity[]> {
    return this.find({
      select: ['id', 'name'],
      where: {
        isHidden: false,
      },
      order: { name: 'ASC' },
    });
  }

  public async getNTUserID(userId: number): Promise<string | null> {
    const user = await this.findOne({
      where: { id: userId },
      select: ['ntUserId'],
    });
    return user?.ntUserId || null;
  }
}
