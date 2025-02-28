import type { Metadata } from "next";
import type { FC } from "react";

import { Marketing } from "@/components/Dashboard/Marketing";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Next.js Marketing Dashboard | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "This is Next.js Marketing Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const MarketingPage: FC = () => {
  return (
    <DefaultLayout>
      <Marketing />
    </DefaultLayout>
  );
};

export default MarketingPage;
