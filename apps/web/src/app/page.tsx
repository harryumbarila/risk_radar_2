import { Metadata } from "next";
import RiskRadar from "@/app/risk-radar/page";

export const metadata: Metadata = {
  title: "Taluspay Dashboard",
  description: "Taluspay Dashboard",
};

export default function Home() {
  return (
    <>
      <RiskRadar />
    </>
  );
}
