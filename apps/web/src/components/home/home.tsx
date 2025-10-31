'use client';

import type { FC } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const Home: FC = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Welcome to Dashboard
          </h1>
          <div className="h-0.5 w-16 bg-blue-500 mx-auto mb-6" />
          <p className="text-slate-600 mb-8">
            Your centralized platform for all your needs
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};
