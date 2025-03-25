import type { ColumnDef, PaginationState } from '@tanstack/react-table';

import type { PaginationResponse } from '@/ui/types';

export type DataTableProps<BaseModel> = {
  title?: string;
  isLoading: boolean; // Loading
  data: PaginationResponse<BaseModel>; // Row Data
  columns: ColumnDef<BaseModel>[]; // Columns definitions
  onSelectRow?: (arg: BaseModel) => void; // On row selection
  onSetPagination: (arg: PaginationState) => void; // Pagination
  initialItemsPerPage: number;
};
