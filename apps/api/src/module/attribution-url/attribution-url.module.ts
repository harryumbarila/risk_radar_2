import { Module } from '@nestjs/common';

import { AttributionUrlController } from './attribution-url.controller';
import { AttributionUrlService } from './attribution-url.service';

@Module({
  controllers: [AttributionUrlController],
  providers: [AttributionUrlService],
  exports: [AttributionUrlService],
})
export class AttributionUrlModule {}
