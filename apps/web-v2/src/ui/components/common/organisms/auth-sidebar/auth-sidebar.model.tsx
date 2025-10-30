import { IconType } from 'react-icons/lib';

export interface AuthSidebarProps {
  currentPath?: string;
}

export interface AuthSidebarMenuItem {
  name: string;
  path: string;
  icon: IconType;
}
