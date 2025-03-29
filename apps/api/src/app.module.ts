import { logger } from '@denali/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { GlobalModule } from '@/api/module/global/global.module';
import { JwtAuthGuard } from '@/api/shared/auth/guard/jwt-auth.guard';
import { DbTypeORMModule as ConnectorDbTypeOrmModule } from '@/connector-db/connection/nestjs-module';
import { DbTypeORMModule as CrescentViewDbTypeOrmModule } from '@/crescent-view-db/connection/nestjs-module';
import { DbTypeORMModule as DataWarehouseDbTypeOrmModule } from '@/data-warehouse-db/connection/nestjs-module';
import { DbTypeORMModule as FinanceDbTypeOrmModule } from '@/finance-db/connection/nestjs-module';
import { DbTypeORMModule as IrisDbTypeOrmModule } from '@/iris-db/connection/nestjs-module';

import { AppController } from './app.controller';
import { ExampleMultiDbModule } from './module/example-multi-db/example-multi-db.module';
import { IrisProxyModule } from './module/iris-proxy/iris-proxy.module';
import { LegacyDashboardProxyModule } from './module/legacy-dashboard-proxy/legacy-dashboard-proxy.module';
import { RiskRadarModule } from './module/risk-radar/risk-radar.module';
import { rootConfig } from './shared/config/root.config';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfig),
    IrisDbTypeOrmModule,
    DataWarehouseDbTypeOrmModule,
    ConnectorDbTypeOrmModule,
    CrescentViewDbTypeOrmModule,
    FinanceDbTypeOrmModule,
    LoggerModule.forRoot({
      pinoHttp: {
        logger,
      },
    }),
    GlobalModule,
    LegacyDashboardProxyModule,
    IrisProxyModule,
    ExampleMultiDbModule,
    RiskRadarModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
