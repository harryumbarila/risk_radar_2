import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { PayaMonthlyResidualMetadata } from '../entities';

@Injectable()
export class PayaMonthlyResidualMetadataRepository extends Repository<PayaMonthlyResidualMetadata> {
  public constructor(@InjectDataSource('paya') dataSource: DataSource) {
    super(PayaMonthlyResidualMetadata, dataSource.createEntityManager());
  }
}
