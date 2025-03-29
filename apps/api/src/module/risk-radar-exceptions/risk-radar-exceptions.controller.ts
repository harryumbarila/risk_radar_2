import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import type { RiskRadarExceptionsListResultDto } from './dto/risk-radar-exceptions-list-result.dto';
import { RiskRadarExceptionsService } from './risk-radar-exceptions.service';

@ApiTags('Risk Radar Exceptions')
@Controller('/v1/risk-radar-exceptions')
export class RiskRadarExceptionsController {
  public constructor(
    private readonly riskRadarExceptionsService: RiskRadarExceptionsService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get risk radar exceptions list.',
  })
  @ApiOperation({
    operationId: 'getRiskRadarExceptionsList',
    summary:
      'Get risk radar exceptions list with filtering and sorting options',
  })
  @Public()
  @Get('list')
  public async getExceptionsList(
    @Query('dtStart') dtStart: Date,
    @Query('dtEnd') dtEnd: Date,
    @Query('pkRiskRadarExceptionStatus') pkRiskRadarExceptionStatus: number,
    @Query('pkRiskRadarUserAssigned') pkRiskRadarUserAssigned: number,
    @Query('sMIDSearch') sMIDSearch: string,
    @Query('sGeneralSearch') sGeneralSearch: string,
    @Query('sExceptionList') sExceptionList: string,
    @Query('bViewAll') bViewAll: boolean,
    @Query('iSortBy') iSortBy: number,
    @Query('iProcessor') iProcessor: number
  ): Promise<RiskRadarExceptionsListResultDto[]> {
    return this.riskRadarExceptionsService.getExceptionsList({
      dtStart,
      dtEnd,
      pkRiskRadarExceptionStatus,
      pkRiskRadarUserAssigned,
      sMIDSearch,
      sGeneralSearch,
      sExceptionList,
      bViewAll,
      iSortBy,
      iProcessor,
    });
  }
}
