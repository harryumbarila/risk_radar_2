import React from 'react';

import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/libs/shared/providers/query-client';
import { $riskApi } from '@/libs/shared/api/risk.api';

import AutoHoldBoardPage from '@/libs/domain/auto-hold/board/board';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '360 Hold Module',
};

export default async function HoldModulePage(): Promise<React.JSX.Element> {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      $riskApi.queryOptions('get', '/v1/auto-hold-exception')
    );
  } catch (error) {
    console.warn('Auto-hold prefetch failed, using mock data:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AutoHoldBoardPage />
    </HydrationBoundary>
  );
}
