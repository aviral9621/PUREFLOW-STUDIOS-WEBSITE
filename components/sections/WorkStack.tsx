import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  m,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useAllProjects } from '../../hooks/useProjects';
import { toPortfolioItems, type PortfolioItem, type PreviewSource } from '../../lib/portfolio';
import { viewToPath } from '../../lib/router';
import { setPageTone } from '../../lib/pageTone';
import { PreviewContent } from './PortfolioPreview';

// ─────────────────────────────────────────────────────────────────────────────
// WorkStack — the homepage work section, directly under the hero.
//
// Three scroll-driven beats:
//   1. The page eases from the hero's black into a light canvas as the section
//      arrives (and back to black at the closing prompt, to meet Services).
//   2. Project cards pin under the navbar and stack: each new card slides up
//      over the last, while the ones beneath shrink back.
//   3. Once the stack runs out, a closing "build yours next" prompt.
//
// Content comes from `lib/caseStudies.ts` through the same adapter as every
// other project card on the site; FEATURED picks the projects, their order,
// the colour of each card's tint, and (for live sites) the still screenshots
// in /public/work. Stills rather than live embeds on purpose: several running
// websites inside a scroll-driven stack is what makes scrolling stutter.
//
// Scroll performance:
//   • Cards stay in normal flow, each `position: sticky` with its own `top`,
//     so the browser does the pinning — nothing is laid out per frame.
//   • The only per-frame work is one transform (scale) per card, computed
//     from scrollY against geometry measured once per resize.
//   • Every length that affects layout is px or svh, never vh, so the mobile
//     URL bar showing/hiding can't reflow the stack mid-scroll.
//
// NOTE: sticky positioning needs every ancestor to leave `overflow` visible —
// don't add `overflow-hidden` to this section or its wrappers.
// ─────────────────────────────────────────────────────────────────────────────

interface Featured {
  slug: string;
  glow: string;
  /** Stills of a live site: a desktop capture (16:10) and a phone capture (9:19.5). */
  shots?: { desktop: string; mobile: string };
  /**
   * A finished device mockup (laptop + phone, one image) that replaces the
   * framed screenshots. 2:1 (e.g. 2400×1200) on a pure white background, with
   * the devices centred and resting on the bottom edge — the card crops
   * nothing, it only scales the image to fit.
   */
  mockup?: string;
  /** The client's own logo, shown in place of the name. Size is the file's own,
   *  so the browser reserves its box before it loads. */
  logo?: { src: string; width: number; height: number };
}

const FEATURED: Featured[] = [
  {
    slug: 'quick-hotels',
    glow: '255,47,134',
    shots: {
      desktop: '/work/quick-hotels-desktop.webp',
      mobile: '/work/quick-hotels-mobile.webp',
    },
    mockup: '/work/quick-hotels-mockup.webp',
    logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
  },
  {
    slug: 'unskills-computer-education-crm',
    glow: '168,85,247',
    mockup: '/work/unskills-crm-showcase.webp',
    logo: { src: '/work/unskills-logo.webp', width: 356, height: 160 },
  },
  {
    slug: 'herbal-vantage',
    glow: '34,197,94',
    shots: {
      desktop: '/work/herbal-vantage-desktop.webp',
      mobile: '/work/herbal-vantage-mobile.webp',
    },
  },
  { slug: 'ecommerce-retail-platform', glow: '217,70,239' },
  {
    slug: 'spectrum-tour-travels',
    glow: '249,115,22',
    shots: {
      desktop: '/work/spectrum-tour-travels-desktop.webp',
      mobile: '/work/spectrum-tour-travels-mobile.webp',
    },
  },
];

const LIGHT = '#f4f2f7';
const INK = '#0d0b12';
const TONE_MS = 700;

/** Where the first card pins (just under the navbar), per layout. */
const PIN = { mobile: 84, desktop: 100 };
/** How far each pinned card sits below the one before it, so the stack shows. */
const STEP = { mobile: 10, desktop: 16 };
/** Space between cards in flow — how much extra scroll each card takes to arrive. */
const GAP = { mobile: 28, desktop: 120 };
/** How much a card shrinks for each card stacked over it. */
const SHRINK = 0.035;

type StackItem = PortfolioItem & {
  glow: string;
  phone?: string;
  mockup?: string;
  logo?: Featured['logo'];
};

function useMinWidth(px: number) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [px]);
  return matches;
}

/** Document-space geometry of the stack, re-measured whenever it resizes. */
interface StackLayout {
  /** scrollY at which card i pins. */
  pinAt: number[];
  /** scrollY at which card i's top reaches the pinned bottom edge of card i - 1. */
  coverFrom: number[];
}

interface Props {
  onOpenProject: (slug: string) => void;
  onStartProject: () => void;
  onViewAll?: () => void;
}

