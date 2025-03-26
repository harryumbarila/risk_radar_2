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

import type {
  RiskRadarResponseDto,
  RiskUser,
} from '@/shared/response/legacy-dashboard-proxy';
import { useAssignExceptionToUser } from '@/web/src/hooks/risk-radar/use-assign-exception-to-user';
import type { FilterState } from '@/web/src/hooks/risk-radar/use-filtered-risk-radar';
import { useReviewExceptionByUsername } from '@/web/src/hooks/risk-radar/use-review-exception-by-username';

type RiskRadarData = {
  dba: string;
  net_dep_amt: number;
  fsp_appr_auth_tot_amt: number;
  auth_decline_amt: number;
  activation_datetime: string;
  channel: string;
  reseller: string;
  risk_watch: boolean;
  new_account: boolean;
  exception_id: string;
  assigned_user_id?: number;
  user_reviewed?: string;
  keyed_perc_score: number;
  avg_ticket_score: number;
  high_ticket_score: number;
  credit_score: number;
  channel_score: number;
  monthly_vol_score: number;
  avg_batch_score: number;
  dup_card_score: number;
  dup_bin_score: number;
  late_post_score: number;
  foreign_keyed_score: number;
  chbk_ret_req_score: number;
  divert: boolean;
  divert_balance_amt: number;
  amex_opt_blue: boolean;
  moto_avs_score: number;
  settle_30perc_more_than_auth_score: number;
  no_auth_score: number;
  auth_decline_score: number;
  neg_batch_score: number;
  auto_hold_score: number;
  funding_exception_score: number;
  exception_created_datetime: string;
  mid: string;
};

type RiskRadarTableProps = {
  data: RiskRadarResponseDto;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  status: number;
  riskUsers: { risk_users: RiskUser[] };
  filters: FilterState;
};

type CustomColumn = Column<RiskRadarData>;

