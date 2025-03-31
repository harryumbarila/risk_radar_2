import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { CLXReportingSearchAVSResponseLookup } from '../entities/clx-reporting-search-avs-response-lookup.entity';

@Injectable()
export class CLXReportingSearchAVSResponseLookupRepository extends Repository<CLXReportingSearchAVSResponseLookup> {
  public constructor(
    @InjectDataSource('data-warehouse') dataSource: DataSource
  ) {
    super(
      CLXReportingSearchAVSResponseLookup,
      dataSource.createEntityManager()
    );
  }
}
