import type { IrisUsersResponseDto } from './iris-users';

type BaseObject = {
  id: number;
  name: string;
};

type ReportsAndManagesType = {
  user_id: number;
  full_name: string;
};

type GroupType = {
  id: number;
  name: string;
};
export interface IrisFilteredUserData {
  label: string; // User's full name to display
  value: number; // User ID
  rsl: BaseObject[];
  channels: BaseObject[];
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

  private static createReportsTo(
    reports: ReportsAndManagesType[]
  ): BaseObject[] {
    return reports.map((report) => ({
      id: report.user_id,
      name: report.full_name,
    }));
  }

  private static createChannels(groups: GroupType[]): BaseObject[] {
    return groups.map((group) => ({
      id: group.id,
      name: group.name,
    }));
  }

  private static createManages(
    manages: ReportsAndManagesType[]
  ): IrisFilteredUserData['manages'] {
    return manages.map((manage) => ({
      user_id: manage.user_id,
      username: manage.full_name,
    }));
  }
}
