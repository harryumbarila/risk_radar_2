import React from 'react';

import type { BaseModel } from '../../types/base';
import type { PaginationResponse } from '../../types/pagination';

export type BlacklistedEntry = {
  returnCode: string;
  route: string;
  account: string;
  count: number;
  removed: boolean;
} & BaseModel;

const generateMockBlacklistedEntries = (count: number): BlacklistedEntry[] => {
  const entries: BlacklistedEntry[] = [];
  for (let i = 1; i <= count; i += 1) {
    entries.push({
      id: (100000 * Math.random()).toString(),
      returnCode: `R0${i % 3}`, // Example return codes
      route: `Route ${i}`,
      account: `Account ${i}`,
      count: i,
      removed: i % 2 === 0, // Alternating removed status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return entries;
};

export const getBlacklistedEntries = (
  page: number,
  pageSize: number
): Promise<PaginationResponse<BlacklistedEntry>> => {
  const allEntries = generateMockBlacklistedEntries(200); // Generate 200 mock entries
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEntries = allEntries.slice(startIndex, endIndex);

  return Promise.resolve({
    data: paginatedEntries,
    count: paginatedEntries.length,
    total: allEntries.length,
    page,
    pageCount: Math.ceil(allEntries.length / pageSize),
  });
};

export const useBlacklistedEntries = (page: number, pageSize: number) => {
  const [data, setData] =
    React.useState<PaginationResponse<BlacklistedEntry> | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await getBlacklistedEntries(page, pageSize);
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(() => {});
  }, [page, pageSize]);

  return { data, loading, error };
};
