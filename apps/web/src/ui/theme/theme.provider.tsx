'use client';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

import system from './chakra-theme';

export default function ThemeProvider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <NextThemeProvider
        attribute="class"
        disableTransitionOnChange
        defaultTheme="light"
      >
        {props.children}
      </NextThemeProvider>
    </ChakraProvider>
  );
}
