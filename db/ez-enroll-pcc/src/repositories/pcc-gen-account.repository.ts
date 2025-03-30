import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { EZEnrollPccGenAccount } from '../entities';

export class EZEnrollPccGenAccountRepository extends Repository<EZEnrollPccGenAccount> {
  public constructor(@InjectDataSource('ez-enroll') dataSource: DataSource) {
    super(EZEnrollPccGenAccount, dataSource.createEntityManager());
  }
}
