import { Injectable } from '@nestjs/common';
import { RiskRadarExceptionsJeffRepository } from '@denali/finance-db/src/repositories/risk-radar-exceptions-jeff.repository';
import { RiskRadarNotesRepository } from '@denali/finance-db/src/repositories/risk-radar-notes.repository';
import { RiskRadarUserRepository } from '@denali/finance-db/src/repositories/risk-radar-user.repository';
import { AssignRiskRadarExceptionsDto } from '../dtos/assign-risk-radar-exceptions.dto';

@Injectable()
export class RiskRadarExceptionsService {
  constructor(
    private readonly exceptionsRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository,
    private readonly userRepository: RiskRadarUserRepository
  ) {}

  /**
   * @migrated dbo.uspAssignRiskRadarExceptions-rr.StoredProcedure.sql
   */
  async assignExceptions(dto: AssignRiskRadarExceptionsDto): Promise<void> {
    const assignedTo =
      (await this.userRepository.getNTUserID(dto.assignedUserId)) || '';

    // Update exceptions
    await this.exceptionsRepository.assignExceptions(
      dto.exceptionIds,
      dto.assignedUserId
    );

    // Get exceptions with MIDs for notes
    const exceptions = await this.exceptionsRepository.getExceptionsByMIDs(
      dto.exceptionIds
    );

    // Create notes for each exception
    for (const exception of exceptions) {
      await this.notesRepository.createAssignmentNotes(
        exception.mid,
        assignedTo,
        dto.user
      );
    }
  }
}
