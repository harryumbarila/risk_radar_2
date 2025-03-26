import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import type {
  ExceptionDataResponseDto,
  MerchantChargebacksResponseDto,
  MerchantContactResponseDto,
  MerchantNetSettlementResponseDto,
  MerchantNotesResponseDto,
  MerchantResponseDto,
  RiskRadarResponseDto,
  TransactionExceptionResponseDto,
} from '@/shared/response/legacy-dashboard-proxy';
import { KpiStatisticsResponseDto } from '@/shared/response/legacy-dashboard-proxy';

import { LegacyDashboardProxyClient } from './webservice/legacy-dashboard-proxy.client';

export class ExceptionFiltersDto {
  @IsString()
  @IsOptional()
  public from_date?: string;

  @IsString()
  @IsOptional()
  public to_date?: string;

  @IsString()
  @IsOptional()
  public status?: string;

  @IsString()
  @IsOptional()
  public assigned_to?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value === 'null' ? null : value
  )
  public MID?: string | null;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value === 'null' ? null : value
  )
  public dba_or_sic?: string | null;

  @IsArray()
  @Transform(({ value }: { value: string }) => value.split(', '))
  public exception_type: string[];

  @IsBoolean()
  @Transform(({ value }) => value === '1')
  public view_all_exceptions: boolean;

  @IsString()
  @IsOptional()
  public source_type?: string;

  @IsNumber()
  @Type(() => Number)
  public current_page: number;

  @IsNumber()
  @Type(() => Number)
  public records_per_page: number;
}
@ApiTags('Legacy dashboard proxy')
@Controller('/v1/legacy_dashboard_proxy')
export class LegacyDashboardProxyController {
  public constructor(private readonly client: LegacyDashboardProxyClient) {}

  @ApiResponse({
    status: 200,
    description: 'The KPI statistics response.',
  })
  @ApiOperation({ operationId: 'kpi', summary: 'Get KPI statistics' })
  @Get('kpi')
  public getKPI(): KpiStatisticsResponseDto {
    return this.client.getKPI();
  }

  @ApiResponse({
    status: 200,
    description: 'The exception data response.',
  })
  @ApiOperation({
    operationId: 'exception_data',
    summary: 'Get exception data',
  })
  @Get('exception_data')
  public async getExceptionData(): Promise<ExceptionDataResponseDto> {
    return this.client.getExceptionData();
  }

  @ApiResponse({
    status: 200,
    description: 'The risk radar users response.',
  })
  @Get('risk_radar_users')
  public async getRiskRadarUsers(): Promise<RiskRadarResponseDto> {
    return this.client.getRiskRadarUsers();
  }

  @ApiResponse({
    status: 200,
    description: 'The card history response.',
  })
  @Get('card_history')
  public async getCardHistory(
    @Query('cardNumber') cardNumber: string
  ): Promise<ExceptionDataResponseDto> {
    return this.client.getCardHistory(cardNumber);
  }

  @ApiResponse({
    status: 200,
    description: 'The email templates response.',
  })
  @Get('email_templates')
  public async getEmailTemplates(): Promise<ExceptionDataResponseDto> {
    return this.client.getEmailtemplates();
  }

  @ApiResponse({
    status: 200,
    description: 'The exception data response.',
  })
  @Post('push_note_to_iris')
  public async pushNoteToIris(
    @Query('noteId') noteId: string
  ): Promise<ExceptionDataResponseDto> {
    return this.client.pushNoteToIris(noteId);
  }

  @ApiOkResponse({ type: Object })
  @Post('save_new_net_settlement')
  public async saveNewNetSettlement(
    @Body()
    body: {
      category: string;
      tranDate: string;
      tranAmt: number;
      balAmt: number;
      pendingAmt: number;
      writeOffAmt: number;
      reason: string;
      createdBy: string;
      mid: string;
    }
  ): Promise<ExceptionDataResponseDto> {
    return this.client.saveNewNetSettlement(
      body.category,
      body.tranDate,
      body.tranAmt,
      body.balAmt,
      body.pendingAmt,
      body.writeOffAmt,
      body.reason,
      body.createdBy,
      body.mid
    );
  }

  @ApiOkResponse({ type: Object })
  @Post('review_exception')
  public async reviewException(
    @Body() body: { exceptionsId: number[]; reviewerUsername: string }
  ): Promise<unknown> {
    return this.client.postReviewException(
      body.exceptionsId,
      body.reviewerUsername
    );
  }

  @ApiOkResponse({ type: Object })
  @Post('managers_queue')
  public async managersQueue(
    @Body() body: { exceptionsId: number[] }
  ): Promise<unknown> {
    return this.client.postSentToManagersQueue(body.exceptionsId);
  }

