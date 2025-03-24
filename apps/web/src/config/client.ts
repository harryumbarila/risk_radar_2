import { env } from './env';

export const clientConfig = {
  api: {
    url: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  },
  merchant: {
    app: {
      url: env.NEXT_PUBLIC_MERCHANT_BASE_URL,
    },
  },
  riskRadar: {
    url: env.NEXT_PUBLIC_RISK_RADAR_BASE_URL,
  },
};
