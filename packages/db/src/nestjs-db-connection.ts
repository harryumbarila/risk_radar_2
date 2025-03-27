import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

import { config } from './config/config';

export const nestjsDatabaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.pass,
  database: config.db.name,
  autoLoadEntities: true,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: ['error'],
  options: { encrypt: process.env.DB_SSL === 'true' },
};
