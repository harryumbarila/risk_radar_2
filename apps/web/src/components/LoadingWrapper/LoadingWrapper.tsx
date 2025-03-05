'use client';

import { Loader } from '@denali/ui';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

export const LoadingWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? <Loader /> : children;
};
