import { z } from 'zod';
import { components } from '@/libs/shared/api/schemas/schema';

export interface AddParamValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule: components['schemas']['RiskRuleParamValueOutputDto'] | null;
}

export const validateSchema = z.object({
  effectiveDate: z.string(),
  value: z.string(),
});

export type ParameterValueFormModel = z.infer<typeof validateSchema>;
