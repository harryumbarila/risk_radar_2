import type { ColumnDef, PaginationState } from '@tanstack/react-table';

import type { PaginationResponse } from '../../types/pagination';

export type DataTableProps<BaseModel> = {
  title?: string;
  isLoading: boolean;
  data: PaginationResponse<BaseModel>;
  columns: ColumnDef<BaseModel>[];
  onSelectRow?: (arg: BaseModel) => void;
  onSetPagination: (arg: PaginationState) => void;
  initialItemsPerPage: number;
};
