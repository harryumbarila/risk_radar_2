import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';
import { MerchantExceptionDetailRequestDto, MerchantExceptionDetailResponseDto } from './dtos/merchant-exception-detail.dto';
import { RiskRadarService } from './risk-radar.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';
import { AssignExceptionReviewService } from './services/assign-exception-review/assign-exception-review.service';
import { AssignExceptionReviewInputDto } from './services/assign-exception-review/dto/assign-exception-review-input.dto';
import { MerchantCardNumHistoryQueryDto } from './services/merchant-card-num-history/dto/get-merchant-card-num.dto';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { RiskRadarExceptionsListResultDto } from '../risk-radar-exceptions/dto/risk-radar-exceptions-list-result.dto';
import { RiskRadarExceptionsService } from './services/risk-radar-exceptions.service';

@ApiTags('risk-radar')
@Controller('v1/risk-radar')
export class RiskRadarController {
  public constructor(
    private readonly riskRadarService: RiskRadarService,
    private readonly merchantExceptionDetailService: MerchantExceptionDetailService,
    private readonly merchantCardNumHistoryService: MerchantCardNumHistoryService,
    private readonly assignExceptionReviewService: AssignExceptionReviewService,
    private readonly riskRadarExceptionsService: RiskRadarExceptionsService
  ) {}

  @Public()
  @Post('send-exception-memo-email')
  @ApiOkResponse({ description: 'Send exception memo emails' })
  public async sendExceptionMemoEmail(
    @Body() emailDto: SendExceptionMemoEmailDto
  ): Promise<unknown> {
    const message =
      await this.riskRadarService.sendExceptionMemoEmail(emailDto);
    return { message };
  }

  @Public()
  @Post('merchant-exception-detail')
  @ApiOperation({
    summary: 'Get merchant exception details',
    description: 'Retrieves detailed information about a merchant exception',
  })
  @ApiResponse({
    status: 200,
    description: 'The merchant exception details have been successfully retrieved',
    type: MerchantExceptionDetailResponseDto,
  })
  public async getMerchantExceptionDetail(
    @Body() request: MerchantExceptionDetailRequestDto
  ): Promise<MerchantExceptionDetailResponseDto> {
    return this.merchantExceptionDetailService.getMerchantExceptionDetail(request);
  }
    
  @Get('merchant-card-num-history')
  @ApiResponse({})
  public async getMerchantCardNumHistory(
    @Query(ValidationPipe) query: MerchantCardNumHistoryQueryDto
  ) {
    return this.merchantCardNumHistoryService.getMerchantCardNumHistory(query);
  }

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

  @Public()
  @Post('assign-exception-review')
  @ApiOkResponse()
  public assignExceptionReview(@Body() data: AssignExceptionReviewInputDto) {
    return this.assignExceptionReviewService.assignExceptionReview(data);
  }
}
