'use client';

import '@/css/satoshi.css';
import '@/css/simple-datatables.css';
import '@/css/style.css';
import 'dropzone/dist/dropzone.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'jsvectormap/dist/jsvectormap.css';
import 'nouislider/dist/nouislider.css';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { Loader } from '@/components/common/Loader';

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : <UserProvider>{children}</UserProvider>}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
