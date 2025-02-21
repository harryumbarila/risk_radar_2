import { IrisUsersResponseDto } from './iris-users.response.dto';

export interface IrisFilteredUserData {
  label: string; // User's full name to display
  value: number; // User ID
  rsl: {
    id: number;
    name: string;
  }[];
  channels: {
    user_id: number;
    username: string;
  }[];
  manages: {
    user_id: number;
    username: string;
  }[];
}

export interface IrisFilteredUsersResponseDto {
  data: IrisFilteredUserData[];
}

export class FilteredUsersFactory {
  static create(data: IrisUsersResponseDto): IrisFilteredUsersResponseDto {
    const filteredUsers = data.data.map((user) => ({
      label: user.full_name,
      value: user.id,
      rsl: this.createReportsTo(user.reports_to),
      channels: this.createChannels(user.groups),
      manages: this.createManages(user.manages),
    }));

    return { data: filteredUsers };
  }

  private static createReportsTo(reports: any[]) {
    return reports.map((report) => ({
      id: report.user_id,
      name: report.username,
    }));
  }

  private static createChannels(groups: any[]) {
    return groups.map((group) => ({
      user_id: group.id,
      username: group.name,
    }));
  }

  private static createManages(manages: any[]) {
    return manages.map((manage) => ({
      user_id: manage.user_id,
      username: manage.username,
    }));
  }
}
