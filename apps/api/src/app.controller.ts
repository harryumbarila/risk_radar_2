import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import type { VersionData } from './shared/version/version-resolver';
import { VersionResolver } from './shared/version/version-resolver';

class AppVersionResponseDto {
  @ApiProperty({ description: 'Current app version' })
  public version: string;

  @ApiProperty({ description: 'Current app version branch' })
  public branch: string;

  @ApiProperty({ description: 'Current app version commit' })
  public commit: string;

  @ApiProperty({ description: 'Current app created at' })
  public created_at: string;

  @ApiProperty({ description: 'Server time' })
  public current_server_time: string;

  public constructor(version: VersionData) {
    this.version = version.version;
    this.branch = version.branch;
    this.commit = version.commit;
    this.created_at = version.created_at;
    this.current_server_time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  }
}

type AppStatus = 'UP' | 'DOWN';

class AppStatusResponseDto {
  @ApiProperty({ description: 'Current app version', enum: ['UP', 'DOWN'] })
  public status: AppStatus;

  public constructor(status: AppStatus) {
    this.status = status;
  }
}

@ApiTags('App')
@Controller()
@Public()
export class AppController {
  @ApiResponse({
    status: 200,
    description: 'Shows the current App version response.',
    type: AppVersionResponseDto,
  })
  @ApiOperation({ operationId: 'Version' })
  @Get()
  public version(): AppVersionResponseDto {
    return new AppVersionResponseDto(VersionResolver.resolveVersion());
  }

  @ApiResponse({
    status: 200,
    description: 'Shows the current status of App - Operational',
    type: AppStatusResponseDto,
  })
  @ApiResponse({
    status: 502,
    description: 'Not operational - Bad Gateway Exception',
    type: null,
  })
  @ApiResponse({
    status: 503,
    description: 'Not operational - Service Unavailable',
    example: { status: 'DOWN' },
  })
  @ApiOperation({ operationId: 'Status' })
  @Get('/status')
  public status(): AppStatusResponseDto {
    return new AppStatusResponseDto('UP');
  }
}
