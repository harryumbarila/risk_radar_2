export const ROUTE_STRUCTURE = {
  dashboard: {
    label: 'Dashboard',
    href: '/',
  },
  settings: {
    label: 'Settings',
    href: '/settings',
    children: {
      'risk-rules': {
        label: 'Risk Rules',
        href: '/settings/risk-rules',
      },
      'mcc-config': {
        label: 'MCC Configuration',
        href: '/settings/mcc-config',
      },
      'mid-config': {
        label: 'MID Configuration',
        href: '/settings/mid-config',
      },
      'merchant-risk-thresholds': {
        label: 'Merchant Risk Thresholds',
        href: '/settings/merchant-risk-thresholds',
      },
    },
  },
};
