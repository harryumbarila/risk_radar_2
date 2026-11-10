import React from 'react';
import { WhitelistProvider } from '@/libs/domain/mcc-config/components/use-whitelist-store';
import MCCConfigPage from '@/libs/domain/mcc-config/mcc-config.page';

export default function MCCConfigRoute(): React.JSX.Element {
  return (
    <WhitelistProvider>
      <MCCConfigPage />
    </WhitelistProvider>
  );
}

