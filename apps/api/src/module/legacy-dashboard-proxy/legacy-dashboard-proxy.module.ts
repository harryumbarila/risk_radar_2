import { Module } from '@nestjs/common';

import { LegacyDashboardProxyController } from './legacy-dashboard-proxy.controller';
import { LegacyDashboardProxyClient } from './webservice/legacy-dashboard-proxy.client';

@Module({
  providers: [LegacyDashboardProxyClient],
  controllers: [LegacyDashboardProxyController],
})
export class LegacyDashboardProxyModule {}
