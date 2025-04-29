import type { FC, InputHTMLAttributes } from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { SelectOption } from '@/shared/common';
import type { RiskRadarFilterState } from '@/shared/response';

type Props = Omit<
  InputHTMLAttributes<HTMLSelectElement>,
  'name' | 'onChange'
> & {
  options: SelectOption[];
  name: keyof RiskRadarFilterState;
  control: Control<RiskRadarFilterState>;
};

export const ExceptionTypesSelect: FC<Props> = ({
  options,
  name,
  control,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-3 h-full">
      <label
        className="mb-1 block text-sm font-medium text-black dark:text-white"
        htmlFor={name}
      >
        Exception Type
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues = Array.isArray(field.value) ? field.value : [];
          return (
            <>
              <select
                {...props}
                multiple
                className="w-full rounded border-[1.5px] grow border-stroke bg-transparent font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  field.onChange(values);
                }}
                value={selectedValues}
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value} className="px-3 py-1">
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-black dark:text-white">
                Hold Ctrl (Windows) or Command (Mac) to select multiple options
              </span>
              <div className="grid grid-cols-2 divide-x-2 divide-dashed divide-gray-500 dark:divide-white">
                <button
                  className="text-sm font-bold text-green-700"
                  type="button"
                  onClick={() => {
                    field.onChange(options.map((o) => o.value));
                  }}
                >
                  Select All
                </button>
                <button
                  className="text-sm font-bold text-red-500"
                  type="button"
                  onClick={() => {
                    field.onChange([]);
                  }}
                >
                  Clear
                </button>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};
