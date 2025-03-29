import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';
import { RiskRadarService } from './risk-radar.service';

@ApiTags('risk-radar')
@Controller('risk-radar')
export class RiskRadarController {
  public constructor(private readonly riskRadarService: RiskRadarService) {}

  @Post('send-exception-memo-email')
  @ApiOkResponse({ description: 'Send exception memo emails' })
  public async sendExceptionMemoEmail(
    @Body() emailDto: SendExceptionMemoEmailDto
  ): Promise<unknown> {
    const message =
      await this.riskRadarService.sendExceptionMemoEmail(emailDto);
    return { message };
  }
}
