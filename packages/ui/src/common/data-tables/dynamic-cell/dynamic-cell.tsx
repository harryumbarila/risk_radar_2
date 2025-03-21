import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

import type { DynamicCellProps } from './dynamic-cell-model';

export const DynamicCell = <T,>(
  props: DynamicCellProps<T>
): React.ReactElement => {
  switch (props.type) {
    case 'text':
      return (
        <span
          className={`text-sm font-medium text-gray-900 ${props.className}`}
        >
          {props.value}{' '}
        </span>
      );
    case 'number': {
      const formattedValue = new Intl.NumberFormat(
        'en-US',
        props.formatOptions
      ).format(props.value);
      return (
        <span
          className={`text-sm font-medium text-gray-900 ${props.className}`}
        >
          {props.prefix && <span className="mr-1">{props.prefix}</span>}
          {formattedValue}
          {props.suffix && <span className="ml-1">{props.suffix}</span>}
        </span>
      );
    }

    case 'date':
      return (
        <span className={`text-sm text-gray-700 ${props.className}`}>
          {new Intl.DateTimeFormat('en-US', props.formatOptions).format(
            new Date(props.value)
          )}
        </span>
      );

    case 'status': {
      const [active, inactive] = props.labels || ['Active', 'Removed'];
      const status = props.value ? inactive : active;
      const color = props.value ? 'text-red-600' : 'text-green-600';
      return (
        <span className={`text-sm font-medium ${color} ${props.className}`}>
          {status}
        </span>
      );
    }

    case 'actions':
      return (
        <div
          className={`flex justify-center gap-5 ${props.className}`}
          aria-label="table-actions"
        >
          {props.onEdit ? (
            <button
              type="button"
              onClick={() => props.onEdit(props.row.original)}
            >
              {props.iconOnly ? (
                <PencilSquareIcon className="h-6 w-6 text-green-600" />
              ) : (
                'Edit'
              )}
            </button>
          ) : null}
          {props.onDelete ? (
            <button
              type="button"
              onClick={() => props.onDelete(props.row.original)}
            >
              {props.iconOnly ? (
                <TrashIcon className="size-6 text-red-600" />
              ) : (
                'Delete'
              )}
            </button>
          ) : null}
        </div>
      );

    default:
      return <div>Invalid</div>;
  }
};
