import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate, m, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Calendar, Check, Maximize2, X } from 'lucide-react';
import type { CardRows, Showcase, ShowcaseImage } from '../../lib/showcases';
import { viewToPath } from '../../lib/router';

// ─────────────────────────────────────────────────────────────────────────────
// The pieces both showcase layouts share: the software/product page
// (ShowcasePage.tsx) and the website page (WebsiteShowcase.tsx). Same look
// everywhere: an Instrument Serif lead-in over an Anton gradient word, Inter
// body copy on near-black, the brand gradient for numbers and buttons.
// ─────────────────────────────────────────────────────────────────────────────

/** Type specimens need their faces; the site only ships its own fonts. */
export function useSpecimenFonts(type: Showcase['type']) {
  useEffect(() => {
    type.forEach(({ google }) => {
      if (!google) return;
      const href = `https://fonts.googleapis.com/css2?family=${google}&display=swap`;
      if (document.head.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [type]);
}

export const WRAP = 'mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12';
export const SECTION = 'relative border-t border-white/[0.06] py-16 sm:py-24 lg:py-28';

/** True at or above `px` wide. Reads the window on first render (the app mounts
 *  with createRoot, so there's no hydration to mismatch); false on the server. */
export function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Fades content up once as it enters the viewport. */
export const Reveal: React.FC<{
  reduced: boolean;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}> = ({ reduced, className, delay = 0, children }) => (
  <m.div
    className={className}
    initial={reduced ? false : { opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </m.div>
);

/** A gradient display word with the brand glow behind it. */
export const Display: React.FC<{ text: string; className: string }> = ({ text, className }) => (
  <span className="sc-glow">
    <span className={`hero-automation-text sc-display ${className}`} data-text={text}>
      {text}
    </span>
  </span>
);

/** The site's heading: serif italic lead-in over one gradient display word. */
export const Heading: React.FC<{
  lead: string;
  word: string;
  size?: 'lg' | 'md';
  as?: 'h2' | 'h3';
  className?: string;
}> = ({ lead, word, size = 'lg', as: Tag = 'h2', className = '' }) => (
  <Tag className={`flex flex-col items-start ${className}`}>
    <span
      className={`font-serif italic leading-[1.1] tracking-normal text-white/95 ${
        size === 'lg' ? 'text-[clamp(1.6rem,3.2vw,2.75rem)]' : 'text-[clamp(1.45rem,2.6vw,2.2rem)]'
      }`}
    >
      {lead}
    </span>
    <Display
      text={word}
      className={`mt-1 ${size === 'lg' ? 'text-[clamp(3.1rem,7.4vw,6.25rem)]' : 'text-[clamp(2.6rem,5.4vw,4.5rem)]'}`}
    />
  </Tag>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p
    className={`gradient-flow-text text-[11px] font-bold uppercase tracking-[0.24em] ${className}`}
  >
    {children}
  </p>
);

/** Paragraph with `**emphasis**`. */
export const Rich: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <p className={className}>
    {text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') ? (
        <strong key={i} className="font-semibold text-white">
          {p.slice(2, -2)}
        </strong>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    )}
  </p>
);

/** Brand-gradient dot used on chips. */
export const Dot = () => (
  <span
    aria-hidden="true"
    className="h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-r from-[#ff2f86] to-[#a855f7]"
  />
);

/**
 * A still. 'tile' images (crops of light UI) sit centred on a light canvas
 * with breathing room; everything else fills its rounded box edge to edge.
 */
export const Still: React.FC<{ image: ShowcaseImage; className?: string; eager?: boolean }> = ({
  image,
  className = '',
  eager,
}) => {
  const img = (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="block h-auto w-full"
    />
  );
  if (image.frame === 'browser') {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-white/[0.1] bg-[#16141c] sm:rounded-[22px] ${className}`}
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
          <span className="flex flex-none gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </span>
          {image.url && (
            <span className="mx-auto min-w-0 truncate rounded-full bg-white/[0.06] px-4 py-1 font-mono text-[11px] text-white/55 sm:text-[12px]">
              {image.url}
            </span>
          )}
          <span className="w-[42px] flex-none" aria-hidden="true" />
        </div>
        {img}
      </div>
    );
  }
  return image.frame === 'tile' ? (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#F7F7F9] p-3 sm:rounded-[22px] sm:p-5 ${className}`}
    >
      {img}
    </div>
  ) : (
    <div className={`overflow-hidden rounded-2xl bg-white sm:rounded-[22px] ${className}`}>
      {img}
    </div>
  );
};

/**
 * A wide still that opens full screen when tapped. On a phone a 2:1 image with
 * callouts is ~350px wide and its text unreadable, so the viewer shows it at
 * 230% of the screen width to pan (pinch-zoom works too); on larger screens it
 * fits the window. A "Tap to zoom" chip shows on phones only.
 */
export const Zoomable: React.FC<{ image: ShowcaseImage; children: React.ReactNode }> = ({ image, children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge: ${image.alt}`}
        className="group relative block w-full cursor-zoom-in rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#d946ef] sm:rounded-[22px]"
      >
        {children}
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#0d0b12]/80 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur sm:hidden">
          <Maximize2 className="h-3.5 w-3.5" />
          Tap to zoom
        </span>
      </button>
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={image.alt}
            className="fixed inset-0 z-[200] flex flex-col bg-[#050505]/95 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div className="flex flex-none items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="min-w-0 truncate text-[13px] text-white/60">
                <span className="sm:hidden">Swipe to explore · </span>
                {image.alt}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center overflow-auto overscroll-contain px-4 pb-6 sm:justify-center sm:px-6">
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                onClick={(e) => e.stopPropagation()}
                className="block h-auto w-[230vw] max-w-none flex-none rounded-xl bg-white sm:w-auto sm:max-h-full sm:max-w-full"
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

/**
 * Cut-out cards (transparent rounded corners) straight on the dark page. Every
 * card in a row is the same size (the images are padded to a common canvas
 * when they're cut), so equal columns line them up exactly. Tablets pair them
 * up. On phones they stack like the homepage work cards: each one pins under
 * the navbar and the next slides up over it while it eases back (CardStack).
 */
export const CardGrid: React.FC<{ rows: CardRows; reduced: boolean; className?: string }> = ({
  rows,
  reduced,
  className = '',
}) => {
  const wide = useMinWidth(640);
  const desktop = useMinWidth(1024);
  if (!wide && !reduced) return <CardStack cards={rows.flat()} className={className} />;
  // Tablets show two per line. Cards that are all one size flow as one set
  // (6 problem cards → 3 even pairs); rows of different sizes stay apart, and
  // an odd card out is centred rather than left beside an empty gap.
  const all = rows.flat();
  const oneSize = all.every((c) => c.width === all[0].width && c.height === all[0].height);
  const lines = !desktop && oneSize ? [all] : rows;
  return (
    <div className={`grid gap-3 sm:gap-4 ${className}`}>
      {lines.map((row, r) => (
        <div
          key={r}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
          style={{ ['--n' as string]: row.length }}
        >
          {row.map((img, i) => (
            <Reveal
              key={img.src}
              reduced={reduced}
              delay={(i % 3) * 0.06}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-(var(--n)-1)*1rem)/var(--n))]"
            >
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
              />
            </Reveal>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Where stacked cards pin on a phone (just under the navbar), and how far
 *  each sits below the one before so the pile shows. */
const STACK_TOP = 84;
const STACK_STEP = 12;

/**
 * The phone layout of CardGrid. Cards stay in normal flow, each `position:
 * sticky` with its own top, so the browser does the pinning. A zero-height
 * marker sits right before each card; a card eases back (scale + a touch
 * darker) as the marker of the card after it travels from the bottom of the
 * screen to its pin line, so the per-frame work is one transform and one
 * filter per card. Needs every ancestor to leave `overflow` visible.
 */
const CardStack: React.FC<{ cards: ShowcaseImage[]; className?: string }> = ({ cards, className = '' }) => {
  const markers = useMemo(() => cards.map(() => React.createRef<HTMLDivElement>()), [cards.length]);
  return (
    <div className={className}>
      {cards.map((img, i) => (
        <React.Fragment key={img.src}>
          <div ref={markers[i]} aria-hidden="true" />
          <StackedCard img={img} index={i} next={markers[i + 1] ?? null} self={markers[i]} />
        </React.Fragment>
      ))}
    </div>
  );
};

const StackedCard: React.FC<{
  img: ShowcaseImage;
  index: number;
  next: React.RefObject<HTMLDivElement | null> | null;
  self: React.RefObject<HTMLDivElement | null>;
}> = ({ img, index, next, self }) => {
  const top = STACK_TOP + index * STACK_STEP;
  const { scrollYProgress } = useScroll({
    target: (next ?? self) as React.RefObject<HTMLElement>,
    offset: ['start end', `start ${top + STACK_STEP}px`],
  });
  // The last card has nothing sliding over it, so it never eases back.
  const scale = useTransform(scrollYProgress, [0, 1], [1, next ? 0.93 : 1]);
  const filter = useTransform(scrollYProgress, [0, 1], ['brightness(1)', next ? 'brightness(0.72)' : 'brightness(1)']);
  return (
    <m.div
      className="sticky mb-6 origin-top will-change-transform last:mb-0"
      style={{ top, scale, filter }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <img
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full drop-shadow-[0_18px_34px_rgba(0,0,0,0.5)]"
      />
    </m.div>
  );
};

/** A violet/pink wash behind a section, the same atmosphere as the rest of the site. */
export const Wash: React.FC<{ at?: string }> = ({ at = '50% 0%' }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
    style={{
      background: `radial-gradient(60% 45% at ${at}, rgba(124,58,237,0.14), rgba(255,47,134,0.05) 45%, transparent 70%)`,
    }}
  />
);

export const Hero: React.FC<{
  s: Showcase;
  reduced: boolean;
  onBack: () => void;
  eyebrow?: string;
  /** The hero visual; defaults to `s.hero`, else the first product's lead image. */
  visual?: ShowcaseImage;
  /** A "Visit the live site" button under the project focus (websites). */
  live?: { href: string; label: string };
  /** Tap the visual to open it full screen (wide images with small text). */
  zoom?: boolean;
}> = ({ s, reduced, onBack, eyebrow = 'Case study', visual = s.hero ?? s.products[0]?.gallery[0], live, zoom }) => {
  return (
    <section className="relative overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
        style={{
          background:
            'radial-gradient(120% 70% at 50% -12%, rgba(164,82,255,0.26) 0%, rgba(255,47,134,0.1) 42%, transparent 72%)',
        }}
      />

      <div className={`relative ${WRAP}`}>
        <a
          href={viewToPath('work')}
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All work
        </a>

        <Reveal reduced={reduced} className="mt-10 sm:mt-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <img
            src={s.logo.src}
            alt={s.client}
            width={s.logo.width}
            height={s.logo.height}
            className="mt-6 h-11 w-auto invert sm:h-14"
          />
          <h1 className="mt-8 flex flex-col items-start">
            <span className="font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] italic leading-[1.1] tracking-normal text-white/95">
              {s.headline.lead}
            </span>
            <Display text={s.headline.word} className="mt-1 text-[clamp(2.75rem,7.4vw,6.5rem)]" />
          </h1>

          <div className="mt-9 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
              Project focus
            </span>
            {s.focus.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white/85"
              >
                <Dot />
                {f}
              </span>
            ))}
          </div>

          {live && (
            <a
              href={live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,47,134,0.28)] transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(255,47,134,0.5)]"
            >
              Visit {live.label}
              <ArrowUpRight className="h-5 w-5" />
            </a>
          )}
        </Reveal>

        {visual && (
          <Reveal reduced={reduced} delay={0.1} className="mt-12 sm:mt-16">
            {zoom ? (
              <Zoomable image={visual}>
                <Still
                  image={visual}
                  eager
                  className="shadow-[0_40px_120px_-40px_rgba(217,70,239,0.45)]"
                />
              </Zoomable>
            ) : (
              <Still
                image={visual}
                eager
                className="shadow-[0_40px_120px_-40px_rgba(217,70,239,0.45)]"
              />
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export const Brief: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <div className={`${WRAP} grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20`}>
      <Reveal reduced={reduced}>
        <Heading lead="The" word="BRIEF." size="md" />
        <Rich
          text={s.brief}
          className="mt-8 max-w-[640px] text-[16px] leading-[1.75] text-white/65 sm:text-[18px]"
        />
      </Reveal>
      <Reveal reduced={reduced} delay={0.1}>
        <dl className="grid gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:rounded-[22px] sm:p-8">
          {s.facts.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
                {f.label}
              </dt>
              <dd className="mt-2 text-[15px] leading-[1.55] text-white/85 sm:text-[16px]">
                {f.value}
              </dd>
            </div>
          ))}
          {s.links?.map((l) => (
            <div key={l.href}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
                Live
              </dt>
              <dd className="mt-2">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-white underline decoration-[#d946ef]/50 underline-offset-4 transition-colors hover:decoration-[#d946ef] sm:text-[16px]"
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </section>
);

export const DesignSystem: React.FC<{ s: Showcase; reduced: boolean; note?: string; zoom?: boolean }> = ({
  s,
  reduced,
  zoom,
  note = 'One visual language across every product, built on the client’s own brand colours and type.',
}) => (
  <section className={SECTION}>
    <div className={WRAP}>
      <Reveal reduced={reduced} className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <Heading lead="The design" word="SYSTEM." />
        <p className="max-w-[520px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">
          {note}
        </p>
      </Reveal>

      {s.systemImage ? (
        <Reveal reduced={reduced} className="mt-12 sm:mt-16">
          {zoom ? (
            <Zoomable image={s.systemImage}>
              <Still image={s.systemImage} />
            </Zoomable>
          ) : (
            <Still image={s.systemImage} />
          )}
        </Reveal>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {s.palette.map((c, i) => {
              const dark = luminance(c.hex) < 0.5;
              return (
                <Reveal key={c.hex} reduced={reduced} delay={i * 0.05}>
                  <div
                    className={`flex aspect-[5/4] flex-col justify-between rounded-2xl p-4 sm:aspect-[4/5] sm:rounded-[22px] sm:p-5 ${
                      dark ? 'text-white' : 'text-[#0d0b12]'
                    } ${luminance(c.hex) < 0.08 ? 'ring-1 ring-white/10' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="text-[14px] font-semibold sm:text-[15px]">{c.name}</span>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] ${
                        dark ? 'bg-white/15' : 'bg-black/[0.07]'
                      }`}
                    >
                      {c.hex.toUpperCase()}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
            {s.type.map((t, i) => (
              <Reveal key={t.family} reduced={reduced} delay={i * 0.08}>
                <div className="flex items-center gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:gap-8 sm:rounded-[22px] sm:p-8">
                  <span
                    className="flex-none text-[60px] leading-none text-white sm:text-[84px]"
                    style={{ fontFamily: `'${t.family}', sans-serif`, fontWeight: 600 }}
                  >
                    Aa
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[22px] text-white sm:text-[26px]"
                      style={{ fontFamily: `'${t.family}', sans-serif`, fontWeight: 600 }}
                    >
                      {t.family}
                    </p>
                    <Eyebrow className="mt-2">{t.role}</Eyebrow>
                    <p className="mt-2 text-[14px] text-white/50">{t.weights}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
);

export const Impact: React.FC<{ s: Showcase; reduced: boolean; lead?: string; word?: string; note?: string }> = ({
  s,
  reduced,
  lead = 'The',
  word = 'IMPACT.',
  note,
}) => (
  <section className={SECTION}>
    <Wash />
    <div className={`relative ${WRAP}`}>
      <Reveal reduced={reduced}>
        <Heading lead={lead} word={word} />
        {note && <p className="mt-6 max-w-[520px] text-[16px] leading-[1.7] text-white/55">{note}</p>}
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
        {s.impact.map((mt, i) => (
          <Reveal key={mt.label} reduced={reduced} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:rounded-[22px] sm:p-7">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
                {mt.label}
              </p>
              <p className="sc-num mt-4 text-[clamp(2.6rem,5.4vw,4.5rem)] leading-none tabular-nums">
                <CountUp value={mt.value} reduced={reduced} />
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-white/60">{mt.caption}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/** "₹4.1L" → { pre: '₹', num: 4.1, post: 'L', … }; null when there's no number. */
function parseFigure(value: string) {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  if (!m) return null;
  const [, pre, digits, post] = m;
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  const grouped = digits.includes(',');
  const fmt = new Intl.NumberFormat(/\d,\d{2},\d{3}/.test(digits) ? 'en-IN' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  return { pre, post, num: Number(digits.replace(/,/g, '')), fmt };
}

/**
 * A figure that counts up from zero, once, when it scrolls into view, with
 * its prefix/suffix and formatting kept ("+42%", "₹4.1L", "2,000+", "4.8").
 * The server renders the final value (crawlers and no-JS readers see it);
 * reduced motion shows it straight away.
 */
export const CountUp: React.FC<{ value: string; reduced: boolean; duration?: number }> = ({
  value,
  reduced,
  duration = 1.8,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const fig = useMemo(() => parseFigure(value), [value]);
  const [text, setText] = useState(() =>
    typeof window === 'undefined' || reduced || !fig ? value : `${fig.pre}${fig.fmt.format(0)}${fig.post}`
  );
  useEffect(() => {
    if (!fig || reduced) {
      setText(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, fig.num, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(`${fig.pre}${fig.fmt.format(v)}${fig.post}`),
    });
    return () => controls.stop();
  }, [inView, fig, reduced, value, duration]);
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
};

export const Words: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16`}>
      <Reveal reduced={reduced}>
        <Heading lead="In their" word="WORDS." />
      </Reveal>
      <Reveal reduced={reduced} delay={0.1}>
        <blockquote className="relative">
          <p className="font-serif text-[clamp(1.4rem,2.4vw,2rem)] italic leading-[1.4] text-white/90">
            {s.testimonial!.quote}
          </p>
          <footer className="mt-8 flex items-center gap-3">
            <span
              className="h-px w-8 bg-gradient-to-r from-[#ff2f86] to-[#a855f7]"
              aria-hidden="true"
            />
            <span>
              <span className="block text-[15px] font-semibold text-white">
                {s.testimonial!.name}
              </span>
              <span className="block text-[14px] text-white/50">{s.testimonial!.role}</span>
            </span>
          </footer>
        </blockquote>
      </Reveal>
    </div>
  </section>
);

export const PROMISES = ['Fixed-price proposals', 'Reply within 24 hours', '30-day post-launch support'];

/** Closing call to action: centred, framed in a gradient-edged panel with the brand glow. */
export const Closing: React.FC<{
  lead: string;
  reduced: boolean;
  onStart: () => void;
  onCall: () => void;
}> = ({ lead, reduced, onStart, onCall }) => (
  <section className="relative py-16 sm:py-24 lg:py-28">
    <div className={WRAP}>
      <Reveal reduced={reduced}>
        {/* 1px gradient edge: the outer div is the border, the inner one the panel. */}
        <div className="rounded-[28px] bg-gradient-to-br from-[#ff2f86]/60 via-white/[0.08] to-[#a855f7]/60 p-px sm:rounded-[36px]">
          <div className="relative overflow-hidden rounded-[27px] bg-[#08070b] px-5 py-12 text-center sm:rounded-[35px] sm:px-12 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(55% 60% at 50% 0%, rgba(217,70,239,0.22), transparent 70%), radial-gradient(40% 50% at 50% 110%, rgba(255,47,134,0.14), transparent 70%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              }}
            />

            <div className="relative flex flex-col items-center">
              <Eyebrow>Your turn</Eyebrow>
              <h2 className="mt-4 flex flex-col items-center sm:mt-5">
                <span className="max-w-[18ch] text-balance font-serif text-[clamp(1.5rem,6.4vw,2.75rem)] italic leading-[1.15] tracking-normal text-white/95 sm:max-w-none">
                  {lead}
                </span>
                {/* Phones: two even lines ("LET’S BUILD" / "YOURS."); wider: one line. */}
                <span className="sc-glow mt-3 sm:mt-2">
                  <span
                    className="hero-automation-text block text-[clamp(2.6rem,12vw,6rem)] leading-[1] sm:text-[clamp(3rem,7.6vw,6rem)] sm:leading-[0.95]"
                    data-text="LET’S BUILD YOURS."
                  >
                    LET’S BUILD<span className="hidden sm:inline"> </span>
                    <br className="sm:hidden" />
                    YOURS.
                  </span>
                </span>
              </h2>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.65] text-white/60 sm:mt-6 sm:max-w-[480px] sm:text-[17px] sm:leading-[1.7]">
                Tell us how your team works today. We’ll show you what it could look like.
              </p>

              <div className="mt-8 flex w-full max-w-[440px] flex-col gap-3 sm:mt-9 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
                <button
                  onClick={onStart}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-8 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,47,134,0.28)] transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(255,47,134,0.5)]"
                >
                  Start a project
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onCall}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/10 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Calendar className="h-4 w-4" />
                  Book a 15-min call
                </button>
              </div>

              <ul className="mt-8 flex flex-col items-start gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
                {PROMISES.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[13.5px] text-white/60 sm:text-[13px] sm:text-white/55">
                    <Check className="h-4 w-4 text-[#d946ef]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/** Relative luminance, 0 (black) to 1 (white). */
export function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
