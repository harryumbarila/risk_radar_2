import React from 'react';
import SettingsMidConfig from '@/libs/domain/settings/mid-config/mid-config';

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'MID Configuration',
};

export default function MidConfigPage(): React.JSX.Element {
  return (
    <>
      <SettingsMidConfig />
    </>
  );
}
