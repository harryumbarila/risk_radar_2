import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { InvoiceResponseDto } from '@/shared/response';

export type InvoicePaginationFilterState = {
  prefix?: string;
  continuationToken?: string;
  searchTerm?: string;
  maxKeys?: number;
};

export type UseFilteredPartnerInvoiceReturnType = {
  filters: InvoicePaginationFilterState;
  //   setFilters: (filters: InvoicePaginationFilterState) => void;
  data: InvoiceResponseDto | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (filtersToApply: InvoicePaginationFilterState) => void;
};

const filters = {
  prefix: undefined,
  continuationToken: undefined,
  maxKeys: undefined,
};

export const useFilteredPartnerInvoice =
  (): UseFilteredPartnerInvoiceReturnType => {
    const { makeRequest } = useBaseApi();

    const [data, setData] = useState<InvoiceResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createQuery = (
      filtersToApply: InvoicePaginationFilterState
    ): string => {
      const urlQueryParams = new URLSearchParams();

      Object.entries(filtersToApply).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              urlQueryParams.append(key, String(item));
            });
          } else {
            urlQueryParams.set(key, String(value));
          }
        }
      });

      return urlQueryParams.toString();
    };

    const fetchData = useCallback(
      async (filtersToApply: InvoicePaginationFilterState): Promise<void> => {
        setIsLoading(true);
        try {
          const queryParams = createQuery(filtersToApply ?? filters);

          const result = await makeRequest<InvoiceResponseDto>(
            `/v1/partner-banks/invoices?${queryParams}`
          );

          //   setFilters(filtersToApply);
          setData(result);
          setError(null);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      },
      [makeRequest]
    );

    return { filters, data, isLoading, error, fetchData };
  };
