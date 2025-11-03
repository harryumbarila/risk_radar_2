import React from 'react';

import { AuthHeader, AuthSidebar } from '@/ui/components';
import { Box } from '@chakra-ui/react';

interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout(props: MainLayoutProps): React.JSX.Element {
  return (
    <Box bg="gray.subtle" minH="100vh">
      <AuthHeader />
      <AuthSidebar />
      <Box ml="260px" p={10} mt={50}>
        <Box bg="white" borderRadius="xl" boxShadow="md" p={4}>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
}
