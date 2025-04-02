/* eslint-disable react/no-unstable-nested-components */
import { useAuth } from '@frontegg/nextjs';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
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
import type {
  RiskRadarExceptionsListRow,
  RiskRadarFilterState,
} from '@/shared/response';
import { useExceptionData } from '@/web/src/hooks/risk-radar/use-exception-data';

import { baseColumns } from './table/base-columns';
import { ManagerQueuedCell } from './table/manager-queued-cell';
import { ManagerQueuedHeader } from './table/manager-queued-header';
import { NotReviewedCell } from './table/not-reviewed-cell';
import { NotReviewedHeader } from './table/not-reviewed-header';
import { TablePagination } from './table/table-pagination';

type RiskRadarTableProps = {
  exceptionList: PaginatedAPIResponse<RiskRadarExceptionsListRow>;
  status: number;
  filters: RiskRadarFilterState;
  fetchData: (filters: RiskRadarFilterState) => void;
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
  exceptionList,
  status,
  filters,
  fetchData,
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

  const handleClickOnReviewButton = useCallback(async (): Promise<void> => {
    if (reviewIds.length > 0 && user?.name) {
      await reviewException(
        reviewIds.map((id) => parseInt(id, 10)),
        user.name
      );
    }
  }, [reviewException, reviewIds, user?.name]);

  const handleClickOnAssignButton = useCallback(async (): Promise<void> => {
    if (assignedExceptionIds.length > 0 && assignedUser) {
      await assignException(
        assignedExceptionIds.map((id) => parseInt(id, 10)),
        assignedUser
      );
    }
  }, [assignException, assignedExceptionIds, assignedUser]);

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

  const handlePageSizeChange = useCallback(
    (pageSize: number): void => {
      fetchData({ ...filters, pageSize, page: 1 });
    },
    [fetchData, filters]
  );

  const columns = useMemo<CustomColumn[]>(() => {
    const completedColumns = baseColumns;

    switch (status) {
      case 1:
        completedColumns.push({
          accessor: 'sUserReviewed',
          Header: (
            <NotReviewedHeader
              handleClickOnReviewButton={handleClickOnReviewButton}
            />
          ),
          Cell: ({ row }) => (
            <NotReviewedCell
              reviewIds={reviewIds}
              handleReviewCheckboxChange={handleReviewCheckboxChange}
              row={row}
            />
          ),
        });
        break;
      case 2:
        completedColumns.push({
          Header: 'Reviewed',
          accessor: 'sUserReviewed',
          Cell: ({ value }) => value ?? 'N/A',
        });
        break;
      case 3:
        completedColumns.push({
          Header: (
            <ManagerQueuedHeader
              riskUsers={riskUsers ?? []}
              setAssignedUser={setAssignedUser}
              handleClickOnAssignButton={handleClickOnAssignButton}
            />
          ),
          accessor: 'sUserReviewed',
          Cell: ({ row }) => (
            <ManagerQueuedCell
              assignedExceptionIds={assignedExceptionIds}
              handleAssignedCheckboxChange={handleAssignedCheckboxChange}
              row={row}
            />
          ),
        });
        break;
      case 4:
        completedColumns.push({
          Header: 'Assigned to',
          accessor: (row) => row.sNTUserID,
          Cell: ({ row }: CellProps<RiskRadarExceptionsListRow>) =>
            riskUsers?.find((u) => u.sNTUserID === row.original.sNTUserID)
              ?.sName ?? 'N/A',
        });
        break;
      default:
        break;
    }

    return completedColumns;
  }, [
    status,
    handleClickOnReviewButton,
    riskUsers,
    handleClickOnAssignButton,
    reviewIds,
    handleReviewCheckboxChange,
    assignedExceptionIds,
    handleAssignedCheckboxChange,
  ]);

  const tableInstance = useTable<RiskRadarExceptionsListRow>(
    {
      columns,
      data: exceptionList.data || [],
      initialState: {
        pageSize: exceptionList.pageSize || DEFAULT_PAGE_SIZE,
        pageIndex: (exceptionList?.page || DEFAULT_PAGE_NUMBER) - 1,
      } as Partial<TableState<RiskRadarExceptionsListRow>>,
      // Tell the table we'll handle pagination ourselves
      // @ts-expect-error - manualPagination is supported but TypeScript definitions might be outdated
      manualPagination: true,
      pageCount: exceptionList?.totalRecords || 1,
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
  } = tableInstance;

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
  if (
    !exceptionList ||
    !exceptionList.data ||
    exceptionList.data.length === 0
  ) {
    return (
      <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 text-xs shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-end border-b border-stroke px-8 pb-4 dark:border-strokedark">
          <div className="flex items-center font-medium">
            <select
              value={state.pageSize}
              className="bg-transparent pl-2"
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
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

        <TablePagination
          page={exceptionList.page}
          pageSize={exceptionList.pageSize}
          totalRecords={exceptionList.totalRecords ?? 0}
          fetchData={fetchData}
          filters={filters}
        />
      </section>
    </div>
  );
};
