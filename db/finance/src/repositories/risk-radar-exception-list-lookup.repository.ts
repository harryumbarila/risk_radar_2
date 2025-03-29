import { Injectable } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarExceptionListLookupEntity } from '../entities/risk-radar-exception-list-lookup.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class RiskRadarExceptionListLookupRepository extends Repository<RiskRadarExceptionListLookupEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarExceptionListLookupEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarExceptionList.StoredProcedure.sql
   */
  public async getExceptionListWithSelection(selectedIds: number[]): Promise<
    Array<{
      id: number;
      description: string;
      isSelected: boolean;
    }>
  > {
    return this.createQueryBuilder('lookup')
      .select([
        'lookup.id',
        'lookup.description',
        'CASE WHEN selected.id IS NULL THEN 0 ELSE 1 END as isSelected',
      ])
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('id')
            .from(RiskRadarExceptionListLookupEntity, 'temp')
            .where('temp.id IN (:...ids)', { ids: selectedIds });
        },
        'selected',
        'selected.id = lookup.id'
      )
      .where('lookup.isHidden = :isHidden', { isHidden: false })
      .orderBy('lookup.description', 'ASC')
      .getRawMany();
  }
}
