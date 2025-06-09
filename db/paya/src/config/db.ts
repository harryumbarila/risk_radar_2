import { env } from './env';

export const config = {
  db: {
    connectionString: env.PAYA_DB_URL,
    ssl: env.DB_SSL,
  },
};
