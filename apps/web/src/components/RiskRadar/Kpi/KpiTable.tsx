import React from "react";
import { KpiStatisticsResponseDto } from "@/hooks/risk-radar/response/kpiStatisticsResponseDto";

interface KpiTableProps {
  data: KpiStatisticsResponseDto;
}

const KpiTable: React.FC<KpiTableProps> = ({ data }) => {
  const tableData = [
    {
      kpi: "Processing MIDs",
      count: data.processingMIDs.count,
      volume: data.processingMIDs.amount,
    },
    {
      kpi: "Exception MIDs",
      count: data.exceptionMIDs.count,
      countPercent: data.exceptionMIDs.percentageIncrease,
      volume: data.exceptionMIDs.amount,
      volumePercent: data.exceptionMIDs.amountPercentageIncrease,
    },
    {
      kpi: "NDF Processing MIDs",
      count: data.ndfProcessingMIDs.count,
      volume: data.ndfProcessingMIDs.amount,
    },
    {
      kpi: "NDF Exception MIDs",
      count: data.ndfExceptionMIDs.count,
      countPercent: data.ndfExceptionMIDs.count,
      volume: data.ndfExceptionMIDs.amount,
      volumePercent: data.ndfExceptionMIDs.amountPercentageIncrease,
    },
    {
      kpi: "Reviewed",
      count: data.reviewed.count,
      volume: data.reviewed.amount,
    },
    { kpi: "Queued", count: data.queued.count, volume: data.queued.amount },
    { kpi: "Divert", count: data.divert.count, volume: data.divert.amount },
    {
      kpi: "Divert Release",
      count: data.divertRelease.count,
      volume: data.divertRelease.amount,
    },
    {
      kpi: "Auto Divert",
      count: data.autoDivert.count,
      volume: data.autoDivert.amount,
    },
  ];

  return (
    <table className="w-full table-auto text-xs">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          <th className="min-w-[220px] px-3 py-2 font-medium text-black dark:text-white">
            KPI
          </th>
          <th className="min-w-[150px] px-3 py-2 font-medium text-black dark:text-white">
            Count
          </th>
          <th className="min-w-[120px] px-3 py-2 font-medium text-black dark:text-white">
            Volume
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td className="border-b border-[#eee] px-3 py-2 text-xs dark:border-strokedark">
              {row.kpi}
            </td>
            <td className="border-b border-[#eee] px-3 py-2 text-xs dark:border-strokedark">
              {row.count}
              {row.countPercent && (
                <span className="text-xs text-meta-3">
                  {" "}
                  ({row.countPercent}%)
                </span>
              )}
            </td>
            <td className="border-b border-[#eee] px-3 py-2 text-xs dark:border-strokedark">
              {row.volume}
              {row.volumePercent && (
                <span className="text-xs text-meta-3">
                  {" "}
                  ({row.volumePercent}%)
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KpiTable;
