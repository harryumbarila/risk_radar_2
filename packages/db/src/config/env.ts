import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_SSL: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .default('false'),
  },

  runtimeEnv: process.env,
});
