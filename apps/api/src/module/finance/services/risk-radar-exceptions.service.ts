import { Injectable } from '@nestjs/common';

import type { AssignRiskRadarExceptionsDto } from '@/api/module/finance/dtos/assign-risk-radar-exceptions.dto';
import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories/risk-radar-exceptions-jeff.repository';
import { RiskRadarNotesRepository } from '@/finance-db/repositories/risk-radar-notes.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class RiskRadarExceptionsService {
  public constructor(
    private readonly exceptionsRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository,
    private readonly userRepository: RiskRadarUserRepository
  ) {}

  /**
   * @migrated dbo.uspAssignRiskRadarExceptions-rr.StoredProcedure.sql
   */
  public async assignExceptions(
    dto: AssignRiskRadarExceptionsDto
  ): Promise<void> {
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
    await Promise.all(
      exceptions.map((e) =>
        this.notesRepository.createAssignmentNotes(e.mid, assignedTo, dto.user)
      )
    );
  }
}
