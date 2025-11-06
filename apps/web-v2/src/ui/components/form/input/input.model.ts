import { InputProps, InputGroupProps } from '@chakra-ui/react';

export interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
  isRequired?: boolean;

  inputGroup?: InputGroupProps
}