export function WorkStack({ onOpenProject, onStartProject, onViewAll }: Props) {
  const { projects } = useAllProjects();
  const reduceMotion = !!useReducedMotion();
  const isDesktop = useMinWidth(1024);
  const pin = isDesktop ? PIN.desktop : PIN.mobile;
  const step = isDesktop ? STEP.desktop : STEP.mobile;
  const gap = isDesktop ? GAP.desktop : GAP.mobile;

  const items = useMemo<StackItem[]>(() => {
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return FEATURED.flatMap(({ slug, glow, shots, mockup, logo }) => {
      const project = bySlug.get(slug);
      if (!project) return [];
      const [item] = toPortfolioItems([project]);
      const preview: PreviewSource = shots
        ? { type: 'image', src: shots.desktop, alt: `${item.name} website` }
        : item.preview;
      return [{ ...item, preview, glow, phone: shots?.mobile, mockup, logo }];
    });
  }, [projects]);

  // ── Dark → light → dark ──
  // Light while the section's top is above 30% of the viewport and its bottom
  // is still below 75%. The switch itself is a timed fade on a full-screen
  // layer, not a scroll-scrubbed colour, so the page never sits half-way in a
  // muddy grey. It waits until the hero has mostly scrolled away: the layer
  // covers whatever of the hero is still on screen, and flipping earlier
  // leaves a tall empty band above the heading. The navbar follows the same
  // switch through `setPageTone`.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const { scrollYProgress: exit } = useScroll({
    target: sectionRef,
    offset: ['end end', 'end start'],
  });
  const [isLight, setIsLight] = useState(false);
  const syncTone = () => setIsLight(enter.get() > 0.7 && exit.get() < 0.25);
  useMotionValueEvent(enter, 'change', syncTone);
  useMotionValueEvent(exit, 'change', syncTone);
  useEffect(() => setPageTone(isLight ? 'light' : 'dark'), [isLight]);
  // Leaving the homepage mid-section must not strand the navbar in light mode.
  useEffect(() => () => setPageTone('dark'), []);

  const fade = `color ${TONE_MS}ms ease, border-color ${TONE_MS}ms ease, opacity 200ms ease`;
  const ink = { color: isLight ? INK : '#ffffff', transition: fade };
  const inkSoft = {
    color: isLight ? 'rgba(13,11,18,0.62)' : 'rgba(255,255,255,0.62)',
    transition: fade,
  };

  // ── Card stack geometry ──
  // Cards are in flow, so card i's layout top is the stack's top plus the
  // heights and gaps of the cards before it — sticky never changes that.
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useRef<StackLayout>({ pinAt: [], coverFrom: [] });
  // Bumped after each measure so the cards' scales re-derive without waiting
  // for the next scroll event.
  const layoutVersion = useMotionValue(0);
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const stack = stackRef.current;
    if (!stack) return;
    let top = stack.getBoundingClientRect().top + window.scrollY;
    let prevHeight = 0;
    const pinAt: number[] = [];
    const coverFrom: number[] = [];
    for (let i = 0; i < items.length; i++) {
      const h = cardRefs.current[i]?.offsetHeight ?? 0;
      pinAt.push(top - (pin + i * step));
      coverFrom.push(i === 0 ? top : top - (pin + (i - 1) * step + prevHeight));
      prevHeight = h;
      top += h + gap;
    }
    layout.current = { pinAt, coverFrom };
    layoutVersion.set(layoutVersion.get() + 1);
  }, [items.length, pin, step, gap, layoutVersion]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stackRef.current) ro.observe(stackRef.current);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const workHref = viewToPath('work');
  const handleViewAll = (e: React.MouseEvent) => {
    if (!onViewAll || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onViewAll();
  };

  if (items.length === 0) return null;

  return (
    // No z-index or transform on the section: the tone layer is `fixed` and has
    // to stack against the hero and navbar in the root context, with the
    // section's own content (z-[16]) above it.
    <section ref={sectionRef} id="work" aria-labelledby="work-stack-title" className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[15]"
        style={{
          backgroundColor: LIGHT,
          opacity: isLight ? 1 : 0,
          transition: `opacity ${TONE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />

      <div className="relative z-[16]">
        {/* ── Intro ── */}
        <header className="mx-auto flex w-full max-w-[1240px] flex-col items-center px-5 pb-10 pt-10 text-center sm:px-8 md:pb-16 md:pt-16 lg:px-12">
          <p
            style={inkSoft}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.34em]"
          >
            Selected work
          </p>
          <h2 id="work-stack-title" className="mt-4 flex flex-col items-center">
            <span
              style={ink}
              className="font-serif text-[clamp(1.75rem,3.4vw,3rem)] italic leading-[1.1] tracking-normal"
            >
              Real work for
            </span>
            <span
              className="hero-automation-text ws-display mt-1 whitespace-nowrap leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
              data-text="REAL BUSINESSES."
            >
              REAL BUSINESSES.
            </span>
          </h2>
          <p
            style={inkSoft}
            className="mt-5 max-w-[520px] text-[15px] leading-[1.65] md:text-[17px]"
          >
            From hotel groups to growing institutes, we design and ship the systems teams open every
            morning: booking engines, CRMs, storefronts and more.
          </p>
        </header>

        {/* ── Stack ── */}
        <div ref={stackRef} className="relative px-3 sm:px-6 lg:px-12">
          {items.map((item, i) => (
            <div
              key={item.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="pointer-events-none sticky mx-auto w-full max-w-[1240px]"
              style={{
                top: pin + i * step,
                marginBottom: i === items.length - 1 ? 0 : gap,
              }}
            >
              <StackCard
                item={item}
                index={i}
                total={items.length}
                scrollY={scrollY}
                layoutVersion={layoutVersion}
                layout={layout}
                reduceMotion={reduceMotion}
                isDesktop={isDesktop}
                pin={pin}
                step={step}
                onOpen={onOpenProject}
              />
            </div>
          ))}
          {/* Holds the finished stack on screen for a beat before it scrolls away. */}
          <div aria-hidden="true" className="h-[10svh]" />
        </div>

        {/* ── Close ── */}
        <div className="mx-auto flex max-w-[1240px] flex-col items-center px-5 pb-28 pt-16 text-center sm:px-8 md:pb-40 md:pt-24">
          <h3 className="flex flex-col items-center">
            <span
              style={ink}
              className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic leading-[1.1] tracking-normal"
            >
              Liked what you saw?
            </span>
            <span
              className="hero-automation-text mt-1 whitespace-nowrap leading-none text-[clamp(2.2rem,4.6vw,4.2rem)]"
              data-text="LET'S BUILD YOURS."
            >
              LET'S BUILD YOURS.
            </span>
          </h3>
          <p
            style={inkSoft}
            className="mt-5 max-w-[460px] text-[15px] leading-[1.6] md:text-[16px]"
          >
            Tell us what's slowing your team down. We'll show you what it could look like.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onStartProject}
              className="flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-sm font-semibold text-white shadow-[0_12px_32px_-10px_rgba(255,47,134,0.55)] transition-transform hover:scale-[1.04]"
            >
              Start a project
              <ArrowUpRight className="h-5 w-5" />
            </button>
            {onViewAll && (
              <a
                href={workHref}
                onClick={handleViewAll}
                style={{
                  ...ink,
                  borderColor: isLight ? 'rgba(13,11,18,0.18)' : 'rgba(255,255,255,0.3)',
                }}
                className="flex h-12 items-center gap-2 rounded-full border px-7 text-sm font-semibold hover:opacity-70"
              >
                See all work
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  item: StackItem;
  index: number;
  total: number;
  scrollY: MotionValue<number>;
  layoutVersion: MotionValue<number>;
  layout: React.MutableRefObject<StackLayout>;
  reduceMotion: boolean;
  isDesktop: boolean;
  pin: number;
  step: number;
  onOpen: (slug: string) => void;
}

const StackCard: React.FC<CardProps> = ({
  item,
  index,
  total,
  scrollY,
  layoutVersion,
  layout,
  reduceMotion,
  isDesktop,
  pin,
  step,
  onOpen,
}) => {
  const { slug, name, description, preview, glow, phone, mockup, logo } = item;
  const href = viewToPath('work-post', slug);

  // Shrinks by SHRINK for every card that has slid over this one — partially
  // for the one still arriving — so the stack reads as a receding pile.
  const scale = useTransform([scrollY, layoutVersion], ([y]: number[]) => {
    const { pinAt, coverFrom } = layout.current;
    let covered = 0;
    for (let j = index + 1; j < total; j++) {
      const from = coverFrom[j];
      const to = pinAt[j];
      if (from === undefined || to === undefined || y <= from) break;
      covered += y >= to ? 1 : (y - from) / Math.max(1, to - from);
    }
    return 1 - covered * SHRINK;
  });

  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    e.preventDefault();
    onOpen(slug);
  };

  const showPhone = isDesktop && !!phone;
  // Desktop cards fill the screen under the navbar, leaving room for the
  // pinned edges of every card beneath; narrower, they size to their content.
  const desktopHeight = `min(740px, calc(100svh - ${pin + (total - 1) * step + 24}px))`;

  return (
    <m.article
      onClick={handleClick}
      style={{
        scale: reduceMotion ? 1 : scale,
        height: isDesktop ? desktopHeight : undefined,
      }}
      className="ws-card group pointer-events-auto relative flex w-full origin-top cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[#0d0b12]/[0.07] bg-white sm:rounded-[28px]"
    >
      {/* Tint in the project's colour, rising from behind the devices. A
          finished mockup brings its own white backdrop, so it gets none. */}
      {!mockup && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 70% at 50% 118%, rgba(${glow},0.22), transparent 70%), linear-gradient(180deg, #ffffff 0%, #faf9fc 100%)`,
          }}
        />
      )}

      {/* ── Top bar ── */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-[#0d0b12]/[0.07] px-5 py-5 sm:px-8 md:flex-row md:items-center md:gap-8 md:py-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 md:contents">
          <h3 className="min-w-0 text-[22px] font-bold leading-[1.15] tracking-[-0.03em] text-[#0d0b12] sm:text-[26px] md:w-[28%] md:flex-none lg:text-[30px]">
            <a
              href={href}
              onClick={handleClick}
              className="inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#d946ef] focus-visible:ring-offset-2"
            >
              {logo ? (
                <img
                  src={logo.src}
                  alt={name}
                  width={logo.width}
                  height={logo.height}
                  decoding="async"
                  className="h-10 w-auto sm:h-11 lg:h-12"
                />
              ) : (
                name
              )}
            </a>
          </h3>
          <span
            aria-hidden="true"
            className="flex h-9 flex-none items-center gap-1 rounded-full bg-[#0d0b12] px-3.5 text-[13px] font-semibold text-white md:hidden"
          >
            View
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <p className="min-w-0 flex-1 line-clamp-2 min-h-[3em] text-[14px] leading-[1.5] text-[#0d0b12]/60 sm:text-[15px] md:min-h-0 lg:text-[16px]">
          {description}
        </p>

        <span
          aria-hidden="true"
          className="hidden h-12 flex-none items-center gap-2 rounded-full bg-[#0d0b12] px-6 text-[15px] font-semibold text-white transition-transform duration-300 group-hover:scale-[1.04] md:flex"
        >
          View project
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      {/* ── Devices ── */}
      {mockup ? (
        <div className="relative px-3 pt-2 sm:px-6 lg:min-h-0 lg:flex-1 lg:px-8 lg:pt-4">
          {/* Phones: the 2:1 box reserves the height before the image loads,
              so the stack's measured geometry never shifts under a scroll. */}
          <div className="relative aspect-[2/1] w-full lg:absolute lg:inset-0 lg:aspect-auto">
            <img
              src={mockup}
              alt={`${name} on a laptop and a phone`}
              width={1774}
              height={887}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-500 ease-out group-hover:-translate-y-1"
            />
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 justify-center px-4 pb-4 pt-5 sm:px-8 sm:pb-8 sm:pt-8 lg:pb-0 lg:pt-[4%]">
          <div className="relative aspect-[16/10] w-full max-w-[880px] self-start lg:h-[104%] lg:w-auto lg:max-w-none">
            <BrowserFrame>
              <PreviewContent preview={preview} name={name} device="browser" />
            </BrowserFrame>

            {showPhone && (
              <div className="absolute -right-[7%] top-[22%] aspect-[9/19.5] h-[84%] transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <div className="relative h-full w-full overflow-hidden rounded-[26px] border-[5px] border-[#16151c] bg-black shadow-[0_30px_60px_-18px_rgba(30,15,50,0.45)]">
                  <img
                    src={phone}
                    alt={`${name} on mobile`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-[6px] h-[12px] w-[32%] -translate-x-1/2 rounded-full bg-black"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </m.article>
  );
};

/** A light browser window around a preview. */
const BrowserFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ws-screen absolute inset-0 flex flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_24px_60px_-24px_rgba(30,15,50,0.35)] ring-1 ring-[#0d0b12]/10 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:rounded-[14px]">
    <div className="flex h-6 flex-none items-center gap-1.5 border-b border-[#0d0b12]/[0.06] bg-[#f3f1f6] px-3 sm:h-8 sm:gap-2 sm:px-4">
      <span className="h-2 w-2 rounded-full bg-[#0d0b12]/15 sm:h-2.5 sm:w-2.5" />
      <span className="h-2 w-2 rounded-full bg-[#0d0b12]/10 sm:h-2.5 sm:w-2.5" />
      <span className="h-2 w-2 rounded-full bg-[#0d0b12]/[0.07] sm:h-2.5 sm:w-2.5" />
      <span className="mx-auto h-3 w-[38%] rounded-full bg-[#0d0b12]/[0.06] sm:h-4" />
    </div>
    <div className="sw-ui relative flex-1 overflow-hidden bg-white">{children}</div>
  </div>
);
