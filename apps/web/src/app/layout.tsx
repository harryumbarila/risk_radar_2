import '@/css/satoshi.css';
import '@/css/simple-datatables.css';
import '@/css/style.css';
import 'dropzone/dist/dropzone.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'jsvectormap/dist/jsvectormap.css';
import 'nouislider/dist/nouislider.css';
import { FronteggAppProvider } from '@frontegg/nextjs/app';

import type { FC, PropsWithChildren } from 'react';

import { LoadingWrapper } from '@/components/LoadingWrapper/LoadingWrapper';

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const authOptions = {
    keepSessionAlive: true, // Uncomment this in order to maintain the session alive
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <LoadingWrapper>
            <FronteggAppProvider authOptions={authOptions} hostedLoginBox>
              {children}
            </FronteggAppProvider>
          </LoadingWrapper>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
