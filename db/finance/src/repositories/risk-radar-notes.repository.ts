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

  public async createManagerQueuedNotes(
    mid: string,
    userCreated: string
  ): Promise<void> {
    await this.insert({
      mid,
      notes: 'Manager Queued',
      notesTypeId: 8,
      userCreated,
      isHidden: false,
    });
  }

  public async createMonthlyValueChangedNotes(
    mid: string,
    oldValue: number,
    newValue: number,
    userCreated: string
  ): Promise<void> {
    const notes = `MV Changed from ${oldValue} to ${newValue}`;

    await this.insert({
      mid,
      userCreated,
      notes,
      notesTypeId: 2,
    });
  }

  public async createAverageTicketChangedNotes(
    mid: string,
    oldValue: number,
    newValue: number,
    userCreated: string
  ): Promise<void> {
    const notes = `AT Changed from ${oldValue} to ${newValue}`;

    await this.insert({
      mid,
      userCreated,
      notes,
      notesTypeId: 3,
    });
  }

  public async createSwipePercentChangedNotes(
    mid: string,
    oldValue: number,
    newValue: number,
    userCreated: string
  ): Promise<void> {
    const notes = `Swipe % Changed from ${oldValue} to ${newValue}`;

    await this.insert({
      mid,
      userCreated,
      notes,
      notesTypeId: 4,
    });
  }

  public async createAutoHoldChangedNotes(
    mid: string,
    oldValue: boolean,
    newValue: boolean,
    userCreated: string
  ): Promise<void> {
    const oldValueString = oldValue ? 'Check' : 'UnCheck';
    const newValueString = newValue ? 'Check' : 'Uncheck';

    const notes = `MV Changed from ${oldValueString} to ${newValueString}`;

    await this.insert({
      mid,
      userCreated,
      notes,
      notesTypeId: 4,
    });
  }

  public async createDivertChangedNotes(
    mid: string,
    isDiverted: boolean,
    userCreated: string
  ): Promise<void> {
    const notes = isDiverted
      ? 'Account put on divert'
      : 'Account removed from divert';

    await this.insert({
      mid,
      userCreated,
      notes,
      notesTypeId: 5,
    });
  }
}
