import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DivertQueueFSPEntity } from '../entities';

export class DivertQueueFSPRepository extends Repository<DivertQueueFSPEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(DivertQueueFSPEntity, dataSource.createEntityManager());
  }

  public async findMaxDivertIdByMid(mid: string): Promise<number | null> {
    const result = await this.createQueryBuilder('divert')
      .select('MAX(divert.id)', 'maxId')
      .where('divert.merchantId = :mid', { mid })
      .andWhere('divert.divertFlag = :flag', { flag: true })
      .getRawOne<{ maxId?: number }>();

    return result?.maxId ?? null;
  }
}
