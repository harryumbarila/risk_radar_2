import React from 'react';
import type { Metadata } from 'next';

import SettingsMCCConfig from '@/libs/domain/settings/mcc-config/mcc-config';

export const metadata: Metadata = {
  title: 'MCC Configuration',
};

export default function MCCConfigPage(): React.JSX.Element {
  return (
    <>
      <SettingsMCCConfig />
    </>
  );
}
