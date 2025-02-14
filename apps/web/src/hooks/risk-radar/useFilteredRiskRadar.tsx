import { useState, useEffect } from "react";
import { riskRadarApi } from "@/hooks/risk-radar/riskRadarApi";

export interface FilterState {
  from_date: string;
  to_date: string;
  status: string;
  assigned_to: string;
  MID: string | null;
  dba_or_sic: string | null;
  exception_type: string[];
  view_all_exceptions: boolean;
  source_type: string;
  current_page: number;
  records_per_page: number;
}

export const useFilteredRiskRadar = () => {
  const [filters, setFilters] = useState<FilterState>({
    from_date: "",
    to_date: "",
    status: "",
    assigned_to: "",
    MID: null,
    dba_or_sic: null,
    exception_type: [],
    view_all_exceptions: false,
    source_type: "0",
    current_page: 1,
    records_per_page: 10,
  });

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && filters.exception_type.length === 0) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          from_date: filters.from_date,
          to_date: filters.to_date,
          status: filters.status,
          assigned_to: filters.assigned_to,
          MID: filters.MID || "null",
          dba_or_sic: filters.dba_or_sic || "null",
          exception_type: filters.exception_type.join(", "),
          view_all_exceptions: filters.view_all_exceptions ? "1" : "0",
          source_type: filters.source_type,
          current_page: filters.current_page.toString(),
          records_per_page: filters.records_per_page.toString(),
        });

        const result = await riskRadarApi(
          `/v1/legacy_dashboard_proxy/risk_radar?${queryParams}`,
        );
        setData(result);
        setIsInitialized(true);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, isInitialized]);

  return { filters, setFilters, data, isLoading, error };
};
