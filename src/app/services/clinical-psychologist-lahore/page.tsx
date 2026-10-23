import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ClipboardList,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactSection from '@/components/ContactSection';

const CANONICAL =
  'https://www.ambreenrashidkhan.com/services/clinical-psychologist-lahore';
const PAGE_TITLE = 'Clinical Psychologist in Lahore | Ambreen Rashid Khan';
const PAGE_DESCRIPTION =
  'Book a session with Ambreen Rashid Khan, Clinical Psychologist in Lahore. In-person psychological therapy in Shadman 2 and online sessions across Pakistan.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SUPPORT_CONCERNS = [
  'anxiety and persistent worry',
  'low mood and depression',
  'trauma-related experiences',
  'relationship difficulties',
  'grief and loss',
  'emotional distress',
  'recurring behavioural or coping patterns',
  'personal growth and self-understanding',
] as const;

const APPROACH_ITEMS = [
  {
    title: 'Trauma-Informed Care',
    icon: ShieldCheck,
    description:
      'A trauma-informed approach recognises that past experiences can affect present emotions, relationships and coping, and allows work to proceed at a respectful pace.',
  },
  {
    title: 'Motivational Interviewing',
    icon: MessageCircleHeart,
    description:
      'Motivational interviewing is used to help you clarify your own reasons for change and build confidence in the steps that feel workable for you.',
  },
  {
    title: 'Tailored to Your Circumstances',
    icon: ClipboardList,
    description:
      'Treatment is adapted to the individual’s circumstances, concerns and goals rather than applying one formula to every person.',
  },
  {
    title: 'Compassionate Communication',
    icon: HeartHandshake,
    description:
      'Sessions are offered with compassionate and respectful communication, including when the conversation involves difficult or sensitive topics.',
  },
] as const;

const FIRST_SESSION_POINTS = [
  'discussion of the reason for seeking therapy',
  'current concerns and how they affect everyday life',
  'relevant personal circumstances or history where appropriate',
  'therapeutic goals',
  'opportunity to ask questions',
  'discussion of appropriate next steps',
] as const;

const RESOURCE_LINKS = [
  {
    href: '/blog/clinical-psychologist-in-lahore',
    title: 'Clinical Psychologist in Lahore: When to Seek Therapy and What to Expect',
  },
  {
    href: '/blog/psychologist-in-lahore',
    title: 'How to Choose the Right Psychologist in Lahore',
  },
  {
    href: '/blog/online-therapy-pakistan',
    title: 'Online Therapy in Pakistan',
  },
] as const;

export default function ClinicalPsychologistLahorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFCF7]">
      <SiteHeader />

      <main className="flex-1">
        <section className="overflow-x-hidden bg-[#FFFCF7]">
          <div className="mx-auto flex max-w-[1210px] flex-col-reverse gap-10 px-5 py-12 sm:px-6 md:flex-col md:py-14 lg:flex-row lg:items-center lg:gap-[70px] lg:px-8 lg:py-16">
            <div className="w-full min-w-0 lg:w-[55%]">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#EEF5EF] px-3.5 py-1.5 text-[12px] font-medium text-[#064F45]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#064F45]" aria-hidden="true" />
                Shadman 2, Lahore • Online across Pakistan
              </p>
              <h1 className="mt-5 font-serif text-[40px] font-semibold leading-[1.12] text-[#123F38] lg:text-[56px] lg:leading-[1.1]">
                Clinical Psychologist in Lahore
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                Psychological support for adults navigating emotional, behavioural, trauma-related
                and relationship concerns, with in-person sessions in Shadman 2, Lahore and online
                sessions across Pakistan.
              </p>
              <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
                >
                  Book a Session
                </a>
                <a
                  href="https://wa.me/923086522764"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#064F45] bg-[#FFFCF7] px-5 py-2.5 text-[13px] font-semibold text-[#064F45] transition-colors hover:bg-[#EEF5EF]"
                >
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex w-full min-w-0 justify-center lg:w-[40%] lg:justify-end">
              <div className="relative h-[340px] w-full overflow-hidden rounded-[22px] bg-[#F3EADB] shadow-[0_8px_24px_rgba(18,63,56,0.08)] md:h-[370px] lg:h-[500px] lg:w-[420px]">
                <Image
                  src="/images/redesign/hero-therapy-room.webp"
                  alt="Calm therapy room in Lahore used for psychological consultations"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 420px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FBF8F1] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                Support
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                Psychological Support Tailored to Your Needs
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                People seek psychological support for many different reasons. Therapy can offer a
                confidential space to understand what is happening, explore contributing patterns,
                and consider what kind of support may be appropriate. It does not mean every concern
                can be treated or resolved in the same way.
              </p>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUPPORT_CONCERNS.map((concern) => (
                <li
                  key={concern}
                  className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] px-5 py-4 text-[15px] text-[#123F38] shadow-[0_1px_6px_rgba(18,63,56,0.04)]"
                >
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#FFFCF7] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                Approach
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                A Personalised Approach to Therapy
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                Ambreen Rashid Khan&apos;s approach incorporates trauma-informed care and motivational
                interviewing, with treatment tailored to the individual’s circumstances, concerns
                and goals.
              </p>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {APPROACH_ITEMS.map(({ title, icon: Icon, description }) => (
                <li
                  key={title}
                  className="rounded-xl border border-[#E8DED1] bg-[#FBF8F1] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)]"
                >
                  <Icon className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="mt-4 font-serif text-lg font-semibold text-[#123F38]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#525B57]">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#FBF8F1] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                Sessions
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                In-Person and Online Therapy Options
              </h2>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] md:p-8">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#C8A675] uppercase">
                  In Lahore
                </p>
                <h3 className="mt-3 font-serif text-xl font-semibold text-[#123F38]">
                  In-Person Sessions
                </h3>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-[#525B57]">
                  <li>Shadman 2, Lahore, Pakistan</li>
                  <li>By appointment</li>
                  <li>Standard individual sessions are approximately 50 minutes</li>
                </ul>
              </li>
              <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] md:p-8">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#C8A675] uppercase">
                  Across Pakistan
                </p>
                <h3 className="mt-3 font-serif text-xl font-semibold text-[#123F38]">
                  Online Sessions
                </h3>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-[#525B57]">
                  <li>Available across Pakistan</li>
                  <li>Suitable for people who cannot regularly travel to Lahore</li>
                  <li>Requires a private environment and reliable internet connection</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-[#FFFCF7] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                First Session
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                What to Expect in Your First Session
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                An initial session is a chance to understand what has brought you to therapy and
                whether this form of support feels appropriate. It is educational and collaborative,
                not a guarantee of a particular outcome.
              </p>
            </div>
            <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
              {FIRST_SESSION_POINTS.map((point) => (
                <li
                  key={point}
                  className="rounded-xl border border-[#E8DED1] bg-[#FBF8F1] px-5 py-4 text-[15px] leading-relaxed text-[#123F38]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#FBF8F1] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                Location
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                Clinical Psychologist in Shadman 2, Lahore
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                Ambreen Rashid Khan provides in-person psychological consultations in Shadman 2,
                Lahore, by appointment. For people outside Lahore, online sessions are available
                across Pakistan.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#FFFCF7] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                Helpful Resources
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                Further reading on therapy, choosing support, and online sessions.
              </p>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {RESOURCE_LINKS.map((article) => (
                <li key={article.href}>
                  <article className="flex h-full flex-col rounded-xl border border-[#E8DED1] bg-[#FBF8F1] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-colors hover:border-[#C8A675]/50">
                    <h3 className="font-serif text-xl font-semibold leading-snug text-[#123F38]">
                      <Link href={article.href} className="transition-colors hover:text-[#064F45]">
                        {article.title}
                      </Link>
                    </h3>
                    <Link
                      href={article.href}
                      className="mt-5 inline-flex text-[13px] font-semibold text-[#064F45] transition-colors hover:text-[#05443B]"
                    >
                      Read article
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
