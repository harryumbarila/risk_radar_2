import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CommissionFile } from '../entities';

@Injectable()
export class CommissionFileRepository extends Repository<CommissionFile> {
  public constructor(@InjectDataSource('paya') dataSource: DataSource) {
    super(CommissionFile, dataSource.createEntityManager());
  }
}
