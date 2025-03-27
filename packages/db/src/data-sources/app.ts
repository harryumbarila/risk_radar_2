import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from '../config/config';

export const database1Config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.pass,
  autoLoadEntities: true,
  logging: ['error'],
  // options: { encrypt: process.env.DB_SSL === 'true' },
};
