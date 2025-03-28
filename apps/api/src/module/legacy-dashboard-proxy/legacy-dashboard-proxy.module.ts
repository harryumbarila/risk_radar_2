import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RiskRadarExceptionStatusEntity } from '@/finance-db/entities';
import { RiskRadarExceptionStatusRepository } from '@/finance-db/repositories';

import { LegacyDashboardProxyController } from './legacy-dashboard-proxy.controller';
import { LegacyDashboardProxyClient } from './webservice/legacy-dashboard-proxy.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([RiskRadarExceptionStatusEntity], 'finance'),
  ],
  providers: [LegacyDashboardProxyClient, RiskRadarExceptionStatusRepository],
  controllers: [LegacyDashboardProxyController],
})
export class LegacyDashboardProxyModule {}
