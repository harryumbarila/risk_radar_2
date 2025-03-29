import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsBusinessInformationEntity } from '../entities/lead-business-information.entity';

@Injectable()
export class LeadsBusinessInformationRepository extends Repository<LeadsBusinessInformationEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsBusinessInformationEntity, dataSource.createEntityManager());
  }
}
