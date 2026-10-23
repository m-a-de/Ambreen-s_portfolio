'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { trackEvent } from '@/lib/analytics';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923086522764"
      target="_blank"
      rel="noopener noreferrer"
      className="float-pop-loop fixed bottom-5 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#C8A675]/50 bg-[#FFFCF7] shadow-[0_4px_14px_rgba(18,63,56,0.12)] transition-colors hover:bg-[#EEF5EF] md:bottom-6 md:left-6 md:h-14 md:w-14"
      aria-label="Contact via WhatsApp"
      onClick={() => trackEvent('whatsapp_click', { source: 'floating_button' })}
    >
      <FaWhatsapp className="h-5 w-5 text-[#064F45] md:h-6 md:w-6" aria-hidden="true" />
    </a>
  );
}
