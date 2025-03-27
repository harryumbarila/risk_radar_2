import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ExampleEntity } from '@/db/entities';

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class ExampleEntityRepository extends Repository<ExampleEntity> {
  public constructor(dataSource: DataSource) {
    super(ExampleEntity, dataSource.createEntityManager());
  }
}
