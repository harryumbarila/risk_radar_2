import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsEntity } from '../entities';

@Injectable()
export class LeadsRepository extends Repository<LeadsEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsEntity, dataSource.createEntityManager());
  }
}
