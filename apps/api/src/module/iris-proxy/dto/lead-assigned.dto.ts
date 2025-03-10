import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined } from 'class-validator';

import {
  HookMapper,
  LeadDataMapper,
} from '@/api/module/iris-proxy/mappers/iris-lead-assigned.mapper';

export class LeadUserAssignedInputDto {
  @ApiProperty({
    description: 'Hook information',
    type: HookMapper,
    required: false,
  })
  @IsDefined()
  @Type(() => HookMapper)
  public hook: HookMapper;

  @ApiProperty({
    description: 'Data information',
    type: LeadDataMapper,
    required: false,
  })
  @IsDefined()
  @Type(() => LeadDataMapper)
  public data: LeadDataMapper;
}

export class LeadUserAssignedOutputDto {
  @ApiProperty({
    description: 'Hook information',
    type: HookMapper,
    required: false,
  })
  @Type(() => Boolean)
  public success: boolean;
}

export class LeadUserAssignedSource {
  public name?: string;
}
