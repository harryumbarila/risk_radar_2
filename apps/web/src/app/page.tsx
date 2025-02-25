"use client";
import RiskRadar from "@/app/risk-radar/page";
import { useUser } from "@auth0/nextjs-auth0/client";
import { roles } from "@/types/roles";
import AttributionUrl from "@/app/attribution-url/page";

export default function Home() {
  const { user } = useUser();
  const { isSales } = roles(user);

  return <>{!isSales() ? <RiskRadar /> : <AttributionUrl />}</>;
}
