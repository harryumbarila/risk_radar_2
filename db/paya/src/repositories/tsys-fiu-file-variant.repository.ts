import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TsysFiuFileVariant } from '../entities';

@Injectable()
export class TsysFiuFileVariantRepository extends Repository<TsysFiuFileVariant> {
  public constructor(@InjectDataSource('paya') dataSource: DataSource) {
    super(TsysFiuFileVariant, dataSource.createEntityManager());
  }
}
