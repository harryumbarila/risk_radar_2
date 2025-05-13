import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { MSPMerchantMonthlyBilling } from '../entities';

@Injectable()
export class MSPMerchantMonthlyBillingRepository extends Repository<MSPMerchantMonthlyBilling> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(MSPMerchantMonthlyBilling, dataSource.createEntityManager());
  }
}
