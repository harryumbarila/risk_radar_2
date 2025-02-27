import useSWR from "swr";
import { baseApi } from "@/hooks/baseApi";
import { IrisLeadSourcesResponseDto } from "./response/iris-sources.response.dto";

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