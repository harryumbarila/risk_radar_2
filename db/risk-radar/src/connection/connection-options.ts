import type { DataSourceOptions } from 'typeorm';

import { config } from '../config/db';
import * as entities from '../entities';

export const connectionOptions: DataSourceOptions = {
  type: 'mssql',
  url: config.db.connectionString,
  entities,
  options: {
    encrypt: config.db.ssl,
    trustServerCertificate: true,
    disableAsciiToUnicodeParamConversion: true,
    appName: 'Denali',
  },
};
