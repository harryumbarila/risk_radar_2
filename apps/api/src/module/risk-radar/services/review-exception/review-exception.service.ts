import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarNotesRepository } from '@/finance-db/repositories';
import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories/risk-radar-exceptions-jeff.repository';

import type { ReviewExceptionInputDto } from './dto/review-exception-input.dto';

@Injectable()
export class ReviewExceptionService {
  public constructor(
    @InjectPinoLogger(ReviewExceptionService.name)
    private readonly logger: Logger,

    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository
  ) {}

  public async reviewExceptions(data: ReviewExceptionInputDto) {
    const { reviewList, user } = data;

    this.logger.info(`Reviewing exceptions by user ${user}`);

    const exceptionIds = reviewList
      .split(',')
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => !Number.isNaN(id));

    this.logger.debug(`Parsed exception IDs: ${exceptionIds.join(', ')}`);

    if (exceptionIds.length === 0) {
      this.logger.warn('No valid exception IDs provided');
      return { success: false, message: 'No valid exception IDs provided' };
    }

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

    this.logger.info(
      `Successfully reviewed ${mids.length} exceptions by user ${user}`
    );
    return { success: true, message: `Updated ${mids.length} exceptions` };
  }
}
