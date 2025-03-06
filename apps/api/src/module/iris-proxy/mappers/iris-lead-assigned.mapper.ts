import { ApiPropertyOptional } from '@nestjs/swagger';

import type {
  Address,
  AssignedBy,
  Hook,
  Lead,
  LeadData,
  LeadUserAssigned,
} from '@/shared/response';

export class HookMapper implements Hook {
  @ApiPropertyOptional({
    type: Number,
    description: 'Request ID',
  })
  public requestId?: number;

  @ApiPropertyOptional({
    description: 'Event type',
    example: 'lead.assigned',
    type: String,
  })
  public event?: string;

  public constructor(values: Hook) {
    Object.assign(this, values);
  }

  public static map(hook: Hook): HookMapper {
    return new HookMapper({
      requestId: hook.requestId,
      event: hook.event,
    });
  }
}
export class AddressMapper implements Address {
  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Main St',
    type: String,
  })
  public address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'New York',
    type: String,
  })
  public city?: string;

  @ApiPropertyOptional({
    description: 'State',
    example: 'NY',
    type: String,
  })
  public state?: string;

  @ApiPropertyOptional({
    description: 'Zip code',
    example: '10001',
    type: String,
  })
  public zip?: string;

  public constructor(values: Address) {
    Object.assign(this, values);
  }

  public static map(address: Address): AddressMapper {
    return new AddressMapper({
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
    });
  }
}

export class AssignedByMapper implements AssignedBy {
  @ApiPropertyOptional({
    description: 'User ID',
    example: 123,
    type: Number,
  })
  public id?: number;

  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe',
    type: String,
  })
  public name?: string;

  @ApiPropertyOptional({
    description: 'User class',
    example: 'admin',
    type: String,
  })
  public userClass?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'example@gmail.com',
    type: String,
  })
  public email?: string;

  public constructor(values: AssignedBy) {
    Object.assign(this, values);
  }

  public static map(assignedBy: AssignedBy): AssignedByMapper {
    return new AssignedByMapper({
      id: assignedBy.id,
      name: assignedBy.name,
      userClass: assignedBy.userClass,
      email: assignedBy.email,
    });
  }
}

export class LeadMapper implements Lead {
  @ApiPropertyOptional({
    description: 'Lead ID',
    example: 123,
    type: Number,
  })
  public id?: number;

  @ApiPropertyOptional({
    description: 'Lead name',
    example: 'John Doe',
    type: String,
  })
  public name?: string;

  @ApiPropertyOptional({
    description: 'Lead URL',
    example: 'https://example.com/lead/123',
    type: String,
  })
  public lead_url?: string;

  @ApiPropertyOptional({
    description: 'Assigned users',
    type: AssignedByMapper,
    isArray: true, // ✅ Fix applied
  })
  public assignedUsers?: AssignedByMapper[];

  @ApiPropertyOptional({
    description: 'Lead email',
    example: 'example@gmail.com',
    type: String,
  })
  public email?: string;

  @ApiPropertyOptional({
    description: 'Lead address',
    type: AddressMapper,
  })
  public address?: AddressMapper;

  @ApiPropertyOptional({
    description: 'Assigned date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public assignedAt?: Date;

  @ApiPropertyOptional({
    description: 'User who assigned the lead',
    type: AssignedByMapper,
  })
  public user?: AssignedByMapper;

  @ApiPropertyOptional({
    description: 'User who assigned the lead',
    type: AssignedByMapper,
  })
  public assignedBy?: AssignedByMapper;

  public constructor(values: Lead) {
    Object.assign(this, values);
  }

  public static map(lead: Lead): LeadMapper {
    return new LeadMapper({
      id: lead.id,
      name: lead.name,
      lead_url: lead.lead_url,
      assignedUsers: lead.assignedUsers
        ? lead.assignedUsers.map((user) => AssignedByMapper.map(user)) // ✅ Fixed arrow function
        : undefined,
      email: lead.email,
      address: lead.address ? AddressMapper.map(lead.address) : undefined,
      assignedAt: lead.assignedAt ? lead.assignedAt : undefined,
      user: lead.user ? AssignedByMapper.map(lead.user) : undefined,
      assignedBy: lead.assignedBy
        ? AssignedByMapper.map(lead.assignedBy)
        : undefined,
    });
  }
}

export class LeadDataMapper implements LeadData {
  @ApiPropertyOptional({
    description: 'Lead information',
    type: LeadMapper,
  })
  public lead?: LeadMapper;

  @ApiPropertyOptional({
    description: 'List of leads',
    type: LeadMapper,
    isArray: true, // ✅ Fix applied
  })
  public leads?: LeadMapper[];

  public constructor(values: LeadData) {
    Object.assign(this, values);
  }

  public static map(data: LeadData): LeadDataMapper {
    return new LeadDataMapper({
      lead: data.lead ? LeadMapper.map(data.lead) : undefined,
      leads: data.leads
        ? data.leads.map((lead) => LeadMapper.map(lead))
        : undefined, // ✅ Fixed arrow function
    });
  }
}

export class LeadUserAssignedMapper implements LeadUserAssigned {
  @ApiPropertyOptional({
    description: 'Hook information',
    type: HookMapper,
  })
  public hook?: HookMapper;

  @ApiPropertyOptional({
    description: 'Data information',
    type: LeadDataMapper,
  })
  public data?: LeadDataMapper;

  public constructor(values: LeadUserAssigned) {
    Object.assign(this, values);
  }

  public static map(
    leadUserAssigned: LeadUserAssigned
  ): LeadUserAssignedMapper {
    return new LeadUserAssignedMapper({
      hook: leadUserAssigned.hook
        ? HookMapper.map(leadUserAssigned.hook)
        : undefined,
      data: leadUserAssigned.data
        ? LeadDataMapper.map(leadUserAssigned.data)
        : undefined,
    });
  }
}
