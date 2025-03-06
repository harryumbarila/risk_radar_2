import { Module } from '@nestjs/common';

import { IrisProxyController } from './iris-proxy.controller';
import { IrisProxyService } from './iris-proxy.service';
import { IrisClient } from './webservice/iris.client';

@Module({
  providers: [IrisClient, IrisProxyService],
  controllers: [IrisProxyController],
})
export class IrisProxyModule {}
