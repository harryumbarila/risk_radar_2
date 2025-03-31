import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DailyDetail } from '../entities/daily-detail.entity';

@Injectable()
export class DailyDetailRepository extends Repository<DailyDetail> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DailyDetail, dataSource.createEntityManager());
  }
}
