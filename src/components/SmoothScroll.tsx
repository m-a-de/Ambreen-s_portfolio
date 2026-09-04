'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    return;
  }

  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: scrollBehavior(),
    block: 'start',
  });
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToHash(window.location.hash);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      const onHome = pathname === '/';
      const goingHome = url.pathname === '/';

      if (onHome && goingHome && url.hash) {
        event.preventDefault();
        history.pushState(null, '', url.hash);
        scrollToHash(url.hash);
        return;
      }

      if (onHome && goingHome && !url.hash) {
        event.preventDefault();
        history.pushState(null, '', '/');
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  return null;
}
