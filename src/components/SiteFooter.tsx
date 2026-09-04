import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Workshops', href: '/#workshops' },
  { label: 'Resources', href: '/#resources' },
  { label: 'Blog', href: '/blog' },
] as const;

const SERVICE_LINKS = [
  'Individual Therapy',
  'Couples Therapy',
  'Group Therapy',
  'Clinical Supervision',
] as const;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#064F45] text-[#FFFCF7]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <Link href="/" className="inline-flex">
            <Image
              src="/Asset 3@3x.png"
              alt="Ambreen Rashid Khan — Clinical Psychologist"
              width={240}
              height={75}
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="mt-5 font-serif text-lg font-semibold text-[#FFFCF7]">
            Ambreen Rashid Khan
          </p>
          <p className="mt-1 text-sm text-[#C8A675]">Clinical Psychologist</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FFFCF7]/80">
            Dedicated to providing compassionate, evidence-based therapy that honors your unique
            experiences and challenges.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/ambreenrashidkhanpsych"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#FFFCF7] transition-colors hover:border-[#C8A675] hover:text-[#C8A675]"
            >
              <FaFacebook className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/ambreenrashidkhanpsych"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#FFFCF7] transition-colors hover:border-[#C8A675] hover:text-[#C8A675]"
            >
              <FaInstagram className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
            Quick Links
          </h2>
          <ul className="mt-5 space-y-2.5">
            {QUICK_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-[#FFFCF7]/80 transition-colors hover:text-[#C8A675]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
            Services
          </h2>
          <ul className="mt-5 space-y-2.5">
            {SERVICE_LINKS.map((label) => (
              <li key={label}>
                <Link
                  href="/#services"
                  className="text-sm text-[#FFFCF7]/80 transition-colors hover:text-[#C8A675]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
            Contact Info
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-[#FFFCF7]/80">
            <li>
              <a
                href="mailto:consult@ambreenrashidkhan.com"
                className="transition-colors hover:text-[#C8A675]"
              >
                consult@ambreenrashidkhan.com
              </a>
            </li>
            <li>
              <a href="tel:+923335515445" className="transition-colors hover:text-[#C8A675]">
                +92 333 5515445
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/923335515445"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-[#C8A675]"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li>Shadman 2, Lahore, Pakistan</li>
            <li>Online Sessions Across Pakistan &amp; Worldwide</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#05443B]">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs tracking-wide text-[#FFFCF7]/70 sm:px-6 lg:px-8">
          © {currentYear} Ambreen Rashid Khan. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
