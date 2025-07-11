import 'nextra-theme-docs/style.css';

import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout, Navbar } from 'nextra-theme-docs';
import type { FC, PropsWithChildren } from 'react';

export const metadata = {
  metadataBase: new URL('https://github.com/jobox-team/Denali'),
  title: {
    template: '%s - Denali',
  },
  description: 'Denali Documentation',
  applicationName: 'Denali',
  generator: 'Next.js',
};

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  const navbar = (
    <Navbar
      logo={
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✦ Denali Documentation
        </span>
      }
    />
  );

  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/jobox-team/Denali/tree/develop/apps/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
