import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarNotesRepository } from '@/finance-db/repositories';
import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories/risk-radar-exceptions-jeff.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';

/**
 * Service to handle assigning risk radar exceptions to specific users
 */
@Injectable()
export class AssignExceptionsService {
  public constructor(
    @InjectPinoLogger(AssignExceptionsService.name)
    private readonly logger: Logger,

    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository,
    private readonly userRepository: RiskRadarUserRepository
  ) {}

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
        .map(id => id.trim())
        .filter(id => id !== '')
        .map(id => parseInt(id, 10))
        .filter(id => !Number.isNaN(id));

      this.logger.debug(`Parsed exception IDs: ${exceptionIdArray.join(', ')}`);

      if (exceptionIdArray.length === 0) {
        this.logger.warn('No valid exception IDs provided');
        return { success: false };
      }

      // Get the NT user ID of the assigned user
      const assignedUser = await this.userRepository.findOne({
        where: { id: assignToUserId },
        select: ['ntUserId'],
      });

      const assignedUserName = assignedUser?.ntUserId || '';

      // Use the repository's assignExceptions method to update the exceptions
      await this.exceptionsJeffRepository.assignExceptions(
        exceptionIdArray,
        assignToUserId
      );

      // Get MIDs for all updated exceptions
      const exceptions = await this.exceptionsJeffRepository.getExceptionsByMIDs(
        exceptionIdArray
      );
      
      // Create notes for each exception
      const createNotesPromises = exceptions.map((exception: { mid: string }) => 
        this.notesRepository.createAssignmentNotes(
          exception.mid,
          assignedUserName,
          createdBy
        )
      );
      
      await Promise.all(createNotesPromises);

      this.logger.info(
        `Successfully assigned ${exceptions.length} exceptions to user ID ${assignToUserId}`
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        { err: error },
        `Error assigning exceptions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw error;
    }
  }
} 