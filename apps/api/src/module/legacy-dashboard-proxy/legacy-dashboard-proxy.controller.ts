import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import type { ExceptionDataResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import {
  KpiStatisticsResponseDto,
  MerchantResponseDto,
  RiskRadarResponseDto,
} from '@/shared/response/legacy-dashboard-proxy';

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
    description: 'The merchant response.',
  })
  @ApiOperation({ operationId: 'merchant', summary: 'Get merchant' })
  @Get('merchant')
  public merchant(@Query('mid') mid: string): MerchantResponseDto {
    return this.client.getMerchant(mid);
  }

  @ApiResponse({
    status: 200,
    description: 'The risk radar response.',
  })
  @ApiOperation({ operationId: 'risk_radar', summary: 'Get risk radar' })
  @Get('risk_radar')
  public riskRadar(
    @Query() filters: ExceptionFiltersDto
  ): RiskRadarResponseDto {
    return this.client.riskRadar(filters);
  }
}
