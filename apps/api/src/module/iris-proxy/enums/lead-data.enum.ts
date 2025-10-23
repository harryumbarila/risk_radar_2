import { IrisEnv } from '@/api/shared/constanst/iris';

export enum LeadDataFields {
  ID = 'ID',
  SolutionConsultant = 'Solution Consultant',
  ReferralPartner = 'Referral Partner',
  Reseller = 'Reseller',
  ISV = 'ISV',
}

export const LeadDataTab: Record<
  IrisEnv,
  Record<LeadDataFields, number | null>
> = {
  staging: {
    [LeadDataFields.ID]: 65,
    [LeadDataFields.SolutionConsultant]: 8438,
    [LeadDataFields.ReferralPartner]: 8439,
    [LeadDataFields.Reseller]: 8440,
    [LeadDataFields.ISV]: 8441,
  },
  production: {
    [LeadDataFields.ID]: 63,
    [LeadDataFields.SolutionConsultant]: 8046,
    [LeadDataFields.ReferralPartner]: 8047,
    [LeadDataFields.Reseller]: 8048,
    [LeadDataFields.ISV]: 8049,
  },
};
