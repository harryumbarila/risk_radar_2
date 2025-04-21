import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

type BreadcrumbProps = {
  pageName: string;
  extra?: string;
  enableBackButton?: boolean;
};

export const Breadcrumb: FC<BreadcrumbProps> = ({
  pageName,
  extra,
  enableBackButton,
}) => {
  const router = useRouter();
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {enableBackButton ? (
          <button
            type="button"
            className="size-6"
            onClick={() => router.back()}
          >
            <ArrowUturnLeftIcon />
          </button>
        ) : null}
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageName}
          {extra && ` - ${extra}`}
        </h2>
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};
