import { env } from './env';

export const config = {
  db: {
    connectionString: 'postgresql://postgres:denali@localhost:5432/denali',
    ssl: env.DB_SSL,
  },
};
