import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
  name: string;
};

export const ViewAllExceptionsCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ name, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          {...props}
          ref={ref}
          type="checkbox"
          id={name}
          name={name}
          className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label
          htmlFor={name}
          className="ml-2 text-sm text-black dark:text-white"
        >
          View All Exceptions
        </label>
      </div>
    );
  }
);
