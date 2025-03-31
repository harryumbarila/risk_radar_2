import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsOwnerEntity } from '../entities';

@Injectable()
export class LeadsOwnerRepository extends Repository<LeadsOwnerEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsOwnerEntity, dataSource.createEntityManager());
  }
}
