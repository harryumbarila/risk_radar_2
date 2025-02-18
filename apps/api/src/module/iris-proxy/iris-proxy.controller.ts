import { Controller, Get } from '@nestjs/common';
import { IrisClient } from './webservice/iris.client';
import { IrisFilteredUsersResponseDto } from './response/iris-filtered-users.response.dto';

@Controller('/v1/iris_proxy')
export class IrisProxyController {
  constructor(private readonly client: IrisClient) {}

  @Get('users')
  async getUsers(): Promise<IrisFilteredUsersResponseDto> {
    const data = await this.client.getUsers();

    const filteredUsers = data.data
      .filter(
        (user) =>
          Array.isArray(user.groups) &&
          user.groups.some((group) => group.id === 152),
      ) // Only Direct Channel users
      .map((user) => ({
        label: user.full_name, // Display name in dropdown
        value: user.id, // Store user_id
        rsl:
          user.reports_to.length > 0
            ? user.reports_to[0].full_name
            : 'No Supervisor', // Supervisor Name (RSL)
        rsl_id: user.reports_to.length > 0 ? user.reports_to[0].user_id : null, // Supervisor ID (RSL)
      }));

    return { data: filteredUsers };
  }
}
