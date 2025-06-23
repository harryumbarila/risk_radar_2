import { BadRequestException, Injectable } from '@nestjs/common';
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
  // Add a static map to track in-progress assignments at the class level
  private static inProgressAssignments: Map<string, string> = new Map();

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

      // Check if any exceptions are already assigned (status 4)
      const existingExceptions = await this.assignExceptionsRepository
        .createQueryBuilder('exception')
        .select([
          'exception.id',
          'exception.exceptionStatusId',
          'exception.assignedUserId',
        ])
        .whereInIds(exceptionIdArray)
        .getMany();

      const alreadyAssignedExceptions = existingExceptions.filter(
        (exception) => exception.exceptionStatusId === 4
      );

      if (alreadyAssignedExceptions.length > 0) {
        const assignedExceptionIds = alreadyAssignedExceptions
          .map((e) => e.id)
          .join(', ');
        this.logger.warn(
          `Assignment rejected: Exceptions ${assignedExceptionIds} are already assigned (status 4)`
        );
        throw new BadRequestException(
          `The following exceptions are already assigned to users: ${assignedExceptionIds}. Please refresh the page and try again.`
        );
      }

      // Get the NT user ID of the assigned user
      const assignedUser = await this.userService.getUserById(assignToUserId);
      const assignedUserName = assignedUser?.ntUserId || '';

      // Check for concurrent assignments on the same exceptions
      const assignmentKeys = exceptionIdArray.map(
        (exceptionId) => `assignment-${exceptionId}`
      );

      const conflictingExceptions = exceptionIdArray
        .map((exceptionId, index) => {
          const assignmentKey = assignmentKeys[index];
          if (
            AssignExceptionsService.inProgressAssignments.has(assignmentKey)
          ) {
            const currentAssigner =
              AssignExceptionsService.inProgressAssignments.get(assignmentKey);
            return `${exceptionId} (being assigned by ${currentAssigner})`;
          }
          return null;
        })
        .filter((item): item is string => item !== null);

      if (conflictingExceptions.length > 0) {
        this.logger.warn(
          `Assignment conflicts detected for exceptions: ${conflictingExceptions.join(', ')}. 
          Rejecting concurrent assignment attempt by ${createdBy}.`
        );
        throw new BadRequestException(
          `The following exceptions are currently being assigned by another user: ${conflictingExceptions.join(', ')}. Please try again later.`
        );
      }

      try {
        // Set locks for all exceptions being assigned
        assignmentKeys.forEach((key) => {
          AssignExceptionsService.inProgressAssignments.set(key, createdBy);
        });

        this.logger.debug(
          `Assignment locks acquired for exceptions ${exceptionIdArray.join(', ')} by ${createdBy}`
        );

        // Use the repository to handle the database operations
        await this.assignExceptionsRepository.assignExceptions(
          exceptionIdArray,
          assignToUserId
        );
      } finally {
        // Always release the locks, even if an error occurs
        assignmentKeys.forEach((key) => {
          AssignExceptionsService.inProgressAssignments.delete(key);
        });
        this.logger.debug(
          `Assignment locks released for exceptions ${exceptionIdArray.join(', ')}`
        );
      }

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
