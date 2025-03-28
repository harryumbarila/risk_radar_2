import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { GlobalModule } from '@/api/module/global/global.module';
import { JwtAuthGuard } from '@/api/shared/auth/guard/jwt-auth.guard';
import { DbTypeORMModule as CrescentViewDbTypeOrmModule } from '@/crescent-view-db/connection/nestjs-module';
import { DbTypeORMModule as FinanceDbTypeOrmModule } from '@/finance-db/connection/nestjs-module';

import { AppController } from './app.controller';
import { ExampleMultiDbModule } from './module/example-multi-db/example-multi-db.module';
import { IrisProxyModule } from './module/iris-proxy/iris-proxy.module';
import { LegacyDashboardProxyModule } from './module/legacy-dashboard-proxy/legacy-dashboard-proxy.module';
import { rootConfig } from './shared/config/root.config';

// @Entity()
// export class CrescentViewEntity {
//   @Column({ type: 'varchar' })
//   public name: string;

//   @Column({ type: 'varchar' })
//   public isActive: boolean;
// }

@Module({
  imports: [
    ConfigModule.forRoot(rootConfig),
    CrescentViewDbTypeOrmModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: 'postgresql://postgres:crescent@localhost:5433/crescent-view',
    //   entities: [CrescentViewEntity],
    // }),
    FinanceDbTypeOrmModule,
    GlobalModule,
    LegacyDashboardProxyModule,
    IrisProxyModule,
    ExampleMultiDbModule,
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
