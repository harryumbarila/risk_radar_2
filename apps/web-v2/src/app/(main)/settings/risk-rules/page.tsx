import React from 'react';

import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/libs/shared/providers/query-client';
import { $riskApi } from '@/libs/shared/api/risk.api';

import SettingRiskRule from '@/libs/domain/settings/risk-rule/risk-rule.page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Risk Rules',
};

export default async function RiskRulePage(): Promise<React.JSX.Element> {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    $riskApi.queryOptions('get', '/v1/risk-rule')
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingRiskRule />
    </HydrationBoundary>
  );
}
