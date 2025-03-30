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

@ApiTags('risk-radar')
@Controller('v1/risk-radar')
export class RiskRadarController {
  public constructor(
    private readonly riskRadarService: RiskRadarService,
    private readonly merchantExceptionDetailService: MerchantExceptionDetailService,
    private readonly merchantCardNumHistoryService: MerchantCardNumHistoryService,
    private readonly assignExceptionReviewService: AssignExceptionReviewService
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

  @Public()
  @Post('assign-exception-review')
  @ApiOkResponse()
  public assignExceptionReview(@Body() data: AssignExceptionReviewInputDto) {
    return this.assignExceptionReviewService.assignExceptionReview(data);
  }
}
