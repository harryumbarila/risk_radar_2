import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DivertQueueEntity } from '../entities';

export class DivertQueueRepository extends Repository<DivertQueueEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DivertQueueEntity, dataSource.createEntityManager());
  }
}
