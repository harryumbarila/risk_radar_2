import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarNotesEntity } from '../entities/risk-radar-notes.entity';

@Injectable()
export class RiskRadarNotesRepository extends Repository<RiskRadarNotesEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarNotesEntity, dataSource.createEntityManager());
  }

  public async createAssignmentNotes(
    mid: string,
    assignedTo: string,
    userCreated: string
  ): Promise<void> {
    await this.insert({
      mid,
      notes: `Assigned to ${assignedTo || ''}`,
      notesTypeId: 9,
      userCreated,
      isHidden: false,
    });
  }

  /**
   * @migrated dbo.uspAssignRiskRadarExceptionsReview.StoredProcedure.sql
   */
  public async createReviewNotes(
    mid: string,
    userCreated: string
  ): Promise<void> {
    await this.insert({
      mid,
      notes: 'Reviewed',
      notesTypeId: 7,
      userCreated,
      isHidden: false,
    });
  }
}
