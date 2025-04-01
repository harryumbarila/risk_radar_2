/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import { useAuth } from '@frontegg/nextjs';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  Cell,
  CellProps,
  Column,
  ColumnInstance,
  HeaderGroup,
  Row,
  TableInstance,
  TableState,
} from 'react-table';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';

import { useAssignExceptionToUser } from '@/hooks/risk-radar/use-assign-exception-to-user';
import { useReviewExceptionByUsername } from '@/hooks/risk-radar/use-review-exception-by-username';
import type { PaginatedAPIResponse } from '@/shared/common';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/shared/request';
import type { RiskRadarExceptionsListRow } from '@/shared/response';
import type { RiskUser } from '@/shared/response/legacy-dashboard-proxy';
import { useExceptionData } from '@/web/src/hooks/risk-radar/use-exception-data';
import { useFilteredRiskRadar } from '@/web/src/hooks/risk-radar/use-filtered-risk-radar';

type RiskRadarTableProps = {
  data: PaginatedAPIResponse<RiskRadarExceptionsListRow>;
  status: number;
};

type CustomColumn = Column<RiskRadarExceptionsListRow>;

// Update the TableInstance type to include pagination properties
type TableInstanceWithPagination<
  T extends object = RiskRadarExceptionsListRow,
> = TableInstance<T> & {
  page: Row<T>[];
  state: TableState<T> & {
    pageIndex: number;
    pageSize: number;
  };
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageOptions: number[];
  setPageSize: (pageSize: number) => void;
  gotoPage: (pageIndex: number) => void;
};

