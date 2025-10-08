import { IrisEnv } from '@/api/shared/constanst/iris';

export enum LeadStatusFields {
  PROSPECTING = 'Prospecting',
}

export const LeadStatusTab: Record<
  IrisEnv,
  Record<LeadStatusFields, number | null>
> = {
  staging: {
    [LeadStatusFields.PROSPECTING]: 175,
  },
  production: {
    [LeadStatusFields.PROSPECTING]: 175,
  },
};
