import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { SourceEntity } from '../entities';

@Injectable()
export class SourceRepository extends Repository<SourceEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(SourceEntity, dataSource.createEntityManager());
  }
}
