import React from 'react';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/libs/shared/providers/query-client';
import { $riskApi } from '@/libs/shared/api/risk.api';

import SettingRiskRule from '@/libs/domain/settings/risk-rule/risk-rule.page';

export default function RiskRulePage(): React.JSX.Element {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery($riskApi.queryOptions('get', '/v1/risk-rule'));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingRiskRule />
    </HydrationBoundary>
  );
}
