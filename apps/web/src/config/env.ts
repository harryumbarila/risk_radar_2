import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BACKEND_BASE_URL: z
      .string()
      .url()
      .default('https://dashboard-api.taluspay-staging.com'),
    NEXT_PUBLIC_RISK_RADAR_BASE_URL: z
      .string()
      .url()
      .default('http://localhost:3001'),
    NEXT_PUBLIC_MERCHANT_BASE_URL: z
      .string()
      .url()
      .default('https://taluspay-staging.com'),
  },

  server: {
    FRONTEGG_APP_URL: z.string().url(),
    FRONTEGG_BASE_URL: z.string().url(),
    FRONTEGG_CLIENT_ID: z.string().min(1),
    FRONTEGG_APP_ID: z.string().min(1),
    FRONTEGG_ENCRYPTION_PASSWORD: z.string().min(1),
    FRONTEGG_COOKIE_NAME: z.string().min(1).default('fe_session'),
    FRONTEGG_HOSTED_LOGIN: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .default('true'),
    FRONTEGG_LOG_LEVEL: z.enum(['debug', 'info', 'error']).default('error'),
    FRONTEGG_JWT_PUBLIC_KEY: z.string().min(1).optional(), // Not required yet
  },

  runtimeEnv: {
    NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    NEXT_PUBLIC_RISK_RADAR_BASE_URL:
      process.env.NEXT_PUBLIC_RISK_RADAR_BASE_URL,
    NEXT_PUBLIC_MERCHANT_BASE_URL: process.env.NEXT_PUBLIC_MERCHANT_BASE_URL,

    FRONTEGG_APP_URL: process.env.FRONTEGG_APP_URL,
    FRONTEGG_BASE_URL: process.env.FRONTEGG_BASE_URL,
    FRONTEGG_CLIENT_ID: process.env.FRONTEGG_CLIENT_ID,
    FRONTEGG_APP_ID: process.env.FRONTEGG_APP_ID,
    FRONTEGG_ENCRYPTION_PASSWORD: process.env.FRONTEGG_ENCRYPTION_PASSWORD,
    FRONTEGG_COOKIE_NAME: process.env.FRONTEGG_COOKIE_NAME,
    FRONTEGG_HOSTED_LOGIN: process.env.FRONTEGG_HOSTED_LOGIN,
    FRONTEGG_LOG_LEVEL: process.env.FRONTEGG_LOG_LEVEL,
    FRONTEGG_JWT_PUBLIC_KEY: process.env.FRONTEGG_JWT_PUBLIC_KEY,
  },
});
