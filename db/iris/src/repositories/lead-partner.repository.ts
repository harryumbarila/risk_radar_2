import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsPartnerEntity } from '../entities';

@Injectable()
export class LeadsPartnerRepository extends Repository<LeadsPartnerEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsPartnerEntity, dataSource.createEntityManager());
  }
}
