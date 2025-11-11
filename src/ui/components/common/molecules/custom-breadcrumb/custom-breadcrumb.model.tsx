export interface CustomBreadcrumbMenuItem {
  label: string;
  value: string;
  href: string;
}

export interface CustomBreadcrumbMenuItemProps {
  label: string;
  items: CustomBreadcrumbMenuItem[];
}

export interface CustomBreadcrumbPath {
  label: string;
  href?: string;
  isCurrent?: boolean;
  menu?: CustomBreadcrumbMenuItem[];
}

export interface CustomBreadcrumbProps {
  paths: CustomBreadcrumbPath[];
}
