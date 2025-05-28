import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TsysFiuFile } from '../entities';

@Injectable()
export class TsysFiuFileRepository extends Repository<TsysFiuFile> {
  public constructor(@InjectDataSource('paya') dataSource: DataSource) {
    super(TsysFiuFile, dataSource.createEntityManager());
  }
}
