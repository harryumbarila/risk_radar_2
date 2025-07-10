'use client';

import 'simplebar-react/dist/simplebar.min.css';

import { useAuth } from '@frontegg/nextjs';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';

import { useSidebarStore } from '@/stores/sidebar';
import { permissions } from '@/types/permissions';

import type { SidebarItem } from './structure';
import { sidebarStructure } from './structure';

type SidebarProps = {
  setSidebarOpen?: (value: boolean) => void;
  sidebarOpen?: boolean;
};

export const Sidebar: FC<SidebarProps> = () => {
  const { sidebarOpen, sidebarExpanded, setSidebarExpanded, setSidebarOpen } =
    useSidebarStore();
  let pathname = usePathname();

  if (pathname == null) {
    pathname = '';
  }

  const { user } = useAuth();
  const { forResource } = permissions(user);

  const [activeName, setActiveName] = useState(pathname);
  const activeLink = pathname;

  useEffect(() => {
    if (!activeName && activeLink) {
      const activeItem = sidebarStructure
        .flatMap((item) => [item, ...(item.child || [])])
        .find((item) => activeLink.includes(item.link));
      if (activeItem) {
        setActiveName(activeItem.name);
      }
    }
  }, [activeLink, activeName]);

  const [isExpandOnHover, setIsExpandOnHover] = useState(false);

  const handleHoverExpand = (value: boolean): void => {
    if (!sidebarExpanded) {
      setIsExpandOnHover(value);
    }
  };

  const handleNavigate = (path: string): void => {
    setActiveName(path);
  };

  const generateMenu = (
    item: SidebarItem,
    index: number,
    recursive: number = 0
  ): JSX.Element => {
    const isMatch = activeName === item.link || activeName === item.name;
    const classesActive = isMatch ? 'active' : '';

    return (
      <li key={index}>
        <Link
          href={item.link}
          tabIndex={0}
          id={item.id}
          onClick={() => {
            if ('link' in item) {
              handleNavigate(item.name);
            }
          }}
          onKeyDown={(event) => {
            const { code } = event;
            if (code === 'Space') {
              if ('link' in item) {
                handleNavigate(item.name);
              }
            }
          }}
          className={classNames(
            'w-full group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 hover:bg-slate-300/20',
            {
              'pl-4': recursive === 0,
              'pl-11': recursive === 1,
              'pl-16': recursive > 1,
              'bg-graydark dark:bg-meta-4':
                isMatch || activeName.split('.')[0] === item.link,
              'text-slate-400':
                !isMatch && activeName.split('.')[0] !== item.link,
              'text-slate-200':
                !isMatch &&
                activeName.split('.')[0] !== item.link &&
                isExpandOnHover,
            },
            classesActive
          )}
        >
          <div className="flex items-center w-full gap-3">
            <item.icon className="size-6" />
            <div
              className={`truncate ${
                sidebarExpanded || isExpandOnHover ? '' : 'w-0 h-0 opacity-0'
              }`}
            >
              {item.title}
            </div>
          </div>
          {'child' in item ? (
            <div
              className={`${
                sidebarExpanded || isExpandOnHover ? '' : 'w-0 h-0 opacity-0'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            false
          )}
        </Link>
        {'child' in item ? (
          <ul
            className={[
              'overflow-hidden duration-300 ease-in-out',
              sidebarExpanded || isExpandOnHover ? '' : 'h-0',
            ].join(' ')}
            key={item.name}
          >
            {item?.child?.map((value, idx: number) =>
              generateMenu(value, idx, recursive + 1)
            )}
          </ul>
        ) : null}
      </li>
    );
  };

  const newStructure: SidebarItem[] = sidebarStructure.flatMap(
    (item): SidebarItem[] => {
      if (item.name !== 'ANY') {
        const result = forResource(item.name).canRead;
        if (!result) {
          return []; // skip this item
        }
      }

      const newChild = item.child?.filter((child) => {
        if (child.name === 'ANY') {
          return true;
        }
        return forResource(child.name).canRead;
      });

      return [{ ...item, child: newChild }];
    }
  );

  return (
    <nav
      role="navigation"
      className={classNames({
        hidden: !sidebarOpen,
        'only-sm:mt-70': true, // applies only if you've defined it in custom CSS
        'sm:block': true,
        'bg-black': true,
        'dark:bg-boxdark': true,
        'z-20': true,
        'border-r border-slate-100': true,
        'absolute shadow-sm inset-y-0 left-0': true,
        'duration-300 ease-in-out md:fixed md:translate-x-0': true,
        'bg-black w-72': sidebarExpanded,
        'bg-black/70 w-72 backdrop-blur-md':
          !sidebarExpanded && isExpandOnHover,
        'bg-black w-20': !sidebarExpanded && !isExpandOnHover,
      })}
    >
      <button
        type="button"
        aria-label="Toggle Sidebar"
        className="hidden sm:block absolute z-50 top-16 -right-3 bg-white hover:bg-slate-100 text-slate-500 p-0.5 rounded-full border border-slate-200"
        onClick={() => {
          setSidebarExpanded(!sidebarExpanded);
          setSidebarOpen(!sidebarExpanded);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            sidebarExpanded ? 'rotate-0' : 'rotate-180'
          } transform duration-500 h-4 w-4`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        onMouseEnter={() => handleHoverExpand(true)}
        onMouseLeave={() => handleHoverExpand(false)}
        className="relative h-screen overflow-hidden"
      >
        <SimpleBar style={{ height: '100%' }} autoHide>
          <div className="flex flex-col items-center text-slate-500">
            <div
              className={`flex items-center duration-300 ${
                sidebarExpanded || isExpandOnHover ? 'h-35 w-35' : 'h-12 w-12'
              }`}
            >
              <Link href="/">
                <Image
                  width={176}
                  height={32}
                  src="/images/talus-only-logo.png"
                  alt="Logo"
                  priority
                />
              </Link>
            </div>
            <div className="w-full mt-3 mb-10 p-0">
              <ul className="list-none text-sm font-normal px-3">
                {newStructure.map((item, index) => generateMenu(item, index))}
              </ul>
            </div>
          </div>
        </SimpleBar>
      </div>
    </nav>
  );
};
