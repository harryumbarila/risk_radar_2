import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsUnderwritingEntity } from '../entities';

@Injectable()
export class LeadsUnderwritingRepository extends Repository<LeadsUnderwritingEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsUnderwritingEntity, dataSource.createEntityManager());
  }
} 