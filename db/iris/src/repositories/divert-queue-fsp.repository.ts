import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DivertQueueFSPEntity } from '../entities';

export class DivertQueueFSPRepository extends Repository<DivertQueueFSPEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DivertQueueFSPEntity, dataSource.createEntityManager());
  }
}
