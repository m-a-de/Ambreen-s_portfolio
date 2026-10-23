'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Brain,
  BrainCog,
  ChevronDown,
  ClipboardList,
  Globe,
  GraduationCap,
  HeartCrack,
  HeartHandshake,
  Lock,
  MessageCircleHeart,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  UserRound,
  UsersRound,
  Venus,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactSection from '@/components/ContactSection';
import BlogCoverImage from '@/components/BlogCoverImage';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [aboutImageFailed, setAboutImageFailed] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is psychotherapy?',
      answer: 'Psychotherapy is a collaborative treatment based on the relationship between an individual and a psychologist. A psychologist provides a supportive environment that allows you to talk openly with someone who is objective, neutral, and nonjudgmental. Together, you and your psychologist will identify and work through the issues that are causing emotional distress and make positive changes in your life.'
    },
    {
      question: 'How do I know if therapy is right for me?',
      answer: 'Therapy can be beneficial for anyone facing challenges in their life, experiencing emotional distress, or seeking personal growth. If you\'re dealing with persistent feelings of sadness or anxiety, struggling with relationships, recovering from trauma, or simply wanting to understand yourself better, therapy might be helpful. The best way to determine if therapy is right for you is to schedule an initial consultation.'
    },
    {
      question: 'How long does each therapy session last?',
      answer: 'Standard therapy sessions are 50 minutes long, which is considered a therapeutic hour. This allows me to take notes and prepare for the next client. However, I also offer extended sessions of 75 or 90 minutes for certain therapeutic approaches or situations where more time might be beneficial.'
    },
    {
      question: 'How many therapy sessions will I need?',
      answer: 'The duration of therapy varies widely depending on your specific situation, goals, and the type of therapy approach used. Some people might see improvement after just a few sessions, while others benefit from longer-term therapy. We\'ll regularly review your progress together and adjust our approach as needed. My goal is to provide the support you need for as long as it\'s helpful.'
    },
    {
      question: 'Is what I share in therapy confidential?',
      answer: 'Confidentiality is a fundamental part of psychotherapy. What you share in our sessions will be kept private and confidential, with a few important exceptions: if there is a risk of harm to yourself or others, suspected abuse of children or vulnerable adults, or if legally required by a court order. I\'ll discuss these limits to confidentiality with you in our first session.'
    },
    {
      question: 'What approach do you use in therapy?',
      answer: 'I use an integrative approach that draws from several evidence-based therapy methods, including cognitive-behavioral therapy (CBT), psychodynamic therapy, and mindfulness practices. This allows me to tailor the treatment to your specific needs, goals, and preferences. My approach is compassionate, collaborative, and focused on helping you develop practical skills while also exploring deeper patterns that influence your thoughts, feelings, and behaviors.'
    }
  ];

  const heroChips = [
    'Individual Therapy',
    'Couples Therapy',
    'Trauma-Informed Care',
    'Online Sessions',
    'Group Therapy',
  ];

  const heroTiles = [
    { title: '50-Minute', detail: 'Individual Therapy' },
    { title: 'Online & In-Person', detail: 'Session Options' },
    { title: 'Shadman 2', detail: 'Lahore, Pakistan' },
  ];

  const heroTrustItems = [
    { label: 'Trauma-Informed Care', icon: ShieldCheck },
    { label: 'Motivational Interviewing', icon: MessageCircleHeart },
    { label: 'Confidential & Respectful', icon: Lock },
    { label: 'Online & In-Person Sessions', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="overflow-x-hidden bg-[#FFFCF7]">
        <div className="mx-auto flex max-w-[1210px] flex-col-reverse gap-10 px-5 py-12 sm:px-6 md:flex-col md:py-14 lg:flex-row lg:items-center lg:gap-[70px] lg:px-8 lg:py-16">
          <div className="w-full min-w-0 lg:w-[55%]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF5EF] px-3.5 py-1.5 text-[12px] font-medium text-[#064F45]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#064F45]" aria-hidden="true" />
              Lahore • Online &amp; In-Person Sessions
            </div>

            <h1 className="mt-5 font-serif text-[40px] font-semibold leading-[1.12] text-[#123F38] lg:text-[56px] lg:leading-[1.1]">
              Clinical Psychologist in Lahore
              <span className="mt-1 block font-semibold text-[#064F45]">
                Compassionate Support for Meaningful Change
              </span>
            </h1>

            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
              Are you feeling weighed down by worry, loneliness, or a sense that something just isn&apos;t
              right? You&apos;re not alone, and it&apos;s okay to ask for help. As a dedicated Clinical
              Psychologist, I&apos;m here to journey alongside you, guiding you towards genuine happiness
              and fulfillment.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {heroChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-[#EEF5EF] px-3 py-1 text-[12px] font-medium text-[#123F38]"
                >
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:items-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
              >
                Book Your Session
              </a>
              
            </div>

            <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-xl border border-[#DCE8DE] bg-[#FFFCF7]">
              {heroTiles.map((tile, index) => (
                <div
                  key={tile.title}
                  className={`px-2 py-3 text-center sm:px-3 sm:py-4 ${
                    index > 0 ? 'border-l border-[#DCE8DE]' : ''
                  }`}
                >
                  <p className="font-serif text-[13px] font-semibold leading-snug text-[#123F38] sm:text-[15px]">
                    {tile.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-[#525B57] sm:text-xs">{tile.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full min-w-0 justify-center lg:w-[40%] lg:justify-end">
            <div className="relative h-[340px] w-full overflow-hidden rounded-[22px] bg-[#F3EADB] shadow-[0_8px_24px_rgba(18,63,56,0.08)] md:h-[370px] lg:h-[500px] lg:w-[420px]">
              {!heroImageFailed && (
                <Image
                  src="/images/redesign/hero-therapy-room.webp"
                  alt="Calm therapy room for counseling sessions"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1023px) 100vw, 420px"
                  className="object-cover object-center"
                  onError={() => setHeroImageFailed(true)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-hidden bg-[#064F45]">
          <ul className="mx-auto grid max-w-[1210px] grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 sm:gap-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:py-4">
            {heroTrustItems.map(({ label, icon: Icon }) => (
              <li key={label} className="flex min-w-0 items-start gap-2 text-[#FBF8F1] sm:items-center sm:gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF5EF]/10">
                  <Icon className="h-[18px] w-[18px] text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span className="min-w-0 text-[12px] font-medium leading-snug sm:text-[13px]">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="bg-[#FBF8F1] py-16 md:py-20">
        <div className="mx-auto grid max-w-[1210px] items-center gap-10 px-5 sm:px-6 md:grid-cols-2 md:gap-14 lg:gap-16 lg:px-8">
          <div className="relative w-full pb-5">
            <div className="relative h-[320px] w-full overflow-hidden rounded-[22px] bg-[#F3EADB] shadow-[0_6px_20px_rgba(18,63,56,0.06)] sm:h-[380px] md:h-[460px]">
              {!aboutImageFailed && (
                <Image
                  src="/images/redesign/about-therapy-room.webp"
                  alt="Calm therapy room used for counseling sessions"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  onError={() => setAboutImageFailed(true)}
                />
              )}
            </div>
            <div
              className="absolute right-3 bottom-0 z-10 flex h-[90px] w-[90px] rotate-[2deg] flex-col items-center justify-center rounded-[20px] border border-[#C8A675]/55 bg-[#064F45] text-center text-[#FFFCF7] shadow-[0_8px_18px_rgba(18,63,56,0.16)] md:right-2 md:bottom-[-8px] md:h-[116px] md:w-[116px]"
              aria-label="15+ years experience"
            >
              <span className="font-serif text-[28px] font-semibold leading-none md:text-[34px]">15+</span>
              <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] uppercase md:text-[10px]">
                YEARS
              </span>
              <span className="mt-0.5 text-[8px] font-medium tracking-[0.18em] uppercase md:text-[9px]">
                EXPERIENCE
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              About Me
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#123F38] md:text-3xl">
            Ambreen Rashid Khan
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
            As a Clinical Psychologist, I provide individualized psychological support for adults navigating emotional, behavioural, trauma-related, and relationship concerns.

My approach is grounded in trauma-informed care and motivational interviewing, with therapy tailored to each person’s unique needs, circumstances, and goals.
            </p>
            <blockquote className="mt-8 rounded-xl border border-[#E8DED1] bg-[#FFFCF7] px-5 py-5 shadow-[0_1px_6px_rgba(18,63,56,0.04)]">
              <p className="font-serif text-base italic leading-relaxed text-[#123F38] md:text-lg">
                &quot;Every individual has unique needs and circumstances. Being intentional about your path means accounting for your unique makeup, mending your emotional life, and striving for your better life.&quot;
              </p>
              <footer className="mt-4">
                <p className="font-serif text-lg font-semibold text-[#123F38]">Ambreen Rashid Khan</p>
                <p className="text-sm text-[#064F45]">Clinical Psychologist</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="approach" className="bg-[#FFFCF7] py-16 md:py-20">
        <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              My Approach
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
              How I Work
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
              My clinical approach hinges on a trauma informed model with motivational interviewing techniques. This allows me to utilize a tailored approach for each person with whom I work.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {[
              {
                title: 'Trauma-Informed Care',
                icon: ShieldCheck,
                description:
                  'I create a safe environment where we can work through past experiences at your own pace, recognizing the impact of trauma on your life.',
              },
              {
                title: 'Motivational Interviewing',
                icon: MessageCircleHeart,
                description:
                  'I help you discover your own reasons for change and develop the confidence to make those changes, empowering you in your journey.',
              },
              {
                title: 'Tailored Treatment Plans',
                icon: ClipboardList,
                description:
                  'Your therapy will be customized to your specific needs, background, and goals, ensuring the most effective approach for you.',
              },
              {
                title: 'Compassionate Communication',
                icon: HeartHandshake,
                description:
                  'I use warmth and understanding to create a comfortable environment while addressing difficult topics with sensitivity and care.',
              },
            ].map(({ title, icon: Icon, description }) => (
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

          <div className="mt-16 md:mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                The Journey
              </p>
              <h3 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                The Process of Counseling
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                A clear, structured approach to help you understand what to expect and how we&apos;ll work together toward your goals.
              </p>
            </div>

            <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {[
                {
                  step: '1',
                  title: 'Initial Session',
                  description:
                    "Meet with me to get to know my style and see if we're a good fit. This step is all about connection, comfort, and understanding your needs.",
                },
                {
                  step: '2',
                  title: 'Frequency Planning',
                  description:
                    "Together we'll assess the appropriate frequency of meetings based on your needs, concerns, and therapeutic goals.",
                },
                {
                  step: '3',
                  title: 'Gradual Independence',
                  description:
                    "We'll start with more frequent sessions and decrease gradually until you feel confident to continue on your own.",
                },
              ].map(({ step, title, description }) => (
                <li
                  key={step}
                  className="rounded-xl border border-[#E8DED1] bg-[#FBF8F1] px-6 py-7 shadow-[0_1px_6px_rgba(18,63,56,0.04)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A675]/40 font-serif text-lg text-[#064F45]">
                    {step}
                  </span>
                  <h4 className="mt-5 font-serif text-xl font-semibold text-[#123F38]">{title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#525B57]">{description}</p>
                </li>
              ))}
            </ol>

            <blockquote className="mt-10 rounded-xl border border-[#E8DED1] border-l-[3px] border-l-[#064F45] bg-[#FBF8F1] px-6 py-6 md:px-8 md:py-7">
              <p className="font-serif text-lg italic leading-relaxed text-[#123F38] md:text-xl">
                &quot;My aim is to put myself out of business. I want you not to need me anymore! Have an idea of how you would like to approach your treatment when you meet with me. How often would you like to meet? What are your major concerns?&quot;
              </p>
              <footer className="mt-4 text-sm font-semibold text-[#064F45]">— Ambreen Rashid Khan</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#FBF8F1] py-16 md:py-20">
        <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              Our Services
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
              How I Can Support You
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
              Finding the right service modality for your needs is important. Here is a brief description of the different service formats I can provide.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
              <UserRound className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123F38]">Individual Therapy</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#525B57]">
                You are the primary client. Your personal preferences, needs, concerns, goals, hopes, and dreams are our focus.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-[#123F38]">
                <li>50-minute sessions</li>
                <li>In-person or online</li>
              </ul>
            </li>
            <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
              <HeartHandshake className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123F38]">Couples Therapy</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#525B57]">
                The relationship is the primary client. How each individual&apos;s personal preferences, needs, concerns, goals, hopes, and dreams affect the relationship is our focus.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-[#123F38]">
                <li>80-minute sessions</li>
                <li>Safe, supportive environment</li>
              </ul>
            </li>
            <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
              <UsersRound className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123F38]">Group Therapy</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#525B57]">
                The group supports each other in seeking overall life satisfaction. Guidelines create safety as each individual will need to be vulnerable with their peers.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-[#123F38]">
                <li>Shared learning experience</li>
                <li>Supportive community</li>
              </ul>
            </li>
            <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
              <GraduationCap className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123F38]">Clinical Supervision</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#525B57]">
                Clinical Supervision is available at 5k per session and every session would be between 35 to 40 minutes for supplementary supervision.
              </p>
              
              <p className="mt-3 text-sm leading-relaxed text-[#525B57]">
                The process begins with an initial session to get to know each other. Together, we&apos;ll assess the appropriate frequency of meetings for your specific needs and concerns.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-[#FFFCF7] py-16 md:py-20">
        <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              Our Specialties
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
              Areas of Expertise
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
              I work with adults on a wide array of concerns, providing personalized therapy tailored to your unique needs and circumstances.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {[
              { title: 'Relationship Issues', icon: HeartHandshake },
              { title: 'Trauma', icon: ShieldCheck },
              { title: 'Anxiety & Depression', icon: Brain },
              { title: 'Coping with Loss', icon: HeartCrack },
              { title: 'Substance Abuse', icon: ShieldAlert },
              { title: 'PTSD', icon: BrainCog },
              { title: "Women's Issues", icon: Venus },
              { title: 'Self Improvement', icon: Sprout },
            ].map(({ title, icon: Icon }) => (
              <li
                key={title}
                className="rounded-xl border border-[#E8DED1] bg-[#FBF8F1] px-4 py-5 text-center shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Icon className="mx-auto h-9 w-9 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mt-3 font-serif text-sm font-semibold leading-snug text-[#123F38] sm:text-base">
                  {title}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="workshops" className="bg-[#FBF8F1] py-16 md:py-20">
        <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              Professional Support
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
              Workshops &amp; Professional Support
            </h2>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] md:p-8">
              <UsersRound className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123F38]">Group Therapy</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525B57]">
                The group supports each other in seeking overall life satisfaction. Guidelines create safety as each individual will need to be vulnerable with their peers.
              </p>
            </li>
            <li className="rounded-xl border border-[#E8DED1] bg-[#FFFCF7] p-6 shadow-[0_1px_6px_rgba(18,63,56,0.04)] md:p-8">
              <GraduationCap className="h-10 w-10 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123F38]">Clinical Supervision</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#525B57]">
                Clinical Supervision is available at 5k per session and every session would be between 35 to 40 minutes for supplementary supervision.
              </p>
              
            </li>
          </ul>

          <div className="mt-8 text-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
            >
              Book a Session
            </a>
          </div>
        </div>
      </section>

      <div id="resources" className="scroll-mt-[124px]">
        <section className="bg-[#FFFCF7] py-16 md:py-20" aria-labelledby="helpful-resources-heading">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                id="helpful-resources-heading"
                className="font-serif text-3xl font-semibold text-[#123F38] md:text-4xl"
              >
                Helpful Resources
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                Practical guidance on therapy, mental health, and finding the right psychological
                support in Lahore and Pakistan.
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {[
                {
                  href: '/blog/clinical-psychologist-in-lahore',
                  title: 'Clinical Psychologist in Lahore',
                  image: '/images/blog/clinical-psychologist-in-lahore.webp',
                },
                {
                  href: '/blog/psychologist-in-lahore',
                  title: 'Psychologist in Lahore: How to Choose the Right Professional',
                  image: '/images/blog/psychologist-in-lahore.webp',
                },
                {
                  href: '/blog/online-therapy-pakistan',
                  title: 'Online Therapy in Pakistan',
                  image: '/images/blog/online-therapy-pakistan.webp',
                },
              ].map((article) => (
                <li key={article.href}>
                  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8DED1] bg-[#FBF8F1] shadow-[0_1px_6px_rgba(18,63,56,0.04)] transition-colors hover:border-[#C8A675]/50">
                    <BlogCoverImage
                      src={article.image}
                      alt={article.title}
                      hasImage
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="h-48 w-full"
                    />
                    <div className="flex flex-1 flex-col p-6">
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
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-[124px] bg-[#FBF8F1] py-16 md:py-20">
          <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                Resources
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#123F38] md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
                Find answers to common questions about therapy, my approach, and what to expect during your journey.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 items-start gap-3 lg:grid-cols-2 lg:gap-4">
              {[faqs.slice(0, 3), faqs.slice(3)].map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-3">
                  {column.map((faq, columnItemIndex) => {
                    const index = columnIndex * 3 + columnItemIndex;
                    const isOpen = openFaq === index;

                    return (
                      <div
                        key={faq.question}
                        className="overflow-hidden rounded-xl border border-[#E8DED1] bg-[#FFFCF7]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="font-serif text-[15px] font-semibold leading-snug text-[#064F45] md:text-base">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-[#C8A675] transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="border-t border-[#E8DED1] px-5 py-4 text-sm leading-relaxed text-[#525B57]">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-serif text-2xl font-semibold text-[#123F38]">Still Have Questions?</h3>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#525B57]">
                I&apos;m happy to help. Reach out and let&apos;s start a conversation about how I can support you.
              </p>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-[#064F45] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#05443B]"
              >
                Contact Me
              </a>
            </div>
          </div>
        </section>
      </div>

      <ContactSection />

      <SiteFooter />
    </div>
  );
}
