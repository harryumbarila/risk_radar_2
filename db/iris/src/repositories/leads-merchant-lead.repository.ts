import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsMerchantLead } from '../entities';

@Injectable()
export class LeadsMerchantLeadRepository extends Repository<LeadsMerchantLead> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsMerchantLead, dataSource.createEntityManager());
  }
}
