import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { GroupEntity } from '../entities/group.entity';

@Injectable()
export class GroupRepository extends Repository<GroupEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(GroupEntity, dataSource.createEntityManager());
  }
}
