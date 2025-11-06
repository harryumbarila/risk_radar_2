import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { subWeeks, startOfDay, endOfDay } from 'date-fns';

import { AutoHoldExceptionSummary } from '../entities';

@Injectable()
export class AutoHoldExceptionSummaryRepository extends Repository<AutoHoldExceptionSummary> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(AutoHoldExceptionSummary, dataSource.createEntityManager());
  }

  async findExceptionsWithPagination(
    startDate?: Date | string,
    endDate?: Date | string,
    page = 1,
    limit = 10
  ) {
    const today = new Date();
    const effectiveStart = startDate
      ? startOfDay(new Date(startDate))
      : startOfDay(subWeeks(today, 1));
    const effectiveEnd = endDate
      ? endOfDay(new Date(endDate))
      : endOfDay(today);

    const skip = (page - 1) * limit;

    const query = this.createQueryBuilder('a')
      .leftJoinAndSelect('a.source', 's')
      .where('a.createdAt BETWEEN :start AND :end', {
        start: effectiveStart,
        end: effectiveEnd,
      })
      .orderBy('a.createdAt', 'ASC')
      .addOrderBy('s.definition', 'ASC')
      .addOrderBy('a.dataSourceIdentifier', 'ASC')
      .addOrderBy('a.merchantId', 'ASC')
      .skip(skip)
      .take(limit);

    const [results, total] = await query.getManyAndCount();

    const mapped = results.map((a) => ({
      id: a.id,
      source: a.source ?? null,
      dataSourceIdentifier: a.dataSourceIdentifier,
      merchantId: a.merchantId,
      NXDY: a.isNextDay ? 'Yes' : null,
      AH01: a.isAutoHold01 ? 'Yes' : null,
      AH02: a.isAutoHold02 ? 'Yes' : null,
      AH03: a.isAutoHold03 ? 'Yes' : null,
      AH04: a.isAutoHold04 ? 'Yes' : null,
      AH05: a.isAutoHold05 ? 'Yes' : null,
      AH06: a.isAutoHold06 ? 'Yes' : null,
      AH07: a.isAutoHold07 ? 'Yes' : null,
      AH10: a.isAutoHold10 ? 'Yes' : null,
      AH11: a.isAutoHold11 ? 'Yes' : null,
      AH12: a.isAutoHold12 ? 'Yes' : null,
      AH14: a.isAutoHold14 ? 'Yes' : null,
      AH15: a.isAutoHold15 ? 'Yes' : null,
      AH16: a.isAutoHold16 ? 'Yes' : null,
      createdAt: a.createdAt,
    }));

    return {
      data: mapped,
      count: mapped.length,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }
}
