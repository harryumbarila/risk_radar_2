import React from 'react';

import { AuthHeader, AuthSidebar } from '@/ui/components';
import { Box } from '@chakra-ui/react';

interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout(props: MainLayoutProps) {
  return (
    <Box bg="gray.subtle" minH="100vh">
      <AuthHeader />
      <AuthSidebar />
      {props.children}
    </Box>
  );
}
