"use client";

import { Breadcrumb } from "@/components/Breadcrumbs/Breadcrumb";
import { TabOne } from "@/components/Tabs/TabOne";
import { TabThree } from "@/components/Tabs/TabThree";
import { TabTwo } from "@/components/Tabs/TabTwo";

export const Tabs: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Tabs" />

      <div className="flex flex-col gap-9">
        <TabOne />
        <TabTwo />
        <TabThree />
      </div>
    </>
  );
};
