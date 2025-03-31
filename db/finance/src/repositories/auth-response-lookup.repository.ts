import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { AuthResponseLookup } from '../entities/auth-response-lookup.entity';

@Injectable()
export class AuthResponseLookupRepository extends Repository<AuthResponseLookup> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(AuthResponseLookup, dataSource.createEntityManager());
  }
}
