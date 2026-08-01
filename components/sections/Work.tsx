import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MagneticButton } from '../shared/MagneticButton';

// NOTE: the full case-study card lives in `./CaseStudyCard`. It is deliberately
// NOT re-exported here — importers must pull it from that module directly so the
// homepage chunk never picks up the carousel / live-iframe / mockup dependencies.

// ─── Main section ─────────────────────────────────────────────────────────────

interface WorkProps {
  onStartProject: () => void;
  /**
   * Retained so the showcase can be switched back on without touching App.tsx.
   * Unused while the section is being rebuilt.
   */
  onOpenProject?: (slug: string) => void;
  onViewAll?: () => void;
}

export function Work({ onStartProject }: WorkProps) {
  const reduced = useReducedMotion();
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" className="relative py-10 md:py-12 bg-black">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] max-w-full -translate-y-0 rounded-full bg-pink-600/4 blur-[140px]" />
      </div>

      {/* ── Section header ── */}
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 md:mb-10 lg:px-10">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            Stuff we
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="SHIPPED."
          >
            SHIPPED.
          </span>
        </motion.div>
      </div>

      {/* ── "Building this section" panel ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08060d] px-5 py-12 sm:rounded-3xl sm:px-10 sm:py-16 md:py-20"
        >
          {/* Blueprint grid backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)',
            }}
          />

          {/* Ambient gradient wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,70,239,0.14),transparent_60%)]"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Status badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d946ef]/30 bg-[#d946ef]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f0abfc] sm:text-[11px]">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f0abfc] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#f0abfc]" />
              </span>
              In progress
            </span>

            <h3 className="mt-6 font-display text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-white">
              We're building this section.
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-white/55 sm:text-base">
              Our case studies are being rewritten with real numbers, real outcomes and the
              full story behind each build. Worth the wait — check back soon.
            </p>

            {/* Progress rail */}
            <div
              className="mt-9 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.07]"
              role="presentation"
            >
              <div className="work-progress-rail h-full w-2/5 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7]" />
            </div>

            <p className="mt-8 text-[13px] text-white/40 sm:text-sm">
              Want to see the work in the meantime?{' '}
              <span className="text-white/70">Ask us directly — we'll walk you through it.</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom CTA card ── */}
      <motion.div
        className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 md:mt-20 lg:px-10"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="grain relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--color-bg-elevated)] p-6 text-center sm:rounded-3xl sm:p-12">
          {/* Ambient gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-fuchsia-500/5" />

          <h3 className="relative z-10 font-display text-3xl font-bold text-white lg:text-4xl">
            Have a project in mind?
          </h3>
          <p className="relative z-10 mx-auto mt-4 mb-8 max-w-md leading-relaxed text-white/55">
            Let's build something that ships, scales, and outlives the hype cycle.
          </p>

          <div ref={ctaBtnRef} className="relative z-10 inline-block">
            <MagneticButton variant="primary" onClick={onStartProject}>
              Start a project
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
