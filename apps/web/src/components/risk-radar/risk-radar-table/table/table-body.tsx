import type { CellContext, HeaderContext } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { useCallback } from 'react';

import type { RiskRadarExceptionsListRow } from '@/shared/response';

import type { RiskRadarTableColumn } from './base-columns';

type Props = {
  exceptionList: RiskRadarExceptionsListRow[];
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  columns: RiskRadarTableColumn[];
};

export const TableBody: FC<Props> = ({
  exceptionList,
  pageSize,
  currentPage,
  totalRecords,
  columns,
}) => {
  const router = useRouter();

  const goToMerchantDetails = useCallback(
    (merchantId: string, exceptionId: number): void => {
      router.push(
        `/risk-radar/merchants/${merchantId}/exception/${exceptionId}`
      );
    },
    [router]
  );

  const table = useReactTable({
    data: exceptionList,
    columns,
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
    if (typeof headerDef === 'string') {
      return headerDef;
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

  return (
    <div className="overflow-x-auto">
      <table className="datatable-table w-full table-auto !border-collapse break-words px-4 md:px-8 align-middle">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div className="flex items-center">
                    <span>
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() =>
                goToMerchantDetails(
                  row.original.sMID,
                  row.original.pkRiskRadarExceptions
                )
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{renderCell(cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
