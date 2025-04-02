import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadEntity } from '../entities';

@Injectable()
export class LeadRepository extends Repository<LeadEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadEntity, dataSource.createEntityManager());
  }
}
