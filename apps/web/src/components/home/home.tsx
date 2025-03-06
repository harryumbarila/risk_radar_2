'use client';

import { useAuth } from '@frontegg/nextjs';
import type { FC } from 'react';

import AttributionUrl from '@/app/attribution-url/page';
import RiskRadar from '@/app/risk-radar/page';
import { permissions } from '@/types/permissions';

export const Home: FC = () => {
  const { user } = useAuth();
  const { forResource } = permissions(user);

  return forResource('RISK_RADAR').canRead ? <RiskRadar /> : <AttributionUrl />;
};
