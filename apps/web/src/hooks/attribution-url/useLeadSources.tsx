import useSWR from "swr";

import { baseApi } from "@/hooks/baseApi";
import type { IrisLeadSourcesResponseDto } from "@/shared/response/iris-proxy";

type UseLeadSourcesReturnType = {
  data: IrisLeadSourcesResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useLeadSources = (): UseLeadSourcesReturnType => {
  const { data, error, isLoading } = useSWR<
    IrisLeadSourcesResponseDto,
    unknown
  >("/v1/iris_proxy/lead-sources", baseApi, {
    dedupingInterval: 100,
    revalidateOnFocus: false,
  });

  return { data, error, isLoading };
};
