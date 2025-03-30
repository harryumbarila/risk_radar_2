import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsServicesEntity } from '../entities';

@Injectable()
export class LeadsServicesRepository extends Repository<LeadsServicesEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsServicesEntity, dataSource.createEntityManager());
  }
} 