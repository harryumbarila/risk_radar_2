import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { GlobalModule } from '@/api/module/global/global.module';
import { JwtAuthGuard } from '@/api/shared/auth/guard/jwt-auth.guard';

import { AppController } from './app.controller';
import { IrisProxyModule } from './module/iris-proxy/iris-proxy.module';
import { LegacyDashboardProxyModule } from './module/legacy-dashboard-proxy/legacy-dashboard-proxy.module';
import { rootConfig } from './shared/config/root.config';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfig),
    // TypeOrmModule.forRoot(nestjsDatabaseConfig),
    GlobalModule,
    LegacyDashboardProxyModule,
    IrisProxyModule,
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
