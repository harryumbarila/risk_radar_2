import path from 'path';
import type { DataSourceOptions, LoggerOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { logger } from '@/logger/index';

import * as entities from './entities';

export type DBConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dropSchema?: boolean;
  synchronize?: boolean;
  logging?: LoggerOptions;
  maxQueryExecutionTime?: number;
  connectTimeoutMS?: number;
};

let connection: DataSource;

export const connectToDB = async (config: DBConfig): Promise<DataSource> => {
  if (!connection) {
    const options: DataSourceOptions = {
      synchronize: false,
      logging: config.logging || true,
      maxQueryExecutionTime: config.maxQueryExecutionTime || 1000,
      dropSchema: false,
      ...config,

      migrations: [`${path.resolve(__dirname, '..', '..', 'migrations')}/*.js`],

      type: 'mssql',
      entities,
    };

    if (config.logging) {
      logger.info('Connecting to DB');
    }

    connection = new DataSource(options);
    await connection.initialize();

    if (config.logging) {
      logger.info('Successfully connected to the DB');
    }
  }

  return connection;
};

export const getDataSource = (): DataSource => connection;
