import { env } from './env';

export const config = {
  app: {
    port: env.PORT,
  },
  node: {
    env: env.NODE_ENV,
  },
  frontegg: {
    client: {
      id: env.FRONTEGG_CLIENT_ID,
    },
    apiKey: env.FRONTEGG_API_KEY,
  },
  iris: {
    env: env.IRIS_ENV,
    url: env.IRIS_URL,
    apiKey: env.IRIS_API_KEY,
  },
  legacyDashboard: {
    url: env.LEGACY_DASHBOARD_URL,
  },
};
