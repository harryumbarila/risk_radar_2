import type { FC } from 'react';

import { formatCurrency } from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import type { VolumenType } from '@/web/src/types/exception';

const tableHeaders = [
  { name: 'Month/Year', align: 'center' },
  { name: 'Volume', align: 'right' },
  { name: 'Avg Ticket', align: 'right' },
  { name: 'Swiped %', align: 'right' },
  { name: 'Highest Ticket', align: 'right' },
  { name: 'Total CB', align: 'right' },
  { name: 'V CB %', align: 'right' },
  { name: 'MC CB %', align: 'right' },
  { name: 'Disc CB %', align: 'right' },
  { name: 'Amex CB %', align: 'right' },
];
type Props = {
  data: VolumenType[];
};

export const VolumeTable: FC<Props> = ({ data }) => {
  return (
    <table className="w-full lg:w-1/2  table-auto text-[10px] border rounded-sm border-gray-400">
      <thead>
        <tr className="border-b border-gray-400 bg-gray-2 dark:bg-meta-4 text-center text-black dark:text-white">
          {tableHeaders.map((header) => (
            <th
              key={header.name}
              className={`py-1 font-bold text-black dark:text-white text-${header.align}`}
            >
              {header.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((vol) => (
          <tr
            key={`${vol.year}-${vol.month}`}
            className="text-center border-b border-gray-400 odd:bg-white even:bg-gray-50 dark:odd:bg-transparent dark:even:bg-meta-4"
          >
            <td className="font-bold dark:border-strokedark text-black dark:text-white">
              {vol.month} {vol.year}
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {formatCurrency(vol.volume)}
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {formatCurrency(vol.averageTicket)}
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {vol.swipedPercentage.toFixed(2)}%
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {formatCurrency(vol.highestTicket)}
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {formatCurrency(vol.totalChargebacks)}
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {vol.visaChargebackPercentage.toFixed(2)}%
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {vol.mastercardChargebackPercentage.toFixed(2)}%
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {vol.discoverChargebackPercentage.toFixed(2)}%
            </td>
            <td className="dark:border-strokedark text-right text-black dark:text-white">
              {vol.amexChargebackPercentage.toFixed(2)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
