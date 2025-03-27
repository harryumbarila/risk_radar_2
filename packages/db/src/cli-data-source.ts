import { DataSource } from 'typeorm';

import { config } from './config/config';
import * as entities from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.pass,
  database: config.db.name,
  entities,
  // options: {
  //   encrypt: config.db.ssl,
  //   trustServerCertificate: true,
  // },
});
// eslint-disable-next-line import/no-default-export
// export default AppDataSource;
