import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { config } from '../config/config';
import * as entities from '../entities';

export const database1Config: DataSourceOptions = {
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.pass,
  entities,
  migrations: ['migrations/*.js'],
};

export const CliDataSource = new DataSource(database1Config);
