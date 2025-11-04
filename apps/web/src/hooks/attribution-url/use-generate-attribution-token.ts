import { useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { AttributionDataPayload } from '@/types/attribution-url';

type GenerateAttributionTokenResponse = {
  token: string;
};

export type UseGenerateAttributionTokenReturnType = {
  generateToken: (payload: AttributionDataPayload) => Promise<string>;
  isLoading: boolean;
  error: string | null;
};

export function useGenerateAttributionToken(): UseGenerateAttributionTokenReturnType {
  const { makeRequest } = useBaseApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateToken = async (
    payload: AttributionDataPayload
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await makeRequest<GenerateAttributionTokenResponse>(
        '/attribution-url/generate-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      return response.token;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate attribution token';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateToken,
    isLoading,
    error,
  };
}
