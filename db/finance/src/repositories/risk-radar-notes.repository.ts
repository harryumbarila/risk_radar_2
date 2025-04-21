import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarNotesEntity } from '../entities/risk-radar-notes.entity';

type RiskRadarNote = {
  sNotes: string;
  dtCreated: Date;
  sUserCreated: string;
  bPinnedNotes: string | null;
  pkRiskRadarNotes: number;
  dtIrisMemoRequest: Date | null;
  dtIrisMemoRequestFulfilled: Date | null;
};

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

    const notes = `Auto hold Changed from ${oldValueString} to ${newValueString}`;

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
      irisMemoRequestDate: () => 'GETDATE()',
      irisMemoRequestFulfilledDate: () => 'GETDATE()',
    });
  }

  public async getNotesByMid(mid: string): Promise<RiskRadarNote[]> {
    return this.createQueryBuilder('notes')
      .select([
        'notes.notes as sNotes',
        'notes.createdAt as dtCreated',
        'notes.userCreated as sUserCreated',
        "CASE WHEN notes.notesTypeId = 6 THEN '*' END as bPinnedNotes",
        'notes.id as pkRiskRadarNotes',
        'notes.irisMemoRequestDate as dtIrisMemoRequest',
        'notes.irisMemoRequestFulfilledDate as dtIrisMemoRequestFulfilled',
      ])
      .where('notes.mid = :mid', { mid })
      .andWhere('notes.isHidden = :isHidden', { isHidden: false })
      .orderBy('CASE WHEN notes.notesTypeId = 6 THEN 0 ELSE 1 END')
      .addOrderBy('notes.createdAt', 'DESC')
      .addOrderBy('notes.id', 'DESC')
      .getRawMany();
  }
}
