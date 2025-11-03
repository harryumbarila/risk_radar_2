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
      'mcc-configuration': {
        label: 'MCC Configuration',
        href: '/settings/mcc-config',
      },
      'mid-configuration': {
        label: 'MID Configuration',
        href: '/settings/mid-config',
      },
    },
  },
};
