import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsBusinessInformation } from '../entities/lead-business-information.entity';

@Injectable()
export class LeadsBusinessInformationRepository extends Repository<LeadsBusinessInformation> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(LeadsBusinessInformation, dataSource.createEntityManager());
  }
}
