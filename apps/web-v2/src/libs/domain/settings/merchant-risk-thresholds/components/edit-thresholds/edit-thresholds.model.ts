import { z } from 'zod';
import { components } from '@/libs/shared/api/schemas/schema';
import { stringNumberZod } from '@/libs/utils/validations';

export interface EditThresholdsDrawerProps {
  threshold: components['schemas']['MerchanRiskThresholdsEntity'];
}

export const merchantRiskThresholdsSchema = z.object({
  keyedPercentage: stringNumberZod,
  monthlyVolume: stringNumberZod,
  highTicket: stringNumberZod,
  transactionCount: stringNumberZod,
  declinePercentage: stringNumberZod,
});

export type MerchantRiskThresholdsFormModel = z.infer<
  typeof merchantRiskThresholdsSchema
>;
