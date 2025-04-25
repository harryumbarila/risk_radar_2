/* eslint-disable react/no-unstable-nested-components */
import { DataTable, DynamicCell } from '@denali/ui';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import type { PaginationResponse } from '@/shared/common';
import type { TransactionExceptionResponseDto } from '@/shared/response';
import { Tooltip } from '@/ui/common/tool-tips/risk-tooltip';
import {
  formatCurrency,
  formatDate,
} from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import { useTransactionExceptions } from '@/web/src/hooks/risk-radar/use-transaction-exceptions';

const ITEMS_PER_PAGE = 50;

const columnHelper = createColumnHelper<TransactionExceptionResponseDto>();

type ExceptionTableProps = {
  exceptionId?: string;
  exceptionTypes?: {
    id: number;
    description: string;
  }[];
  onCardNumberClick: (arg: TransactionExceptionResponseDto) => void;
  onTransactionAmountClick: (arg: TransactionExceptionResponseDto) => void;
};

export const ExceptionsTable: FC<ExceptionTableProps> = ({
  exceptionId,
  exceptionTypes,
  onCardNumberClick,
  onTransactionAmountClick,
}) => {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: ITEMS_PER_PAGE,
    });
  const { data, isLoading } = useTransactionExceptions(exceptionId || null);

  const columns = useMemo<ColumnDef<TransactionExceptionResponseDto>[]>(() => {
    return [
      columnHelper.accessor('transactionDate', {
        header: () => 'Trans Date',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatDate(info.getValue(), 'MM/dd/yyyy kk:mm:ss')}
            className="text-center"
          />
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('authAmount', {
        header: () => 'Auth Amt',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatCurrency(info.getValue())}
            className="text-right"
          />
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('transactionAmount', {
        header: () => 'Trans Amt',
        cell: (info) => {
          const value = info.getValue();
          const transactionAmount =
            value >= 0
              ? formatCurrency(value)
              : `(${formatCurrency(Math.abs(value))})`;
          return (
            <DynamicCell
              type="text"
              value={transactionAmount}
              onClick={() => onTransactionAmountClick(info.row.original)}
              className={`text-right cursor-pointer text-blue-600 hover:text-blue-800 hover:underline ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('posEntryMode', {
        header: () => 'Post',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('avsResponseCode', {
        header: () => 'AVS',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('authCode', {
        header: () => 'Auth Code',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('cardNumber', {
        header: () => 'Card #',
        cell: (info) => (
          <td>
            <span className="block text-center">
              <button
                type="button"
                className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => onCardNumberClick(info.row.original)}
              >
                {info.getValue()}
              </button>
              {` ${info.row.original.transactionId?.slice(-4)}`}
            </span>
          </td>
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('transactionId', {
        header: () => 'PIN',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('exceptionList', {
        header: () => 'Eligible Exceptions',
        cell: (info) => (
          <td className="text-center">
            {info.getValue() &&
              info
                .getValue()
                .split(' ')
                .filter((r) => !!r && r !== '-')
                .map((exceptionNumber) => (
                  <Tooltip
                    key={exceptionNumber}
                    text={
                      exceptionTypes?.filter(
                        (exceptionType) =>
                          exceptionType.id === parseInt(exceptionNumber, 10)
                      )[0]?.description ?? ''
                    }
                  >
                    <span className="cursor-pointer m-[4px] text-blue-600 underline">
                      {exceptionNumber}
                    </span>
                  </Tooltip>
                ))}
          </td>
        ),
        footer: (info) => info.column.id,
        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
    ] as ColumnDef<TransactionExceptionResponseDto>[];
  }, [exceptionTypes, onCardNumberClick, onTransactionAmountClick]);

  const entries =
    useMemo((): PaginationResponse<TransactionExceptionResponseDto> | null => {
      if (!data || !Array.isArray(data)) {
        return null;
      }

      const totalCount = data.length;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;

      // Handle empty state or out-of-bounds
      if (startIndex >= totalCount) {
        return {
          data: [],
          count: 0,
          total: totalCount,
          page: pageIndex,
          pageCount: Math.ceil(totalCount / pageSize),
        };
      }

      const paginatedEntries = data.slice(startIndex, endIndex);

      return {
        data: paginatedEntries.map((item) => ({
          ...item,
          id: item.transactionId,
        })),
        count: paginatedEntries.length,
        total: totalCount,
        page: pageIndex,
        pageCount: Math.ceil(totalCount / pageSize),
      };
    }, [data, pageIndex, pageSize]);

  if (!entries) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <DataTable
        tableContainerClassName="max-h-[500px]"
        columns={columns}
        data={entries}
        isLoading={isLoading}
        initialItemsPerPage={ITEMS_PER_PAGE}
        onSetPagination={setPagination}
      />
    </div>
  );
};
