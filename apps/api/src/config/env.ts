// import 'dotenv/config';

import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['production', 'development', 'test'])
      .default('production'),

    FRONTEGG_CLIENT_ID: z.string().min(1).default('s'),
    FRONTEGG_API_KEY: z.string().min(1).default('s'),

    LEGACY_DASHBOARD_URL: z
      .string()
      .url()
      .default('http://taluspay-staging.com/'),
    IRIS_URL: z.string().url().default('http://taluspay-staging.com/'),

    IRIS_API_KEY: z.string().min(1).default('s'),
    IRIS_ENV: z.enum(['staging', 'production']).default('staging'),

    PORT: z.number().default(3001),
  },

  runtimeEnv: process.env,
});
