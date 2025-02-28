"use client";

import { Breadcrumb } from "@/components/Breadcrumbs/Breadcrumb";
import { BreadcrumbOne } from "@/components/Breadcrumbs/BreadcrumbOne";
import { BreadcrumbThree } from "@/components/Breadcrumbs/BreadcrumbThree";
import { BreadcrumbTwo } from "@/components/Breadcrumbs/BreadcrumbTwo";

export const Breadcrumbs: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Breadcrumb" />

      <div className="flex flex-col gap-7.5">
        <BreadcrumbOne />
        <BreadcrumbTwo />
        <BreadcrumbThree />
      </div>
    </>
  );
};
