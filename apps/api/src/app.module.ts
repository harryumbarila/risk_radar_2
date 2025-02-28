import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { IrisProxyModule } from './module/iris-proxy/iris-proxy.module';
import { LegacyDashboardProxyModule } from './module/legacy-dashboard-proxy/legacy-dashboard-proxy.module';
import { rootConfig } from './shared/config/root.config';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfig),
    LegacyDashboardProxyModule,
    IrisProxyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
