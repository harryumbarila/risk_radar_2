import React from 'react';
import type { Metadata } from 'next';

import SettingsMerchantRiskThresholds from '@/libs/domain/settings/merchant-risk-thresholds/merchant-risk-thresholds';

export const metadata: Metadata = {
  title: 'Merchant Risk Thresholds',
};

export default function MidConfigPage(): React.JSX.Element {
  return (
    <>
      <SettingsMerchantRiskThresholds />
    </>
  );
}
