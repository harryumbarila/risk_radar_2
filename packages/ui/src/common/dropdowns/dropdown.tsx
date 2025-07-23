import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

type Props<T = string> = InputHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  name: string;
  options: { value: T; label: string }[];
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
};

export const Dropdown = forwardRef<HTMLSelectElement, Props>(
  ({ label, name, options, rules, ...props }, ref) => {
    const { control } = useFormContext();
    return (
      <div className="flex flex-col h-full">
        {label && (
          <label
            className="block text-sm font-medium text-black dark:text-white"
            htmlFor={name}
          >
            {label}
          </label>
        )}

        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field, fieldState }) => (
            <div>
              <select
                {...props}
                {...field}
                className={clsx(
                  'w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                  {
                    '!border-red-500 focus:border-red-500': !!fieldState.error,
                  }
                )}
                ref={ref}
                onChange={(e) => {
                  field.onChange(e);
                }}
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
