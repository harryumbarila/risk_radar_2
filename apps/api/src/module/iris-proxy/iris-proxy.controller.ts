import { Controller, Get } from '@nestjs/common';
import { IrisClient } from './webservice/iris.client';
import {
  FilteredUsersFactory,
  IrisFilteredUsersResponseDto,
} from './response/iris-filtered-users.response.dto';
import { IrisChannelsResponseDto } from '@denali/shared/response/iris-channels.response.dto';
import { IrisPartnersResponseDto } from '@denali/shared/response/iris-partners.response.dto';
import { ConfigService } from '@nestjs/config';
import { IrisLeadSourcesResponseDto } from './response/iris-lead-sources.response.dto';

export interface IrisProxyControllerConfig {
  IRIS_ENV: string;
}

@Controller('/v1/iris_proxy')
export class IrisProxyController {
  constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService<IrisProxyControllerConfig>,
  ) {}

  @Get('users')
  async users(): Promise<IrisFilteredUsersResponseDto> {
    const data = await this.client.getUsers();
    return FilteredUsersFactory.create(data);
  }

  @Get('lead-sources')
  async leadSources(): Promise<IrisLeadSourcesResponseDto> {
    return this.client.getLeadSources();
  }

  /**
   * @deprecated
   */
  @Get('channels')
  async channels(): Promise<IrisChannelsResponseDto> {
    return this.client.getChannels();
  }

  /**
   * @deprecated
   */
  @Get('partners')
  partners(): IrisPartnersResponseDto {
    if (this.configService.get('IRIS_ENV') === 'staging') {
      return {
        data: [
          {
            id: 41,
            name: 'Default Referral Partner',
          },
        ],
      };
    }

    return {
      data: [
        {
          id: 71,
          name: 'Default Referral Partner',
        },
      ],
    };
  }
}
