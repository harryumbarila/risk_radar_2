export interface RiskRadarResponseDto {
  id: number;
  netDeposit: number;
  fspApprovedAuthAmount: number;
  authDeclineAmount: number;
  dba: string;
  activationDate: string;
  channel: string;
  reseller?: string;
  referralPartner?: string;
  solutionConsultant?: string;
  autoApproved?: boolean;
  riskWatch?: boolean;
  newAccount?: boolean;
  at?: number;
  ht?: number;
  credits?: number;
  channelRule?: string;
  keyedPercentage?: number;
}

export const riskRadarResponseDto: RiskRadarResponseDto[] = [
  {
    id: 1,
    netDeposit: 361042.88,
    fspApprovedAuthAmount: 0.0,
    authDeclineAmount: -26198.38,
    dba: 'Citation-Permits Processing Ce',
    activationDate: '2024-04-30 12:58:04 PM',
    channel: 'Direct Channel',
    reseller: 'Goldman Consulting',
    at: 714,
    ht: 26,
  },
  {
    id: 2,
    netDeposit: 407399.92,
    fspApprovedAuthAmount: 0.0,
    authDeclineAmount: 0.0,
    dba: 'Taylor & Martin Inc',
    activationDate: '2021-11-01 3:23:00 PM',
    channel: 'Direct Channel',
    solutionConsultant: 'Jeff Becher',
    at: 875,
  },
  {
    id: 3,
    netDeposit: 105341.6,
    fspApprovedAuthAmount: 0.0,
    authDeclineAmount: -3216.49,
    dba: 'RX SYSTEMS, INC.',
    activationDate: '2020-04-22 7:57:00 AM',
    channel: 'Partner Channel',
    at: 341,
  },
  {
    id: 5,
    netDeposit: 95650.42,
    fspApprovedAuthAmount: 0.0,
    authDeclineAmount: -7750.68,
    dba: 'Auto Protection 888-485-4337',
    activationDate: '',
    channel: 'Direct Channel',
    referralPartner: 'Parkside Financial',
    at: 188,
    ht: 20,
  },
  {
    id: 6,
    netDeposit: 2074.75,
    fspApprovedAuthAmount: 0.0,
    authDeclineAmount: -202.8,
    dba: 'HOT SHOTS SPORTS PHOTOGRAPHY',
    activationDate: '2019-09-01 1:25:00 PM',
    channel: 'Direct Channel',
    solutionConsultant: 'Talus Legacy Agents',
    keyedPercentage: 8,
  },
];
