/* eslint-disable react/no-unstable-nested-components */
import { DataTable, DynamicCell, Loader } from '@denali/ui';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { FC } from 'react';
import React, { useMemo } from 'react';

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

        enableSorting: true,
        sortingFn: 'datetime',
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('authAmount', {
        header: () => 'Auth Amt',
        cell: (info) => (
          <td className="text-right">
            {info.row.original.authResponseDescription ? (
              <Tooltip text={info.row.original.authResponseDescription}>
                <span className="text-black dark:text-white">
                  {formatCurrency(info.getValue())}
                </span>
              </Tooltip>
            ) : (
              <span className="text-black dark:text-white">
                {formatCurrency(info.getValue())}
              </span>
            )}
          </td>
        ),

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
              className={`text-right cursor-pointer text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-600 ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },

        enableSorting: true,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('posEntryMode', {
        header: () => 'POS',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),

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

        enableSorting: true,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('debitNetworkIdentifier', {
        header: () => 'PIN',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),

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

        enableSorting: false,
        meta: {
          align: 'center',
        },
      }),
    ] as ColumnDef<TransactionExceptionResponseDto>[];
  }, [exceptionTypes, onCardNumberClick, onTransactionAmountClick]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <DataTable
        tableContainerClassName="max-h-[220px]"
        columns={columns}
        data={{
          data: data.map((item) => ({
            ...item,
            id: item.transactionId,
          })),
          count: data.length,
          total: data.length,
          page: pageIndex,
          pageCount: Math.ceil(data.length / pageSize),
        }}
        isLoading={isLoading}
        initialItemsPerPage={ITEMS_PER_PAGE}
        onSetPagination={setPagination}
      />
    </div>
  );
};
