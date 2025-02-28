"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import type { FC } from "react";

import AttributionUrl from "@/app/attribution-url/page";
import RiskRadar from "@/app/risk-radar/page";
import { roles } from "@/types/roles";

const Home: FC = () => {
  const { user } = useUser();
  const { isSales } = roles(user);

  return !isSales() ? <RiskRadar /> : <AttributionUrl />;
};

export default Home;
