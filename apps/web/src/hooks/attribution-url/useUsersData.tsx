import useSWR from "swr";
import { IrisFilteredUsersResponseDto } from "@/hooks/attribution-url/response/irisUsersResponseDto";
import { baseApi } from "@/hooks/baseApi";

export const useUsersData = () => {
  const { data, error, isLoading } = useSWR<IrisFilteredUsersResponseDto>(
    "/v1/iris_proxy/users", // Only the relative endpoint
    baseApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
