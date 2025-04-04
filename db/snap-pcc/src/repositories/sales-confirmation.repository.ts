import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { SnapPccSalesConfirmation } from '../entities';

export class SnapPccSalesConfirmationRepository extends Repository<SnapPccSalesConfirmation> {
  public constructor(@InjectDataSource('snap-pcc') dataSource: DataSource) {
    super(SnapPccSalesConfirmation, dataSource.createEntityManager());
  }
}
