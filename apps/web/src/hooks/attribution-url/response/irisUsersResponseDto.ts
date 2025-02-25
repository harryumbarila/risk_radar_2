export interface IrisFilteredUserData {
  label: string; // User's full name to display
  value: number; // User ID
  rsl: {
    id: number;
    name: string;
  }[];
  channels: {
    id: number;
    name: string;
  }[];
  manages: {
    user_id: number;
    username: string;
  }[];
}

export interface IrisFilteredUsersResponseDto {
  data: IrisFilteredUserData[];
}
