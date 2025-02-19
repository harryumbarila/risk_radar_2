import useSWR from "swr";
import { baseApi } from "@/hooks/baseApi";
import { IrisChannelsResponseDto } from "@/hooks/attribution-url/response/iris-channels.response.dto";

export const useChannels = () => {
  const { data, error, isLoading } = useSWR<IrisChannelsResponseDto>(
    "/v1/iris_proxy/channels", // Only the relative endpoint
    baseApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
