import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { TSYSDivertFlagUpdateEntity } from '../entities';

export class TSYSDivertFlagUpdateRepository extends Repository<TSYSDivertFlagUpdateEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(TSYSDivertFlagUpdateEntity, dataSource.createEntityManager());
  }

  public async findValidByMid(
    mid: string
  ): Promise<TSYSDivertFlagUpdateEntity | null> {
    return this.createQueryBuilder('divert')
      .where('divert.sMID = :mid', { mid })
      .andWhere('divert.bHidden = 0')
      .andWhere('divert.dtRemove IS NULL')
      .getOne();
  }
}
