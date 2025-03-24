export interface RiskRadarUser {
  user_id: number;
  username: string;
}

export interface RiskRadarUsersResponseDto {
  risk_users: RiskRadarUser[];
}
