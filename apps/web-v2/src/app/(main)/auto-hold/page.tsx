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

  // Prefetch with error handling to prevent "Failed to fetch" errors
  try {
    await queryClient.prefetchQuery(
      $riskApi.queryOptions('get', '/v1/auto-hold-exception')
    );
  } catch (error) {
    // Silently handle prefetch errors - the page will still work with mock data
    console.warn('Auto-hold prefetch failed, using mock data:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AutoHoldBoardPage />
    </HydrationBoundary>
  );
}
