import { DataTable, DynamicCell, Loader } from '@denali/ui';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import {
  formatCurrency,
  formatDate,
  formatDateWithoutTime,
} from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import type { CardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';
import { useCardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';

const ITEMS_PER_PAGE = 10;

const columnHelper = createColumnHelper<CardHistory>();

type CardHistoryTableProps = {
  cardNumber?: string;
};

export const CardHistoryTable: FC<CardHistoryTableProps> = ({ cardNumber }) => {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: ITEMS_PER_PAGE,
    });
  const { data, isLoading } = useCardHistory(cardNumber || null);

  const currentItems = (data || []).sort((a, b) => {
    const midA = a.mid || '';
    const midB = b.mid || '';
    const dateA = a.transmissionDate || '';
    const dateB = b.transmissionDate || '';

    const midCompare = midB.localeCompare(midA); // Descending by mid
    if (midCompare !== 0) return midCompare;

    return dateB.localeCompare(dateA); // Descending by transmissionDate
  });

  const cardHistory = currentItems || [];

  const columns = useMemo<ColumnDef<CardHistory>[]>(() => {
    return [
      columnHelper.accessor('mid', {
        header: () => 'MID',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),

        enableSorting: false,
        meta: {
          align: 'center',
        },
      }),

      columnHelper.accessor('transactionDate', {
        header: () => 'Trans Date',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatDate(info.getValue(), 'MM/dd/yyyy')}
            className="text-center"
          />
        ),
        enableSorting: false,

        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('amount', {
        header: () => 'Trans Amt',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatCurrency(info.getValue())}
            className="text-right"
          />
        ),

        enableSorting: false,
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

        enableSorting: false,
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

        enableSorting: false,
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

        enableSorting: false,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('cardNumber', {
        header: () => 'Card #',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue()}
            className="text-center"
          />
        ),

        enableSorting: false,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.accessor('debitNetworkIdentifier', {
        header: () => 'DB Net',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue() || ''}
            className="text-center"
          />
        ),

        enableSorting: false,
        meta: {
          align: 'center',
        },
      }),

      columnHelper.accessor('transmissionDate', {
        header: () => 'Transmission Date',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatDateWithoutTime(info.getValue())}
            className="text-right"
          />
        ),

        enableSorting: false,
        meta: {
          align: 'right',
        },
      }),

      columnHelper.accessor('netDepositAmount', {
        header: () => 'Net Dep. Amt',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatCurrency(info.getValue())}
            className="text-right"
          />
        ),

        enableSorting: false,
        meta: {
          align: 'right',
        },
      }),
    ] as ColumnDef<CardHistory>[];
  }, []);

  return (
    <div>
      <div className="h-full">
        <div className="max-w-full h-full flex flex-col bg-white dark:bg-boxdark">
          {/* Issuer Information */}
          {isLoading ? (
            <div className="flex-1 flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 py-2 border-b border-stroke dark:border-strokedark">
                <div>
                  <span className="text-sm font-semibold text-black dark:text-white">
                    Issuer Bank:&nbsp;
                  </span>
                  <span className="text-sm text-black dark:text-white">
                    {cardHistory[0]?.issuerBank || 'No data available'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-black dark:text-white">
                    Issuer Country:&nbsp;
                  </span>
                  <span className="text-sm text-black dark:text-white">
                    {cardHistory[0]?.issuerCountry || 'No data available'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-black dark:text-white">
                    Issuer Phone:&nbsp;
                  </span>
                  <span className="text-sm text-black dark:text-white">
                    {cardHistory[0]?.issuerPhone || 'No data available'}
                  </span>
                </div>
              </div>
              <div className="py-2 border-b border-stroke dark:border-strokedark">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Card # History
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <DataTable
                  tableContainerClassName="max-h-[300px]"
                  columns={columns}
                  data={{
                    data: currentItems.map((item) => ({
                      ...item,
                      id: item.mid,
                    })),
                    count: currentItems.length,
                    total: currentItems.length,
                    page: pageIndex,
                    pageCount: Math.ceil(currentItems.length / pageSize),
                  }}
                  isLoading={isLoading}
                  initialItemsPerPage={ITEMS_PER_PAGE}
                  onSetPagination={setPagination}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
