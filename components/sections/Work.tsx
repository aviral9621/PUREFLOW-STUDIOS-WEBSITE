import React, { useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MagneticButton } from '../shared/MagneticButton';
import { useAllProjects } from '../../hooks/useProjects';
import { toPortfolioItems } from '../../lib/portfolio';
import { ProjectShowcaseCard } from './ProjectShowcaseCard';
import { PortfolioMore } from './PortfolioMore';

// NOTE: the grid below renders `ProjectShowcaseCard`, the reusable portfolio
// component. It takes a `PortfolioItem` (not a `Project`), so it drops into any
// page that can produce one — see `components/WorkIndexPage.tsx`. The older
// thumbnail-style `./CaseStudyCard` now only serves the related-projects strip
// on a case-study page.

const FEATURED_COUNT = 6;

interface WorkProps {
  onStartProject: () => void;
  onOpenProject?: (slug: string) => void;
  onViewAll?: () => void;
}

/** Keeps the grid from collapsing while the first fetch is in flight. */
const CardSkeleton: React.FC = () => (
  <div className="min-h-[270px] animate-pulse rounded-[14px] border border-white/[0.06] bg-[#08080d] sm:min-h-[290px] sm:rounded-[18px] lg:min-h-[308px]" />
);

export function Work({ onStartProject, onOpenProject, onViewAll }: WorkProps) {
  const reduced = useReducedMotion();
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  // The full list, sliced locally — the homepage shows the first FEATURED_COUNT
  // and the "see all" link only earns its place when there are more than that.
  const { projects, loading } = useAllProjects();

  const items = useMemo(
    () => toPortfolioItems(projects.slice(0, FEATURED_COUNT)),
    [projects]
  );
  const showSkeletons = loading && items.length === 0;
  const total = projects.length;
  const hasMore = total > FEATURED_COUNT;

  return (
    <section id="work" className="relative bg-black py-14 md:py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-pink-600/[0.04] blur-[140px]" />
      </div>

      {/* ── Section header ── */}
      <div className="relative z-10 mx-auto mb-12 max-w-[1440px] px-4 sm:px-6 md:mb-16 lg:px-10">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-serif text-[clamp(1.75rem,3.4vw,3rem)] italic leading-[1.1] tracking-normal text-white/95">
            Stuff we
          </span>
          <span
            className="hero-automation-text mt-1 inline-block text-[clamp(2.5rem,5.6vw,5rem)] leading-none"
            data-text="SHIPPED."
          >
            SHIPPED.
          </span>
        </motion.div>
      </div>

      {/* ── Showcase grid ── */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
          {showSkeletons
            ? Array.from({ length: FEATURED_COUNT }, (_, i) => <CardSkeleton key={i} />)
            : items.map((item, i) => (
                <ProjectShowcaseCard
                  key={item.id}
                  item={item}
                  index={i}
                  reduced={reduced}
                  onOpen={(slug) => onOpenProject?.(slug)}
                />
              ))}
        </div>

        {/* See all — the way into the full listing */}
        {onViewAll && !showSkeletons && hasMore && (
          <PortfolioMore
            shown={items.length}
            total={total}
            label={`Show all ${total} projects`}
            intent="navigate"
            reduced={reduced}
            onClick={onViewAll}
          />
        )}
      </div>

      {/* ── Bottom CTA card ── */}
      <motion.div
        className="relative z-10 mx-auto mt-16 max-w-[1440px] px-4 sm:px-6 md:mt-24 lg:px-10"
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
