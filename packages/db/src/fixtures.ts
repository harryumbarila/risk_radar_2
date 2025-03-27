/* eslint-disable no-await-in-loop */
import * as path from 'path';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli';

import { logger } from '@/logger/index';

import { config as dbConfig } from './config/config';
import type { DBConfig } from './db-connection';
import { connectToDB } from './db-connection';

const FIXTURES_DIR = path.resolve(__dirname, '..', '..', 'fixtures');

const loadFixtures = async (config: DBConfig): Promise<boolean> => {
  try {
    const connection = await connectToDB(config);

    logger.info('Dropping database and running migrations');
    await connection.dropDatabase();
    await connection.runMigrations();

    logger.info('Loading fixtures data');
    const loader = new Loader();
    loader.load(FIXTURES_DIR);

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser(), false);

    logger.info('Creating fixtures in DB');
    // eslint-disable-next-line no-restricted-syntax
    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      await connection.getRepository(fixture.entity).save(entity);
    }
  } catch (e) {
    logger.error(e);
    return false;
  }

  logger.info('Fixtures were successfully loaded.');

  return true;
};

loadFixtures({
  host: dbConfig.db.host,
  port: dbConfig.db.port,
  username: dbConfig.db.username,
  password: dbConfig.db.pass,
  database: dbConfig.db.name,
}).catch((e) => {
  // eslint-disable-next-line no-console
  console.log(e);
});
