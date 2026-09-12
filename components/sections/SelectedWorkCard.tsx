import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { viewToPath } from '../../lib/router';
import { DESIGNED_PREVIEWS } from './WorkPreviews';
import { PortfolioPreview } from './PortfolioPreview';
import type { DeviceKind, PortfolioItem, PreviewSource } from './ProjectShowcaseCard';

// ─────────────────────────────────────────────────────────────────────────────
// SelectedWorkCard — one project in the "Selected work" grid.
//
// Reading order is fixed and identical on every card:
//
//   Category pill + number  →  product preview  →  name  →  blurb  →  View project
//
// The whole card is one link. The anchor wraps the project name and is
// stretched over the card with `.sw-card__link::after`, so there is exactly one
// tab stop per card, the accessible name is the project name, and the browser's
// own affordances (middle-click, copy link, open in new tab) all work — while a
// click anywhere on the card still opens the case study through the SPA router.
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectedWorkItem {
  /** Case-study slug — must exist in `lib/caseStudies.ts`; drives /work/<slug>. */
  slug: string;
  /** Pill label. A product type reads best here ("Custom CRM"). */
  category: string;
  /** Short brand name — this is the card headline. */
  name: string;
  /** One or two lines, no more. */
  description: string;
  /**
   * Fallback preview for a project with no designed mockup. Ignored when the
   * slug has an entry in `DESIGNED_PREVIEWS`.
   */
  preview?: PreviewSource;
  device?: DeviceKind;
  /** Marks the one card that carries the purple emphasis. */
  featured?: boolean;
}

/** Narrow a `PortfolioItem` (the shape the project data layer produces) to what
 *  this card needs, so the same card renders on the homepage and the service
 *  pages from one source of truth. */
export function toSelectedWorkItem(item: PortfolioItem): SelectedWorkItem {
  return {
    slug: item.slug,
    category: item.category,
    name: item.name,
    description: item.description,
    preview: item.preview,
    device: item.device,
  };
}

interface Props {
  item: SelectedWorkItem;
  /** 1-based position, rendered as the 01 / 02 / 03 index. */
  index: number;
  onOpen: (slug: string) => void;
}

export const SelectedWorkCard: React.FC<Props> = ({ item, index, onOpen }) => {
  const { slug, category, name, description, preview, device, featured } = item;
  const href = viewToPath('work-post', slug);
  const Designed = DESIGNED_PREVIEWS[slug];

  // Let the browser handle modified clicks (new tab / new window) natively;
  // only a plain left click is taken over by the SPA router.
  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((e as React.MouseEvent<HTMLElement>).button !== 0) return;
    e.preventDefault();
    onOpen(slug);
  };

  return (
    <article
      onClick={handleClick}
      className={`sw-card group relative flex w-full max-w-[400px] flex-col rounded-[14px] p-[18px] sm:max-w-none sm:rounded-[16px] sm:p-5 lg:p-6 ${
        featured ? 'sw-card--featured' : ''
      }`}
    >
      {/* 1–2 · Category + index */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-[7px] rounded-full border border-[var(--sw-ghost)] bg-white/[0.03] py-1 pl-2 pr-2.5 text-[11.5px] font-medium leading-[1.45] text-[var(--sw-text-soft)] sm:text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--sw-accent)]" aria-hidden="true" />
          {category}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-[11px] font-medium tracking-[0.08em] text-[var(--sw-accent)]/75"
        >
          {String(index).padStart(2, '0')}
        </span>
      </div>

      {/* 3 · Product preview — 16:9 is the floor: the mockups are laid out
          against this box's width, and a shorter box would crop the phone in
          the Quick Hotels composition. The card's max-width above is what keeps
          this from ballooning on a wide single-column screen. */}
      <div className="sw-stage relative mt-3.5 aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-[var(--sw-ghost)] bg-[#07070c] sm:mt-4 sm:rounded-[10px]">
        <div className="sw-stage__inner absolute inset-0">
          {Designed ? (
            <Designed />
          ) : (
            <PortfolioPreview
              preview={preview ?? { type: 'placeholder' }}
              name={name}
              device={device ?? 'browser'}
            />
          )}
        </div>
      </div>

      {/* 4–5 · Name + blurb */}
      <h3 className="mt-3.5 text-[18px] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--sw-text)] sm:mt-4 sm:text-[20px]">
        <a
          href={href}
          onClick={handleClick}
          className="sw-card__link rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--sw-accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sw-surface)]"
        >
          {name}
        </a>
      </h3>

      <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[var(--sw-muted)] sm:text-[14px]">
        {description}
      </p>

      {/* 6 · View project */}
      <div className="mt-3.5 flex items-center gap-1.5 pt-0 sm:mt-auto sm:pt-4">
        <span className="sw-cta relative text-[13px] font-medium text-[var(--sw-text)]">
          View Project
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="sw-cta__arrow h-[13px] w-[13px] text-[var(--sw-text)]"
        />
      </div>
    </article>
  );
};
