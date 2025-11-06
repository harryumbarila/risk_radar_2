import { z } from 'zod';
import { components } from '@/libs/shared/api/schemas/schema';

export interface AddParamValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule: components['schemas']['RiskRuleParamValueOutputDto'] | null;
}

export const validateSchema = z.object({
  effectiveDate: z
    .string()
    .min(1, 'Effective Date is required')
    .refine((dateStr) => {
      const selected = new Date(dateStr);

      const now = new Date();

      selected.setSeconds(0, 0);
      now.setSeconds(0, 0);
      // Normalize to minute precision to allow "same-minute" selection
      return selected.getTime() >= now.getTime();
    }, 'Effective Date must be equal or greater than current date/time'),
  value: z
    .string()
    .refine((val) => !isNaN(Number(val)), 'Value must be a number'),
});

export type ParameterValueFormModel = z.infer<typeof validateSchema>;
