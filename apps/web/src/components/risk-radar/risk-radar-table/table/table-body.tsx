'use client';

import type { CellContext, HeaderContext } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

import type { CommonStatus } from '@/shared/common';
import type { RiskRadarExceptionsListRow } from '@/shared/response';
import { Loader } from '@/ui/common';

import type { RiskRadarTableColumn } from './base-columns';
import { SortHeaderCell } from './sort-header-cell';

type Props = {
  exceptionList: RiskRadarExceptionsListRow[];
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  columns: RiskRadarTableColumn[];
  dataStatus?: CommonStatus;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  onSort?: (column: string) => void;
};

export const TableBody: FC<Props> = ({
  exceptionList,
  pageSize,
  currentPage,
  totalRecords,
  columns,
  dataStatus,
  sortBy,
  sortDirection,
  onSort,
}) => {
  const router = useRouter();

  // As we have a lot of columns if there is no data we hide them to see the not data available message
  const columnsToRender = dataStatus || !exceptionList.length ? [] : columns;
  const goToMerchantDetails = (
    merchantId?: string,
    exceptionId?: number
  ): void => {
    if (merchantId) {
      router.push(
        `/risk-radar/merchants/${merchantId}${exceptionId ? `?exceptionId=${exceptionId}` : ''}`
      );
    }
  };

  const table = useReactTable({
    data: exceptionList,
    columns: columnsToRender,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalRecords / pageSize),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  });

  const renderHeader = (
    header: HeaderContext<RiskRadarExceptionsListRow, unknown>
  ): ReactNode => {
    const headerDef = header.column.columnDef.header;
    const columnId = header.column.id;

    if (typeof headerDef === 'string') {
      return (
        <SortHeaderCell
          label={headerDef}
          sortDirection={columnId === sortBy ? sortDirection : null}
          onSort={() => onSort?.(columnId)}
          enableSorting={header.column.getCanSort()}
        />
      );
    }
    if (typeof headerDef === 'function') {
      return headerDef(header) as ReactNode;
    }
    return null;
  };

  const renderCell = (
    cell: CellContext<RiskRadarExceptionsListRow, unknown>
  ): ReactNode => {
    const cellDef = cell.column.columnDef.cell;
    if (typeof cellDef === 'function') {
      return cellDef(cell) as ReactNode;
    }
    const value = cell.getValue() as ReactNode;

    return value;
  };

  const statusContent = useMemo(() => {
    if (!dataStatus && !exceptionList.length) {
      return <p className="text-center">No data available</p>;
    }

    if (dataStatus === 'error') {
      return <p className="text-center text-red-500">Error</p>;
    }

    if (dataStatus === 'loading') {
      return <Loader size="small" fullScreen={false} />;
    }

    return null;
  }, [dataStatus, exceptionList.length]);

  return (
    <div className="overflow-x-auto">
      <table className="datatable-table w-full table-auto !border-collapse break-words px-4 md:px-8 align-middle text-black dark:text-white">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div className="flex items-center">
                    <span className="font-bold">
                      {header.isPlaceholder
                        ? null
                        : renderHeader(header.getContext())}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {statusContent && (
            <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default dark:border-strokedark dark:bg-boxdark">
              {statusContent}
            </div>
          )}

          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => {
                const value = renderCell(cell.getContext());
                const isLast = row.getVisibleCells().length === index + 1;
                return (
                  <td
                    className={classNames('cursor-pointer')}
                    key={cell.id}
                    onClick={() => {
                      // Last column is interactive
                      if (isLast) return;

                      goToMerchantDetails(
                        cell.row.original.sMID || cell.row.original.irisMId,
                        cell.row.original.pkRiskRadarExceptions
                      );
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
