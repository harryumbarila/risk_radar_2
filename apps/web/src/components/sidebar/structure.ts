import {
  ChartCandlestick,
  ChartColumnStacked,
  Link2,
  Radar,
  Receipt,
  UserPen,
  Workflow,
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
        id: 'residual',
        title: 'Residual',
        name: 'RESIDUAL',
        link: '/residual',
        icon: Receipt,
      },
      {
        id: 'net-settlement',
        title: 'Net Settlement',
        name: 'NET_SETTLEMENT',
        link: '/net-settlement',
        icon: Workflow,
      },
    ],
  },
];

export { sidebarStructure };
