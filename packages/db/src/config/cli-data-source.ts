import path from 'path';
import { DataSource } from 'typeorm';

import * as entities from '../entities';
import { config } from './config';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.pass,
  database: config.db.name,
  entities,
  migrations: [`${path.resolve(__dirname, '..', '..', 'migrations')}/*.js`],
  options: {
    encrypt: config.db.ssl,
    trustServerCertificate: true,
  },
});
