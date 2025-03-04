import { useAuth } from '@frontegg/nextjs';
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWR from 'swr';

const BACKEND_BASE_URL = 'https://dashboard-api.taluspay-staging.com';

// eslint-disable-next-line import/no-default-export
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
      : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || BACKEND_BASE_URL}${url}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(fullUrl, requestOptions);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
  /* eslint-disable */
  const getSWRFetcher = () => {
    return <T>(url: string, options?: RequestInit) =>
      authFetcher<T>(url, options);
  };
  /* eslint-enable */
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
  /* eslint-disable */
  return useSWR<Data, Error>(
    key,
    key ? (url) => fetcher<Data>(url, options) : null,
    swrOptions
  );
  /* eslint-enable */
}
