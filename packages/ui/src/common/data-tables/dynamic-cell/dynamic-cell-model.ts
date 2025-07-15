import type { Row } from '@tanstack/react-table';
import type { HTMLAttributes } from 'react';

type BaseCell = {
  customValue?: string | number;
} & HTMLAttributes<HTMLTableCellElement>;

type TextCell = BaseCell & {
  type: 'text';
  value: string | number;
  className?: string;
};

type NumberCell = BaseCell & {
  type: 'number';
  value: number;
  className?: string;
  formatOptions?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
};

type DateCell = BaseCell & {
  type: 'date';
  value: string | number | Date;
  className?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

type Status = BaseCell & {
  type: 'status';
  value: boolean;
  className?: string;
  labels?: [active: string, inactive: string];
};

type ActionsCell<T> = BaseCell & {
  type: 'actions';
  row: Row<T>;
  className?: string;
  onEdit?: (data: T) => Promise<void> | void;
  onDelete?: (data: T) => Promise<void> | void;
  iconOnly?: boolean;
};

export type DynamicCellProps<T> =
  | TextCell
  | NumberCell
  | DateCell
  | Status
  | ActionsCell<T>;
