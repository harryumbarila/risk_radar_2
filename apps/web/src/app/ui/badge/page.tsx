import type { Metadata } from "next";
import React from "react";

import { BadgeFour } from "@/components/Badges/BadgeFour";
import { BadgeOne } from "@/components/Badges/BadgeOne";
import { BadgeThree } from "@/components/Badges/BadgeThree";
import { BadgeTwo } from "@/components/Badges/BadgeTwo";
import { Breadcrumb } from "@/components/Breadcrumbs/Breadcrumb";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Badge | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Badge page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

const Badge: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Badge" />

      <div className="flex flex-col gap-7.5">
        <BadgeOne />
        <BadgeTwo />
        <BadgeThree />
        <BadgeFour />
      </div>
    </DefaultLayout>
  );
};

export default Badge;
