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
  status?: string;
}

export interface Hook {
  requestId?: number;
  event?: string;
}

export interface LeadUsersAssignedResponse {
  data: AssignedUser[];
  links: Links;
  meta: Meta;
}

export interface AssignedUser {
  id?: number;
  username?: string;
  full_name?: string;
  email?: string;
  status?: string;
  class?: string;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}
