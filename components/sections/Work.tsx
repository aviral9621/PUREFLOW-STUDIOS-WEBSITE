import React, { useRef } from 'react';
import { MagneticButton } from '../shared/MagneticButton';
import { SelectedWork } from './SelectedWork';

// NOTE: this module is only the homepage's work *block* — the `SelectedWork`
// section (three curated products, see `./SelectedWork.tsx`) followed by the
// "have a project in mind" card. It owns the `#work` anchor the navbar links
// to, and nothing else; keep the section itself free of extra CTAs so it can be
// reused elsewhere as-is.
//
// The data-driven grid that used to live here now serves the /work index —
// see `components/WorkIndexPage.tsx` and `./ProjectShowcaseCard.tsx`.

interface WorkProps {
  onStartProject: () => void;
  onOpenProject?: (slug: string) => void;
  onViewAll?: () => void;
}

export function Work({ onStartProject, onOpenProject, onViewAll }: WorkProps) {
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  return (
    <div id="work" className="relative bg-[#070708]">
      <SelectedWork onOpenProject={(slug) => onOpenProject?.(slug)} onViewAll={onViewAll} />

      {/* ── Bottom CTA card ── */}
      <div className="relative z-10 mx-auto max-w-[1240px] px-6 pb-20 md:px-10 md:pb-28 lg:px-12">
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
      </div>
    </div>
  );
}
