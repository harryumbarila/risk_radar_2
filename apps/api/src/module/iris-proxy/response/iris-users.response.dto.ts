export interface IrisUsersResponseDto {
  data: UserData[];
}

interface UserData {
  id: number;
  full_name: string;
  class: UserClass;
  groups: UserGroup[];
  reports_to: UserReport[];
}

interface UserClass {
  id: number;
  name: string;
}

interface UserGroup {
  id: number;
  name: string;
}

interface UserReport {
  user_id: number;
  full_name: string;
}
