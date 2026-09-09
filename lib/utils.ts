import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Runs a state update that grows the page, leaving the viewport exactly where
 * it was.
 *
 * Two things fight you here. Chrome's scroll anchoring nudges the page when a
 * large subtree changes, and `html` carries `scroll-behavior: smooth`, so the
 * correcting scroll would *animate* — which reads as the new content sliding up
 * from the bottom. Smooth is disabled for the correction, then restored, so the
 * grid simply appears at its final size.
 */
export function withPinnedScroll(update: () => void) {
  const y = window.scrollY;
  update();

  requestAnimationFrame(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    html.style.scrollBehavior = previous;
  });
}
