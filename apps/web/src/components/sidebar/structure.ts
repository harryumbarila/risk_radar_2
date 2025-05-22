import {
  ChartCandlestick,
  ChartColumnStacked,
  Link2,
  Radar,
  UserPen,
} from 'lucide-react';

import type { ResourceKey } from '@/types/permissions';

export type SidebarItem = {
  id: string;
  title: string;
  name: ResourceKey;
  parent?: boolean;
  icon: typeof Link2;
  link: string;
  child?: SidebarItem[];
};

const sidebarStructure: SidebarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    name: 'ATTRIBUTION_LINK',
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
        name: 'RISK_RADAR', // FIXME: Add permission
        link: '/tsys-fiu',
        icon: ChartCandlestick,
      },
    ],
  },
];

export { sidebarStructure };
