import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  Allow,
} from 'class-validator';

export class UserMapper {
  @ApiProperty({
    description: 'User ID',
    required: false,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: 'User name',
    required: false,
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'User class',
    required: false,
  })
  @IsString()
  public userClass: string;
}

export class GroupMapper {
  @ApiProperty({
    description: 'Group ID',
    required: false,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: 'Group name',
    required: false,
  })
  @IsString()
  public name: string;
}

export class SourceMapper {
  @ApiProperty({
    description: 'Source ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  public id: number | null;

  @ApiProperty({
    description: 'Source name',
    required: false,
  })
  @IsOptional()
  @IsString()
  public name: string | null;
}

export class StatusMapper {
  @ApiProperty({
    description: 'Status ID',
    required: false,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: 'Status name',
    required: false,
  })
  @IsString()
  public name: string;
}

export class AddressMapper {
  @ApiProperty({
    description: 'ZIP code',
    required: false,
  })
  @IsString()
  public zip: string;

  @ApiProperty({
    description: 'City',
    required: false,
  })
  @IsString()
  public city: string;

  @ApiProperty({
    description: 'State',
    required: false,
  })
  @IsString()
  public state: string;

  @ApiProperty({
    description: 'Address',
    required: false,
  })
  @IsString()
  public address: string;
}

export class CampaignMapper {
  @ApiProperty({
    description: 'Campaign ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  public id: number | null;

  @ApiProperty({
    description: 'Campaign name',
    required: false,
  })
  @IsOptional()
  @IsString()
  public name: string | null;
}

export class CategoryMapper {
  @ApiProperty({
    description: 'Category ID',
    required: false,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: 'Category name',
    required: false,
  })
  @IsString()
  public name: string;
}

export class LeadMapper {
  @ApiProperty({
    description: 'Lead ID',
    required: false,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: 'Lead name',
    required: false,
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Lead email',
    required: false,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'Group information',
    type: GroupMapper,
    required: false,
  })
  @Type(() => GroupMapper)
  @Allow()
  public group: GroupMapper;

  @ApiProperty({
    description: 'Phone number',
    required: false,
  })
  @IsString()
  public phone: string;

  @ApiProperty({
    description: 'Source information',
    type: SourceMapper,
    required: false,
  })
  @Type(() => SourceMapper)
  @Allow()
  public source: SourceMapper;

  @ApiProperty({
    description: 'Status information',
    type: StatusMapper,
    required: false,
  })
  @Type(() => StatusMapper)
  @Allow()
  public status: StatusMapper;

  @ApiProperty({
    description: 'Address information',
    type: AddressMapper,
    required: false,
  })
  @Type(() => AddressMapper)
  @Allow()
  public address: AddressMapper;

  @ApiProperty({
    description: 'Contact name',
    required: false,
  })
  @IsString()
  public contact: string;

  @ApiProperty({
    description: 'Campaign information',
    type: CampaignMapper,
    required: false,
  })
  @Type(() => CampaignMapper)
  @Allow()
  public campaign: CampaignMapper;

  @ApiProperty({
    description: 'Category information',
    type: CategoryMapper,
    required: false,
  })
  @Type(() => CategoryMapper)
  @Allow()
  public category: CategoryMapper;

  @ApiProperty({
    description: 'Lead URL',
    required: false,
  })
  @IsString()
  public lead_url: string;

  @ApiProperty({
    description: 'Sales representative',
    type: UserMapper,
    required: false,
  })
  @Type(() => UserMapper)
  @Allow()
  public salesRep: UserMapper;

  @ApiProperty({
    description: 'Creation date',
    required: false,
  })
  @IsString()
  public createdAt: string;

  @ApiProperty({
    description: 'Created by user',
    type: UserMapper,
    required: false,
  })
  @Type(() => UserMapper)
  @Allow()
  public createdBy: UserMapper;

  @ApiProperty({
    description: 'New status information',
    type: StatusMapper,
    required: false,
  })
  @Type(() => StatusMapper)
  @Allow()
  public newStatus: StatusMapper;

  @ApiProperty({
    description: 'Assigned users',
    type: [UserMapper],
    required: false,
    isArray: true,
  })
  @IsArray()
  @Type(() => UserMapper)
  public assignedUsers: UserMapper[];

  @ApiProperty({
    description: 'Previous status information',
    type: StatusMapper,
    required: false,
  })
  @Type(() => StatusMapper)
  @Allow()
  public previousStatus: StatusMapper;

  @ApiProperty({
    description: 'Status updated at',
    required: false,
  })
  @IsString()
  public statusUpdatedAt: string;

  @ApiProperty({
    description: 'Status updated by user',
    type: UserMapper,
    required: false,
  })
  @Type(() => UserMapper)
  @Allow()
  public statusUpdatedBy: UserMapper;
}

export class HookMapper {
  @ApiProperty({
    description: 'Request ID',
    required: false,
  })
  @IsNumber()
  public requestId: number;

  @ApiProperty({
    description: 'Event name',
    required: false,
  })
  @IsString()
  public event: string;
}

export class LeadDataMapper {
  @ApiProperty({
    description: 'Lead information',
    type: LeadMapper,
    required: false,
  })
  @IsDefined()
  @Type(() => LeadMapper)
  public lead: LeadMapper;
}

export class LeadStatusUpdatedInputDto {
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

export class LeadStatusUpdatedOutputDto {
  @ApiProperty({
    description: 'Success status',
    type: Boolean,
    required: false,
  })
  @Type(() => Boolean)
  public success: boolean;
}
