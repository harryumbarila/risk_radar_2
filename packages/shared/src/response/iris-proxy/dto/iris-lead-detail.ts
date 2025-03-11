interface Detail {
  id: number;
  name: string;
  type: Type;
  fields: Field[];
  record?: number;
}

interface Field {
  id: number;
  uid: number | null;
  field: string;
  value: string;
}

enum Type {
  Set = 'set',
  Tab = 'tab',
}

interface Campaign {
  id: number | null;
  name: null | string;
}
interface General {
  id: number;
  name: string;
  group: Campaign;
  category: Campaign;
  status: Campaign;
  campaign: Campaign;
  source: Campaign;
  created: Date;
  modified: Date;
  mid: number;
}

export interface LeadDetailResponse {
  general: General;
  details: Detail[];
}
