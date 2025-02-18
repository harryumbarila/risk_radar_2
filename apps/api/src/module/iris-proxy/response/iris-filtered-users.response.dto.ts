export interface IrisFilteredUserData {
  label: string; // User's full name to display
  value: number; // User ID
  rsl: string; // Supervisor's full name (or "No Supervisor")
  rsl_id: number; // Supervisor's user ID (or null)
}

export interface IrisFilteredUsersResponseDto {
  data: IrisFilteredUserData[];
}
