import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarNotesRepository } from '@/finance-db/repositories';
import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories/risk-radar-exceptions-jeff.repository';

import type { AssignExceptionReviewInputDto } from './dto/assign-exception-review-input.dto';

@Injectable()
export class AssignExceptionReviewService {
  public constructor(
    @InjectPinoLogger(AssignExceptionReviewService.name)
    private readonly logger: Logger,

    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository
  ) {}

  public async assignExceptionReview(data: AssignExceptionReviewInputDto) {
    const { reviewList, user } = data;

    const exceptionIds = reviewList
      .split(',')
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => !Number.isNaN(id));

    // Update exceptions status and user reviewed
    await this.exceptionsJeffRepository.reviewExceptions(exceptionIds, user);

    // Get distinct MIDs for notes
    const mids =
      await this.exceptionsJeffRepository.getDistinctMIDsForReview(
        exceptionIds
      );

    // Create review notes for each MID
    await Promise.all(
      mids.map(({ mid }) => this.notesRepository.createReviewNotes(mid, user))
    );

    return { message: `Updated ${mids.length} exceptions` };
  }
}
