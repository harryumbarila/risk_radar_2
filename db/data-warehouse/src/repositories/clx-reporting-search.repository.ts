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
      .where('clx.accountNumber LIKE :sCardNumF6', {
        sCardNumF6: `${first6Digits}%`,
      })
      .andWhere('clx.accountNumber LIKE :sCardNumL4', {
        sCardNumL4: `%${last4Digits}`,
      })
      .getMany();
  }
}
