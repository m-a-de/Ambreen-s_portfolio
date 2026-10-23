'use client';

import { sendGAEvent } from '@next/third-parties/google';

/** Sends a GA4 event. Never pass personal or health-related data. */
export function trackEvent(eventName: string, params?: Record<string, string>) {
  try {
    sendGAEvent('event', eventName, params ?? {});
  } catch {
    // Analytics failures must not interrupt the user action.
  }
}
