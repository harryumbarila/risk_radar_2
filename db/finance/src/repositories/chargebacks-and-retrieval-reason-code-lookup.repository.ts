import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChargebacksAndRetrievalReasonCodeLookupEntity } from '../entities/chargebacks-and-retrieval-reason-code-lookup.entity';

@Injectable()
export class ChargebacksAndRetrievalReasonCodeLookupRepository extends Repository<ChargebacksAndRetrievalReasonCodeLookupEntity> {
  constructor(dataSource: DataSource) {
    super(
      ChargebacksAndRetrievalReasonCodeLookupEntity,
      dataSource.createEntityManager()
    );
  }
}
