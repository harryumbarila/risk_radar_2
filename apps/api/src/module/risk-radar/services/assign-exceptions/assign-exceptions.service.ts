import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarNotesService } from '@/api/module/risk-radar/services/risk-radar-notes/risk-radar-notes.service';
import { RiskRadarUserService } from '@/api/module/risk-radar/services/risk-radar-user/risk-radar-user.service';
import type { RiskRadarExceptionsJeffEntity } from '@/finance-db/entities/risk-radar-exceptions-jeff.entity';
import { RiskRadarAssignExceptionsRepository } from '@/finance-db/repositories/risk-radar-assign-exceptions.repository';

type ExceptionWithMid = Pick<RiskRadarExceptionsJeffEntity, 'id' | 'mid'>;

/**
 * Service to handle assigning risk radar exceptions to specific users
 */
@Injectable()
export class AssignExceptionsService {
  public constructor(
    @InjectPinoLogger(AssignExceptionsService.name)
    private readonly logger: Logger,
    private readonly assignExceptionsRepository: RiskRadarAssignExceptionsRepository,
    private readonly notesService: RiskRadarNotesService,
    private readonly userService: RiskRadarUserService
  ) {}

  private isExceptionWithMid(obj: unknown): obj is ExceptionWithMid {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      typeof (obj as ExceptionWithMid).id === 'number' &&
      'mid' in obj &&
      typeof (obj as ExceptionWithMid).mid === 'string'
    );
  }

  /**
   * Assign risk radar exceptions to a specific user
   */
  public async assignExceptions(
    exceptionIds: string,
    assignToUserId: number,
    createdBy: string
  ): Promise<{ success: boolean }> {
    this.logger.info(
      `Assigning exceptions to user ID ${assignToUserId} by ${createdBy}`
    );

    try {
      // Parse exception IDs from comma-separated string to array of numbers
      const exceptionIdArray = exceptionIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id !== '')
        .map((id) => parseInt(id, 10))
        .filter((id) => !Number.isNaN(id));

      this.logger.debug(`Parsed exception IDs: ${exceptionIdArray.join(', ')}`);

      if (exceptionIdArray.length === 0) {
        this.logger.warn('No valid exception IDs provided');
        return { success: false };
      }

      // Get the NT user ID of the assigned user
      const assignedUser = await this.userService.getUserById(assignToUserId);
      const assignedUserName = assignedUser?.ntUserId || '';

      // Use the repository to handle the database operations
      await this.assignExceptionsRepository.assignExceptions(
        exceptionIdArray,
        assignToUserId
      );

      // Get MIDs for the assigned exceptions
      const exceptions =
        await this.assignExceptionsRepository.getExceptionsByMIDs(
          exceptionIdArray
        );

      // Create notes for each exception
      await Promise.all(
        exceptions.map((exception) =>
          this.notesService.createAssignmentNotes(
            exception.mid,
            assignedUserName,
            createdBy
          )
        )
      );

      this.logger.info(
        `Successfully assigned exceptions to user ID ${assignToUserId}`
      );
      return { success: true };
    } catch (error: unknown) {
      this.logger.error(
        { err: error },
        `Error assigning exceptions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw error;
    }
  }
}
