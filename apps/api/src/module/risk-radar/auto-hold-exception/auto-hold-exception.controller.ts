import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { AutoHoldExceptionSummariesService } from './auto-hold-exception.service';
import {
  ListAutoHoldExceptionSummaryPaginationInput,
  ListAutoHoldExceptionSummaryPaginationOutput,
} from './dto/list-auto-hold-exception.dto';
import { AutoHoldStatsDto } from './dto/auto-hold-stats.dto';

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

  @Get('stats')
  @Public()
  @ApiOperation({
    summary: 'Get auto hold exception statistics',
    description:
      'Returns aggregate statistics including total MIDs from ADF and DFT sources and counts of MIDs impacted by each auto hold flag.',
  })
  @ApiOkResponse({
    description: 'Auto hold exception statistics retrieved successfully.',
    type: AutoHoldStatsDto,
  })
  async getAutoHoldStats(): Promise<AutoHoldStatsDto> {
    return this.autoHoldExceptionSummariesService.getAutoHoldStats();
  }
}
