import React from 'react';
import { RulesProvider } from '@/libs/domain/risk-rules/context/rules-context';
import RiskRulesPage from '@/libs/domain/risk-rules/risk-rules.page';

export default function RiskRulesRoute(): React.JSX.Element {
  return (
    <RulesProvider>
      <RiskRulesPage />
    </RulesProvider>
  );
}

