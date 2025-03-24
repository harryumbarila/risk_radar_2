export interface IrisUsersResponseDto {
  data: UserData[];
  meta: Meta;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface UserData {
  id: number;
  full_name: string;
  class: UserClass;
  groups: UserGroup[];
  reports_to: UserReport[];
  manages: UserManage[];
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
  username: string;
  full_name: string;
  class: UserClass;
}

interface UserManage {
  user_id: number;
  username: string;
  full_name: string;
  class: UserClass;
}
