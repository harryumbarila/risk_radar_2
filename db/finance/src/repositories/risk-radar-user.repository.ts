import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskRadarUserEntity } from '../entities/risk-radar-user.entity';

@Injectable()
export class RiskRadarUserRepository extends Repository<RiskRadarUserEntity> {
  constructor(dataSource: DataSource) {
    super(RiskRadarUserEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarUser.StoredProcedure.sql
   */
  async getActiveUsers(): Promise<RiskRadarUserEntity[]> {
    return this.createQueryBuilder('user')
      .select(['user.id', 'user.name'])
      .where('user.isHidden = :isHidden', { isHidden: false })
      .orderBy('user.name', 'ASC')
      .getMany();
  }

  async getNTUserID(userId: number): Promise<string | null> {
    const user = await this.findOne({
      where: { id: userId },
      select: ['ntUserId'],
    });
    return user?.ntUserId || null;
  }
}
