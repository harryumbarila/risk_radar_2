import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskRadarNotesEntity } from '../entities/risk-radar-notes.entity';

@Injectable()
export class RiskRadarNotesRepository extends Repository<RiskRadarNotesEntity> {
  constructor(dataSource: DataSource) {
    super(RiskRadarNotesEntity, dataSource.createEntityManager());
  }

  async createAssignmentNotes(
    mid: string,
    assignedTo: string,
    userCreated: string
  ): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(RiskRadarNotesEntity)
      .values({
        mid,
        notes: `Assigned to ${assignedTo || ''}`,
        notesTypeId: 9,
        userCreated,
        isHidden: false,
      })
      .execute();
  }

  /**
   * @migrated dbo.uspAssignRiskRadarExceptionsReview.StoredProcedure.sql
   */
  async createReviewNotes(mid: string, userCreated: string): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(RiskRadarNotesEntity)
      .values({
        mid,
        notes: 'Reviewed',
        notesTypeId: 7,
        userCreated,
        isHidden: false,
      })
      .execute();
  }
}
