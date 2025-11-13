import React from 'react';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/ui/theme';
import { ReactQueryProvider } from '@/libs/shared/providers/query-client';
// import { FronteggAppProvider } from '@frontegg/nextjs/app';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Risk radar v2',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  // const authOptions = {
  //   keepSessionAlive: true, // Uncomment this in order to maintain the session alive
  // };
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* <FronteggAppProvider authOptions={authOptions}> */}
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
        {/* </FronteggAppProvider> */}
      </body>
    </html>
  );
}
