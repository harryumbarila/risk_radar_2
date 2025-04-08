import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarExceptionsJeffEntity } from '../entities/risk-radar-exceptions-jeff.entity';

/**
 * Repository to handle Risk Radar exception assignments
 * @migrated dbo.uspAssignRiskRadarExceptions-rr.StoredProcedure.sql
 */
@Injectable()
export class RiskRadarAssignExceptionsRepository extends Repository<RiskRadarExceptionsJeffEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarExceptionsJeffEntity, dataSource.createEntityManager());
  }

  /**
   * Assigns risk radar exceptions to a specified user
   * @param exceptionIds Array of exception IDs to assign
   * @param assignToUserId User ID to assign exceptions to
   */
  public async assignExceptions(
    exceptionIds: number[],
    assignToUserId: number
  ): Promise<void> {
    // Update exceptions to set assigned user and status
    await this.createQueryBuilder()
      .update(RiskRadarExceptionsJeffEntity)
      .set({
        assignedUserId: assignToUserId,
        exceptionStatusId: 4, // Assigned status
      })
      .whereInIds(exceptionIds)
      .execute();
  }

  /**
   * Get MIDs for exceptions
   * @param exceptionIds Array of exception IDs
   */
  public async getExceptionsByMIDs(
    exceptionIds: number[]
  ): Promise<Array<{ mid: string }>> {
    return this.createQueryBuilder('e')
      .select(['e.mid'])
      .whereInIds(exceptionIds)
      .andWhere('e.exceptionStatusId = :statusId', { statusId: 4 })
      .getMany();
  }
}
