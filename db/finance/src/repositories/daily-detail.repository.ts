import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Between, MoreThan, Not, Repository } from 'typeorm';

import { DailyDetail } from '../entities/daily-detail.entity';

@Injectable()
export class DailyDetailRepository extends Repository<DailyDetail> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DailyDetail, dataSource.createEntityManager());
  }

  public async findDeclinedAuthTransactions(
    mid: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyDetail[]> {
    return this.find({
      where: [
        {
          mid,
          transactionDate: Between(startDate, endDate),
          cardNumber: Not(''),
          gt2AuthDeclOnDiffCardPoints: MoreThan(0),
        },
        {
          mid,
          transactionDate: Between(startDate, endDate),
          cardNumber: Not(''),
          gt1AuthDeclOnSameCardPoints: MoreThan(0),
        },
        {
          mid,
          transactionDate: Between(startDate, endDate),
          cardNumber: Not(''),
          i1AuthDeclOnSpecificReasonPoints: MoreThan(0),
        },
      ],
    });
  }
}
