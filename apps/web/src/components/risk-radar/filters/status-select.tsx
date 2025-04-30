import classNames from 'classnames';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { RiskRadarFilterState } from '@/shared/response';

type Props = Omit<InputHTMLAttributes<HTMLSelectElement>, 'name'> & {
  options: { value: number; label: string }[];

  control: Control<RiskRadarFilterState>;
};

export const StatusSelect = forwardRef<HTMLSelectElement, Props>(
  ({ options, control, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-3 h-full">
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor="status"
        >
          Exception Status
        </label>
        <Controller
          control={control}
          name="status"
          rules={{ required: 'Status is required' }}
          render={({ field, fieldState }) => (
            <div>
              <select
                {...props}
                {...field}
                className={classNames(
                  'w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                  {
                    '!border-red-500 focus:border-red-500': !!fieldState.error,
                  }
                )}
                ref={ref}
              >
                {options.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <small className="text-red-500">
                {fieldState.error?.message}
              </small>
            </div>
          )}
        />
      </div>
    );
  }
);