export const RiskRadarTable: React.FC<RiskRadarTableProps> = ({
  data,
  status,
}): JSX.Element => {
  const [reviewIds, setReviewIds] = useState<string[]>([]);
  const [assignedExceptionIds, setAssignedExceptionIds] = useState<string[]>(
    []
  );

  const { data: exceptionData } = useExceptionData();
  const riskUsers = exceptionData?.risk_user;

  const [assignedUser, setAssignedUser] = useState(
    String(riskUsers?.[0]?.sNTUserID ?? '')
  );
  const { user } = useAuth();

  const { reviewException } = useReviewExceptionByUsername();
  const { assignException } = useAssignExceptionToUser();

  const handleClickOnReviewButton = async (): Promise<void> => {
    if (reviewIds.length > 0 && user?.name) {
      await reviewException(
        reviewIds.map((id) => parseInt(id, 10)),
        user.name
      );
    }
  };

  const handleClickOnAssignButton = async (): Promise<void> => {
    if (assignedExceptionIds.length > 0 && assignedUser) {
      await assignException(
        assignedExceptionIds.map((id) => parseInt(id, 10)),
        assignedUser
      );
    }
  };

  const handleReviewCheckboxChange = useCallback((id: string): void => {
    setReviewIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleAssignedCheckboxChange = useCallback((id: string): void => {
    setAssignedExceptionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const formatNumber = (value: unknown): string => {
    if (value === undefined || value === null || Number(value) === 0) {
      return 'N/A';
    }
    return Number(value).toLocaleString();
  };

  const formatScore = (value: unknown): string => {
    const numValue = Number(value);
    if (numValue === 0) return '';
    return numValue.toFixed(0);
  };

  const formatBoolean = (value: unknown): string => {
    return value === 'Yes' ? 'Yes' : 'No';
  };

  const formatDate = (value: unknown): string => {
    if (!value) return 'N/A';
    try {
      return new Date(String(value)).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const columns = useMemo<CustomColumn[]>(() => {
    const baseColumns: CustomColumn[] = [
      {
        Header: 'DBA',
        accessor: 'sDBA',
      },
      {
        Header: 'Net Deposit',
        accessor: 'dNetDepAmt',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'FSP Approved Auth',
        accessor: () => 0, // This field doesn't exist in the API response
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Auth Decline',
        accessor: 'dAuthDeclineAmt',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Activation Date',
        accessor: 'dtActivated',
        Cell: ({ value }: { value: unknown }) => formatDate(value),
      },
      {
        Header: 'Channel',
        accessor: 'sChannel',
      },
      {
        Header: 'Reseller',
        accessor: 'sReseller',
      },
      {
        Header: 'Risk Watch',
        accessor: 'bRiskWatch',
        Cell: ({ value }: { value: unknown }) => formatBoolean(value),
      },
      {
        Header: 'New Account',
        accessor: 'bNewAcct',
        Cell: ({ value }: { value: unknown }) => formatBoolean(value),
      },
      {
        Header: 'Keyed %',
        accessor: 'iNumOfKeyedTransAboveLimit',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Avg Ticket',
        accessor: () => 0, // Not in the API response
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'High Ticket',
        accessor: 'iTransAmtAboveHighTicketLimit',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Credit',
        accessor: 'iCreditRule',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Channel',
        accessor: 'iSalesChannelRule',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Monthly Vol',
        accessor: 'iBatchVolAboveLimit',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Avg Batch',
        accessor: 'iAvgBatch',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Dup Card',
        accessor: 'iDupCard',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Dup Bin',
        accessor: 'iDupBin',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Late Post',
        accessor: 'iLatePostTrans',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Foreign Keyed',
        accessor: 'iFgnkeyedTrans',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Chargeback',
        accessor: 'iChbkOrIRR',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Divert',
        accessor: 'bDivert',
        Cell: ({ value }: { value: unknown }) => formatBoolean(value),
      },
      {
        Header: 'Divert Balance',
        accessor: 'dSettlementBalance',
        Cell: ({ value }: { value: unknown }) => formatNumber(value),
      },
      {
        Header: 'Amex OptBlue',
        accessor: 'sAMEXOptBlueInd',
        Cell: ({ value }: { value: unknown }) => formatBoolean(value),
      },
      {
        Header: 'MOTO AVS',
        accessor: 'iMototIoAVS',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'Settle 30%+',
        accessor: 'iAuthCaptureAmtLargeVariation',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'No Auth',
        accessor: 'iNoAuthTrans',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'Auth Decline',
        accessor: 'iAuthDecline',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'Negative Batch',
        accessor: 'iNegDailyBatches',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'Auto Hold',
        accessor: 'iAutoHold',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'Funding Exception',
        accessor: 'iFundingExclusionAndException',
        Cell: ({ value }: { value: unknown }) => formatScore(value),
      },
      {
        Header: 'Exception Created',
        accessor: 'dtCreated',
        Cell: ({ value }: { value: unknown }) => formatDate(value),
      },
      {
        Header: 'Exception ID',
        accessor: 'pkRiskRadarExceptions',
        Cell: ({ value }: { value: unknown }) => String(value),
      },
    ];

    if (status === 1) {
      baseColumns.push({
        Header: () => (
          <div>
            <button
              className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              type="button"
              onClick={handleClickOnReviewButton}
            >
              Review
            </button>
          </div>
        ),
        accessor: 'sUserReviewed',
        Cell: ({ row }: CellProps<RiskRadarExceptionsListRow>) => (
          <input
            type="checkbox"
            placeholder="Enter notes"
            onClick={(e) => {
              e.stopPropagation();
            }}
            checked={reviewIds.includes(
              String(row.original.pkRiskRadarExceptions)
            )}
            onChange={() =>
              handleReviewCheckboxChange(
                String(row.original.pkRiskRadarExceptions)
              )
            }
            className="border p-1 rounded"
          />
        ),
      });
    } else if (status === 2) {
      baseColumns.push({
        Header: 'Reviewed',
        accessor: 'sUserReviewed',
        Cell: ({ value }: CellProps<RiskRadarExceptionsListRow>) =>
          value ? String(value) : 'N/A',
      });
    } else if (status === 3) {
      baseColumns.push({
        Header: () => (
          <div>
            <select
              value={assignedUser}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setAssignedUser(e.target.value)}
              className="bg-transparent pl-2"
            >
              {riskUsers?.map((user: RiskUser) => (
                <option key={user.sNTUserID} value={String(user.sNTUserID)}>
                  {user.sName}
                </option>
              ))}
            </select>
            <button
              className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              type="button"
              onClick={handleClickOnAssignButton}
            >
              Assign
            </button>
          </div>
        ),
        accessor: 'sUserReviewed',
        Cell: ({ row }: CellProps<RiskRadarExceptionsListRow>) => (
          <input
            type="checkbox"
            onClick={(e) => e.stopPropagation()}
            checked={assignedExceptionIds.includes(
              String(row.original.pkRiskRadarExceptions)
            )}
            onChange={() =>
              handleAssignedCheckboxChange(
                String(row.original.pkRiskRadarExceptions)
              )
            }
            className="border p-1 rounded"
          />
        ),
      });
    } else if (status === 4) {
      baseColumns.push({
        Header: 'Assigned to',
        accessor: (row) => row.sNTUserID,
        Cell: ({ row }: CellProps<RiskRadarExceptionsListRow>) =>
          riskUsers?.find(
            (user) => String(user.sNTUserID) === String(row.original.sNTUserID)
          )?.sName ?? 'N/A',
      });
    }

    return baseColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    reviewIds,
    assignedUser,
    assignedExceptionIds,
    handleReviewCheckboxChange,
    handleAssignedCheckboxChange,
  ]);

  const tableInstance = useTable<RiskRadarExceptionsListRow>(
    {
      columns,
      data: data.data || [],
      initialState: {
        pageSize: data.pageSize || DEFAULT_PAGE_SIZE,
        pageIndex: (data?.page || DEFAULT_PAGE_NUMBER) - 1,
      } as Partial<TableState<RiskRadarExceptionsListRow>>,
      // Tell the table we'll handle pagination ourselves
      // @ts-expect-error - manualPagination is supported but TypeScript definitions might be outdated
      manualPagination: true,
      pageCount: data?.totalRecords || 1,
    },
    useFilters,
    useSortBy,
    usePagination
  ) as TableInstanceWithPagination<RiskRadarExceptionsListRow>;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    // pageOptions,
    setPageSize,
    gotoPage,
  } = tableInstance;

  const { filters, setFilters } = useFilteredRiskRadar();

  useEffect(() => {
    const newPage = state.pageIndex + 1;
    if (newPage !== filters.page) {
      // TODO: Update the filters
    }
  }, [state.pageIndex, setFilters, filters.page]);

  useEffect(() => {
    if (state.pageSize !== filters.pageSize) {
      // TODO: Update the filters
    }
  }, [state.pageSize, setFilters, filters.pageSize]);

  const handlePageChange = useCallback(
    (newPageIndex: number) => {
      gotoPage(newPageIndex);
    },
    [gotoPage]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
    },
    [setPageSize]
  );

  const router = useRouter();

  const goToMerchantDetails = useCallback(
    (merchantId: string, exceptionId: number): void => {
      router.push(
        `/risk-radar/merchants/${merchantId}/exception/${exceptionId}`
      );
    },
    [router]
  );

  // Display a message if no data is available
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-center">No data available</p>
      </div>
    );
  }

  return (
    <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 text-xs shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-end border-b border-stroke px-8 pb-4 dark:border-strokedark">
        <div className="flex items-center font-medium">
          <select
            value={state.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="bg-transparent pl-2"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <p className="pl-2 text-black dark:text-white">Entries Per Page</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="datatable-table w-full table-auto !border-collapse break-words px-4 md:px-8 align-middle"
        >
          <thead>
            {headerGroups.map(
              (headerGroup: HeaderGroup<RiskRadarExceptionsListRow>) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (column: ColumnInstance<RiskRadarExceptionsListRow>) => (
                      <th {...column.getHeaderProps()} key={column.id}>
                        <div className="flex items-center">
                          <span>
                            {column.render('Header') as React.ReactNode}
                          </span>
                        </div>
                      </th>
                    )
                  )}
                </tr>
              )
            )}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<RiskRadarExceptionsListRow>) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                  onClick={() =>
                    goToMerchantDetails(
                      row.original.sMID,
                      row.original.pkRiskRadarExceptions
                    )
                  }
                >
                  {row.cells.map((cell: Cell<RiskRadarExceptionsListRow>) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render('Cell') as React.ReactNode}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between border-t border-stroke px-8 pt-5 dark:border-strokedark">
        <p className="font-medium">
          Showing {data.pageSize} to {data.pageSize} of {data.totalRecords}{' '}
          entries
        </p>
        <div className="flex">
          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-whiter"
            onClick={() => {
              previousPage();
            }}
            disabled={!canPreviousPage}
            type="button"
            aria-label="Previous"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z"
                fill=""
              />
            </svg>
          </button>

          {Array.from({ length: data.totalRecords ?? 0 }, (_, i) => i).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${
                  state.pageIndex === page && 'bg-primary text-white'
                } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white`}
                type="button"
              >
                {page + 1}
              </button>
            )
          )}

          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white"
            onClick={() => {
              nextPage();
            }}
            disabled={!canNextPage}
            type="button"
            aria-label="Next"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
