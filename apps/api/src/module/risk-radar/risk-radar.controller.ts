import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';
import { MerchantExceptionDetailRequestDto, MerchantExceptionDetailResponseDto } from './dtos/merchant-exception-detail.dto';
import { RiskRadarService } from './risk-radar.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';

@ApiTags('risk-radar')
@Controller('v1/risk-radar')
export class RiskRadarController {
  public constructor(
    private readonly riskRadarService: RiskRadarService,
    private readonly merchantExceptionDetailService: MerchantExceptionDetailService
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
}
