import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '../config/db';
import * as entities from '../entities';

export const DbTypeORMModule = TypeOrmModule.forRoot({
  name: 'data-warehouse',
  type: 'mssql',
  url: config.db.connectionString,
  entities,
  options: {
    encrypt: config.db.ssl,
    trustServerCertificate: true,
    disableAsciiToUnicodeParamConversion: true,
    appName: 'Denali',
  },
});
