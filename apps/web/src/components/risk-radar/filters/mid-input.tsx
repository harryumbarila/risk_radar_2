import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
  name: string;
};

export const MIDInput = forwardRef<HTMLInputElement, Props>(
  ({ name, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        name={name}
        id={name}
        type="text"
        placeholder="Enter MID"
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    );
  }
);
