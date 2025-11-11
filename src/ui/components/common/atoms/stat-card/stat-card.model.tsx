import { ReactNode } from 'react';

export interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: ReactNode;
  isPositive?: boolean;
}
