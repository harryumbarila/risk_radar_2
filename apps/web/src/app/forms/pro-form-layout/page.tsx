"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import RiskRadarTableComponent from "../../../components/RiskRadar/RiskRadarTable";
import KpiTable from "@/components/RiskRadar/Kpi/KpiTable";
import { useKPIData } from "@/hooks/risk-radar/useKPIData";
import Loader from "@/components/common/Loader";
import { useRiskRadarData } from "@/hooks/risk-radar/useRiskRadarData";

const ProFormLayout = () => {
  const { data, error, isLoading } = useKPIData();
  const {
    data: riskRadarData,
    error: riskRadarError,
    isLoading: riskRadarLoading,
  } = useRiskRadarData();

  console.log(riskRadarData);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

      <div className="mb-4 grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-6.5">
              {isLoading ? (
                <Loader />
              ) : error ? (
                <div className="flex h-56 items-center justify-center">
                  <p className="text-red-500">
                    Error fetching data: {error.message}
                  </p>
                </div>
              ) : data ? (
                <KpiTable data={data} />
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exception Date
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Select System
                  </label>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="system"
                        id="all"
                        value="all"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="all"
                        className="ml-2 text-sm text-black dark:text-white"
                      >
                        All
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="system"
                        id="tsys"
                        value="tsys"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="tsys"
                        className="ml-2 text-sm text-black dark:text-white"
                      >
                        TSYS
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="system"
                        id="fsp"
                        value="fsp"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="fsp"
                        className="ml-2 text-sm text-black dark:text-white"
                      >
                        FSP North
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="viewAll"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="viewAll"
                      className="ml-2 text-sm text-black dark:text-white"
                    >
                      View All Exceptions
                    </label>
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Survey Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exception Type
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Select Exception Types
                  </label>
                  <select
                    multiple
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="compliance">Compliance Exception</option>
                    <option value="operational">Operational Exception</option>
                    <option value="regulatory">Regulatory Exception</option>
                    <option value="policy">Policy Exception</option>
                    <option value="security">Security Exception</option>
                    <option value="performance">Performance Exception</option>
                  </select>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Hold Ctrl (Windows) or Command (Mac) to select multiple
                    options
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">List</h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Status
                  </label>
                  <select className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="relative mb-5">
                  <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
                    <div className="absolute inset-x-0 h-px bg-stroke dark:bg-strokedark"></div>
                    <span className="relative z-10 bg-white px-4 text-sm font-medium text-black dark:bg-boxdark dark:text-white">
                      OR
                    </span>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    MID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter MID"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    DBA/SIC
                  </label>
                  <input
                    type="text"
                    placeholder="Enter DBA/SIC"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {riskRadarLoading ? (
          <Loader />
        ) : riskRadarError ? (
          <div className="flex h-56 items-center justify-center">
            <p className="text-red-500">
              Error fetching data: {riskRadarError.message}
            </p>
          </div>
        ) : riskRadarData ? (
          <RiskRadarTableComponent data={riskRadarData} />
        ) : (
          <div>No data available</div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ProFormLayout;
