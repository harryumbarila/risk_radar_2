import { Module } from '@nestjs/common';

import { IrisProxyController } from './iris-proxy.controller';
import { IrisClient } from './webservice/iris.client';

@Module({
  providers: [IrisClient],
  controllers: [IrisProxyController],
})
export class IrisProxyModule {}
