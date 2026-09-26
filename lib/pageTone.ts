import { useSyncExternalStore } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Page tone — whether the page is currently showing its light canvas.
//
// The site is dark by default. A section that turns the page light (the
// homepage work stack) calls `setPageTone('light')` while it is in charge and
// `setPageTone('dark')` when it lets go, and chrome that sits above every
// section (the navbar) follows along with `usePageTone()`.
// ─────────────────────────────────────────────────────────────────────────────

export type PageTone = 'dark' | 'light';

let tone: PageTone = 'dark';
const listeners = new Set<() => void>();

export function setPageTone(next: PageTone) {
  if (next === tone) return;
  tone = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePageTone(): PageTone {
  return useSyncExternalStore(subscribe, () => tone, () => 'dark');
}
