import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DFT256Batch } from '../entities/dft-256-batch';

@Injectable()
export class DFT256BatchRepository extends Repository<DFT256Batch> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(DFT256Batch, dataSource.createEntityManager());
  }
}
