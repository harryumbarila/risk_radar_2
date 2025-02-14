import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LegacyDashboardProxyModule } from './module/legacy-dashboard-proxy/legacy-dashboard-proxy.module';
import { ConfigModule } from '@nestjs/config';
import { rootConfig } from './shared/config/root.config';

@Module({
  imports: [ConfigModule.forRoot(rootConfig), LegacyDashboardProxyModule],
  controllers: [AppController],
})
export class AppModule {}
