import React from 'react';
import {
  ArrowUpRight,
  Building2,
  Cloud,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Leaf,
  Monitor,
  Plane,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  UtensilsCrossed,
} from 'lucide-react';
import { PreviewContent } from './PortfolioPreview';
import type { MockupKind } from '../casestudy/Mockup';

// ─────────────────────────────────────────────────────────────────────────────
// ProjectShowcaseCard — the portfolio card used by the homepage "Stuff we
// shipped" grid and by the /work index.
//
// It is deliberately data-agnostic: it renders a `PortfolioItem`, not a
// `Project` / `CaseStudy`. Map whatever the source of truth is into that shape
// (see `lib/portfolio.ts`) and the card works unchanged.
//
// Reading order is fixed and never varies between cards:
//
//   Category  →  Project name  →  Description  →  Product preview  →  View Project
//
// At >= sm the preview escapes the flex flow and is anchored to the right half
// of the card, angled in 3D and bleeding off the right edge; the text column is
// width-capped so the two never collide. Below sm it stays in flow, so a stacked
// card reads in exactly the order above.
// ─────────────────────────────────────────────────────────────────────────────

export type DeviceKind = 'browser' | 'phone';

export type PreviewSource =
  /** A static screenshot / product shot. */
  | { type: 'image'; src: string; alt?: string }
  /** The real site, embedded live and scaled to fit (lazy, non-interactive). */
  | { type: 'live'; src: string }
  /** A designed in-app mockup, for products with no public URL. */
  | { type: 'mockup'; kind: MockupKind }
  /** Nothing supplied — renders a neutral UI skeleton. */
  | { type: 'placeholder' };

export interface PortfolioItem {
  id: string;
  slug: string;
  /** Pill label. A product type reads best here ("Website", "Custom CRM"). */
  category: string;
  /** Short brand name — this is the headline, so keep it to a few words. */
  name: string;
  /** One or two lines. Anything longer is clamped rather than left to sprawl. */
  description: string;
  device: DeviceKind;
  preview: PreviewSource;
}

// ─── Category → icon ─────────────────────────────────────────────────────────

const ICON_RULES: Array<[RegExp, React.ComponentType<{ className?: string }>]> = [
  [/mobile|app\b|ios|android/i, Smartphone],
  [/crm|dashboard|saas|platform|admin|erp/i, LayoutDashboard],
  [/e-?commerce|shop|store|retail/i, ShoppingBag],
  [/travel|tour|hospitality|hotel|stay/i, Plane],
  [/education|edtech|institute|school|learn/i, GraduationCap],
  [/health|clinic|medical|pharma/i, Stethoscope],
  [/food|restaurant|dining/i, UtensilsCrossed],
  [/herbal|wellness|organic|agri/i, Leaf],
  [/real ?estate|property|construction/i, Building2],
  [/website|web|landing|marketing/i, Monitor],
  [/cloud|automation|ai\b/i, Cloud],
];

function iconFor(category: string) {
  for (const [pattern, Icon] of ICON_RULES) {
    if (pattern.test(category)) return Icon;
  }
  return Layers;
}

// ─── Device frames ───────────────────────────────────────────────────────────

const BrowserFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-hidden rounded-[8px] border border-white/[0.14] bg-[#0c0c13] shadow-[0_44px_90px_-34px_rgba(0,0,0,0.95)]">
    {/* chrome */}
    <div className="flex h-[22px] items-center gap-[5px] border-b border-white/[0.07] bg-[#12121a] px-2.5">
      <span className="h-[5px] w-[5px] rounded-full bg-white/20" />
      <span className="h-[5px] w-[5px] rounded-full bg-white/[0.14]" />
      <span className="h-[5px] w-[5px] rounded-full bg-white/10" />
      <span className="ml-2 h-[9px] flex-1 rounded-full bg-white/[0.05]" />
    </div>
    {/* screen */}
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07070c]">
      {children}
    </div>
  </div>
);

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full rounded-[24px] border border-white/[0.16] bg-[#0c0c13] p-[5px] shadow-[0_44px_90px_-34px_rgba(0,0,0,0.95)]">
    <div className="relative h-full w-full overflow-hidden rounded-[19px] bg-black">
      {children}
      {/* notch */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[6px] h-[7px] w-[38%] -translate-x-1/2 rounded-full bg-black"
      />
    </div>
  </div>
);

// ─── Card ────────────────────────────────────────────────────────────────────

interface Props {
  item: PortfolioItem;
  onOpen: (slug: string) => void;
}

export const ProjectShowcaseCard: React.FC<Props> = ({ item, onOpen }) => {
  const Icon = iconFor(item.category);
  const isPhone = item.device === 'phone';
  const open = () => onOpen(item.slug);

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`${item.name} — view project`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      className="pfc-card group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#08080d] p-6 sm:min-h-[290px] sm:rounded-[18px] sm:p-8 lg:min-h-[308px]"
    >
      {/* Accent wash behind the device — the only always-on colour on the card. */}
      <span
        aria-hidden="true"
        className="pfc-card__wash pointer-events-none absolute -right-[18%] top-1/2 -z-10 h-[130%] w-[75%] -translate-y-1/2 rounded-full"
      />

      {/* 1–3 · Category → name → description */}
      <div className="relative z-20 sm:max-w-[50%]">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] py-1.5 pl-2.5 pr-3.5 text-[11px] font-medium tracking-tight text-white/70 backdrop-blur-sm">
          <Icon className="h-3.5 w-3.5 text-[#d946ef]" />
          {item.category}
        </span>

        <h3 className="mt-4 text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[1.6rem]">
          {item.name}
        </h3>

        <p className="mt-3 line-clamp-4 text-[13px] leading-[1.65] text-white/45">
          {item.description}
        </p>
      </div>

      {/* 4 · Product preview */}
      <div className="pfc-stage relative z-0 -mx-6 mt-6 h-[210px] sm:pointer-events-none sm:absolute sm:inset-y-0 sm:right-0 sm:m-0 sm:h-full sm:w-[44%]">
        {isPhone ? (
          <div className="pfc-device absolute bottom-[-8%] left-[28%] aspect-[9/19] h-[102%] w-auto sm:bottom-[-13%] sm:left-[26%] sm:h-[106%]">
            <PhoneFrame>
              <PreviewContent preview={item.preview} name={item.name} device={item.device} />
            </PhoneFrame>
          </div>
        ) : (
          <div className="pfc-device absolute left-[8%] top-1/2 w-[112%] -translate-y-1/2 sm:left-[4%] sm:w-[134%]">
            <BrowserFrame>
              <PreviewContent preview={item.preview} name={item.name} device={item.device} />
            </BrowserFrame>
          </div>
        )}
      </div>

      {/* 5 · View Project */}
      <div className="relative z-20 mt-7 flex items-center gap-4 sm:mt-auto sm:max-w-[50%] sm:pt-6">
        <span className="relative text-[13px] font-medium tracking-tight text-white/85 transition-colors duration-300 group-hover:text-white">
          View Project
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full bg-white/25 transition-colors duration-300 group-hover:bg-[#d946ef]"
          />
        </span>
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.14] text-white/65 transition-colors duration-300 group-hover:border-[#d946ef]/55 group-hover:bg-[#d946ef]/10 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
};
