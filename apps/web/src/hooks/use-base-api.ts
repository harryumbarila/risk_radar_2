import { useAuth } from '@frontegg/nextjs';
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWR from 'swr';

import { clientConfig } from '@/config/client';

 
export default function useBaseApi(): {
  makeRequest: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
  getSWRFetcher: () => <T>(url: string, options?: RequestInit) => Promise<T>;
} {
  const { user } = useAuth();
  const accessToken = user?.accessToken;

  // Create an authenticated fetcher function
  const authFetcher = async <T>(
    url: string,
    options?: RequestInit
  ): Promise<T> => {
    const fullUrl = url.startsWith('http')
      ? url
      : `${clientConfig.api.url}${url}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(fullUrl, requestOptions);
    if (!response.ok) {
      const responseBody = (await response.json()) as {
        error: string;
        message: string;
        statusCode: number;
      };
      throw new Error(`Error: ${responseBody.error} ${responseBody.message}`);
    }

     
    return response.json();
  };

  // For direct API calls (original functionality)
  const makeRequest = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    return authFetcher<T>(endpoint, options);
  };

  // For use with SWR
   
  const getSWRFetcher = () => {
    return <T>(url: string, options?: RequestInit) =>
      authFetcher<T>(url, options);
  };
   
  return { makeRequest, getSWRFetcher };
}

// New hook that uses SWR with authenticated fetcher
export function useApiSWR<Data = never, Error = never>(
  key: string | null,
  options?: RequestInit,
  swrOptions?: SWRConfiguration
): SWRResponse<Data, Error> {
  const { getSWRFetcher } = useBaseApi();
  const fetcher = getSWRFetcher();
   
  return useSWR<Data, Error>(
    key,
    key ? (url) => fetcher<Data>(url, options) : null,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000, // Deduplicate requests within 10 seconds
      revalidateIfStale: false,
      ...swrOptions,
    }
  );
   
}
