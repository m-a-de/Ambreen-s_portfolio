'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 600);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      className={`fixed right-4 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#C8A675]/50 bg-[#FFFCF7] shadow-[0_4px_14px_rgba(18,63,56,0.12)] md:right-6 md:bottom-6 md:h-14 md:w-14 ${
        visible ? 'float-pop' : 'pointer-events-none opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5 text-[#064F45] md:h-6 md:w-6" strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
