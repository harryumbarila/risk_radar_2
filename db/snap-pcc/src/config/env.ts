import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SNAP_PCC_DB_URL: z.string().optional(),
    DB_SSL: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .default('false'),
  },

  runtimeEnv: process.env,
});
