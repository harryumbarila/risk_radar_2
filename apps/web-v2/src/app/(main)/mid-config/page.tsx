'use client';

import React from 'react';
import MIDConfigPage from '@/libs/domain/mid-config/mid-config.page';
import { WhitelistProvider } from '@/libs/domain/mid-config/components/useWhitelistStore';

export default function Page(): React.JSX.Element {
  return (
    <WhitelistProvider>
      <MIDConfigPage />
    </WhitelistProvider>
  );
}

