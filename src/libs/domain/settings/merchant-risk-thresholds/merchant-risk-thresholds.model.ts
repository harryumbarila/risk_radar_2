import { z } from 'zod';

export const merchantRiskThresholdsSearchSchema = z.object({
  value: z
    .string()
    .min(1, 'Search term cannot be empty')
    .max(16, 'MID code must be at most 16 digits'),
});

export type MerchantRiskThresholdsSearchFormModel = z.infer<
  typeof merchantRiskThresholdsSearchSchema
>;
