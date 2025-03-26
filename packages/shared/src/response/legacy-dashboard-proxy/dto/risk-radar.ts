export interface RiskRadarResponseDto {
  data: RiskRadarData[];
  meta: RiskRadarMeta;
}

export interface RiskRadarData {
  net_dep_amt: string;
  fsp_appr_auth_tot_amt: string;
  auth_decline_amt: string;
  dba: string;
  activation_datetime: string;
  channel: string;
  reseller: string;
  referral_partner: string;
  solution_consultant: string;
  Auto_Approved_date: string;
  risk_watch: string;
  new_account: string;
  avg_ticket_score: string;
  high_ticket_score: string;
  credit_score: string;
  channel_score: string;
  keyed_perc_score: string;
  monthly_vol_score: string;
  avg_batch_score: string;
  dup_card_score: string;
  dup_bin_score: string;
  late_post_score: string;
  foreign_keyed_score: string;
  chbk_ret_req_score: string;
  next_day_funding: string;
  divert: string;
  divert_balance_amt: string;
  amex_opt_blue: string;
  moto_avs_score: string;
  settle_30perc_more_than_auth_score: string;
  no_auth_score: string;
  auth_decline_score: string;
  neg_batch_score: string;
  auto_hold_score: string;
  funding_exception_score: string;
  total_score: string;
  user_reviewed: string;
  exception_created_datetime: string;
  exception_id: string;
  mid: string;
  reviewButton?: string;
}

export interface RiskRadarMeta {
  records_per_page: number;
  current_page: number;
  last_page: number;
  from_record: number;
  to_record: number;
  total_records: number;
}

export interface RiskUser {
  user_id: number;
  username: string;
}

export interface RiskRadarUsersResponseDto {
  risk_users: RiskUser[];
}
