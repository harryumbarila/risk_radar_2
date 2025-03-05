import { AdvancedChart } from '@denali/ui';
import type { Metadata } from 'next';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Advanced Chart | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Advanced Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const AdvancedChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <AdvancedChart />
    </DefaultLayout>
  );
};

export default AdvancedChartPage;
