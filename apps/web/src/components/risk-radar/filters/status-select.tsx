import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLSelectElement>, 'name'> & {
  options: { value: number; label: string }[];
  name: string;
};

export const StatusSelect = forwardRef<HTMLSelectElement, Props>(
  ({ options, name, ...props }, ref) => {
    return (
      <select
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        ref={ref}
        name={name}
        id={name}
        {...props}
      >
        <option value="" className="text-gray-500">
          Select Status
        </option>
        {options.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    );
  }
);
