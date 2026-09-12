import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SelectedWorkCard, type SelectedWorkItem } from './SelectedWorkCard';
import { viewToPath } from '../../lib/router';

// ─────────────────────────────────────────────────────────────────────────────
// SelectedWork — the homepage portfolio section: three curated products, each
// with a designed preview of the real interface, above a link into the full
// /work listing.
//
// The list below is the section's single source of truth. To change what the
// homepage shows, reorder or swap an entry — `slug` must match a case study in
// `lib/caseStudies.ts` so the card links somewhere real, and exactly one entry
// should carry `featured` (it gets the purple emphasis and anchors the row).
//
// Styling lives in the `.sw-*` block in index.css.
// ─────────────────────────────────────────────────────────────────────────────

const PROJECTS: SelectedWorkItem[] = [
  {
    slug: 'quick-hotels',
    category: 'Website + PMS',
    name: 'Quick Hotels',
    description: 'A mobile-first booking site and a custom PMS on one backend.',
  },
  {
    slug: 'unskills-computer-education-crm',
    category: 'Custom CRM',
    name: 'UnSkills CRM',
    description: 'Leads, admissions, fees and eight branches in one live dashboard.',
    featured: true,
  },
  {
    slug: 'ecommerce-retail-platform',
    category: 'SaaS Dashboard',
    name: 'Quick Hotels CRM',
    description: 'Bookings, leads, occupancy and revenue in one dashboard.',
  },
];

interface Props {
  onOpenProject: (slug: string) => void;
  onViewAll?: () => void;
  /** Overrides the curated list — the service pages pass their own projects. */
  items?: SelectedWorkItem[];
}

export const SelectedWork: React.FC<Props> = ({ onOpenProject, onViewAll, items }) => {
  const projects = items ?? PROJECTS;
  const workHref = viewToPath('work');

  const handleViewAll = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onViewAll?.();
  };

  return (
    <section
      className="sw-section relative overflow-hidden py-[88px] md:py-[120px] lg:py-[152px]"
      aria-labelledby="selected-work-title"
    >
      {/* Atmosphere: two soft purple washes at opposite corners. */}
      <span aria-hidden="true" className="sw-glow sw-glow--tl" />
      <span aria-hidden="true" className="sw-glow sw-glow--br" />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 md:px-10 lg:px-12">
        {/* ── Header ── */}
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--sw-accent)]">
              <span aria-hidden="true" className="h-px w-7 bg-[var(--sw-accent)]/55" />
              Selected work
            </p>

            <h2
              id="selected-work-title"
              className="mt-6 text-[clamp(2.4rem,4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[var(--sw-text)]"
            >
              Real businesses.
              <br />
              <span className="sw-headline-accent">Real software.</span>
            </h2>
          </div>

          {onViewAll && (
            <a
              href={workHref}
              onClick={handleViewAll}
              className="sw-viewall group/all inline-flex w-fit items-center gap-1.5 self-start text-[15px] font-medium text-[var(--sw-text)] md:mb-2 md:self-auto"
            >
              View all work
              <ArrowUpRight aria-hidden="true" className="sw-viewall__arrow h-4 w-4" />
            </a>
          )}
        </header>

        {/* ── Grid ── */}
        {/* Single column centres its capped-width cards; from sm up the cards
            fill their track as normal. */}
        <div className="mt-10 grid grid-cols-1 justify-items-center gap-4 sm:mt-[60px] sm:grid-cols-2 sm:justify-items-stretch sm:gap-5 lg:mt-[72px] lg:grid-cols-3 lg:gap-6">
          {projects.map((project, i) => (
            <SelectedWorkCard
              key={project.slug}
              item={project}
              index={i + 1}
              onOpen={onOpenProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
