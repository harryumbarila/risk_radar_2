import { PaginationResponse } from '@/data/interfaces/api';
import type { ColumnDef, PaginationState, Row } from '@tanstack/react-table';
import { ComponentType } from 'react';

export interface CollapsibleBodyProps<BaseModel> {
  row: Row<BaseModel>;
}

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
  CollapsibleBody?: ComponentType<CollapsibleBodyProps<BaseModel>>;
};
