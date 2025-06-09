import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '@/api/shared/aws/aws.module';
import { TsysFiuFile, TsysFiuFileVariant, PayaMonthlyResidualMetadata } from '@/paya-db/entities';
import {
  TsysFiuFileRepository,
  TsysFiuFileVariantRepository,
  PayaMonthlyResidualMetadataRepository,
} from '@/paya-db/repositories';

import { PayaController } from './paya.controller';
import { CommissionService } from './services/commission/commission.service';
import { PayaService } from './services/tsys-fiu/tsys-fiu.service';

@Module({
  imports: [
    AWSModule,
    FastifyMulterModule,
    TypeOrmModule.forFeature([TsysFiuFileVariant, TsysFiuFile, PayaMonthlyResidualMetadata], 'paya'),
  ],
  controllers: [PayaController],
  providers: [
    TsysFiuFileRepository,
    TsysFiuFileVariantRepository,
    PayaMonthlyResidualMetadataRepository,
    PayaService,
    CommissionService
  ],
  exports: [PayaService, CommissionService],
})
export class PayaModule {}
