import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    IRIS_DB_CONNECTION_STRING: z.string(),
    DB_SSL: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .default('false'),
  },

  runtimeEnv: process.env,
});
