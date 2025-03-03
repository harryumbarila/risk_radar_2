'use client';

import { FC } from 'react';
import AttributionUrl from '@/app/attribution-url/page';
import RiskRadar from '@/app/risk-radar/page';
import { useAuth } from '@frontegg/nextjs';
import { roles } from '@/types/roles';

export const Home: FC = () => {
  const { user } = useAuth();
  const { isSales } = roles(user);

  return !isSales() ? <RiskRadar /> : <AttributionUrl />;
};
