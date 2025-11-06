import { AutoHoldExceptionSummaryRepository } from '@/risk-radar-db/repositories';
import { Injectable } from '@nestjs/common';
import {
  ListAutoHoldExceptionSummaryPaginationInput,
  ListAutoHoldExceptionSummaryPaginationOutput,
} from './dto/list-auto-hold-exception.dto';

@Injectable()
export class AutoHoldExceptionSummariesService {
  constructor(
    readonly autoHoldExceptionSummaryRepository: AutoHoldExceptionSummaryRepository
  ) {}

  async findExceptionsWithPagination(
    pagination: ListAutoHoldExceptionSummaryPaginationInput
  ): Promise<ListAutoHoldExceptionSummaryPaginationOutput> {
    const { page = 1, limit = 50, startDate, endDate } = pagination;

    const data =
      await this.autoHoldExceptionSummaryRepository.findExceptionsWithPagination(
        startDate,
        endDate,
        page,
        limit
      );

    return {
      data: data.data,
      count: data.count,
      total: data.total,
      page: data.page,
      pageCount: data.pageCount,
    };
  }
}
