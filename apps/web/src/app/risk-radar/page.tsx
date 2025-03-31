'use client';

import { Breadcrumb, Loader } from '@denali/ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { RiskRadarTableComponent } from '@/components/risk-radar/risk-radar-table';
import { useExceptionData } from '@/hooks/risk-radar/use-exception-data';
import type { FilterState } from '@/hooks/risk-radar/use-filtered-risk-radar';
import { useFilteredRiskRadar } from '@/hooks/risk-radar/use-filtered-risk-radar';
import { useRiskRadarUsers } from '@/hooks/risk-radar/use-get-risk-radar-users';

type ExceptionType = {
  pk: number;
  sDesc: string;
};

type SourceType = {
  pk: number;
  sName: string;
};

type RiskUser = {
  user_id: number;
  username: string;
  bHidden?: boolean;
};

const RiskRadar: FC = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { data: exceptionData } = useExceptionData();
  const { data: riskRadarUsersData } = useRiskRadarUsers();

  const {
    filters,
    setFilters,
    data: filteredData,
    isLoading: filterLoading,
    error: filterError,
    fetchData,
  } = useFilteredRiskRadar();

  useEffect(() => {
    if (exceptionData?.exception_type) {
      const allExceptionTypes = exceptionData.exception_type.map(
        (type: ExceptionType) => String(type.pk)
      );

      setFilters((prev: FilterState) => ({
        ...prev,
        exception_type: allExceptionTypes,
        view_all_exceptions: true,
      }));
    }
  }, [exceptionData, setFilters]);


  const filterComponent = useMemo((): JSX.Element => {
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

    if (filteredData && riskRadarUsersData) {
      return (
        <RiskRadarTableComponent
          data={filteredData}
          filters={filters}
          setFilters={setFilters}
          status={Number(filters.status)}
          riskUsers={riskRadarUsersData}
        />
      );
    }

    return <div>No data available</div>;
  }, [
    filterError,
    filterLoading,
    filteredData,
    filters,
    riskRadarUsersData,
    setFilters,
  ]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm h-[340px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exception Date And Source
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
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
                      value={filters.from_date}
                      onChange={(e) =>
                        setFilters((prev: FilterState) => ({
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
                      value={filters.to_date}
                      onChange={(e) =>
                        setFilters((prev: FilterState) => ({
                          ...prev,
                          to_date: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="system"
                  >
                    Select System
                  </label>
                  <div className="flex gap-11.5">
                    {exceptionData?.source_type.map(
                      (source: SourceType, idx: number) => (
                        <div key={source.pk} className="flex items-center">
                          <input
                            type="radio"
                            name="system"
                            id={`source-${source.pk}`}
                            value={source.pk}
                            defaultChecked={idx === 0}
                            className="size-4 border-gray-300 text-primary focus:ring-primary"
                            onChange={(e) =>
                              setFilters((prev: FilterState) => ({
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
                      )
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="viewAll"
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                      onChange={(e) => {
                        setFilters((prev: FilterState) => ({
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
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm h-[340px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exception Type
              </h3>
            </div>
            <form action="#" className="h-55">
              <div className="p-6.5 h-full">
                <div className="mb-5 h-full">
                  <select
                    multiple
                    value={filters.exception_type}
                    className="w-full rounded border-[1.5px] h-full border-stroke bg-transparent px-5 py-4 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setFilters((prev: FilterState) => ({
                        ...prev,
                        exception_type: values,
                      }));
                    }}
                  >
                    {exceptionData?.exception_type.map(
                      (type: ExceptionType) => (
                        <option key={type.pk} value={type.pk}>
                          {type.sDesc}
                        </option>
                      )
                    )}
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
          <div className="rounded-sm h-[340px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exception Status, MID and DBA/SIC{' '}
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-5">
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={filters.status}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setFilters((prev: FilterState) => ({
                        ...prev,
                        status: e.target.value,
                      }));
                    }}
                  >
                    <option value="0">Select Status</option>
                    {exceptionData?.status.map(
                      (status: {
                        pkRiskRadarExceptionStatus: number;
                        sExceptionStatusDesc: string;
                      }) => (
                        <option
                          key={status.pkRiskRadarExceptionStatus}
                          value={status.pkRiskRadarExceptionStatus}
                        >
                          {status.sExceptionStatusDesc}
                        </option>
                      )
                    )}
                  </select>

                  {filters.status === '4' && (
                    <div className="mb-5 mt-2">
                      <select
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={filters.assigned_to}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          setFilters((prev: FilterState) => ({
                            ...prev,
                            assigned_to: e.target.value,
                          }));
                        }}
                      >
                        <option value="0">Select user</option>
                        {riskRadarUsersData?.risk_users.map(
                          (riskUser: RiskUser) => (
                            <option
                              key={riskUser.user_id}
                              value={riskUser.user_id}
                            >
                              {riskUser.username}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}
                </div>

                {selectedStatus === 'Assigned' && (
                  <div className="mb-5 mt-2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="assignedTo"
                    >
                      Assign To User
                    </label>
                    <select
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e) => {
                        setFilters((prev: FilterState) => ({
                          ...prev,
                          assigned_to: e.target.value,
                        }));
                      }}
                    >
                      <option value="">Select User</option>
                      {exceptionData?.risk_user
                        .filter((user: { bHidden: boolean }) => !user.bHidden)
                        .map(
                          (user: {
                            pkRiskRadarUser: number;
                            sName: string;
                          }) => (
                            <option
                              key={user.pkRiskRadarUser}
                              value={user.pkRiskRadarUser}
                            >
                              {user.sName}
                            </option>
                          )
                        )}
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
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter MID"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => {
                      setFilters((prev: FilterState) => ({
                        ...prev,
                        MID: e.target.value,
                      }));
                    }}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter DBA/SIC"
                    onChange={(e) => {
                      setFilters((prev: FilterState) => ({
                        ...prev,
                        dba_or_sic: e.target.value,
                      }));
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="inline-flex items-center justify-center w-full m-4">
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            fetchData();
          }}
        >
          Search
        </button>
      </div>

      <div className="mt-4">{filterComponent}</div>
    </DefaultLayout>
  );
};

export default RiskRadar;
