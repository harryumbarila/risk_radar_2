import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined } from 'class-validator';

import {
  HookMapper,
  LeadDataMapper,
} from '@/api/module/iris-proxy/mappers/iris-lead-assigned.mapper';

export class LeadUserAssignedDto {
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
