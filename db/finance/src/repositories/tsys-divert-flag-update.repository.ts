import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { TSYSDivertFlagUpdateEntity } from '../entities';

export class TSYSDivertFlagUpdateRepository extends Repository<TSYSDivertFlagUpdateEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(TSYSDivertFlagUpdateEntity, dataSource.createEntityManager());
  }
}
