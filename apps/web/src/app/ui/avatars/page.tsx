import type { Metadata } from "next";
import type { FC } from "react";

import { AvatarOne } from "@/components/Avatars/AvatarOne";
import { AvatarTwo } from "@/components/Avatars/AvatarTwo";
import { Breadcrumb } from "@/components/Breadcrumbs/Breadcrumb";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Avatars | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Avatars page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AvatarsPage: FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Avatars" />

      <div className="flex flex-col gap-7.5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 1</h3>
          </div>

          <div className="px-4 py-9 sm:px-6 xl:px-8.5">
            <AvatarOne />
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 2</h3>
          </div>

          <div className="p-4 sm:p-6 xl:p-9">
            <AvatarTwo />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AvatarsPage;
