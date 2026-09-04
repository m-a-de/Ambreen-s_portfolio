'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
  Brain,
  BrainCog,
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
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-md border border-[#064F45] bg-[#FFFCF7] px-5 py-2.5 text-[13px] font-semibold text-[#064F45] transition-colors hover:bg-[#EEF5EF]"
              >
                Learn More
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

          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C8A675] uppercase">
              About Me
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#123F38] md:text-4xl">
              About Our Professional Psychology Therapy
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525B57] lg:text-base">
              A variety of counseling and psychotherapy services to help you find your inner peace. Book an appointment today and start your journey towards a happier and more fulfilling life.
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
                Because I work for myself and for your well being, I can adjust session rates based on need, as appropriate.
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
              <p className="mt-3 text-sm leading-relaxed text-[#525B57]">
                Because I work for myself and for your well being, I can adjust session rates based on need, as appropriate.
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-white via-teal-50/20 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">COMMON QUESTIONS</h3>
              <div className="h-1 w-8 bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-700 max-w-3xl mx-auto text-lg">
              Find answers to common questions about therapy, my approach, and what to expect during your journey.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-teal-50/30 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                      <span className="text-teal-600 font-bold group-hover:text-white transition-colors duration-300">{index + 1}</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-lg pt-2">{faq.question}</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-teal-500 transition-all duration-300 flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 py-5 bg-gradient-to-br from-teal-50/50 to-white border-t border-teal-100">
                    <div className="pl-14">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                Still Have Questions?
              </h3>
              <p className="text-teal-50 mb-8 max-w-2xl mx-auto text-lg">
                Have a question that&apos;s not addressed here? I&apos;m happy to help. Reach out and let&apos;s start a conversation about how I can support you.
              </p>
              <a 
                href="#contact"
                className="inline-block bg-white text-teal-600 hover:bg-teal-50 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">CONTACT US</h3>
              <div className="h-1 w-8 bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-6">
              Book An Appointment Now
            </h2>
            <p className="text-center text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              I&apos;m here to listen and support you on your journey to better mental health. Feel free to reach out with any questions you have about my services or to schedule a consultation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-8">Get In Touch</h3>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Reach out to schedule a consultation or ask any questions about my services. I&apos;m here to help you take the first step toward better mental health.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-1">Phone</p>
                    <a href="tel:+923335515445" className="text-gray-900 hover:text-teal-600 transition-colors font-medium">+92 333 5515445</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-1">Location</p>
                    <p className="text-gray-900 font-medium">Shadman 2, Lahore, Pakistan</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-1">Working Hours</p>
                    <p className="text-gray-900 font-medium">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: By appointment only
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      All timings are applicable for appointments only.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 mb-2">Appointments Only</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Please book in advance. Same-week slots often available. Use the form to schedule your consultation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-2xl p-8 shadow-lg border border-teal-100">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-6">Send Me a Message</h3>
              <form className="space-y-5" onSubmit={handleContactSubmit} noValidate>
                {contactStatus.submitted && (
                  <div
                    className={`p-4 rounded-xl ${
                      contactStatus.success
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
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
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white hover:border-teal-300"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white hover:border-teal-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone <span className="text-gray-500 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white hover:border-teal-300"
                    placeholder="+92 ..."
                  />
                </div>
                <div>
                  <label htmlFor="enquiry" className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject
                  </label>
                  <select
                    id="enquiry"
                    name="enquiryType"
                    value={contactForm.enquiryType}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white hover:border-teal-300"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="individual">Individual Therapy</option>
                    <option value="couples">Couples Therapy</option>
                    <option value="assessment">Assessment &amp; Consultation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none bg-white hover:border-teal-300"
                    placeholder="Share anything you feel is important for me to know."
                  />
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={contactForm.privacy}
                    onChange={handleContactChange}
                    required
                    className="mt-1 w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I understand that my information will be treated confidentially and securely in accordance with professional standards.
                  </label>
                </div>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey || ''}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken('')}
                  onError={() => setTurnstileToken('')}
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSending ? 'Sending...' : 'Book Now'}
                </button>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Your privacy is important to me. All information shared will be kept confidential in accordance with ethical guidelines.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src="/Asset 3@3x.png" 
                  alt="Ambreen Rashid Khan Logo" 
                  width={240}
                  height={75}
                  className="h-20 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-teal-100 text-sm">
                Clinical Psychologist
              </p>
              <p className="text-teal-200 text-sm mt-2">
                Dedicated to providing compassionate, evidence-based therapy that honors your unique experiences and challenges.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-teal-100">
                <li><a href="#about" className="hover:text-white transition-colors">→ About</a></li>
                <li><a href="#approach" className="hover:text-white transition-colors">→ Approach</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">→ Services</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">→ FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">→ Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-teal-100">
                <li>+92 333 5515445</li>
                <li>Shadman 2, Lahore, Pakistan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Working Hours</h4>
              <p className="text-sm text-teal-100 mb-2">
                Monday - Friday<br />
                9:00 AM - 6:00 PM
              </p>
              <p className="text-xs text-teal-200 mb-4">
                All timings are applicable for appointments only.
              </p>
              <a 
                href="#contact"
                className="inline-block bg-white text-teal-800 hover:bg-teal-50 px-4 py-2 rounded-md font-semibold text-sm transition-colors"
              >
                Contact Me
              </a>
            </div>
          </div>
          <div className="border-t border-teal-700 pt-8 text-center text-sm text-teal-200">
            © 2024 Ambreen Rashid Khan. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923335515445"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
