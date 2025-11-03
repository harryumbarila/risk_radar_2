'use client';

import React from 'react';

import { Field, Input } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';

import { useFormContext } from 'react-hook-form';

import { InputFieldProps } from './input.model';

export default function InputField(props: InputFieldProps) {
  const { label, name, isRequired, ...rest } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Field.Root required={isRequired} invalid={!!errors?.[name]}>
      {label ? (
        <Field.Label htmlFor={name}>
          {label} {isRequired && <Field.RequiredIndicator />}
        </Field.Label>
      ) : null}

      <Input {...rest} {...register(name)} />
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ message }) => <Field.ErrorText>{message}</Field.ErrorText>}
      />
    </Field.Root>
  );
}
