import type { DataSourceOptions } from 'typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

import { config } from '../config/db';
import * as entities from '../entities';

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  url: config.db.connectionString,
  entities,
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    ssl: {
      rejectUnauthorized: config.db.ssl,
    },
  },
};
