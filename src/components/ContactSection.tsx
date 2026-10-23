'use client';

import { useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { trackEvent } from '@/lib/analytics';

export default function ContactSection() {
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

      trackEvent('generate_lead', { lead_source: 'contact_form' });

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

  return (
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
              Reach out to schedule a consultation or ask about my services.I&apos;m here to support your
              journey toward better mental health.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">Phone</p>
                  <a
                    href="tel:+923086522764"
                    className="mt-1 block text-[15px] text-[#123F38] transition-colors hover:text-[#064F45]"
                    onClick={() => trackEvent('phone_click', { source: 'contact_section' })}
                  >
                    +92 308 6522764
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="mt-0.5 h-5 w-5 shrink-0 text-[#C8A675]" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[#064F45] uppercase">WhatsApp</p>
                  <a
                    href="https://wa.me/923086522764"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[15px] text-[#123F38] transition-colors hover:text-[#064F45]"
                    onClick={() => trackEvent('whatsapp_click', { source: 'contact_section' })}
                  >
                    +92 308 6522764
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
  );
}
