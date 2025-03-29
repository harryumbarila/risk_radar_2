import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { ChargebacksAndRetrievalReasonCodeLookupEntity } from '../entities/chargebacks-and-retrieval-reason-code-lookup.entity';

@Injectable()
export class ChargebacksAndRetrievalReasonCodeLookupRepository extends Repository<ChargebacksAndRetrievalReasonCodeLookupEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(
      ChargebacksAndRetrievalReasonCodeLookupEntity,
      dataSource.createEntityManager()
    );
  }
}
