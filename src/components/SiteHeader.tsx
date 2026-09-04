'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Workshops', href: '/#workshops' },
  { label: 'Resources', href: '/#resources' },
  { label: 'Blog', href: '/blog' },
] as const;

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const contactHref = pathname === '/' ? '#contact' : '/#contact';

  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#064F45] text-[#FBF8F1]">
        <div className="mx-auto flex h-[34px] max-w-7xl items-center justify-between gap-3 px-4 text-[11px] leading-none sm:px-6 sm:text-xs lg:px-8">
          <p className="shrink-0 tracking-wide">Based in Lahore, Pakistan</p>
          <p className="hidden min-w-0 text-center tracking-wide md:block">
            Online Sessions Across Pakistan &amp; Worldwide
          </p>
          <a
            href="https://wa.me/923335515445"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 tracking-wide transition-colors hover:text-[#C8A675]"
          >
            <FaWhatsapp className="h-3.5 w-3.5" aria-hidden="true" />
            <span>+92 333 5515445</span>
          </a>
        </div>
      </div>

      <div className="relative border-b border-[#E8DED1] bg-[#FFFCF7] shadow-[0_1px_8px_rgba(18,63,56,0.04)]">
        <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[90px] lg:px-8">
          <Link href="/" className="flex min-w-0 shrink-0 items-center" onClick={closeMobileMenu}>
            <Image
              src="/Asset 3@3x.png"
              alt="Ambreen Rashid Khan — Clinical Psychologist"
              width={260}
              height={80}
              className="h-[52px] w-auto object-contain sm:h-[58px] lg:h-[68px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-[#123F38] transition-colors hover:text-[#064F45]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center">
            <a
              href={contactHref}
              className="float-pop-loop hidden rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold tracking-wide text-[#FFFCF7] shadow-[0_1px_4px_rgba(6,79,69,0.12)] transition-colors hover:bg-[#05443B] lg:inline-flex"
            >
              Book a Session
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex items-center justify-center rounded-md border border-[#E8DED1] p-2 text-[#123F38] transition-colors hover:bg-[#F3EADB] lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              <span className="relative block h-5 w-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
                  }`}
                  strokeWidth={1.6}
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
                  }`}
                  strokeWidth={1.6}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? '' : 'pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`fixed top-[114px] bottom-0 left-0 z-40 flex w-[min(82vw,320px)] flex-col bg-[#FFFCF7] shadow-[8px_0_24px_rgba(18,63,56,0.12)] transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="border-b border-[#E8DED1] px-5 py-5">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">Menu</p>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-5" aria-label="Mobile">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMobileMenu}
              className={`rounded-md px-3 py-2.5 text-sm font-medium text-[#123F38] transition-colors hover:bg-[#F3EADB] ${
                mobileOpen ? 'mobile-nav-link' : ''
              }`}
              style={{ animationDelay: mobileOpen ? `${90 + index * 55}ms` : '0ms' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  );
}
