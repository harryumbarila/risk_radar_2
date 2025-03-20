import type { IrisUsersResponseDto } from './iris-users';

type BaseObject = {
  id: number;
  name: string;
};

type ReportsAndManagesType = {
  user_id: number;
  full_name: string;
  class?: {
    id: number;
    name: string;
  };
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
  // Define class IDs as static properties based on environment
  private static readonly MANAGES_CLASS_IDS = {
    staging: [41, 30],
    production: [71, 30],
  };

  private static readonly REPORTS_TO_CLASS_IDS = {
    staging: [53],
    production: [25, 95],
  };

  public static create(
    data: IrisUsersResponseDto,
    environment: 'staging' | 'production' = 'production'
  ): IrisFilteredUsersResponseDto {
    const filteredUsers = data.data.map((user) => ({
      label: user.full_name,
      value: user.id,
      rsl: this.createReportsTo(user.reports_to, environment),
      channels: this.createChannels(user.groups),
      manages: this.createManages(user.manages, environment),
    }));

    return { data: filteredUsers };
  }

  private static createReportsTo(
    reports: ReportsAndManagesType[],
    environment: 'staging' | 'production'
  ): BaseObject[] {
    // Get the appropriate class IDs for the environment
    const validClassIds = this.REPORTS_TO_CLASS_IDS[environment];

    // Filter based on environment and class id
    const filteredReports = reports.filter(
      (report) => report.class && validClassIds.includes(report.class.id)
    );

    return filteredReports.map((report) => ({
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
    manages: ReportsAndManagesType[],
    environment: 'staging' | 'production'
  ): IrisFilteredUserData['manages'] {
    // Get the appropriate class IDs for the environment
    const validClassIds = this.MANAGES_CLASS_IDS[environment];

    // Filter based on environment and class id
    const filteredManages = manages.filter(
      (manage) => manage.class && validClassIds.includes(manage.class.id)
    );

    return filteredManages.map((manage) => ({
      user_id: manage.user_id,
      username: manage.full_name,
    }));
  }
}
