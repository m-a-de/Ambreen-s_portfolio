'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

type BookSessionLinkProps = {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
};

export default function BookSessionLink({
  href,
  source,
  className,
  children,
}: BookSessionLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent('book_session_click', { source })}
    >
      {children}
    </Link>
  );
}
