"use client";

import type { FC } from "react";

import RiskRadarTable from "@/components/RiskRadar/RiskRadarTable/RiskRadarTable";
import type { RiskRadarResponseDto } from "@/shared/response/legacy-dashboard-proxy";

export type RiskRadarTableComponentProps = {
  data: RiskRadarResponseDto;
};

export const RiskRadarTableComponent: FC<RiskRadarTableComponentProps> = ({
  data,
}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <RiskRadarTable data={data} />
    </div>
  );
};
