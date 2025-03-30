import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';
import { RiskRadarService } from './risk-radar.service';
import { MerchantCardNumHistoryQueryDto } from './services/merchant-card-num-history/dto/get-merchant-card-num.dto';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';

@ApiTags('risk-radar')
@Controller('v1/risk-radar')
export class RiskRadarController {
  public constructor(
    private readonly riskRadarService: RiskRadarService,
    private readonly merchantCardNumHistoryService: MerchantCardNumHistoryService
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
  @Get('merchant-card-num-history')
  @ApiResponse({})
  public async getMerchantCardNumHistory(
    @Query(ValidationPipe) query: MerchantCardNumHistoryQueryDto
  ) {
    return this.merchantCardNumHistoryService.getMerchantCardNumHistory(query);
  }
}
