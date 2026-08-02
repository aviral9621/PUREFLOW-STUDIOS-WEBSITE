import { Home } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// NotFoundPage — the 404 view. Rendered as a standalone page (no navbar, no
// footer, no contact popup) so it carries a single message and a single action.
//
// Motion is pure CSS (see the `.nf-*` block in index.css) rather than
// framer-motion: the animations here are a fade-in, a slow float and a breathing
// glow, none of which need a JS animation runtime. Every one of them is disabled
// under `prefers-reduced-motion`.
// ─────────────────────────────────────────────────────────────────────────────

interface NotFoundPageProps {
  onGoHome: () => void;
}

export function NotFoundPage({ onGoHome }: NotFoundPageProps) {
  return (
    <main className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#060608] px-5 py-16 text-center selection:bg-[#D946EF] selection:text-white">
      {/* Soft radial purple glow behind the content, breathing slowly. */}
      <div className="nf-glow pointer-events-none absolute inset-0 -z-0" aria-hidden="true" />

      {/* 600px rather than 520: the 48px heading needs 573px to stay on one line,
          and a lone "page." on a second row breaks the hierarchy. The description
          is still held to 42ch below, so the text column itself stays compact. */}
      <div className="nf-enter relative z-10 flex w-full max-w-[600px] flex-col items-center">
        {/* ── Broken-document icon ── */}
        <div className="nf-float mb-7" aria-hidden="true">
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nf-icon opacity-95"
          >
            <path
              d="M31.5 5.5H14a4.5 4.5 0 0 0-4.5 4.5v34A4.5 4.5 0 0 0 14 48.5h13"
              stroke="url(#nf-stroke)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M31.5 5.5 44.5 18.5V28"
              stroke="url(#nf-stroke)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M31 5.9v11.6a1.5 1.5 0 0 0 1.5 1.5h11.6"
              stroke="url(#nf-stroke)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* the "missing" cross */}
            <path
              d="m35.5 35.5 11 11m0-11-11 11"
              stroke="url(#nf-stroke)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="nf-stroke" x1="9.5" y1="5.5" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C85EFF" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── 404 ── */}
        <p className="nf-code mb-5">
          <span className="sr-only">Error 404</span>
          <span aria-hidden="true">
            4<span className="nf-zero">0</span>4
          </span>
        </p>

        {/* ── Heading ── */}
        <h1 className="nf-heading mb-3.5 font-sans font-bold text-white">
          You're on the wrong page.
        </h1>

        {/* ── Description ── */}
        <p className="nf-desc mb-10 font-sans font-normal text-white/65">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* ── Single call to action ──
            An anchor rather than a bare <button>: this is navigation, so it stays
            keyboard- and screen-reader-correct, opens in a new tab on
            middle-click, and still works if the JS handler never runs. */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="nf-cta inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl px-[30px] font-sans text-[16px] font-semibold text-white sm:w-auto"
        >
          <Home className="h-[19px] w-[19px] flex-shrink-0" strokeWidth={2.1} aria-hidden="true" />
          Go to Homepage
        </a>
      </div>
    </main>
  );
}
