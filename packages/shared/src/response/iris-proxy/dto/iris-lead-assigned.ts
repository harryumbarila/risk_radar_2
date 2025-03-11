export interface LeadUserAssigned {
  hook?: Hook;
  data?: LeadData;
}

export interface LeadData {
  lead?: Lead;
  leads?: Lead[];
}

export interface Lead {
  id?: number;
  name?: string;
  lead_url?: string;
  assignedUsers?: AssignedBy[];
  email?: string;
  contact?: string;
  phone?: string;
  address?: Address;
  assignedAt?: Date;
  user?: AssignedBy;
  assignedBy?: AssignedBy;
}

export interface Address {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface AssignedBy {
  id?: number;
  name?: string;
  userClass?: string;
  email?: string;
}

export interface Hook {
  requestId?: number;
  event?: string;
}
