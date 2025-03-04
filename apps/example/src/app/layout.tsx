'use client';

import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { Loader } from '@/components/common/Loader';

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
