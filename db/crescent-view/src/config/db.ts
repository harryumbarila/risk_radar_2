import { env } from './env';

export const config = {
  db: {
    connectionString:
      'postgresql://postgres:crescent@localhost:5433/crescent-view',
    ssl: env.DB_SSL,
  },
};
