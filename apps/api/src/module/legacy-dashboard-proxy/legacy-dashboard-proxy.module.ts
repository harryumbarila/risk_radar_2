import { Module } from '@nestjs/common';

import { LegacyDashboardProxyController } from './legacy-dashboard-proxy.controller';
import { LegacyDashboardProxyClient } from './webservice/legacy-dashboard-proxy.client';
import { RiskRadarExceptionStatusRepository } from '@/finance-db/repositories';
import { RiskRadarExceptionStatusEntity } from '@/finance-db/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RiskRadarExceptionStatusEntity], 'finance')],
  providers: [LegacyDashboardProxyClient, RiskRadarExceptionStatusRepository],
  controllers: [LegacyDashboardProxyController],
})
export class LegacyDashboardProxyModule {}
