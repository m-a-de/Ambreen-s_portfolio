'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
  Brain,
  BrainCog,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock,
  Globe,
  GraduationCap,
  HeartCrack,
  HeartHandshake,
  Lock,
  Mail,
  MapPin,
  MessageCircleHeart,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  UserRound,
  UsersRound,
  Venus,
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'general',
    message: '',
    privacy: false,
    website: '',
  });
  const [contactStatus, setContactStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [aboutImageFailed, setAboutImageFailed] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' && 'checked' in e.target ? e.target.checked : false;
    setContactForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message || !contactForm.privacy) {
      setContactStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields and agree to the privacy statement.',
      });
      return;
    }

    if (!turnstileToken) {
      setContactStatus({
        submitted: true,
        success: false,
        message: 'Please complete the human verification before submitting.',
      });
      return;
    }

    setIsSending(true);
    setContactStatus({ submitted: false, success: false, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactForm, turnstileToken }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your message. Please try again later.');
      }

      setContactStatus({
        submitted: true,
        success: true,
        message: 'Thank you for reaching out. I will respond to your message within 24-48 hours.',
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        enquiryType: 'general',
        message: '',
        privacy: false,
        website: '',
      });
      setTurnstileToken('');
      turnstileRef.current?.reset();
    } catch (error) {
      setContactStatus({
        submitted: true,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Unable to send your message. Please try again later.',
      });
    } finally {
      setIsSending(false);
    }
  };

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
              Empowering Change
              <span className="mt-1 block font-semibold text-[#064F45]">
                for a Happier, Authentic Life
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

      <section id="contact" className="scroll-mt-[124px] bg-[#FFFCF7] py-16 md:py-20">
        <div className="mx-auto max-w-[1210px] px-5 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[22px] border border-[#E8DED1] bg-[#FBF8F1] lg:grid-cols-2">
            <div className="flex flex-col p-6 sm:p-8 md:p-10 lg:p-12">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
                Let&apos;s Connect
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#123F38] md:text-4xl">
                Book An Appointment Now
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#525B57]">
              Reach out to schedule a consultation or ask about my services.I&apos;m here to support your journey toward better mental health.
              </p>
              

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">Phone</p>
                    <a
                      href="tel:+923335515445"
                      className="mt-1 block text-[15px] text-[#123F38] transition-colors hover:text-[#064F45]"
                    >
                      +92 333 5515445
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FaWhatsapp className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">WhatsApp</p>
                    <a
                      href="https://wa.me/923335515445"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-[15px] text-[#123F38] transition-colors hover:text-[#064F45]"
                    >
                      +92 333 5515445
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">Email</p>
                    <a
                      href="mailto:consult@ambreenrashidkhan.com"
                      className="mt-1 block break-all text-[15px] text-[#123F38] transition-colors hover:text-[#064F45]"
                    >
                      consult@ambreenrashidkhan.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">Location</p>
                    <p className="mt-1 text-[15px] text-[#123F38]">Shadman 2, Lahore, Pakistan</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">Working Hours</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#123F38]">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: By appointment only
                    </p>
                    <p className="mt-2 text-sm text-[#525B57]">
                      All timings are applicable for appointments only.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#E8DED1] bg-[#FFFCF7] px-4 py-4">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <p className="font-serif text-base font-semibold text-[#123F38]">Appointments Only</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#525B57]">
                    Please book in advance. Same-week slots often available.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                
                
              </div>
            </div>

            <div className="border-t border-[#E8DED1] bg-[#FFFCF7] p-6 sm:p-8 md:p-10 lg:border-t-0 lg:border-l lg:p-12">
              <h3 className="font-serif text-2xl font-semibold text-[#123F38]">Send Me a Message</h3>
              <form className="relative mt-6 space-y-5" onSubmit={handleContactSubmit} noValidate>
                {contactStatus.submitted && (
                  <div
                    className={`rounded-[11px] border p-4 text-sm ${
                      contactStatus.success
                        ? 'border-[#C8D9C8] bg-[#EEF5EF] text-[#064F45]'
                        : 'border-[#E8C9C4] bg-[#FBF3F1] text-[#7A3B32]'
                    }`}
                  >
                    {contactStatus.message}
                  </div>
                )}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={contactForm.website}
                    onChange={handleContactChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#123F38]">
                      Name <span className="text-[#A65B52]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="w-full rounded-[11px] border border-[#E8DED1] bg-[#FFFCF7] px-4 py-3 text-[15px] text-[#123F38] outline-none transition-colors focus:border-[#064F45] focus:ring-2 focus:ring-[#064F45]/15"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#123F38]">
                      Email <span className="text-[#A65B52]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className="w-full rounded-[11px] border border-[#E8DED1] bg-[#FFFCF7] px-4 py-3 text-[15px] text-[#123F38] outline-none transition-colors focus:border-[#064F45] focus:ring-2 focus:ring-[#064F45]/15"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#123F38]">
                      Phone <span className="text-xs font-normal text-[#525B57]">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      className="w-full rounded-[11px] border border-[#E8DED1] bg-[#FFFCF7] px-4 py-3 text-[15px] text-[#123F38] outline-none transition-colors focus:border-[#064F45] focus:ring-2 focus:ring-[#064F45]/15"
                      placeholder="+92 ..."
                    />
                  </div>
                  <div>
                    <label htmlFor="enquiry" className="mb-2 block text-sm font-semibold text-[#123F38]">
                      Subject
                    </label>
                    <select
                      id="enquiry"
                      name="enquiryType"
                      value={contactForm.enquiryType}
                      onChange={handleContactChange}
                      className="w-full rounded-[11px] border border-[#E8DED1] bg-[#FFFCF7] px-4 py-3 text-[15px] text-[#123F38] outline-none transition-colors focus:border-[#064F45] focus:ring-2 focus:ring-[#064F45]/15"
                    >
                      <option value="general">General Enquiry</option>
                      <option value="individual">Individual Therapy</option>
                      <option value="couples">Couples Therapy</option>
                      <option value="assessment">Assessment &amp; Consultation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-[#123F38]">
                    Message <span className="text-[#A65B52]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-[11px] border border-[#E8DED1] bg-[#FFFCF7] px-4 py-3 text-[15px] text-[#123F38] outline-none transition-colors focus:border-[#064F45] focus:ring-2 focus:ring-[#064F45]/15"
                    placeholder="Share anything you feel is important for me to know."
                  />
                </div>
                <div className="flex items-start gap-3 rounded-[11px] border border-[#E8DED1] bg-[#FFFCF7] p-4">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={contactForm.privacy}
                    onChange={handleContactChange}
                    required
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-[#E8DED1] text-[#064F45] accent-[#064F45] focus:ring-[#064F45]"
                  />
                  <label htmlFor="privacy" className="cursor-pointer text-sm leading-relaxed text-[#525B57]">
                    I understand that my information will be treated confidentially and securely in accordance with professional standards.
                  </label>
                </div>
                <div>
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={turnstileSiteKey || ''}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                    onError={() => setTurnstileToken('')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full rounded-[11px] bg-[#064F45] px-8 py-3.5 text-[13px] font-semibold tracking-wide text-white uppercase transition-colors hover:bg-[#05443B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? 'Sending...' : 'Book Now'}
                </button>
                <p className="text-center text-xs leading-relaxed text-[#525B57]">
                  Your privacy is important to me. All information shared will be kept confidential in accordance with ethical guidelines.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <a
        href="https://wa.me/923335515445"
        target="_blank"
        rel="noopener noreferrer"
        className="float-pop-loop fixed bottom-5 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#C8A675]/50 bg-[#FFFCF7] shadow-[0_4px_14px_rgba(18,63,56,0.12)] transition-colors hover:bg-[#EEF5EF] md:bottom-6 md:left-6 md:h-14 md:w-14"
        aria-label="Contact via WhatsApp"
      >
        <FaWhatsapp className="h-5 w-5 text-[#064F45] md:h-6 md:w-6" aria-hidden="true" />
      </a>
    </div>
  );
}
