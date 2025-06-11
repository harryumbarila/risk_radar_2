import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '@/api/shared/aws/aws.module';
import { EmailModule } from '@/api/shared/email/email.module';
import {
  CommissionFile,
  CommissionFileVariant,
  PayaMonthlyResidualMetadata,
  TsysFiuFile,
  TsysFiuFileVariant,
} from '@/paya-db/entities';
import {
  CommissionFileRepository,
  CommissionFileVariantRepository,
  PayaMonthlyResidualMetadataRepository,
  TsysFiuFileRepository,
  TsysFiuFileVariantRepository,
} from '@/paya-db/repositories';

import { PayaController } from './paya.controller';
import { CommissionService } from './services/commission/commission.service';
import { PayaService } from './services/tsys-fiu/tsys-fiu.service';

@Module({
  imports: [
    AWSModule,
    EmailModule,
    FastifyMulterModule,
    TypeOrmModule.forFeature(
      [
        TsysFiuFileVariant,
        TsysFiuFile,
        PayaMonthlyResidualMetadata,
        CommissionFile,
        CommissionFileVariant,
      ],
      'paya'
    ),
  ],
  controllers: [PayaController],
  providers: [
    TsysFiuFileRepository,
    TsysFiuFileVariantRepository,
    PayaMonthlyResidualMetadataRepository,
    CommissionFileRepository,
    CommissionFileVariantRepository,
    PayaService,
    CommissionService,
  ],
  exports: [PayaService, CommissionService],
})
export class PayaModule {}
