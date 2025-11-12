'use client';
import React from 'react';

import { AuthHeader, AuthSidebar } from '@/ui/components';
import { SidebarProvider, useSidebar } from '@/ui/components/common/organisms/auth-sidebar/sidebar-context';
import { Box } from '@chakra-ui/react';

function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? '80px' : '260px';

  return (
    <Box 
      ml={{ base: 0, md: sidebarWidth }} 
      pt="90px"
      px={6}
      pb={6}
      transition="margin-left 0.3s ease"
    >
      {children}
    </Box>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout(props: MainLayoutProps): React.JSX.Element {
  return (
    <SidebarProvider>
      <Box bg="gray.subtle" minH="100vh">
        <AuthHeader />
        <AuthSidebar />
        <MainContent>{props.children}</MainContent>
      </Box>
    </SidebarProvider>
  );
}
