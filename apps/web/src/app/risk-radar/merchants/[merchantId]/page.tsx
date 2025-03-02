'use client';

import { notFound } from 'next/navigation';
import type { FC } from 'react';

import { Breadcrumb } from '@/components/Breadcrumbs/Breadcrumb';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { useMerchant } from '@/hooks/risk-radar/useMerchant';

type Props = {
  params: {
    merchantId: string;
  };
};

const RiskRadarMerchantPage: FC<Props> = ({ params }) => {
  const { merchantId } = params;

  const { data, error, isLoading } = useMerchant(merchantId);

  if (!merchantId) {
    notFound();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading merchant data</div>;
  }

  const merchantProfile = data?.merchant_profile[0];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Merchant Profile" />

      {/* Header */}
      <h1 className="mb-2 text-2xl font-semibold text-black dark:text-white">
        Merchant Profile: {merchantProfile?.sMId}
      </h1>

      {/* Basic Merchant Info */}
      <section className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>DBA Name:</strong> {merchantProfile?.sDBAName}
          </p>
          <p className="text-black dark:text-white">
            <strong>Address:</strong> {merchantProfile?.sDBAAddress}
          </p>
          <p className="text-black dark:text-white">
            <strong>City:</strong> {merchantProfile?.sDBACity}
          </p>
          <p className="text-black dark:text-white">
            <strong>State:</strong> {merchantProfile?.sDBAState}
          </p>
          <p className="text-black dark:text-white">
            <strong>ZIP:</strong> {merchantProfile?.sDBAZip}
          </p>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>Merchant ID:</strong> {merchantProfile?.sMId}
          </p>
          <p className="text-black dark:text-white">
            <strong>SIC:</strong> {merchantProfile?.sSIC} -{' '}
            {merchantProfile?.sSICDesc}
          </p>
          <p className="text-black dark:text-white">
            <strong>Merchant Type:</strong> {merchantProfile?.sMerchantType}
          </p>
          <p className="text-black dark:text-white">
            <strong>Activation Date:</strong> {merchantProfile?.sActivationDate}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mb-4 flex gap-2 border-b border-stroke pb-2 dark:border-strokedark">
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
        >
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
                  <th className="p-4 font-medium text-black dark:text-white">
                    Month/Year
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Volume
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Avg Ticket
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Swiped %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Highest Ticket
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Total CB
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    V CB %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    MC CB %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Disc CB %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Amex CB %
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.volume.map((vol) => (
                  <tr key={`${vol.iYear}-${vol.iMonth}`}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.sMonth} {vol.iYear}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dVol.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dAvgTkt.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dSwipedPercBasedOnTransCnt.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dHighestTkt.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dTotCB.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dVCBPerc.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dMCCBPerc.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dDCBPerc.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dACBPerc.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default RiskRadarMerchantPage;
