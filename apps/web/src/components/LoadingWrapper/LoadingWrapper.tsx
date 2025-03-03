'use client';

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Loader } from '@/components/common/Loader';

export const LoadingWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? <Loader /> : children;
};
