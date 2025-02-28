import useSWR from "swr";

import { baseApi } from "@/hooks/baseApi";
import type { IrisChannelsResponseDto } from "@/shared/response/iris-proxy";

type UseChannelsReturnType = {
  data: IrisChannelsResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useChannels = (): UseChannelsReturnType => {
  const { data, error, isLoading } = useSWR<IrisChannelsResponseDto, unknown>(
    "/v1/iris_proxy/channels", // Only the relative endpoint
    baseApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
