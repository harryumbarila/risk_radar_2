import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarExceptionsJeffEntity } from '../entities/risk-radar-exceptions-jeff.entity';
import type { RiskRadarNotesRepository } from './risk-radar-notes.repository';
import type { RiskRadarUserRepository } from './risk-radar-user.repository';

/**
 * Repository to handle Risk Radar exception assignments
 * @migrated dbo.uspAssignRiskRadarExceptions-rr.StoredProcedure.sql
 */
@Injectable()
export class RiskRadarAssignExceptionsRepository extends Repository<RiskRadarExceptionsJeffEntity> {
  public constructor(
    @InjectDataSource('finance') dataSource: DataSource,
    private readonly notesRepository: RiskRadarNotesRepository,
    private readonly userRepository: RiskRadarUserRepository
  ) {
    super(RiskRadarExceptionsJeffEntity, dataSource.createEntityManager());
  }

  /**
   * Assigns risk radar exceptions to a specified user
   * @param exceptionIds Array of exception IDs to assign
   * @param assignToUserId User ID to assign exceptions to
   * @param createdBy Username who initiated the assignment
   */
  public async assignExceptions(
    exceptionIds: number[],
    assignToUserId: number,
    createdBy: string
  ): Promise<void> {
    // Get the NT user ID of the assigned user
    const assignedUser = await this.userRepository.findOne({
      where: { id: assignToUserId },
      select: ['ntUserId'],
    });

    const assignedUserName = assignedUser?.ntUserId || '';

    // Update exceptions to set assigned user and status
    await this.createQueryBuilder()
      .update(RiskRadarExceptionsJeffEntity)
      .set({
        assignedUserId: assignToUserId,
        exceptionStatusId: 4, // Assigned status
      })
      .whereInIds(exceptionIds)
      .execute();

    // Get MIDs for all updated exceptions
    const exceptions = await this.createQueryBuilder('e')
      .select(['e.mid'])
      .whereInIds(exceptionIds)
      .andWhere('e.exceptionStatusId = :statusId', { statusId: 4 })
      .getMany();
    // Create notes for each exception
    await Promise.all(
      exceptions.map((exception) =>
        this.notesRepository.createAssignmentNotes(
          exception.mid,
          assignedUserName,
          createdBy
        )
      )
    );
  }
}
