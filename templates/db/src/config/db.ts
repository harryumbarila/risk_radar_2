import { env } from './env';

export const config = {
  db: {
    connectionString: env.EXAMPLE_DB_CONNECTION_STRING,
    ssl: env.DB_SSL,
  },
};
