import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { CLXReportingSearch } from '../entities';

@Injectable()
export class ClxReportingRepository extends Repository<CLXReportingSearch> {
  public constructor(
    @InjectDataSource('data-warehouse') dataSource: DataSource
  ) {
    super(CLXReportingSearch, dataSource.createEntityManager());
  }

  public async getReportingForCard(
    first6Digits: string,
    last4Digits: string
  ): Promise<CLXReportingSearch[]> {
    return this.createQueryBuilder('clx')
      .where('clx.accountNumberF6 = :first6Digits', {
        first6Digits,
      })
      .andWhere('clx.accountNumberL4 = :last4Digits', {
        last4Digits,
      })
      .getMany();
  }
}
