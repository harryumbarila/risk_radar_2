import { env } from './env';

export const serverConfig = {
  frontegg: {
    baseUrl: env.FRONTEGG_BASE_URL,
    app: {
      id: env.FRONTEGG_APP_ID,
      url: env.FRONTEGG_APP_URL,
    },
    client: {
      id: env.FRONTEGG_CLIENT_ID,
    },
    cookie: {
      name: env.FRONTEGG_COOKIE_NAME,
    },
    encryption: {
      password: env.FRONTEGG_ENCRYPTION_PASSWORD,
    },
    logLevel: env.FRONTEGG_LOG_LEVEL,
  },
};
