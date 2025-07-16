import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { NetSettlementTransWorkSheet } from '../entities';

@Injectable()
export class NetSettlementTransWorkSheetRepository extends Repository<NetSettlementTransWorkSheet> {
  public constructor(
    @InjectDataSource('crescent-view') dataSource: DataSource
  ) {
    super(NetSettlementTransWorkSheet, dataSource.createEntityManager());
  }
}
