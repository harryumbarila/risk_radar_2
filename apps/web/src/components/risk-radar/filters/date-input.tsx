import classNames from 'classnames';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type Props = {
  label: string;
  className?: string;
  name: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const DateInput = forwardRef<HTMLInputElement, Props>(
  ({ label, name, className, error, ...props }, ref) => {
    return (
      <div className={classNames('flex flex-col gap-2', className)}>
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor={name}
        >
          {label}
        </label>
        <div>
          <input
            {...props}
            ref={ref}
            name={name}
            id={name}
            type="date"
            className={classNames(
              'w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white dark:focus:border-primary',
              error
                ? 'border-red-500 dark:border-red-500'
                : 'border-stroke dark:border-form-strokedark'
            )}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }
);
