// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
import React, { useMemo } from "react";
import type { Column } from "react-table";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import type {
  RiskRadarData,
  RiskRadarResponseDto,
} from "@/shared/response/legacy-dashboard-proxy";

type RiskRadarTableProps = {
  data: RiskRadarResponseDto;
};

const RiskRadarTable: React.FC<RiskRadarTableProps> = ({ data }) => {
  const columns = useMemo<Column<RiskRadarData>[]>(
    () => [
      {
        Header: "DBA",
        accessor: "dba",
      },
      {
        Header: "Net Deposit",
        accessor: "net_dep_amt",
        Cell: ({ value }) => `${value.toLocaleString()}`,
      },
      {
        Header: "FSP Approved Auth",
        accessor: "fsp_appr_auth_tot_amt",
        Cell: ({ value }) => `${value.toLocaleString()}`,
      },
      {
        Header: "Auth Decline",
        accessor: "auth_decline_amt",
        Cell: ({ value }) => `${value.toLocaleString()}`,
      },
      {
        Header: "Activation Date",
        accessor: "activation_datetime",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Channel",
        accessor: "channel",
      },
      {
        Header: "Reseller",
        accessor: "reseller",
      },
      {
        Header: "Risk Watch",
        accessor: "risk_watch",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "New Account",
        accessor: "new_account",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Auto Approved",
        accessor: "Auto_Approved_date",
      },
      {
        Header: "Keyed %",
        accessor: "keyed_perc_score",
        Cell: ({ value }) => (value ? `${value}%` : "N/A"),
      },
      {
        Header: "Average Ticket Score",
        accessor: "avg_ticket_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "High Ticket Score",
        accessor: "high_ticket_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Credit Score",
        accessor: "credit_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Channel Score",
        accessor: "channel_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Monthly Volume Score",
        accessor: "monthly_vol_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Average Batch Score",
        accessor: "avg_batch_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Duplicate Card Score",
        accessor: "dup_card_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Duplicate BIN Score",
        accessor: "dup_bin_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Late Post Score",
        accessor: "late_post_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Foreign Keyed Score",
        accessor: "foreign_keyed_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Chargeback Return Request Score",
        accessor: "chbk_ret_req_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Next Day Funding",
        accessor: "next_day_funding",
        Cell: ({ value }) => (value === "Y" ? "Yes" : "No"),
      },
      {
        Header: "Divert",
        accessor: "divert",
        Cell: ({ value }) => (value === "Y" ? "Yes" : "No"),
      },
      {
        Header: "Divert Balance Amount",
        accessor: "divert_balance_amt",
        Cell: ({ value }) => `${Number(value).toLocaleString()}`,
      },
      {
        Header: "Amex OptBlue",
        accessor: "amex_opt_blue",
        Cell: ({ value }) => (value === "Y" ? "Yes" : "No"),
      },
      {
        Header: "MOTO AVS Score",
        accessor: "moto_avs_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Settle 30% More Than Auth Score",
        accessor: "settle_30perc_more_than_auth_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "No Auth Score",
        accessor: "no_auth_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Auth Decline Score",
        accessor: "auth_decline_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Negative Batch Score",
        accessor: "neg_batch_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Auto Hold Score",
        accessor: "auto_hold_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "Funding Exception Score",
        accessor: "funding_exception_score",
        Cell: ({ value }) => Number(value).toFixed(2),
      },
      {
        Header: "User Reviewed",
        accessor: "user_reviewed",
        Cell: ({ value }) => (value === "Y" ? "Yes" : "No"),
      },
      {
        Header: "Exception Created",
        accessor: "exception_created_datetime",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
      },
      {
        Header: "Exception ID",
        accessor: "exception_id",
      },
    ],
    [],
  );
  const tableData = useMemo(() => data.DATA, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 text-xs shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between border-b border-stroke px-8 pb-4 dark:border-strokedark">
        <div className="w-100">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
            placeholder="Search..."
          />
        </div>

        <div className="flex items-center font-medium">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
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
          className="datatable-table w-full table-auto !border-collapse break-words px-4 md:px-8"
        >
          <thead>
            {headerGroups.map((headerGroup, key) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                {headerGroup.headers.map((column, hkey) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    <div className="flex items-center">
                      <span> {column.render("Header") as React.ReactNode}</span>

                      <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                          <svg
                            className="fill-current"
                            width="10"
                            height="5"
                            viewBox="0 0 10 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5 0L0 5H10L5 0Z" fill="" />
                          </svg>
                        </span>
                        <span className="inline-block">
                          <svg
                            className="fill-current"
                            width="10"
                            height="5"
                            viewBox="0 0 10 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z"
                              fill=""
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={key}>
                  {row.cells.map((cell, key) => (
                    <td {...cell.getCellProps()} key={key}>
                      {cell.render("Cell") as React.ReactNode}
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
          Showing {pageIndex + 1} of {pageOptions.length} pages
        </p>
        <div className="flex">
          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-whiter"
            onClick={() => previousPage()}
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

          {pageOptions.map((_page, index) => (
            <button
              key={_page}
              onClick={() => gotoPage(index)}
              className={`${
                pageIndex === index && "bg-primary text-white"
              } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white`}
              type="button"
            >
              {index + 1}
            </button>
          ))}

          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white"
            onClick={(): void => nextPage()}
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

export default RiskRadarTable;
