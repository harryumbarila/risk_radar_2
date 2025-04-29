import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { MssqlParameter, Repository } from 'typeorm';

import { LeadEntity } from '../entities';

@Injectable()
export class LeadRepository extends Repository<LeadEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(LeadEntity, dataSource.createEntityManager());
  }

  /**
   * Find lead by merchant ID with proper varchar casting
   */
  public async findByMerchantId(
    merchantId: string,
    isArchived = false
  ): Promise<LeadEntity | null> {
    return this.createQueryBuilder('lead')
      .where('lead.irisMId = :mid', {
        mid: new MssqlParameter(merchantId, 'varchar', 16),
      })
      .andWhere('lead.isArchived = :isArchived', { isArchived })
      .getOne();
  }
}
