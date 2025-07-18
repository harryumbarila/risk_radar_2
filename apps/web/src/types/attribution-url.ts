export enum GenerationFormMode {
  NEW_LEAD = 'NEW_LEAD',
  EXISTING_LEAD = 'EXISTING_LEAD',
}

export type FormValues = {
  generationMode: GenerationFormMode;
  existingLeadId: string;
  irisUser: string;
  channel: string;
  rsl: string;
  referralPartner: string;
};

export type AttributionDataPayload = {
  user_id: string;
  channel_id: string;
  pb_key: string;
  rsl_user_id?: string;
  referral_partner_user_id?: string;
  source_id?: string;
  lead_id?: string;
};
