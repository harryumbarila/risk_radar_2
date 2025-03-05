import dynamic from 'next/dynamic';
import type { Props } from 'react-apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

// Default height for the chart to avoid the flickering issue
export const ApexChartWrapper: React.FC<Props> = ({
  height = 70,
  ...props
}) => {
  const isClient = typeof window !== 'undefined';

  return isClient ? <ReactApexChart {...props} height={height} /> : null;
};
