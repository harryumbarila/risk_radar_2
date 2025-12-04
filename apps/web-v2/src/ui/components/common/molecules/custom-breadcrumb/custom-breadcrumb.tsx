'use client';
import React from 'react';
import Link from 'next/link';

import { Breadcrumb, Menu, Portal } from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';

import {
  CustomBreadcrumbProps,
  CustomBreadcrumbMenuItemProps,
} from './custom-breadcrumb.model';

function BreadCrumbMenuItem({ label, items }: CustomBreadcrumbMenuItemProps) {
  return (
    <Breadcrumb.Item>
      {items && items.length > 0 ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Breadcrumb.Link
              as="button"
              display="inline-flex"
              alignItems="center"
              gap={1}
              suppressHydrationWarning
            >
              {label}
              <LuChevronDown />
            </Breadcrumb.Link>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {items.map((item) => (
                  <Menu.Item
                    as={Link}
                    key={item.value}
                    value={item.value}
                    // @ts-expect-error href is valid on <Link>
                    href={item.href}
                    prefetch={false}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <Breadcrumb.Link as="button" suppressHydrationWarning>
          {label}
        </Breadcrumb.Link>
      )}
    </Breadcrumb.Item>
  );
}

export default function CustomBreadcrumb({
  paths,
}: CustomBreadcrumbProps): React.JSX.Element {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List gap="4">
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={path.label}>
              {path.menu ? (
                <BreadCrumbMenuItem label={path.label} items={path.menu} />
              ) : (
                <Breadcrumb.Item>
                  {isLast ? (
                    <Breadcrumb.CurrentLink>
                      {path.label}
                    </Breadcrumb.CurrentLink>
                  ) : (
                    <Breadcrumb.Link href={path.href}>
                      {path.label}
                    </Breadcrumb.Link>
                  )}
                </Breadcrumb.Item>
              )}
              {!isLast && <Breadcrumb.Separator>/</Breadcrumb.Separator>}
            </React.Fragment>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
