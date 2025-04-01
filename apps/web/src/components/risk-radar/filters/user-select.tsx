import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { SelectOption } from '@/shared/common';

type Props = InputHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
};

export const UserSelect = forwardRef<HTMLSelectElement, Props>(
  ({ options, ...props }, ref) => {
    return (
      <div className="mb-5 mt-2">
        <select
          {...props}
          ref={ref}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        >
          <option value="0">Select user</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
