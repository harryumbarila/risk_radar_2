import { IconButtonProps } from '@chakra-ui/react';
import { ThemeProviderProps } from 'next-themes';

export type ColorMode = 'light' | 'dark';

export interface ColorModeProps extends ThemeProviderProps {}
export interface ColorModeButtonProps
  extends Omit<IconButtonProps, 'aria-label'> {}

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}
