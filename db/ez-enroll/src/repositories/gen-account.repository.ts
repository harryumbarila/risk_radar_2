import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { EZEnrollGenAccount } from '../entities';

export class EZEnrollGenAccountRepository extends Repository<EZEnrollGenAccount> {
  public constructor(@InjectDataSource('ez-enroll') dataSource: DataSource) {
    super(EZEnrollGenAccount, dataSource.createEntityManager());
  }
}
