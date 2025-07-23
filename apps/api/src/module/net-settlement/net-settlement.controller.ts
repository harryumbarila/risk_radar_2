import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { NetSettlementBaseDto } from './dto/handle-action.dto';
import { NetSettlementMidLabelUpdateDto } from './dto/handle-add-label.dto';
import { HandleDeleteTransactionDto } from './dto/handle-delete-transaction.dto';
import { HandleDiverAddDto } from './dto/handle-divert-add.dto';
import { HandleDiverRemovedDto } from './dto/handle-divert-removed.dto';
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
    description: 'Deleted a transaction given a MID',
  })
  @ApiOperation({
    operationId: 'net-settlement-summary',
    summary: 'Delete a transaction given a MID',
  })
  @Post('summary/transaction/remove')
  public async handleRemoveTransaction(
    @Body() payload: HandleDeleteTransactionDto
  ) {
    return this.netSettlementsService.deleteTransaction(payload);
  }

  @ApiResponse({
    status: 200,
    description: 'Deleted a transaction given a MID',
  })
  @ApiOperation({
    operationId: 'net-settlement-summary',
    summary: 'Delete a transaction given a MID',
  })
  @Post('summary/label/add')
  public async updateLabel(@Body() payload: NetSettlementMidLabelUpdateDto) {
    return this.netSettlementsService.updateMIDLabel(payload);
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
        return this.netSettlementsService.writeOffNetSettlement({
          ...payload,
          writeOffType: 'regular',
        });
      case '5': // risk write off
        return this.netSettlementsService.writeOffNetSettlement({
          ...payload,
          writeOffType: 'risk',
        });
      case '6': // apply
        return this.netSettlementsService.applyCheckToNetSettlement({
          ...payload,
          checkType: 'payed',
        });
      case '7': // transfer
        return this.netSettlementsService.applyCheckDivertTransfer(payload);
      case '8': // transfer to another MID
        return this.netSettlementsService.applyTransferToAnotherMID(payload);
      default:
        return {
          success: false,
        };
    }
  }
}
