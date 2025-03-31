import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { CLXReportingSearchPaymentMethodLookup } from '../entities/clx-reporting-search-payment-method-lookup.entity';

@Injectable()
export class CLXReportingSearchPaymentMethodLookupRepository extends Repository<CLXReportingSearchPaymentMethodLookup> {
  public constructor(
    @InjectDataSource('data-warehouse') dataSource: DataSource
  ) {
    super(
      CLXReportingSearchPaymentMethodLookup,
      dataSource.createEntityManager()
    );
  }
}
