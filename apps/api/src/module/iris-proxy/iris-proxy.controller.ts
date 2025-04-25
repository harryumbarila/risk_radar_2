import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';
import { IrisClient } from '@/api/shared/module/iris/iris.client';
import type {
  IrisBasicInfoResponseDto,
  IrisChannelsResponseDto,
  IrisFilteredUsersResponseDto,
  IrisLeadSourcesResponseDto,
} from '@/shared/response/iris-proxy';
import {
  FilteredUsersFactory,
  IrisPartnersResponseDto,
} from '@/shared/response/iris-proxy';

import type { LeadUserAssignedOutputDto } from './dto';
import { LeadUserAssignedInputDto } from './dto';
import { IrisProxyService } from './iris-proxy.service';

export type IrisProxyControllerConfig = {
  IRIS_ENV: string;
};

@ApiTags('Iris Proxy')
@Controller('/v1/iris_proxy')
export class IrisProxyController {
  public constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService<IrisProxyControllerConfig>,
    private readonly irisProxyService: IrisProxyService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The filtered users response.',
  })
  @ApiOperation({ operationId: 'users', summary: 'Get filtered users' })
  @Get('users')
  public async users(): Promise<IrisFilteredUsersResponseDto> {
    const data = await this.client.getUsers();
    const environment =
      this.configService.get('IRIS_ENV') === 'staging'
        ? 'staging'
        : 'production';
    return FilteredUsersFactory.create(data, environment);
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

  @ApiResponse({
    status: 200,
    description: 'The lead sources response.',
  })
  @ApiOperation({
    operationId: 'lead-assigned-webhook',
    summary: 'Webhook for assigned leads',
  })
  @Public()
  @Post('lead-assigned-webhook')
  public async leadAssignedWebhook(
    @Body() payload: LeadUserAssignedInputDto
  ): Promise<LeadUserAssignedOutputDto> {
    // Iris health check
    if (payload?.hook?.event === 'subscription.test') {
      return { success: true };
    }
    return this.irisProxyService.leadAssignmentWebhook(payload);
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

  @ApiResponse({
    status: 200,
    description: 'The lead basic info.',
  })
  @ApiOperation({
    operationId: 'lead-basic-info',
    summary: 'Get lead basic info',
  })
  @Get('lead-basic-info/:leadId')
  public leadBasicInfo(
    @Param('leadId') leadId: number
  ): Promise<IrisBasicInfoResponseDto> {
    return this.irisProxyService.getLeadBasicInfo(leadId);
  }
}
