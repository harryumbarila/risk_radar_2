import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['production', 'development', 'test'])
      .default('development'),

    FRONTEGG_CLIENT_ID: z.string().min(1),
    FRONTEGG_API_KEY: z.string().min(1),

    LEGACY_DASHBOARD_URL: z.string().url(),
    IRIS_URL: z.string().url(),

    IRIS_API_KEY: z.string().min(1),
    IRIS_ENV: z.enum(['staging', 'production']),

    PORT: z.number().default(3001),
  },

  runtimeEnv: process.env,
});
