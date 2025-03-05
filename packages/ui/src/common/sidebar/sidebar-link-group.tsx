'use client';

import type { FC, ReactNode } from 'react';
import { useState } from 'react';

type SidebarLinkGroupProps = {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
};

export const SidebarLinkGroup: FC<SidebarLinkGroupProps> = ({
  children,
  activeCondition,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = (): void => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
};
