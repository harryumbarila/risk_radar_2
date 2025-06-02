import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

import { GlobalModule } from '@/api/module/global/global.module';
import { JwtAuthGuard } from '@/api/shared/auth/guard/jwt-auth.guard';
import { loggerConfig } from '@/api/shared/config/logger.config';
import { DbTypeORMModule as ConnectorDbTypeOrmModule } from '@/connector-db/connection/nestjs-module';
import { DbTypeORMModule as CrescentViewDbTypeOrmModule } from '@/crescent-view-db/connection/nestjs-module';
import { DbTypeORMModule as DataWarehouseDbTypeOrmModule } from '@/data-warehouse-db/connection/nestjs-module';
import { DbTypeORMModule as DsmDbTypeOrmModule } from '@/dsm-db/connection/nestjs-module';
import { DbTypeORMModule as EzEnrollDbTypeOrmModule } from '@/ez-enroll-db/connection/nestjs-module';
import { DbTypeORMModule as EzEnrollPccTypeOrmModule } from '@/ez-enroll-pcc-db/connection/nestjs-module';
import { DbTypeORMModule as FinanceDbTypeOrmModule } from '@/finance-db/connection/nestjs-module';
import { DbTypeORMModule as IrisDbTypeOrmModule } from '@/iris-db/connection/nestjs-module';
import { DbTypeORMModule as PayaTypeOrmModule } from '@/paya-db/connection/nestjs-module';
import { DbTypeORMModule as SnapPccTypeOrmModule } from '@/snap-pcc-db/connection/nestjs-module';

import { AppController } from './app.controller';
import { ExampleMultiDbModule } from './module/example-multi-db/example-multi-db.module';
import { IrisProxyModule } from './module/iris-proxy/iris-proxy.module';
import { LegacyDashboardProxyModule } from './module/legacy-dashboard-proxy/legacy-dashboard-proxy.module';
import { PartnerBanksModule } from './module/partner-banks/partner-banks.module';
import { PayaModule } from './module/paya/paya.module';
import { RiskRadarModule } from './module/risk-radar/risk-radar.module';
import { AWSModule } from './shared/aws/aws.module';
import { rootConfig } from './shared/config/root.config';
import { EmailModule } from './shared/email/email.module';

// Load dotenv only in development mode (DBs)
// eslint-disable-next-line no-restricted-properties
if (process.env.NODE_ENV !== 'production') {
  import('dotenv/config');
}

@Module({
  imports: [
    ConfigModule.forRoot(rootConfig),
    ScheduleModule.forRoot(),
    DataWarehouseDbTypeOrmModule,
    ConnectorDbTypeOrmModule,
    CrescentViewDbTypeOrmModule,
    FinanceDbTypeOrmModule,
    IrisDbTypeOrmModule,
    DsmDbTypeOrmModule,
    EzEnrollDbTypeOrmModule,
    EzEnrollPccTypeOrmModule,
    SnapPccTypeOrmModule,
    PayaTypeOrmModule,
    LoggerModule.forRoot(loggerConfig),
    GlobalModule,
    LegacyDashboardProxyModule,
    IrisProxyModule,
    ExampleMultiDbModule,
    RiskRadarModule,
    AWSModule,
    EmailModule,
    PartnerBanksModule,
    PayaModule,
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
