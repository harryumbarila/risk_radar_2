import { env } from './env';

export const config = {
  db: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    pass: env.DB_PASSWORD,
    name: env.DB_NAME,
    ssl: env.DB_SSL,
  },
};
