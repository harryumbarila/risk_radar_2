import { Module } from '@nestjs/common';
import { IrisClient } from './webservice/iris.client';
import { IrisProxyController } from './iris-proxy.controller';

@Module({
  providers: [IrisClient],
  controllers: [IrisProxyController],
})
export class IrisProxyModule {}
