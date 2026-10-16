import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  User,
  Building2,
  PenTool,
  MonitorSmartphone,
  Clock,
  Code2,
  Globe,
  LayoutDashboard,
  Layers,
  Quote,
  FileText,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Wallet,
  Users,
} from 'lucide-react';
import type { CaseStudy } from '../../lib/caseStudies';
import { LiveDeviceEmbed } from './LiveDeviceEmbed';
import { UnskillsShowcase } from './UnskillsShowcase';
import { StayHubShowcase } from './StayHubShowcase';

// ── Shared motion preset ──────────────────────────────────────────────────────

const reveal = (reduced: boolean | null, delay = 0) =>
  ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }) as const;

const SECTION = 'relative px-5 sm:px-6 lg:px-10';
const SHELL = 'mx-auto max-w-7xl';

// Big faint outlined section number ("01", "02").
const Marker: React.FC<{ value: string }> = ({ value }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none select-none font-display leading-none text-transparent"
    style={{
      fontSize: 'clamp(5rem, 13vw, 11rem)',
      WebkitTextStroke: '1.5px rgba(217,70,239,0.22)',
    }}
  >
    {value}
  </span>
);

// ── 1. Hero ───────────────────────────────────────────────────────────────────

const scrollToDetails = () =>
  document.getElementById('case-study-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export const Hero: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => (
  <section className={`${SECTION} pt-0 pb-8 md:pt-1 md:pb-12`}>
    {/* Subtle grid texture only — the purple ambient glow is rendered at the
        page level so it flows seamlessly from the nav down (no hard seam). */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 50% 28%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 28%, black, transparent 75%)',
        }}
      />
    </div>

    <div className={`${SHELL} relative grid items-center gap-8 sm:gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12`}>
      {/* Left — copy (below the preview on mobile, left on desktop) */}
      <motion.div {...reveal(reduced)} className="order-2 lg:order-1">
        <span className="inline-flex items-center rounded-full border border-[#d946ef]/30 bg-[#d946ef]/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f0abfc]">
          {cs.category}
        </span>
        <h1 className="mt-6 font-display uppercase leading-[0.92] tracking-[0.005em] text-white" style={{ fontSize: 'clamp(2.6rem, 5vw, 5rem)' }}>
          {cs.name}
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-base">{cs.tagline}</p>

        {cs.hero?.bullets && cs.hero.bullets.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {cs.hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[14px] text-white/80 sm:text-[15px]">
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-[#d946ef]" />
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {cs.hero?.ctaLabel ? (
            <a
              href="/start-project"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_14px_50px_-12px_rgba(217,70,239,0.7)] transition-transform hover:scale-[1.03]"
            >
              {cs.hero.ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <>
              {cs.liveUrl && (
                <a
                  href={cs.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_14px_50px_-12px_rgba(217,70,239,0.7)] transition-transform hover:scale-[1.03]"
                >
                  View Live Site
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              <button
                onClick={scrollToDetails}
                className={
                  cs.liveUrl
                    ? 'inline-flex h-12 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-7 text-[14px] font-semibold text-white/90 transition-colors hover:border-white/30 hover:bg-white/[0.08]'
                    : 'group inline-flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_14px_50px_-12px_rgba(217,70,239,0.7)] transition-transform hover:scale-[1.03]'
                }
              >
                {cs.liveUrl ? 'Case Study' : 'Explore Case Study'}
                <FileText className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Right — the real Quick Hotels site, live in a browser frame
          (on top on mobile, right column on desktop) */}
      <motion.div {...reveal(reduced, 0.12)} className="relative order-1 lg:order-2">
        <LiveDeviceEmbed
          device={cs.hero?.device ?? 'browser'}
          showcase={cs.hero?.image ? { type: 'image' as const, src: cs.hero.image } : cs.showcase.desktop}
          liveUrl={cs.liveUrl || cs.showcase.desktop.src}
          label={cs.hero?.device === 'laptop' ? 'Dashboard' : 'Live site'}
          siteName={cs.name}
          nonInteractive
        />
      </motion.div>
    </div>
  </section>
);

// ── 2. Snapshot strip ───────────────────────────────────────────────────────────

export const SnapshotStrip: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => {
  const s = cs.snapshot;
  const fields = [
    { label: 'Client', value: s.client, Icon: User },
    { label: 'Industry', value: s.industry, Icon: Building2 },
    { label: 'Services', value: s.services, Icon: PenTool },
    { label: 'Platforms', value: s.platforms, Icon: MonitorSmartphone },
    ...(s.timeline ? [{ label: 'Timeline', value: s.timeline, Icon: Clock }] : []),
    { label: 'Stack', value: s.stack, Icon: Code2 },
  ];

  return (
    <section className={`${SECTION} pb-4`}>
      <motion.div
        {...reveal(reduced)}
        className={`${SHELL} grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-6`}
      >
        {fields.map(({ label, value, Icon }) => (
          <div key={label} className="flex flex-col gap-2 bg-[#08070d] p-4 sm:p-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              <Icon className="h-3.5 w-3.5 text-[#d946ef]/70" />
              {label}
            </span>
            <span className="font-mono text-[12.5px] leading-snug text-white/85">{value}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

// ── 3. The Challenge ────────────────────────────────────────────────────────────

export const Challenge: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => (
  <section id="case-study-details" className={`${SECTION} py-16 md:py-24`}>
    <div className={`${SHELL} max-w-5xl`}>
      <motion.div {...reveal(reduced)} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-8">
        <div className="shrink-0">
          <Marker value="01" />
        </div>
        <div className="pt-2 sm:pt-6">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] uppercase leading-none tracking-wide text-white">
            The Challenge
          </h2>
          <p className="mt-5 max-w-[68ch] text-[15.5px] leading-[1.8] text-white/65 sm:text-[16.5px]">
            {cs.challenge}
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ── 4. What We Built ────────────────────────────────────────────────────────────

const BUILT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  dashboard: LayoutDashboard,
};

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  up: TrendingUp,
  down: TrendingDown,
  rupee: IndianRupee,
  wallet: Wallet,
  clock: Clock,
  users: Users,
};

export const WhatWeBuilt: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => (
  <section className={`${SECTION} py-10 md:py-14`}>
    <div className={SHELL}>
      <motion.h2
        {...reveal(reduced)}
        className="text-center font-display text-[clamp(2rem,4.5vw,3.2rem)] uppercase leading-none tracking-wide text-white"
      >
        What We Built
      </motion.h2>

      <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-7">
        {cs.whatWeBuilt.map((card, i) => {
          const Icon = BUILT_ICONS[card.icon] ?? Layers;
          return (
            <motion.div
              {...reveal(reduced, i * 0.1)}
              key={card.title}
              className="relative overflow-hidden rounded-2xl border border-[#d946ef]/15 bg-white/[0.025] p-6 sm:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(217,70,239,0.1),transparent_55%)]" />
              <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d946ef]/25 bg-[#d946ef]/10">
                <Icon className="h-5 w-5 text-[#f0abfc]" />
              </div>
              <h3 className="relative mt-4 font-sans text-[1.25rem] font-semibold tracking-[-0.01em] text-white">
                {card.title}
              </h3>
              <ul className="relative mt-4 space-y-3">
                {card.items.map((item) => (
                  <li key={item} className="relative pl-5 text-[14.5px] leading-[1.6] text-white/70">
                    <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#ff2f86] to-[#a855f7]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ── 5. Tech Stack ───────────────────────────────────────────────────────────────

const TechLogo: React.FC<{ logo: string }> = ({ logo }) => {
  const p = 'h-4 w-4';
  switch (logo) {
    case 'react':
      return (
        <svg viewBox="-11.5 -10.23 23 20.46" className={p} fill="none" stroke="currentColor" strokeWidth={1}>
          <circle r="2.05" fill="currentColor" stroke="none" />
          <g>
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'vercel':
      return (
        <svg viewBox="0 0 24 24" className={p}>
          <path d="M12 3l10 18H2z" fill="currentColor" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" className={p}>
          <path
            d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C13.4 10.85 14.5 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.6 7.15 14.5 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.4 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.6 13.15 9.5 12 7 12z"
            fill="currentColor"
          />
        </svg>
      );
    case 'supabase':
      return (
        <svg viewBox="0 0 24 24" className={p}>
          <path d="M13.2 1.6c.5-.63 1.5-.2 1.5.6V10h6.1c1 0 1.55 1.16.92 1.94l-9.34 11.4c-.5.62-1.5.2-1.5-.6V14H4.8c-1 0-1.55-1.16-.92-1.94L13.2 1.6z" fill="currentColor" />
        </svg>
      );
    case 'nextjs':
      return (
        <svg viewBox="0 0 24 24" className={p}>
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <path d="M8 8v8M8 8l8.5 9.4M16 8v6.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'razorpay':
      return (
        <svg viewBox="0 0 24 24" className={p}>
          <path d="M16.5 3l-7 13h3.2l-2.4 5 7.4-11h-3.4l2.6-7z" fill="currentColor" />
          <path d="M6.5 7.5l9-3-1 3-7.2 2.3z" fill="currentColor" opacity="0.55" />
        </svg>
      );
    default:
      return <span className="inline-block h-2 w-2 rounded-full bg-current" />;
  }
};

export const TechStack: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => (
  <section className={`${SECTION} py-12 md:py-16`}>
    <div className={SHELL}>
      <motion.h2
        {...reveal(reduced)}
        className="text-center font-display text-[clamp(2rem,4.5vw,3.2rem)] uppercase leading-none tracking-wide text-white"
      >
        Tech Stack
      </motion.h2>
      <motion.div {...reveal(reduced, 0.1)} className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {cs.techStack.map((t) => (
          <span
            key={t.name}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
          >
            <span className="text-white/90">
              <TechLogo logo={t.logo} />
            </span>
            <span className="font-mono text-[12.5px]">{t.name}</span>
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

// ── 6. Visual Showcase (live embeds) ────────────────────────────────────────────

export const VisualShowcase: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => {
  const kind = cs.showcase.desktop.type;
  const hasProduct = !!cs.productShowcase;
  // Show the laptop+phone showcase for live sites and designed mockups.
  if (kind !== 'live' && kind !== 'mockup' && kind !== 'image' && !hasProduct) return null;
  const isLive = kind === 'live';

  return (
    <section className={`${SECTION} py-16 md:py-24`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a452ff]/10 blur-[160px]" />
      </div>

      <div className={`${SHELL} relative`}>
        <motion.div {...reveal(reduced)} className="text-center">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] uppercase leading-none tracking-wide text-white">
            Visual Showcase
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-white/55">
            {isLive
              ? `The real ${cs.name} site — live inside the frames. Click in to scroll and explore.`
              : `A closer look at the ${cs.name} dashboard.`}
          </p>
        </motion.div>

        {hasProduct ? (
          <motion.div {...reveal(reduced, 0.1)} className="mt-12">
            <StayHubShowcase image={cs.hero?.image} />
          </motion.div>
        ) : isLive ? (
          <motion.div
            {...reveal(reduced, 0.1)}
            className="mt-12 flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-10"
          >
            {/* Laptop — real site in desktop layout */}
            <div className="order-2 w-full lg:order-1 lg:w-[60%]">
              <LiveDeviceEmbed device="laptop" showcase={cs.showcase.desktop} liveUrl={cs.liveUrl} label="Desktop" siteName={cs.name} />
            </div>
            {/* Phone — real mobile layout */}
            <div className="order-1 w-full lg:order-2 lg:w-[34%]">
              <LiveDeviceEmbed device="phone" showcase={cs.showcase.mobile} liveUrl={cs.liveUrl} label="Mobile" siteName={cs.name} />
            </div>
          </motion.div>
        ) : kind === 'image' ? (
          // Static dashboard screenshot — shown big in a laptop frame.
          <motion.div {...reveal(reduced, 0.1)} className="mx-auto mt-12 w-full max-w-4xl">
            <LiveDeviceEmbed
              device="laptop"
              showcase={cs.showcase.desktop}
              liveUrl={cs.showcase.desktop.src}
              label="Dashboard"
              siteName={cs.name}
              nonInteractive
            />
          </motion.div>
        ) : (
          // Non-live (designed) work: a multi-device collage (phone + laptop + tablet).
          <motion.div {...reveal(reduced, 0.1)}>
            <UnskillsShowcase image={cs.hero?.image} />
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ── 7. The Outcome ──────────────────────────────────────────────────────────────

function withHighlight(text: string, keyword?: string): React.ReactNode {
  if (!keyword) return text;
  const i = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="gradient-text">{text.slice(i, i + keyword.length)}</span>
      {text.slice(i + keyword.length)}
    </>
  );
}

export const Outcome: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => (
  <section className={`${SECTION} py-20 md:py-28`}>
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff20a0]/8 blur-[150px]" />
    </div>
    <motion.div {...reveal(reduced)} className={`${SHELL} relative flex max-w-4xl flex-col items-center text-center`}>
      <Marker value="02" />
      <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">The Outcome</span>
      <p className="mt-6 font-display text-[clamp(1.8rem,5vw,3.6rem)] uppercase leading-[1.05] tracking-wide text-white">
        {withHighlight(cs.outcome, cs.outcomeHighlight)}
      </p>

      {cs.metrics && cs.metrics.length > 0 && (
        <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-y-7 sm:grid-cols-4 sm:gap-y-0">
          {cs.metrics.map((m, i) => {
            const Icon = METRIC_ICONS[m.icon ?? ''] ?? TrendingUp;
            return (
              <div
                key={m.label}
                className={`flex flex-col items-center px-3 text-center ${i > 0 ? 'sm:border-l sm:border-white/10' : ''}`}
              >
                <Icon className="h-5 w-5 text-[#d946ef]" />
                <p className="mt-2 gradient-text font-display text-[2rem] leading-none">{m.value}</p>
                <p className="mt-1.5 text-[11px] leading-tight text-white/50">{m.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  </section>
);

// ── 8. Testimonial (optional) ───────────────────────────────────────────────────

export const Testimonial: React.FC<{ cs: CaseStudy; reduced: boolean | null }> = ({ cs, reduced }) => {
  if (!cs.testimonial) return null;
  const t = cs.testimonial;
  return (
    <section className={`${SECTION} py-16 md:py-20`}>
      <motion.div {...reveal(reduced)} className={`${SHELL} relative max-w-3xl text-center`}>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] uppercase leading-none tracking-wide text-white">
          {t.heading ?? 'What Our Client Says'}
        </h2>
        <Quote className="mx-auto mt-6 h-9 w-9 text-[#d946ef]/60" />
        <blockquote className="mt-5 font-serif text-[clamp(1.25rem,3vw,1.9rem)] italic leading-[1.5] text-white/90">
          “{t.quote}”
        </blockquote>
        <p className="mt-6 gradient-text text-sm font-bold">{t.name}</p>
        <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-white/40">{t.role}</p>
      </motion.div>
    </section>
  );
};

// ── 9. CTA band ─────────────────────────────────────────────────────────────────

export const CaseStudyCTA: React.FC<{ reduced: boolean | null; onStart: () => void; liveUrl: string }> = ({
  reduced,
  onStart,
  liveUrl,
}) => (
  <section className={`${SECTION} py-16 md:py-24`}>
    <motion.div
      {...reveal(reduced)}
      className={`${SHELL} relative max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] px-6 py-12 text-center sm:px-10 sm:py-16`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.16) 0%, transparent 55%)',
        }}
      />
      <h2 className="relative font-display text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[1.02] tracking-wide text-white">
        Want something like this for your business?
      </h2>
      <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
        We design, build and ship custom software, CRMs, websites and apps — end to end.
      </p>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={onStart}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_14px_50px_-12px_rgba(217,70,239,0.7)] transition-transform hover:scale-[1.03]"
        >
          Start a project with PureFlow
          <ArrowRight className="h-4 w-4" />
        </button>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.08]"
          >
            Visit live site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  </section>
);
