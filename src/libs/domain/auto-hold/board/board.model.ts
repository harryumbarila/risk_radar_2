import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { components } from '@/libs/shared/api/schemas/schema';
import { formatDate } from '@/libs/utils/formatter';

const columnHelper =
  createColumnHelper<
    components['schemas']['AutoHoldExceptionSummaryOutputDto']
  >();

export const columnsBoards = [
  columnHelper.accessor('merchantId', {
    header: () => 'MID',
    enableSorting: true,
  }),
  columnHelper.accessor('NXDY', {
    header: () => 'NXDY',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('dataSourceIdentifier', {
    header: () => 'Data source',
    enableSorting: true,
    meta: {
      align: 'left',
    },
  }),
  columnHelper.accessor('source.definition', {
    header: () => 'Source',
    enableSorting: true,
    meta: {
      align: 'left',
    },
  }),
  columnHelper.accessor('AH001', {
    header: () => 'AH001',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH002', {
    header: () => 'AH002',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH003', {
    header: () => 'AH003',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH004', {
    header: () => 'AH004',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH005', {
    header: () => 'AH005',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH006', {
    header: () => 'AH006',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH007', {
    header: () => 'AH007',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH008', {
    header: () => 'AH008',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH009', {
    header: () => 'AH009',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH010', {
    header: () => 'AH010',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH011', {
    header: () => 'AH011',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH012', {
    header: () => 'AH012',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH013', {
    header: () => 'AH013',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH014', {
    header: () => 'AH014',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH015', {
    header: () => 'AH015',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('AH016', {
    header: () => 'AH016',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created At',
    enableSorting: true,
    cell: (info) => formatDate(info.getValue()),
    meta: {
      align: 'center',
    },
  }),
] as ColumnDef<components['schemas']['AutoHoldExceptionSummaryOutputDto']>[];
