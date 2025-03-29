import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { CLXReportingSearch } from '../entities';

@Injectable()
export class ClxReportingRepository extends Repository<CLXReportingSearch> {
  public constructor(
    @InjectDataSource('data-warehouse') dataSource: DataSource
  ) {
    super(CLXReportingSearch, dataSource.createEntityManager());
  }
}
