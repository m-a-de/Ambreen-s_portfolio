'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-3">
              <Image 
                src="/Asset 3@3x.png" 
                alt="Ambreen Rashid Khan Logo" 
                width={260}
                height={80}
                className="h-20 w-auto object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 shadow-sm"
                aria-label="Toggle navigation"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                <a href="#about" className="hover:text-teal-600 transition-colors">About</a>
                <a href="#approach" className="hover:text-teal-600 transition-colors">Approach</a>
                <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
                <a href="#faq" className="hover:text-teal-600 transition-colors">FAQ</a>
                <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
                <a 
                  href="#contact" 
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors font-semibold"
                >
                  CONTACT ME
                </a>
              </nav>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
              <a href="#about" className="hover:text-teal-600 transition-colors" onClick={() => setMobileOpen(false)}>About</a>
              <a href="#approach" className="hover:text-teal-600 transition-colors" onClick={() => setMobileOpen(false)}>Approach</a>
              <a href="#services" className="hover:text-teal-600 transition-colors" onClick={() => setMobileOpen(false)}>Services</a>
              <a href="#faq" className="hover:text-teal-600 transition-colors" onClick={() => setMobileOpen(false)}>FAQ</a>
              <a href="#contact" className="hover:text-teal-600 transition-colors" onClick={() => setMobileOpen(false)}>Contact</a>
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                CONTACT ME
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop')`
          }}
        >
          {/* Teal Overlay - Matching site color scheme */}
          <div className="absolute inset-0 bg-teal-900/60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-white mb-6 leading-tight drop-shadow-lg">
            Ambreen Rashid Khan
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Empowering Change for a Happy, Authentic Life
          </p>
          <a 
            href="#contact"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold text-lg uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contact Now
          </a>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-white via-teal-50/30 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side - Images */}
            <div className="relative">
              {/* Decorative Circle Behind */}
              <div className="absolute inset-0 -z-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-100 to-teal-200 opacity-30 blur-2xl"></div>
              </div>
              
              {/* Large Circular Image */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-teal-100 shadow-2xl ring-4 ring-teal-50">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop" 
                    alt="Ambreen Rashid Khan - Clinical Psychologist"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Smaller Overlapping Image - Therapy Session */}
                <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl z-10 ring-2 ring-teal-100">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop" 
                    alt="Therapy Session"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Experience Badge - Hexagon Style */}
                <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex flex-col items-center justify-center shadow-2xl z-10 border-4 border-white transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">15+</span>
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">Years</span>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              {/* Section Heading with Unique Style */}
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">WHO WE ARE</h3>
                <div className="h-1 w-8 bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"></div>
              </div>

              {/* Main Title with Gradient Accent */}
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-6 leading-tight">
                About Our Professional <span className="text-teal-600">Psychology Therapy</span>
              </h2>

              {/* Description with Quote Style */}
              <div className="relative pl-6 border-l-4 border-teal-400">
                <p className="text-gray-700 leading-relaxed text-lg">
                  A variety of counseling and psychotherapy services to help you find your inner peace. Book an appointment today and start your journey towards a happier and more fulfilling life.
                </p>
              </div>

              {/* Features Grid - Card Style */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block mb-1">Qualified Therapies</span>
                        <p className="text-sm text-gray-600">15+ Years of Experience</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block mb-1">Availability</span>
                        <p className="text-sm text-gray-600">Online & In-Person sessions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block mb-1">Individual Counseling</span>
                        <p className="text-sm text-gray-600">Mental help for families</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block mb-1">Referring Therapists</span>
                        <p className="text-sm text-gray-600">Experts you can trust</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature with Quote */}
              <div className="pt-6 border-t-2 border-teal-100">
                <div className="bg-gradient-to-r from-teal-50 to-white rounded-lg p-6 relative">
                  <svg className="absolute top-4 left-4 w-8 h-8 text-teal-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <p className="text-gray-700 italic mb-4 pl-8 text-lg">
                    &quot;Every individual has unique needs and circumstances. Being intentional about your path means accounting for your unique makeup, mending your emotional life, and striving for your better life.&quot;
                  </p>
                  <div className="flex items-center gap-4 pl-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-teal-300 to-transparent"></div>
                    <div>
                      <p className="text-xl font-serif text-gray-900 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                        Ambreen Rashid Khan
                      </p>
                      <p className="text-sm text-teal-600 font-medium">Clinical Psychologist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section id="approach" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">MY APPROACH</h3>
              <div className="h-1 w-8 bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-6">
              How I Work
            </h2>
            <p className="text-center text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              My clinical approach hinges on a trauma informed model with motivational interviewing techniques. This allows me to utilize a tailored approach for each person with whom I work.
            </p>
          </div>

          {/* Approach Features - Image/Text Layout */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Side - Image */}
            <div className="relative order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop" 
                  alt="Therapeutic Approach"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent"></div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -z-10"></div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6 order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-6">
                Evidence-Based <span className="text-teal-600">Therapeutic Methods</span>
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                I integrate multiple evidence-based approaches to create a personalized treatment plan that addresses your unique needs and goals.
              </p>
              
              {/* Features List with Checkmarks */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Trauma-Informed Care</h4>
                    <p className="text-gray-600">I create a safe environment where we can work through past experiences at your own pace, recognizing the impact of trauma on your life.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Motivational Interviewing</h4>
                    <p className="text-gray-600">I help you discover your own reasons for change and develop the confidence to make those changes, empowering you in your journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Tailored Treatment Plans</h4>
                    <p className="text-gray-600">Your therapy will be customized to your specific needs, background, and goals, ensuring the most effective approach for you.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Compassionate Communication</h4>
                    <p className="text-gray-600">I use warmth and understanding to create a comfortable environment while addressing difficult topics with sensitivity and care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process of Counseling - Enhanced Design */}
          <div className="bg-gradient-to-br from-white via-teal-50/30 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-teal-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">THE JOURNEY</h3>
                <div className="h-1 w-8 bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"></div>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
                The Process of Counseling
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                A clear, structured approach to help you understand what to expect and how we&apos;ll work together toward your goals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-400 rounded-full border-4 border-white"></div>
                </div>
                <h4 className="text-xl font-serif font-semibold text-gray-900 mb-3">Initial Session</h4>
                <p className="text-gray-600 leading-relaxed">
                  Meet with me to get to know my style and see if we&apos;re a good fit. This step is all about connection, comfort, and understanding your needs.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-400 rounded-full border-4 border-white"></div>
                </div>
                <h4 className="text-xl font-serif font-semibold text-gray-900 mb-3">Frequency Planning</h4>
                <p className="text-gray-600 leading-relaxed">
                  Together we&apos;ll assess the appropriate frequency of meetings based on your needs, concerns, and therapeutic goals.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-400 rounded-full border-4 border-white"></div>
                </div>
                <h4 className="text-xl font-serif font-semibold text-gray-900 mb-3">Gradual Independence</h4>
                <p className="text-gray-600 leading-relaxed">
                  We&apos;ll start with more frequent sessions and decrease gradually until you feel confident to continue on your own.
                </p>
              </div>
            </div>
            
            {/* Quote Section */}
            <div className="bg-white rounded-2xl p-8 border-l-4 border-teal-500 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100/30 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="relative z-10">
                <svg className="w-12 h-12 text-teal-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <blockquote className="text-xl md:text-2xl italic text-gray-700 mb-6 leading-relaxed">
                  &quot;My aim is to put myself out of business. I want you not to need me anymore! Have an idea of how you would like to approach your treatment when you meet with me. How often would you like to meet? What are your major concerns?&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-teal-300 to-transparent"></div>
                  <p className="text-gray-900 font-semibold text-lg">— Ambreen Rashid Khan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-100/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">OUR SPECIALTIES</h3>
              <div className="h-1 w-8 bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-4">
              Areas of Expertise
            </h2>
            <p className="text-center text-gray-700 max-w-3xl mx-auto text-lg">
              I work with adults on a wide array of concerns, providing personalized therapy tailored to your unique needs and circumstances.
            </p>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {/* Specialty Card 1 - Relationship Issues */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop" 
                  alt="Relationship Issues"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Relationship Issues</h3>
              </div>
            </div>

            {/* Specialty Card 2 - Trauma */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=800&auto=format&fit=crop" 
                  alt="Trauma"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trauma</h3>
              </div>
            </div>

            {/* Specialty Card 3 - Depression & Anxiety */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" 
                  alt="Anxiety and Depression"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Anxiety & Depression</h3>
              </div>
            </div>

            {/* Specialty Card 4 - Grief & Loss */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop" 
                  alt="Coping with Loss"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coping with Loss</h3>
              </div>
            </div>

            {/* Specialty Card 5 - Substance Abuse */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=800&auto=format&fit=crop" 
                  alt="Substance Abuse"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Substance Abuse</h3>
              </div>
            </div>

            {/* Specialty Card 6 - PTSD */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop" 
                  alt="PTSD"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PTSD</h3>
              </div>
            </div>

            {/* Specialty Card 7 - Women's Issues */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=800&auto=format&fit=crop" 
                  alt="Women's Issues"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Women&apos;s Issues</h3>
              </div>
            </div>

            {/* Specialty Card 8 - Self Improvement */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop" 
                  alt="Self Improvement"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Self Improvement</h3>
              </div>
            </div>
          </div>

          {/* Service Types Section */}
          <div className="mt-20 pt-16 border-t-2 border-teal-100">
            <h3 className="text-3xl font-serif font-semibold text-center text-gray-900 mb-4">
              Service Formats
            </h3>
            <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
              Finding the right service modality for your needs is important. Here is a brief description of the different service formats I can provide.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-8 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Individual Therapy</h3>
                <p className="text-gray-600 mb-6">
                  You are the primary client. Your personal preferences, needs, concerns, goals, hopes, and dreams are our focus.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    50-minute sessions
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    In-person or online
                  </li>
                </ul>
                <a 
                  href="#contact"
                  className="inline-block w-full text-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Contact Me
                </a>
              </div>

              <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-8 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Couples Therapy</h3>
                <p className="text-gray-600 mb-6">
                  The relationship is the primary client. How each individual&apos;s personal preferences, needs, concerns, goals, hopes, and dreams affect the relationship is our focus.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    80-minute sessions
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Safe, supportive environment
                  </li>
                </ul>
                <a 
                  href="#contact"
                  className="inline-block w-full text-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Contact Me
                </a>
              </div>

              <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-8 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Group Therapy</h3>
                <p className="text-gray-600 mb-6">
                  The group supports each other in seeking overall life satisfaction. Guidelines create safety as each individual will need to be vulnerable with their peers.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Shared learning experience
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Supportive community
                  </li>
                </ul>
                <a 
                  href="#contact"
                  className="inline-block w-full text-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          {/* Clinical Supervision */}
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
              Clinical Supervision &amp; Pricing
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Clinical Supervision is available at 5k per session and every session would be between 35 to 40 minutes for supplementary supervision.
              </p>
              <p>
                Because I work for myself and for your well being, I can adjust session rates based on need, as appropriate.
              </p>
              <p>
                The process begins with an initial session to get to know each other. Together, we&apos;ll assess the appropriate frequency of meetings for your specific needs and concerns.
              </p>
            </div>
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
