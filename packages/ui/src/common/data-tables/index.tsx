'use client';

import React from 'react';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';

export const DataTables: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Data Tables" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10" />
    </>
  );
};
