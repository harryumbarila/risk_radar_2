'use client';

import '@/css/satoshi.css';
import '@/css/simple-datatables.css';
import '@/css/style.css';

import { Loader } from '@denali/ui';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
