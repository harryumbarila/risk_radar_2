import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { MerchantMemoUpload } from '../entities';

export class MerchantMemoUploadRepository extends Repository<MerchantMemoUpload> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(MerchantMemoUpload, dataSource.createEntityManager());
  }
}
