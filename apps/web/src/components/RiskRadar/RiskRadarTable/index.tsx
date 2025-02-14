"use client";
import React from "react";
import RiskRadarTable from "@/components/RiskRadar/RiskRadarTable/RiskRadarTable";
import { RiskRadarResponseDto } from "@/hooks/risk-radar/response/riskRadarResponseDto";

export interface RiskRadarTableComponentProps {
  data: RiskRadarResponseDto;
}

const RiskRadarTableComponent: React.FC<RiskRadarTableComponentProps> = (
  data,
) => {
  return (
    <>
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <RiskRadarTable data={data.data} />
      </div>
    </>
  );
};

export default RiskRadarTableComponent;
