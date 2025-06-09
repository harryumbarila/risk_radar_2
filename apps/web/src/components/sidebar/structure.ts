import {
  ChartCandlestick,
  ChartColumnStacked,
  Link2,
  Radar,
  UserPen,
  Receipt,
} from 'lucide-react';

import type { ResourceKey } from '@/types/permissions';

export type SidebarItem = {
  id: string;
  title: string;
  name: ResourceKey | 'ANY';
  parent?: boolean;
  icon: typeof Link2;
  link: string;
  child?: SidebarItem[];
};

const sidebarStructure: SidebarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    name: 'ANY',
    parent: true,
    icon: ChartColumnStacked,
    link: '/',
    child: [
      {
        id: 'risk-radar',
        title: 'Risk Radar',
        name: 'RISK_RADAR',
        link: '/risk-radar',
        icon: Radar,
      },
      {
        id: 'attribution-url',
        title: 'Attribution URL',
        name: 'ATTRIBUTION_LINK',
        link: '/attribution-url',
        icon: Link2,
      },
      {
        id: 'msp-merchant-invoice',
        title: 'MSP Merchant Invoice',
        name: 'MSP_INVOICE',
        link: '/partner-bank',
        icon: UserPen,
      },
      {
        id: 'tsys-fiu',
        title: 'TSYS FIU',
        name: 'TSYS_FIU',
        link: '/tsys-fiu',
        icon: ChartCandlestick,
      },
      {
        id: 'commission',
        title: 'Commission',
        name: 'COMMISSION',
        link: '/commission',
        icon: Receipt,
      },
    ],
  },
];

export { sidebarStructure };