  @ApiOkResponse({ type: Object })
  @Post('assign_exception_to_user')
  public async assignExceptionToUser(
    @Body() body: { exceptionsId: number[]; riskUserId: string }
  ): Promise<unknown> {
    return this.client.postAssignExceptionToUser(
      body.exceptionsId,
      body?.riskUserId
    );
  }

  @ApiOkResponse({ type: Object })
  @Post('mark_exception_as_divert')
  public async markExceptionsAsDivert(
    @Body() body: { exceptionsId: number[] }
  ): Promise<unknown> {
    return this.client.postExecuteDivertCommand(body?.exceptionsId);
  }

  @ApiOkResponse({ type: Object })
  @Post('save_merchant_data')
  public async saveMerchantData(
    @Query('mid') mid: string,
    @Body()
    body: {
      mid: string;
      note: string;
      isPinned: boolean;
      bbbRating: string;
      author: string;
      preferredContact: string;
    }
  ): Promise<unknown> {
    return this.client.saveMerchantData(
      mid,
      body?.note,
      body?.isPinned,
      body?.bbbRating,
      body?.author,
      body?.preferredContact
    );
  }

  @ApiOkResponse({ type: Object })
  @Post('toggle_managers_queue')
  public async postManagersQueue(
    @Body()
    body: {
      exceptionsId: number[];
    }
  ): Promise<unknown> {
    return this.client.postSentToManagersQueue(body?.exceptionsId);
  }

  @ApiOkResponse({ type: Object })
  @Put('toggle_auto_hold_white_label')
  public async putExecuteAutoHoldWhiteLabelCommand(
    @Body() body: { exceptionsId: number[]; isActive: boolean }
  ): Promise<unknown> {
    return this.client.putExecuteAutoHoldWhiteLabelCommand(
      body?.exceptionsId,
      body?.isActive
    );
  }

  @ApiOkResponse({ type: Object })
  @Put('toggle_risk_watch_command')
  public async putExecuteRisKWatchCommand(
    @Body() body: { exceptionsId: number[]; isActive: boolean }
  ): Promise<unknown> {
    return this.client.putExecuteRiskWatchCommand(
      body?.exceptionsId,
      body?.isActive
    );
  }

  @ApiResponse({
    status: 200,
    description: 'The merchant response.',
  })
  @ApiOperation({ operationId: 'merchant', summary: 'Get merchant' })
  @Get('merchant')
  public merchant(
    @Query('mid') mid: string,
    @Query('exceptionId') exceptionId: string
  ): Promise<MerchantResponseDto> {
    return this.client.getMerchant(mid, exceptionId);
  }

  @ApiOkResponse({ type: Object })
  @ApiOperation({
    operationId: 'merchantContactInfo',
    summary: 'Get merchant contact information',
  })
  @Get('merchant_contact_info')
  public merchantContactInfo(
    @Query('mid') mid: string
  ): Promise<MerchantContactResponseDto> {
    return this.client.getMerchantContactInfo(mid);
  }

  @ApiOkResponse({ type: Object })
  @ApiOperation({
    operationId: 'transactionExceptions',
    summary: 'Get merchant transaction exceptions',
  })
  @Get('transaction_exceptions')
  public transactionExceptions(
    @Query('mid') mid: string
  ): Promise<TransactionExceptionResponseDto> {
    return this.client.getTransactionExceptions(mid);
  }

  @ApiOkResponse({ type: Object })
  @ApiOperation({ operationId: 'merchantNotes', summary: 'Get merchant notes' })
  @Get('merchant_notes')
  public merchantNotes(
    @Query('mid') mid: string
  ): Promise<MerchantNotesResponseDto> {
    return this.client.getMerchantNotes(mid);
  }

  @ApiOkResponse({ type: Object })
  @ApiOperation({
    operationId: 'merchantChargebacks',
    summary: 'Get merchant chargebacks',
  })
  @Get('merchant_chargebacks')
  public merchantChargeback(
    @Query('mid') mid: string
  ): Promise<MerchantChargebacksResponseDto> {
    return this.client.getMerchantChargebacks(mid);
  }

  @ApiOkResponse({ type: Object })
  @ApiOperation({
    operationId: 'merchantNetSettlement',
    summary: 'Get merchant net settlement',
  })
  @Get('merchant_net_settlement')
  public merchantNetSettlement(
    @Query('mid') mid: string
  ): Promise<MerchantNetSettlementResponseDto> {
    return this.client.getMerchantNetSettlement(mid);
  }

  @ApiResponse({
    status: 200,
    description: 'The risk radar response.',
  })
  @ApiOperation({ operationId: 'risk_radar', summary: 'Get risk radar' })
  @Get('risk_radar')
  public riskRadar(
    @Query() filters: ExceptionFiltersDto
  ): Promise<RiskRadarResponseDto> {
    return this.client.riskRadar(filters);
  }
}
