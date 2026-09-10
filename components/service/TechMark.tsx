import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TechMark — the small brand glyph inside a "Built with" chip.
//
// Drawn inline rather than fetched: eight tiny paths cost less than one network
// request, they stay crisp at any density, and nothing breaks if a CDN is
// blocked. Each mark keeps just enough of its brand colour to be recognisable
// without turning the row into a logo wall.
//
// Anything without a mark falls back to its initials, so adding a technology to
// `lib/services.ts` never leaves a hole in the row.
// ─────────────────────────────────────────────────────────────────────────────

type MarkProps = { className?: string };

const marks: Record<string, React.FC<MarkProps>> = {
  'next.js': ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <path d="M9 16.5V7.5h1.4l5.1 6.7V7.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  react: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#61DAFB" strokeWidth="1.1">
      <circle cx="12" cy="12" r="2" fill="#61DAFB" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  'react native': ({ className }) => marks.react({ className }),
  typescript: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="3" fill="#3178C6" />
      <path
        d="M13.1 18.6v-2.1c.4.3 1 .5 1.7.5.8 0 1.2-.3 1.2-.8 0-.4-.3-.7-1.2-1.1-1.4-.6-2-1.3-2-2.5 0-1.5 1.2-2.4 2.9-2.4.8 0 1.4.1 1.9.3v2c-.5-.3-1-.5-1.6-.5-.7 0-1.1.3-1.1.7 0 .4.3.6 1.2 1 1.4.6 2.1 1.3 2.1 2.5 0 1.6-1.2 2.5-3 2.5-.9 0-1.6-.1-2.1-.4ZM11.6 12.1H9.5v6.6H7.4v-6.6H5.3v-1.8h6.3v1.8Z"
        fill="#fff"
      />
    </svg>
  ),
  'tailwind css': ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M12 7.2c-2.4 0-3.9 1.2-4.5 3.6.9-1.2 1.95-1.65 3.15-1.35.68.17 1.17.67 1.71 1.22.88.9 1.9 1.93 4.14 1.93 2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.68-.17-1.17-.67-1.71-1.22C15.26 8.23 14.24 7.2 12 7.2Zm-4.5 5.4c-2.4 0-3.9 1.2-4.5 3.6.9-1.2 1.95-1.65 3.15-1.35.68.17 1.17.67 1.71 1.22.88.9 1.9 1.93 4.14 1.93 2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.68-.17-1.17-.67-1.71-1.22-.88-.9-1.9-1.93-4.14-1.93Z"
        fill="#38BDF8"
      />
    </svg>
  ),
  supabase: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M13.2 1.5 3.4 13.3c-.5.6-.1 1.5.7 1.5h7v7.7c0 .9 1.1 1.3 1.7.6l9.8-11.8c.5-.6.1-1.5-.7-1.5h-7V2.1c0-.9-1.1-1.3-1.7-.6Z" fill="#3ECF8E" />
    </svg>
  ),
  vercel: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M12 3.5 22.5 21h-21L12 3.5Z" fill="#fff" />
    </svg>
  ),
  'node.js': ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M12 1.8 21.5 7v10L12 22.2 2.5 17V7L12 1.8Z" fill="#5FA04E" />
      <path d="M12 7.6v8.8M9 10.4c0-1 .9-1.6 3-1.6M15 13.6c0 1-.9 1.6-3 1.6" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  postgresql: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#336791" />
      <path d="M8.3 17V7.4h3.1c1.8 0 2.8 1 2.8 2.6 0 1.7-1.1 2.7-2.9 2.7h-1.4V17H8.3Zm1.6-5.6h1.3c1 0 1.5-.5 1.5-1.4 0-.8-.5-1.3-1.5-1.3H9.9v2.7Z" fill="#fff" />
    </svg>
  ),
  pwa: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#A855F7" strokeWidth="1.6">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" strokeLinecap="round" />
    </svg>
  ),
};

/** Initials, for anything without a drawn mark. */
const Fallback: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
  <span className={`cev-mark-fallback ${className ?? ''}`}>
    {name
      .replace(/[^A-Za-z ]/g, '')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()}
  </span>
);

export const TechMark: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const Mark = marks[name.toLowerCase()];
  return Mark ? <Mark className={className} /> : <Fallback name={name} className={className} />;
};
