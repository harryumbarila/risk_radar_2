import { ErrorMessage } from '@hookform/error-message';
import type { InputHTMLAttributes } from 'react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type InputFieldProps = {
  isRequired?: boolean;
  name: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField: React.FC<React.PropsWithChildren<InputFieldProps>> = (
  props
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const {
    children,
    label,
    type = 'text',
    placeholder,
    name,
    isRequired,
    ...rest
  } = props;

  return (
    <div className="flex flex-col h-full">
      {label && (
        <label
          className="block text-sm font-medium text-black dark:text-white"
          htmlFor={name}
        >
          {label} {isRequired ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          <input
            type={type}
            className="border px-3 py-2 rounded-md"
            placeholder={placeholder}
            {...field}
            {...rest}
          />
        )}
        name={name}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <small className="text-red-500">{message}</small>
        )}
      />
      {children}
    </div>
  );
};
