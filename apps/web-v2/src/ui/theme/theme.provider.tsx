'use client';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import system from './chakra-theme';
import { ColorModeProvider } from '../components/common/molecules';

export default function ThemeProvider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  );
}
