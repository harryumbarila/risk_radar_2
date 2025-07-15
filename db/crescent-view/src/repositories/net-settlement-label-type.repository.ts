import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { NetSettlementLabelType } from '../entities';

@Injectable()
export class NetSettlementLabelTypeRepository extends Repository<NetSettlementLabelType> {
  public constructor(
    @InjectDataSource('crescent-view') dataSource: DataSource
  ) {
    super(NetSettlementLabelType, dataSource.createEntityManager());
  }
}
