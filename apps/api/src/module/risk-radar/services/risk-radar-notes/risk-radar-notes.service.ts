import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarNotesRepository } from '@/finance-db/repositories';

@Injectable()
export class RiskRadarNotesService {
  public constructor(
    @InjectPinoLogger(RiskRadarNotesService.name)
    private readonly logger: Logger,
    private readonly notesRepository: RiskRadarNotesRepository
  ) {}

  /**
   * Create assignment notes for a merchant
   */
  public async createAssignmentNotes(
    mid: string,
    assignedUserName: string,
    createdBy: string
  ): Promise<void> {
    this.logger.info(
      `Creating assignment notes for MID ${mid} assigned to ${assignedUserName} by ${createdBy}`
    );

    try {
      await this.notesRepository.createAssignmentNotes(
        mid,
        assignedUserName,
        createdBy
      );
    } catch (error: unknown) {
      this.logger.error(
        { err: error },
        `Error creating assignment notes for MID ${mid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      throw error;
    }
  }

  /**
   * Create review notes for a merchant
   */
  public async createReviewNotes(
    mid: string,
    userCreated: string
  ): Promise<void> {
    this.logger.info(`Creating review notes for MID ${mid} by ${userCreated}`);

    try {
      await this.notesRepository.createReviewNotes(mid, userCreated);
    } catch (error: unknown) {
      this.logger.error(
        { err: error },
        `Error creating review notes for MID ${mid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      throw error;
    }
  }
}
