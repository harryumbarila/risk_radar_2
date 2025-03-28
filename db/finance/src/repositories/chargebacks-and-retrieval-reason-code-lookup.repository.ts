import { Injectable } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { ChargebacksAndRetrievalReasonCodeLookupEntity } from '../entities/chargebacks-and-retrieval-reason-code-lookup.entity';

@Injectable()
export class ChargebacksAndRetrievalReasonCodeLookupRepository extends Repository<ChargebacksAndRetrievalReasonCodeLookupEntity> {
  public constructor(dataSource: DataSource) {
    super(
      ChargebacksAndRetrievalReasonCodeLookupEntity,
      dataSource.createEntityManager()
    );
  }
}
