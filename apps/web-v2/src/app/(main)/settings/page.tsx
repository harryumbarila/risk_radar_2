import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import RiskRulePage from '@/libs/domain/settings/components/risk-rule/risk-rule.page';
import { getQueryClient } from '@/libs/shared/providers/query-client';
import { $riskApi } from '@/libs/shared/api/risk.api';

export default function SettingsPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery($riskApi.queryOptions('get', '/v1/risk-rule'));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RiskRulePage />
    </HydrationBoundary>
  );
}
