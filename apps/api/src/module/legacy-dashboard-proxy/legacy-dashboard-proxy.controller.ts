import { Controller, Get, Post } from '@nestjs/common';
import { LegacyDashboardProxyClient } from './legacy-dashboard-proxy.client';
import { KpiStatisticsResponseDto } from './kpi-statistics.response.dto';
import { RiskRadarResponseDto } from './risk-radar.response.dto';

@Controller('/v1/legacy_dashboard_proxy')
export class LegacyDashboardProxyController {
  constructor(private readonly client: LegacyDashboardProxyClient) {}

  @Get('kpi')
  getKPI(): KpiStatisticsResponseDto {
    return this.client.getKPI();
  }

  @Post('risk_radar')
  riskRadar(): RiskRadarResponseDto[] {
    return this.client.riskRadar();
  }
}
