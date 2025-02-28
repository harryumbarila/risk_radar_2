import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type {
  IrisChannelsResponseDto,
  IrisFilteredUsersResponseDto,
  IrisLeadSourcesResponseDto,
} from '@/shared/response/iris-proxy';
import {
  FilteredUsersFactory,
  IrisPartnersResponseDto,
} from '@/shared/response/iris-proxy';

import { IrisClient } from './webservice/iris.client';

export type IrisProxyControllerConfig = {
  IRIS_ENV: string;
};
@ApiTags('Iris Proxy')
@Controller('/v1/iris_proxy')
export class IrisProxyController {
  public constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService<IrisProxyControllerConfig>
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The filtered users response.',
  })
  @ApiOperation({ operationId: 'users', summary: 'Get filtered users' })
  @Get('users')
  public async users(): Promise<IrisFilteredUsersResponseDto> {
    const data = await this.client.getUsers();
    return FilteredUsersFactory.create(data);
  }

  @ApiResponse({
    status: 200,
    description: 'The lead sources response.',
  })
  @ApiOperation({ operationId: 'lead-sources', summary: 'Get lead sources' })
  @Get('lead-sources')
  public async leadSources(): Promise<IrisLeadSourcesResponseDto> {
    return this.client.getLeadSources();
  }

  /**
   * @deprecated
   */
  @ApiResponse({
    status: 200,
    description: 'The channels response.',
  })
  @ApiOperation({ operationId: 'channels', summary: 'Get channels' })
  @Get('channels')
  public async channels(): Promise<IrisChannelsResponseDto> {
    return this.client.getChannels();
  }

  /**
   * @deprecated
   */
  @ApiResponse({
    status: 200,
    description: 'The partners response.',
  })
  @ApiOperation({ operationId: 'partners', summary: 'Get partners' })
  @Get('partners')
  public partners(): IrisPartnersResponseDto {
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
