'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const maxVisibleButtons = 5;

  const allPages = generateFixedPagination(currentPage, totalPages, maxVisibleButtons);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => (
          <PaginationNumber
            key={index}
            href={typeof page === 'number' ? createPageURL(page) : '#'}
            page={page}
            isActive={currentPage === page}
            isEllipsis={page === '...'}
          />
        ))}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  isEllipsis,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
  isEllipsis: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-md': isEllipsis,
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && !isEllipsis,
    },
  );

  return isEllipsis ? (
    <div className={className}>...</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

function generateFixedPagination(
  currentPage: number,
  totalPages: number,
  maxVisibleButtons: number
): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxButtons = Math.min(maxVisibleButtons, totalPages);

  pages.push(1);

  if (totalPages <= maxVisibleButtons) {
    for (let i = 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    let start: number;
    let end: number;

    if (currentPage <= Math.floor(maxButtons / 2)) {
      start = 2;
      end = maxButtons - 2;
    } else if (currentPage > totalPages - Math.floor(maxButtons / 2)) {
      start = totalPages - (maxButtons - 3);
      end = totalPages - 1;
    } else {
      start = currentPage - Math.floor((maxButtons - 4) / 2);
      end = currentPage + Math.floor((maxButtons - 4) / 2);
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
  }
  return pages;
}




