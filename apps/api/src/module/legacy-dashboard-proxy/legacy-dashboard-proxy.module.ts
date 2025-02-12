import { Module } from '@nestjs/common';
import { LegacyDashboardProxyClient } from './legacy-dashboard-proxy.client';
import { LegacyDashboardProxyController } from './legacy-dashboard-proxy.controller';

@Module({
  providers: [LegacyDashboardProxyClient],
  controllers: [LegacyDashboardProxyController],
})
export class LegacyDashboardProxyModule {}
