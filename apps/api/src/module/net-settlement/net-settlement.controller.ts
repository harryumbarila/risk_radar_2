import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { NetSettlementBaseDto } from './dto/handle-action.dto';
import { HandleDiverAddDto } from './dto/handle-divert-add.dto';
import { HandleDiverRemovedDto } from './dto/handle-divert-removed.dto copy';
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
  public async getNetSettlementSummaryByMID(@Param('mid') mid: string) {
    return this.netSettlementsService.getNetSettlementSummaryByMID(mid);
  }

  @ApiResponse({
    status: 200,
    description: 'Added a divert note given a MID',
  })
  @ApiOperation({
    operationId: 'net-settlement-summary',
    summary: 'Add a divert note given a MID',
  })
  @Post('summary/add')
  public async handleDivertAdd(@Body() payload: HandleDiverAddDto) {
    return this.netSettlementsService.handleDivertAdd(payload);
  }

  @ApiResponse({
    status: 200,
    description: 'Added a divert note given a MID',
  })
  @ApiOperation({
    operationId: 'net-settlement-summary',
    summary: 'Add a divert note given a MID',
  })
  @Post('summary/remove')
  public async handleDivertRemove(@Body() payload: HandleDiverRemovedDto) {
    return this.netSettlementsService.handleDivertRemove(payload);
  }

  @ApiResponse({
    status: 200,
    description: 'Added a divert note given a MID',
  })
  @ApiOperation({
    operationId: 'net-settlement-summary',
    summary: 'Add a divert note given a MID',
  })
  @Post('summary/action')
  public async handleAction(@Body() payload: NetSettlementBaseDto) {
    switch (payload.type) {
      case '1': // release
        return this.netSettlementsService.releaseFunds(payload);
      case '2': // withdraw
        return this.netSettlementsService.withDraw(payload);
      case '3': // apply
        return this.netSettlementsService.applyCheckToNetSettlement({
          ...payload,
          checkType: 'received',
        });
      case '4': // write off
        return this.netSettlementsService.applyCheckToNetSettlement({
          ...payload,
          writeOffType: 'regular',
        });
      case '5': // write off
        return this.netSettlementsService.applyCheckToNetSettlement({
          ...payload,
          writeOffType: 'risk',
        });
      case '6': // apply
        return this.netSettlementsService.applyCheckToNetSettlement({
          ...payload,
          checkType: 'payed',
        });
      default:
        return {
          success: false,
        };
    }
  }
}
