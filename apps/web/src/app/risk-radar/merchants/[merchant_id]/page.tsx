import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Props {
  params: {
    merchant_id: string;
  };
}

export default async function RiskRadarMerchantPage({ params }: Props) {
  const { merchant_id } = params;

  if (!merchant_id) {
    notFound();
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

      {/* Header */}
      <h1 className="mb-2 text-2xl font-semibold text-black dark:text-white">
        Merchant Profile: 561100000155440
      </h1>

      {/* Basic Merchant Info */}
      <section className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>DBA Name:</strong> NOBI
          </p>
          <p className="text-black dark:text-white">
            <strong>Address:</strong> 1900 AMBASSADOR DR
          </p>
          {/* ... other merchant info */}
        </div>
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>Merchant ID:</strong> 561100000155440
          </p>
          {/* ... other details */}
        </div>
      </section>

      {/* Tabs */}
      <nav className="mb-4 flex gap-2 border-b border-stroke pb-2 dark:border-strokedark">
        <button className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90">
          Contact
        </button>
        {/* ... other tab buttons */}
      </nav>

      {/* Contact Tab Content */}
      <section className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Contact
        </h2>
        <div className="grid grid-cols-2 gap-4">{/* ... contact info */}</div>
      </section>

      {/* Volume Table */}
      <section className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Volume
        </h2>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Month/Year
                  </th>
                  {/* ... other headers */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    Jan 2024
                  </td>
                  {/* ... other cells */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
