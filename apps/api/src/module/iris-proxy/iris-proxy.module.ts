import { Module } from '@nestjs/common';

import { IrisModule } from '@/api/shared/module/iris/iris.module';

import { IrisProxyController } from './iris-proxy.controller';
import { IrisProxyService } from './iris-proxy.service';

@Module({
  imports: [IrisModule],
  providers: [IrisProxyService],
  controllers: [IrisProxyController],
})
export class IrisProxyModule {}
