import type { PaginationResponse } from '@denali/shared';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';

export type DataTableProps<BaseModel> = {
  title?: string;
  isLoading: boolean; // Loading
  data: PaginationResponse<BaseModel>; // Row Data
  columns: ColumnDef<BaseModel>[]; // Columns definitions
  onSelectRow?: (arg: BaseModel) => void; // On row selection
  onSetPagination?: (arg: PaginationState) => void; // Pagination
  initialItemsPerPage?: number;
  enablePagination?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  tableClassName?: string;
  tableContainerClassName?: string;
};
