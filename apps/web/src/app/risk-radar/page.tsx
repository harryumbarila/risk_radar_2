"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumbs/Breadcrumb";
import { Loader } from "@/components/common/Loader";
import { DefaultLayout } from "@/components/Layouts/DefaultLayout";
import { RiskRadarTableComponent } from "@/components/RiskRadar/RiskRadarTable";
import { useExceptionData } from "@/hooks/risk-radar/useExceptionData";
import { useFilteredRiskRadar } from "@/hooks/risk-radar/useFilteredRiskRadar";

const RiskRadar: FC = () => {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data: exceptionData } = useExceptionData();

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
  }, [exceptionData, setFilters]);

  const handleMIDInputChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      const merchantId = event.currentTarget.value;
      router.push(`/risk-radar/merchants/${merchantId}`);
    }
  };

  const filterComponent = useMemo(() => {
    if (filterLoading) {
      return <Loader size="small" fullScreen={false} />;
    }

    if (filterError) {
      return (
        <div className="flex h-56 items-center justify-center">
          <p className="text-red-500">Error fetching data</p>
        </div>
      );
    }

    if (filteredData) {
      return <RiskRadarTableComponent data={filteredData} />;
    }

    return <div>No data available</div>;
  }, [filterError, filterLoading, filteredData]);

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
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="system"
                  >
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
                          className="size-4 border-gray-300 text-primary focus:ring-primary"
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
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          view_all_exceptions: e.target.checked,
                        }));
                      }}
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
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="startDate"
                    >
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
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="endDate"
                    >
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
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="exceptionType"
                  >
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
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="status"
                  >
                    Status
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }));
                    }}
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
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="assignedTo"
                    >
                      Assign To User
                    </label>
                    <select
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          assigned_to: e.target.value,
                        }));
                      }}
                    >
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
                    <div className="absolute inset-x-0 h-px bg-stroke dark:bg-strokedark" />
                    <span className="relative z-10 bg-white px-4 text-sm font-medium text-black dark:bg-boxdark dark:text-white">
                      OR
                    </span>
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="mid"
                  >
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
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="dba"
                  >
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

      <div className="mt-4">{filterComponent}</div>
    </DefaultLayout>
  );
};

export default RiskRadar;
