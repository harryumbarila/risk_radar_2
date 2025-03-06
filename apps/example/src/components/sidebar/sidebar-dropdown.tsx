import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import type { SidebarItemType } from './types';

type SidebarDropdownProps = {
  item: SidebarItemType[];
};

export const SidebarDropdown: FC<SidebarDropdownProps> = ({ item }) => {
  const pathname = usePathname();

  return (
    <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
      {item.map((itm) => (
        <li key={itm.label}>
          <Link
            href={itm.route}
            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
              pathname === itm.route ? 'text-white' : ''
            }`}
          >
            {itm.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
