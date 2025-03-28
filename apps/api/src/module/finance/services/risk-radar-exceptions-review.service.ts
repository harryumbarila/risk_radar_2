import { RiskRadarExceptionsJeffRepository } from '@denali/finance-db/src/repositories/risk-radar-exceptions-jeff.repository';
import { RiskRadarNotesRepository } from '@denali/finance-db/src/repositories/risk-radar-notes.repository';
import { Injectable } from '@nestjs/common';

import type { AssignRiskRadarExceptionsReviewDto } from '@/api/module/finance/dtos/assign-risk-radar-exceptions-review.dto';

@Injectable()
export class RiskRadarExceptionsReviewService {
  public constructor(
    private readonly exceptionsRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository
  ) {}

  /**
   * @migrated dbo.uspAssignRiskRadarExceptionsReview.StoredProcedure.sql
   */
  public async reviewExceptions(
    dto: AssignRiskRadarExceptionsReviewDto
  ): Promise<void> {
    const exceptionIds = dto.exceptionIds
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !Number.isNaN(id));

    // Update exceptions status and user reviewed
    await this.exceptionsRepository.reviewExceptions(exceptionIds, dto.user);

    // Get distinct MIDs for notes
    const mids =
      await this.exceptionsRepository.getDistinctMIDsForReview(exceptionIds);

    // Create review notes for each MID

    await Promise.all(
      mids.map(({ mid }) =>
        this.notesRepository.createReviewNotes(mid, dto.user)
      )
    );
  }
}
