import { components } from '@/libs/shared/api/schemas/schema';

export interface ParamValuesHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  rule: components['schemas']['RiskRuleParamValueOutputDto'] | null;
}
