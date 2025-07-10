import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { NetSettlementsService } from './net-settlement.service';

@ApiTags('net-settlement')
@Controller('v1/net-settlement')
export class NetSettlementsController {
  public constructor(
    private readonly netSettlementsService: NetSettlementsService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'List Net Settlement summary',
  })
  @ApiOperation({
    operationId: 'net-settlement-summary',
    summary: 'Get Net Settlement summary given a MID',
  })
  @Get('summary/:mid')
  public async sendInvoices(@Param('mid') mid: string) {
    return this.netSettlementsService.getNetSettlementSummaryByMID(mid);
  }
}
