import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { NetSettlementMidLabel } from '../entities';

@Injectable()
export class NetSettlementMidLabelRepository extends Repository<NetSettlementMidLabel> {
  public constructor(
    @InjectDataSource('crescent-view') dataSource: DataSource
  ) {
    super(NetSettlementMidLabel, dataSource.createEntityManager());
  }
}
