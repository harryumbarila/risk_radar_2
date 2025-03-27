import { ExampleEntity } from '@denali/db';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class ExampleEntityRepository extends Repository<ExampleEntity> {
  public constructor(dataSource: DataSource) {
    super(ExampleEntity, dataSource.createEntityManager());
  }
}
