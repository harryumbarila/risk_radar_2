import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { DSMSalesConfirmation } from '../entities';

export class DSMSalesConfirmationRepository extends Repository<DSMSalesConfirmation> {
  public constructor(@InjectDataSource('ez-enroll') dataSource: DataSource) {
    super(DSMSalesConfirmation, dataSource.createEntityManager());
  }
}
