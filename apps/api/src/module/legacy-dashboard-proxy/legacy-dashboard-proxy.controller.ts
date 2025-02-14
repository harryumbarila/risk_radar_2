import { Controller, Get, Post, Query } from '@nestjs/common';
import { LegacyDashboardProxyClient } from './webservice/legacy-dashboard-proxy.client';
import { KpiStatisticsResponseDto } from './response/kpi-statistics.response.dto';
import { RiskRadarResponseDto } from './response/risk-radar.response.dto';
import { ExceptionDataResponseDto } from './response/exception-data.response.dto';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ExceptionFiltersDto {
  @IsString()
  @IsOptional()
  from_date?: string;

  @IsString()
  @IsOptional()
  to_date?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  assigned_to?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  MID?: string | null;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  dba_or_sic?: string | null;

  @IsArray()
  @Transform(({ value }) => value.split(', '))
  exception_type: string[];

  @IsBoolean()
  @Transform(({ value }) => value === '1')
  view_all_exceptions: boolean;

  @IsString()
  @IsOptional()
  source_type?: string;

  @IsNumber()
  @Type(() => Number)
  current_page: number;

  @IsNumber()
  @Type(() => Number)
  records_per_page: number;
}

@Controller('/v1/legacy_dashboard_proxy')
export class LegacyDashboardProxyController {
  constructor(private readonly client: LegacyDashboardProxyClient) {}

  @Get('kpi')
  getKPI(): KpiStatisticsResponseDto {
    return this.client.getKPI();
  }

  @Get('exception_data')
  async getExceptionData(): Promise<ExceptionDataResponseDto> {
    return this.client.getExceptionData();
  }

  @Get('risk_radar')
  async riskRadar(
    @Query() filters: ExceptionFiltersDto,
  ): Promise<RiskRadarResponseDto> {
    return this.client.riskRadar(filters);
  }
}
