/* eslint-disable react/no-unstable-nested-components */

'use client';

import {
  Breadcrumb,
  DataTable,
  Dropdown,
  DynamicCell,
  Loader,
} from '@denali/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { Search } from 'lucide-react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { NetSettlementTransactionRow } from '@/shared/response';
import { WriteOff } from '@/web/src/components/net-settlement/write-off';
import {
  formatCurrency,
  formatDate,
} from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import type { NetSettlementSummaryFilterState } from '@/web/src/hooks/net-settlement/net-settlement-summary';
import { useNetSettlementSummary } from '@/web/src/hooks/net-settlement/net-settlement-summary';

const columnHelper = createColumnHelper<NetSettlementTransactionRow>();

const NetSettlementPage: React.FC = () => {
  const { data, fetchData, addNotes, removeNotes, handleAction, isLoading } =
    useNetSettlementSummary();

  const methods = useForm<NetSettlementSummaryFilterState>({
    defaultValues: {
      mid: '',
      label: '',
      divertReason: data?.header?.divertReason || '',
    },
    mode: 'onChange',
  });

  const { mid } = methods.watch();

  const columns = React.useMemo<
    ColumnDef<NetSettlementTransactionRow>[]
  >(() => {
    return [
      columnHelper.accessor('category', {
        header: () => 'Trans Category',
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
      columnHelper.accessor('dtTrans', {
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
      columnHelper.accessor('dTransAmt', {
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
              className={`text-right dark:text-blue-600 ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },

        enableSorting: false,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('dBalanceAmt', {
        header: () => 'Balance Amt',
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
              className={`text-right dark:text-blue-600 ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },
        footer: ({ table }) => {
          const value = table
            .getFilteredRowModel()
            .rows.reduce(
              (total, row) =>
                total + (row.getValue<number>('dBalanceAmt') || 0),
              0
            );

          const transactionAmount =
            value >= 0
              ? formatCurrency(value)
              : `(${formatCurrency(Math.abs(value))})`;

          return (
            <DynamicCell
              type="text"
              value={transactionAmount}
              className={`text-right dark:text-blue-600 ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },
        enableSorting: false,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('dPendingAmt', {
        header: () => 'Pending Amt',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatCurrency(info.getValue())}
            className="text-right"
          />
        ),
        footer: ({ table }) => {
          const value = table
            .getFilteredRowModel()
            .rows.reduce(
              (total, row) =>
                total + (row.getValue<number>('dPendingAmt') || 0),
              0
            );
          const pendingAmount =
            value >= 0
              ? formatCurrency(value)
              : `(${formatCurrency(Math.abs(value))})`;

          return (
            <DynamicCell
              type="text"
              value={pendingAmount}
              className={`text-right dark:text-blue-600 ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },
        enableSorting: false,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('dWriteOffAmt', {
        header: () => 'Write Off Amt',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={formatCurrency(info.getValue())}
            className="text-right"
          />
        ),
        footer: ({ table }) => {
          const value = table
            .getFilteredRowModel()
            .rows.reduce(
              (total, row) =>
                total + (row.getValue<number>('dWriteOffAmt') || 0),
              0
            );
          const writeOffAmount =
            value >= 0
              ? formatCurrency(value)
              : `(${formatCurrency(Math.abs(value))})`;
          return (
            <DynamicCell
              type="text"
              value={writeOffAmount}
              className={`text-right dark:text-blue-600 ${value >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            />
          );
        },
        enableSorting: false,
        meta: {
          align: 'right',
        },
      }),
      columnHelper.accessor('sTransDivertReason', {
        header: () => 'Reason',
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
      columnHelper.accessor('sCreatedBy', {
        header: () => 'Created By',
        cell: (info) => (
          <DynamicCell
            type="text"
            value={info.getValue() || '-'}
            className="text-center"
          />
        ),
        enableSorting: false,
        meta: {
          align: 'center',
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => 'Actions',
        cell: (props) => (
          <DynamicCell
            type="actions"
            row={props.row}
            iconOnly
            onDelete={() => {}}
          />
        ),
        meta: {
          align: 'center',
        },
      }),
    ] as ColumnDef<NetSettlementTransactionRow>[];
  }, []);

  React.useEffect(() => {
    if (data) {
      methods.reset({
        mid: data.header.sMID16Exist,
        label: '',
        divertReason: data.header.divertReason || '',
      });
    }
  }, [data, methods]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Net Settlement" />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 bg-white shadow-lg rounded-xl space-y-6">
          <div
            className={`"flex flex-wrap items-center gap-4 ${data ? 'border-b pb-4' : undefined}`}
          >
            <FormProvider {...methods}>
              <div className="flex items-center gap-4">
                <div>
                  <label
                    htmlFor="mid"
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Net Settlement - MID Search
                  </label>
                  <input
                    type="text"
                    placeholder="MID"
                    {...methods.register('mid')}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  {data ? (
                    <Dropdown
                      label="Labels"
                      name="label"
                      options={[
                        { value: '', label: '--Select--' },
                        ...data.labels.map((label) => ({
                          value: String(label.id),
                          label: label.name,
                        })),
                      ]}
                    />
                  ) : null}
                </div>

                <div className="flex items-center pt-6">
                  <button
                    type="button"
                    onClick={methods.handleSubmit(fetchData)}
                    disabled={!mid}
                    className={`rounded ${!mid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  >
                    <Search className="size-5" />
                  </button>
                </div>
              </div>
            </FormProvider>
          </div>

          {data ? (
            <>
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-black">MID</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {data?.header.sMID16Exist}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">DBA</p>
                  <p className="text-lg font-semibold">{data?.header.sDBA}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Routing #</p>
                  <p className="text-lg font-semibold">
                    {data?.header.sMerchantBankRoutingNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Account #</p>
                  <p className="text-lg font-semibold">
                    {data?.header.sMerchantBankAccountNumber}
                  </p>
                </div>
              </div>

              {methods.formState.isSubmitting ? (
                <div className="pb-[25px] bg-white rounded-lg shadow overflow-hidden">
                  <Loader fullScreen={false} />
                </div>
              ) : (
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-black mb-1"
                    >
                      Divert Reason
                    </label>
                    <input
                      readOnly={!!data?.header.divertReason}
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter reason"
                      {...methods.register('divertReason', { required: false })}
                    />
                  </div>
                  <button
                    type="button"
                    className={classNames(' text-white px-4 py-2 rounded-md ', {
                      'bg-red-600 hover:bg-red-700': data?.header.divertReason,
                      'bg-blue-600 hover:bg-blue-700':
                        !data?.header.divertReason,
                    })}
                    onClick={
                      data?.header.divertReason
                        ? methods.handleSubmit(removeNotes)
                        : methods.handleSubmit(addNotes)
                    }
                  >
                    {data?.header.divertReason ? 'Remove' : 'Add'}
                  </button>
                </div>
              )}

              <DataTable
                tableContainerClassName="max-h-[300px]"
                columns={columns}
                data={{
                  data: data?.transactions.map((item) => ({
                    ...item,
                    id: String(item.pkTrans),
                    createdAt: String(item.dtCreated),
                    updatedAt: String(item.dtCreated),
                  })),
                  count: data?.transactions.length,
                  total: data?.transactions.length,
                  page: 0,
                  pageCount: 1,
                }}
                enablePagination={false}
                isLoading={isLoading}
              />
              {/* Footer Inputs */}
              <WriteOff mid={methods.watch().mid} handleAction={handleAction} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NetSettlementPage;
