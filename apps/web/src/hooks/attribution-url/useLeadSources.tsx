import useSWR from "swr";
import { baseApi } from "@/hooks/baseApi";
import { IrisLeadSourcesResponseDto } from "@/shared/response/iris-proxy";

export const useLeadSources = () => {
    const { data, error, isLoading } = useSWR<IrisLeadSourcesResponseDto>(
        "/v1/iris_proxy/lead-sources",
        baseApi,
        {
            dedupingInterval: 100,
            revalidateOnFocus: false,
        }
    );

    return { data, error, isLoading };
};