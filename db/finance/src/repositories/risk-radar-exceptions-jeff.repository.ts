import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { In, Repository } from 'typeorm';

import { RiskRadarExceptionsJeffEntity } from '../entities/risk-radar-exceptions-jeff.entity';

@Injectable()
export class RiskRadarExceptionsJeffRepository extends Repository<RiskRadarExceptionsJeffEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarExceptionsJeffEntity, dataSource.createEntityManager());
  }

  public async assignExceptions(
    exceptionIds: number[],
    assignedUserId: number
  ): Promise<void> {
    if (exceptionIds.length === 0) return;

    await this.update(
      { id: In(exceptionIds) },
      {
        assignedUserId,
        exceptionStatusId: 4,
      }
    );
  }

  public async getExceptionsByMIDs(
    exceptionIds: number[]
  ): Promise<Pick<RiskRadarExceptionsJeffEntity, 'id' | 'mid'>[]> {
    if (exceptionIds.length === 0) return [];

    return this.find({
      select: ['id', 'mid'],
      where: {
        id: In(exceptionIds),
        exceptionStatusId: 4,
      },
    });
  }

  /**
   * @migrated dbo.uspAssignRiskRadarExceptionsReview.StoredProcedure.sql
   */
  public async reviewExceptions(
    exceptionIds: number[],
    user: string
  ): Promise<void> {
    if (exceptionIds.length === 0) return;

    await this.update(
      {
        id: In(exceptionIds),
        exceptionStatusId: In([1, 2, 3, 4]),
      },
      {
        exceptionStatusId: 2,
        userReviewed: user,
      }
    );
  }

  public async getDistinctMIDsForReview(
    exceptionIds: number[]
  ): Promise<Pick<RiskRadarExceptionsJeffEntity, 'mid'>[]> {
    if (exceptionIds.length === 0) {
      return [];
    }

    const result = await this.find({
      select: ['mid'],
      where: { id: In(exceptionIds) },
    });

    // Manually remove duplicates since TypeORM `find()` doesn't support DISTINCT
    const uniqueMIDs = Array.from(new Set(result.map((r) => r.mid))).map(
      (mid) => ({ mid })
    );

    return uniqueMIDs;
  }
}
