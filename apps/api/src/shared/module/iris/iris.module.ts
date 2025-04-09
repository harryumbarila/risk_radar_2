import { Module } from '@nestjs/common';

import { IrisClient } from './iris.client';

@Module({
  providers: [IrisClient],
  exports: [IrisClient],
})
export class IrisModule {}
