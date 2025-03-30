import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { LeadsFinancialProfileEntity } from '../entities';

@Injectable()
export class LeadsFinancialProfileRepository extends Repository<LeadsFinancialProfileEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadsFinancialProfileEntity, dataSource.createEntityManager());
  }
} 