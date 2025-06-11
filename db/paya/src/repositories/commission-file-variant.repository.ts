import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CommissionFileVariant } from '../entities';

@Injectable()
export class CommissionFileVariantRepository extends Repository<CommissionFileVariant> {
  public constructor(@InjectDataSource('paya') dataSource: DataSource) {
    super(CommissionFileVariant, dataSource.createEntityManager());
  }
}
