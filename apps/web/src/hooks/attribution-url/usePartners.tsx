import useSWR from "swr";
import { baseApi } from "@/hooks/baseApi";
import { IrisPartnersResponseDto } from "@/shared/response/iris-proxy";

export const usePartners = () => {
  const { data, error, isLoading } = useSWR<IrisPartnersResponseDto>(
    "/v1/iris_proxy/partners", // Only the relative endpoint
    baseApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
