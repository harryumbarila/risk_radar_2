/* eslint-disable react/destructuring-assignment */

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

import type { DynamicCellProps } from './dynamic-cell-model';

export const DynamicCell = <T,>(
  props: DynamicCellProps<T>
): React.ReactElement => {
  switch (props.type) {
    case 'text':
      return (
        <td className={`text-black ${props.className}`} onClick={props.onClick}>
          {props.value}{' '}
        </td>
      );
    case 'number': {
      const formattedValue = new Intl.NumberFormat(
        'en-US',
        props.formatOptions
      ).format(props.value);
      return (
        <td className={`text-black ${props.className}`}>
          {props.prefix && <span className="mr-1">{props.prefix}</span>}
          {formattedValue}
          {props.suffix && <span className="ml-1">{props.suffix}</span>}
        </td>
      );
    }

    case 'date':
      return (
        <td className={`text-black ${props.className}`}>
          {new Intl.DateTimeFormat('en-US', props.formatOptions).format(
            new Date(props.value)
          )}
        </td>
      );

    case 'status': {
      const [active, inactive] = props.labels || ['Active', 'Removed'];
      const status = props.value ? inactive : active;
      const color = props.value ? 'text-red-600' : 'text-green-600';
      return <span className={`${color} ${props.className}`}>{status}</span>;
    }

    case 'actions':
      return (
        <td>
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
                  <TrashIcon className="h-6 w-6 text-red-600" />
                ) : (
                  'Delete'
                )}
              </button>
            ) : null}
          </div>
        </td>
      );

    default:
      return <td>Invalid</td>;
  }
};
