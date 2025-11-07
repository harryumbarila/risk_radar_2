import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { AutoHoldExceptionSummariesService } from './auto-hold-exception.service';
import {
  ListAutoHoldExceptionSummaryPaginationInput,
  ListAutoHoldExceptionSummaryPaginationOutput,
} from './dto/list-auto-hold-exception.dto';

@ApiTags('auto-hold-exception')
@Controller('v1/auto-hold-exception')
export class AutoHoldExceptionSummariesController {
  constructor(
    public autoHoldExceptionSummariesService: AutoHoldExceptionSummariesService
  ) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'Paginated list of risk rules and their parameters.',
    type: ListAutoHoldExceptionSummaryPaginationOutput,
  })
  async listRiskRules(
    @Query() pagination: ListAutoHoldExceptionSummaryPaginationInput
  ): Promise<ListAutoHoldExceptionSummaryPaginationOutput> {
    return this.autoHoldExceptionSummariesService.findExceptionsWithPagination(
      pagination
    );
  }
}
