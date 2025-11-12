import { BaseModel } from '@/data/interfaces/api';
import type { Row } from '@tanstack/react-table';

export interface DataRowProps<Entry extends BaseModel> {
  row: Row<Entry>;
  colSpan?: number;
  CollapsibleBody?: React.ComponentType<{ row: Row<Entry> }>;
}