type TableInstanceWithPagination<T extends object = RiskRadarData> =
  TableInstance<T> & {
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
  filters,
  setFilters,
  status,
  riskUsers,
}): JSX.Element => {
  const [reviewIds, setReviewIds] = useState<string[]>([]);
  const [assignedExceptionIds, setAssignedExceptionIds] = useState<string[]>(
    []
  );
  const [assignedUser, setAssignedUser] = useState(
    String(riskUsers?.risk_users?.[0]?.user_id ?? '')
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
    return value ? 'Yes' : 'No';
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
        accessor: 'dba',
      },
      {
        Header: 'Net Deposit',
        accessor: 'net_dep_amt',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'FSP Approved Auth',
        accessor: 'fsp_appr_auth_tot_amt',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Auth Decline',
        accessor: 'auth_decline_amt',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Activation Date',
        accessor: 'activation_datetime',
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: 'Channel',
        accessor: 'channel',
      },
      {
        Header: 'Reseller',
        accessor: 'reseller',
      },
      {
        Header: 'Risk Watch',
        accessor: 'risk_watch',
        Cell: ({ value }) => formatBoolean(value),
      },
      {
        Header: 'New Account',
        accessor: 'new_account',
        Cell: ({ value }) => formatBoolean(value),
      },
      {
        Header: 'Keyed %',
        accessor: 'keyed_perc_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Avg Ticket',
        accessor: 'avg_ticket_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'High Ticket',
        accessor: 'high_ticket_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Credit',
        accessor: 'credit_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Channel',
        accessor: 'channel_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Monthly Vol',
        accessor: 'monthly_vol_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Avg Batch',
        accessor: 'avg_batch_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Dup Card',
        accessor: 'dup_card_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Dup Bin',
        accessor: 'dup_bin_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Late Post',
        accessor: 'late_post_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Foreign Keyed',
        accessor: 'foreign_keyed_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Chargeback',
        accessor: 'chbk_ret_req_score',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Divert',
        accessor: 'divert',
        Cell: ({ value }) => formatBoolean(value),
      },
      {
        Header: 'Divert Balance',
        accessor: 'divert_balance_amt',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Amex OptBlue',
        accessor: 'amex_opt_blue',
        Cell: ({ value }) => formatBoolean(value),
      },
      {
        Header: 'MOTO AVS',
        accessor: 'moto_avs_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'Settle 30%+',
        accessor: 'settle_30perc_more_than_auth_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'No Auth',
        accessor: 'no_auth_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'Auth Decline',
        accessor: 'auth_decline_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'Negative Batch',
        accessor: 'neg_batch_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'Auto Hold',
        accessor: 'auto_hold_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'Funding Exception',
        accessor: 'funding_exception_score',
        Cell: ({ value }) => formatScore(value),
      },
      {
        Header: 'Exception Created',
        accessor: 'exception_created_datetime',
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: 'Exception ID',
        accessor: 'exception_id',
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
        accessor: 'user_reviewed',
        Cell: ({ row }: CellProps<RiskRadarData>) => (
          <input
            type="checkbox"
            placeholder="Enter notes"
            onClick={(e) => {
              e.stopPropagation();
            }}
            checked={reviewIds.includes(row.original.exception_id)}
            onChange={() =>
              handleReviewCheckboxChange(row.original.exception_id)
            }
            className="border p-1 rounded"
          />
        ),
      });
    } else if (status === 2) {
      baseColumns.push({
        Header: 'Reviewed',
        accessor: 'user_reviewed',
        Cell: ({ value }: CellProps<RiskRadarData>) =>
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
              {riskUsers?.risk_users?.map((user: RiskUser) => (
                <option key={user.user_id} value={String(user.user_id)}>
                  {user.username}
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
        accessor: 'user_reviewed',
        Cell: ({ row }: CellProps<RiskRadarData>) => (
          <input
            type="checkbox"
            onClick={(e) => e.stopPropagation()}
            checked={assignedExceptionIds.includes(row.original.exception_id)}
            onChange={() =>
              handleAssignedCheckboxChange(row.original.exception_id)
            }
            className="border p-1 rounded"
          />
        ),
      });
    } else if (status === 4) {
      baseColumns.push({
        Header: 'Assigned to',
        accessor: 'assigned_user_id',
        Cell: ({ row }: CellProps<RiskRadarData>) =>
          riskUsers?.risk_users?.find(
            // eslint-disable-next-line eqeqeq
            (user) => user.user_id == row.original.assigned_user_id
          )?.username ?? 'N/A',
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

  const transformedData = useMemo(
    () =>
      data.data.map((item) => ({
        ...item,
        net_dep_amt: Number(item.net_dep_amt),
        fsp_appr_auth_tot_amt: Number(item.fsp_appr_auth_tot_amt),
        auth_decline_amt: Number(item.auth_decline_amt),
        keyed_perc_score: Number(item.keyed_perc_score),
        avg_ticket_score: Number(item.avg_ticket_score),
        high_ticket_score: Number(item.high_ticket_score),
        credit_score: Number(item.credit_score),
        channel_score: Number(item.channel_score),
        monthly_vol_score: Number(item.monthly_vol_score),
        avg_batch_score: Number(item.avg_batch_score),
        dup_card_score: Number(item.dup_card_score),
        dup_bin_score: Number(item.dup_bin_score),
        late_post_score: Number(item.late_post_score),
        foreign_keyed_score: Number(item.foreign_keyed_score),
        chbk_ret_req_score: Number(item.chbk_ret_req_score),
        divert_balance_amt: Number(item.divert_balance_amt),
        moto_avs_score: Number(item.moto_avs_score),
        settle_30perc_more_than_auth_score: Number(
          item.settle_30perc_more_than_auth_score
        ),
        no_auth_score: Number(item.no_auth_score),
        auth_decline_score: Number(item.auth_decline_score),
        neg_batch_score: Number(item.neg_batch_score),
        auto_hold_score: Number(item.auto_hold_score),
        funding_exception_score: Number(item.funding_exception_score),
        risk_watch: item.risk_watch === 'true',
        new_account: item.new_account === 'true',
        divert: item.divert === 'true',
        amex_opt_blue: item.amex_opt_blue === 'true',
      })),
    [data.data]
  );

  const tableInstance = useTable<RiskRadarData>(
    {
      columns,
      data: transformedData,
      initialState: {
        pageSize: filters.records_per_page,
        pageIndex: filters.current_page - 1,
      } as Partial<TableState<RiskRadarData>>,
    },
    useFilters,
    useSortBy,
    usePagination
  ) as TableInstanceWithPagination<RiskRadarData>;

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
    pageOptions,
    setPageSize,
    gotoPage,
  } = tableInstance;

  useEffect(() => {
    const newPage = state.pageIndex + 1;
    if (newPage !== filters.current_page) {
      setFilters((prev) => ({
        ...prev,
        current_page: newPage,
      }));
    }
  }, [state.pageIndex, setFilters, filters.current_page]);

  useEffect(() => {
    if (state.pageSize !== filters.records_per_page) {
      setFilters((prev) => ({
        ...prev,
        records_per_page: state.pageSize,
      }));
    }
  }, [state.pageSize, setFilters, filters.records_per_page]);

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
    (merchantId: string, exceptionId: string): void => {
      router.push(
        `/risk-radar/merchants/${merchantId}/exception/${exceptionId}`
      );
    },
    [router]
  );

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
            {headerGroups.map((headerGroup: HeaderGroup<RiskRadarData>) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(
                  (column: ColumnInstance<RiskRadarData>) => (
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
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<RiskRadarData>) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                  onClick={() =>
                    goToMerchantDetails(
                      row.original.mid,
                      row.original.exception_id
                    )
                  }
                >
                  {row.cells.map((cell: Cell<RiskRadarData>) => (
                    <td {...cell.getCellProps()} key={cell.row.id}>
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
          Showing {state.pageIndex + 1} of {pageOptions.length} pages
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

          {pageOptions.map((_page: number, index: number) => (
            <button
              key={_page}
              onClick={() => handlePageChange(index)}
              className={`${
                state.pageIndex === index && 'bg-primary text-white'
              } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white`}
              type="button"
            >
              {index + 1}
            </button>
          ))}

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
