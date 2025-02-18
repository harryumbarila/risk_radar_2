"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import RiskRadarTableComponent from "../../components/RiskRadar/RiskRadarTable";
import Loader from "@/components/common/Loader";
import { useExceptionData } from "@/hooks/risk-radar/useExceptionData";
import { useFilteredRiskRadar } from "@/hooks/risk-radar/useFilteredRiskRadar";
import { useRouter } from "next/navigation";

const RiskRadar = () => {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    data: exceptionData,
    error: exceptionError,
    isLoading: exceptionLoading,
  } = useExceptionData();

  const {
    filters,
    setFilters,
    data: filteredData,
    isLoading: filterLoading,
    error: filterError,
  } = useFilteredRiskRadar();

  useEffect(() => {
    if (exceptionData?.exception_type) {
      const allExceptionTypes = exceptionData.exception_type.map((type) =>
        String(type.pk),
      );

      setFilters((prev) => ({
        ...prev,
        exception_type: allExceptionTypes,
        view_all_exceptions: true,
      }));
    }
  }, [exceptionData]);

  const handleMIDInputChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const merchantId = event.currentTarget.value;
      router.push(`/risk-radar/merchants/${merchantId}`);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

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
                    {exceptionData?.source_type.map((source) => (
                      <div key={source.pk} className="flex items-center">
                        <input
                          type="radio"
                          name="system"
                          id={`source-${source.pk}`}
                          value={source.pk}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              source_type: e.target.value,
                            }))
                          }
                        />
                        <label
                          htmlFor={`source-${source.pk}`}
                          className="ml-2 text-sm text-black dark:text-white"
                        >
                          {source.sName}
                        </label>
                      </div>
                    ))}
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
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          from_date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          from_date: e.target.value,
                        }))
                      }
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
                    value={filters.exception_type}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-4 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      );
                      setFilters((prev) => ({
                        ...prev,
                        exception_type: values,
                      }));
                    }}
                  >
                    {exceptionData?.exception_type.map((type) => (
                      <option key={type.pk} value={type.pk}>
                        {type.sDesc}
                      </option>
                    ))}
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
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    {exceptionData?.status.map((status) => (
                      <option
                        key={status.pkRiskRadarExceptionStatus}
                        value={status.sExceptionStatusDesc}
                      >
                        {status.sExceptionStatusDesc}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStatus === "Assigned" && (
                  <div className="mb-5 mt-4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Assign To User
                    </label>
                    <select className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                      <option value="">Select User</option>
                      {exceptionData?.risk_user
                        .filter((user) => !user.bHidden)
                        .map((user) => (
                          <option
                            key={user.pkRiskRadarUser}
                            value={user.pkRiskRadarUser}
                          >
                            {user.sName}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
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
                    onKeyDown={handleMIDInputChange}
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
        {filterLoading ? (
          <Loader size={"small"} fullScreen={false} />
        ) : filterError ? (
          <div className="flex h-56 items-center justify-center">
            <p className="text-red-500">Error fetching data</p>
          </div>
        ) : filteredData ? (
          <RiskRadarTableComponent data={filteredData} />
        ) : (
          <div>No data available</div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default RiskRadar;
