import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { IrisModule } from '@/api/shared/module/iris/iris.module';

import { IrisProxyController } from './iris-proxy.controller';
import { IrisProxyService } from './iris-proxy.service';
import { AssignedUsersConsumer } from '@/api/module/iris-proxy/consumer/assigned-user.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: 'assigned-users' }), IrisModule],
  providers: [IrisProxyService, AssignedUsersConsumer],
  controllers: [IrisProxyController],
})
export class IrisProxyModule {}
