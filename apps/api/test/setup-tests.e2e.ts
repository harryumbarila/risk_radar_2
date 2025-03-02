import { config } from 'dotenv';

config();

beforeAll(async () => {
  // await AppDataSource.initialize();
  // await AppDataSource.showMigrations();
  // await AppDataSource.runMigrations();
}, 8000);

beforeEach(() => {
  try {
    // const entities = AppDataSource.entityMetadatas;
    // const tableNames = entities
    //   .map((entity) => `"${entity.tableName}"`)
    //   .join(', ');
    //
    // await AppDataSource.query(
    //   `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
    // );
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database: ${error}`);
  }
});

afterAll(async () => {
  // if (AppDataSource) {
  //   await AppDataSource.destroy();
  // }
});
