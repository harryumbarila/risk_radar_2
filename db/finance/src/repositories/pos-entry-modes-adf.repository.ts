import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { POSEntryModesADF } from '../entities/pos-entry-modes-adf.entity';

@Injectable()
export class POSEntryModesADFRepository extends Repository<POSEntryModesADF> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(POSEntryModesADF, dataSource.createEntityManager());
  }
}
