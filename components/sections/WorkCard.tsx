import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { viewToPath } from '../../lib/router';
import { getWorkCard } from '../../lib/workCards';
import type { PortfolioItem } from '../../lib/portfolio';
import { PortfolioPreview } from './PortfolioPreview';

// ─────────────────────────────────────────────────────────────────────────────
// WorkCard — the compact project card for grids (the /work index and the
// services pages). It is the homepage stack card in miniature, so a project
// looks the same everywhere:
//
//   client logo (solid black) ········· View ↗
//   what it is, in one line
//   ─────────────────────────────────────
//   the project's 2:1 image on white
//
// Logo and image come from lib/workCards.ts; the words from lib/caseStudies.ts
// (`card.showcaseLine`, falling back to the blurb). A project with no image
// yet shows its stills in a browser frame instead.
//
// The whole card is one link: the anchor wraps the project name (the logo's
// alt text) and is stretched over the card, so there is one tab stop and the
// browser's own link behaviours (new tab, copy link) work.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  item: PortfolioItem;
  onOpen: (slug: string) => void;
}

export const WorkCard: React.FC<Props> = ({ item, onOpen }) => {
  const { slug, name, description, showcaseLine, preview, device } = item;
  const visual = getWorkCard(slug);
  const href = viewToPath('work-post', slug);

  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    e.preventDefault();
    onOpen(slug);
  };

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-[#0d0b12]/[0.07] bg-white shadow-[0_30px_60px_-34px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out hover:-translate-y-1 sm:rounded-[24px]">
      {/* ── Top bar ── */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="min-w-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-[#0d0b12]">
            <a
              href={href}
              onClick={handleClick}
              className="inline-flex rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-[#d946ef] focus-visible:ring-offset-2"
            >
              {visual?.logo ? (
                <img
                  src={visual.logo.src}
                  alt={name}
                  width={visual.logo.width}
                  height={visual.logo.height}
                  decoding="async"
                  className="h-8 w-auto max-w-[170px] object-contain object-left sm:h-9"
                />
              ) : (
                name
              )}
            </a>
          </h3>
          <span
            aria-hidden="true"
            className="flex h-9 flex-none items-center gap-1 rounded-full bg-[#0d0b12] px-3.5 text-[13px] font-semibold text-white transition-transform duration-300 group-hover:scale-[1.05]"
          >
            View
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        {showcaseLine ? (
          <p className="mt-3.5 truncate text-[16px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#0d0b12] sm:text-[17px]">
            {showcaseLine}
          </p>
        ) : (
          <p className="mt-3.5 line-clamp-2 text-[14.5px] leading-[1.5] text-[#0d0b12]/60">{description}</p>
        )}
      </div>

      {/* ── Image ── */}
      <div className="mt-4 border-t border-[#0d0b12]/[0.07] sm:mt-5">
        {visual?.mockup ? (
          <div className="relative aspect-[2/1] w-full bg-white">
            <img
              src={visual.mockup}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.03] sm:p-3"
            />
          </div>
        ) : (
          <div className="sw-stage relative m-4 aspect-[16/10] overflow-hidden rounded-[10px] border border-[#0d0b12]/10 sm:m-5">
            <PortfolioPreview preview={preview} name={name} device={device} />
          </div>
        )}
      </div>
    </article>
  );
};
