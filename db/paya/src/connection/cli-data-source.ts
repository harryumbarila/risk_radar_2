import path from 'path';
import { DataSource } from 'typeorm';

import { connectionOptions } from './connection-options';

export const CliDataSource = new DataSource({
  ...connectionOptions,
  migrations: [`${path.resolve(__dirname, '..', 'migrations')}/*.ts`],
});
