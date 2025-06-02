import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '@/api/shared/aws/aws.module';
import { TsysFiuFile, TsysFiuFileVariant } from '@/paya-db/entities';
import {
  TsysFiuFileRepository,
  TsysFiuFileVariantRepository,
} from '@/paya-db/repositories';

import { PayaController } from './paya.controller';
import { PayaService } from './services/tsys-fiu/tsys-fiu.service';

@Module({
  imports: [
    AWSModule,
    FastifyMulterModule,
    TypeOrmModule.forFeature([TsysFiuFileVariant, TsysFiuFile], 'paya'),
  ],
  controllers: [PayaController],
  providers: [TsysFiuFileRepository, TsysFiuFileVariantRepository, PayaService],
  exports: [PayaService],
})
export class PayaModule {}
