import { Injectable } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarExceptionsJeffEntity } from '../entities/risk-radar-exceptions-jeff.entity';

@Injectable()
export class RiskRadarExceptionsJeffRepository extends Repository<RiskRadarExceptionsJeffEntity> {
  public constructor(dataSource: DataSource) {
    super(RiskRadarExceptionsJeffEntity, dataSource.createEntityManager());
  }

  public async assignExceptions(
    exceptionIds: number[],
    assignedUserId: number
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(RiskRadarExceptionsJeffEntity)
      .set({
        assignedUserId,
        exceptionStatusId: 4,
      })
      .where('id IN (:...ids)', { ids: exceptionIds })
      .execute();
  }

  public async getExceptionsByMIDs(
    exceptionIds: number[]
  ): Promise<Pick<RiskRadarExceptionsJeffEntity, 'id' | 'mid'>[]> {
    return this.createQueryBuilder('exception')
      .select(['exception.id', 'exception.mid'])
      .where('exception.id IN (:...ids)', { ids: exceptionIds })
      .andWhere('exception.exceptionStatusId = :statusId', { statusId: 4 })
      .getMany();
  }

  /**
   * @migrated dbo.uspAssignRiskRadarExceptionsReview.StoredProcedure.sql
   */
  public async reviewExceptions(
    exceptionIds: number[],
    user: string
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(RiskRadarExceptionsJeffEntity)
      .set({
        exceptionStatusId: 2,
        userReviewed: user,
      })
      .where('id IN (:...ids)', { ids: exceptionIds })
      .andWhere('exceptionStatusId IN (:...statusIds)', {
        statusIds: [1, 2, 3, 4],
      })
      .execute();
  }

  public async getDistinctMIDsForReview(
    exceptionIds: number[]
  ): Promise<Pick<RiskRadarExceptionsJeffEntity, 'mid'>[]> {
    return this.createQueryBuilder('exception')
      .select('DISTINCT exception.mid', 'mid')
      .where('exception.id IN (:...ids)', { ids: exceptionIds })
      .getRawMany();
  }
}
