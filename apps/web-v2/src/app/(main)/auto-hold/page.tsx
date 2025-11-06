import React from 'react';

import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/libs/shared/providers/query-client';
import { $riskApi } from '@/libs/shared/api/risk.api';

import AutoHoldBoardPage from '@/libs/domain/auto-hold/board/board';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Auto Hold',
};

export default async function AutoHoldPage(): Promise<React.JSX.Element> {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    $riskApi.queryOptions('get', '/v1/auto-hold-exception')
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AutoHoldBoardPage />
    </HydrationBoundary>
  );
}
