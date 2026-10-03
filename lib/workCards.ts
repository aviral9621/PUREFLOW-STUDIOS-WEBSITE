// ─────────────────────────────────────────────────────────────────────────────
// WORK CARDS — the projects Pureflow shows as cards, and the visuals each card
// uses. One source for every place a project card appears: the homepage work
// stack (components/sections/WorkStack.tsx), the /work index and the services
// pages (components/sections/WorkCard.tsx).
//
// Copy (name, one-line category, blurb) comes from lib/caseStudies.ts; this
// file only picks the projects, their order, their tabs and their images.
// See docs/project-showcase-playbook.md.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkKind = 'software' | 'website' | 'app';

export interface WorkCardVisual {
  slug: string;
  /** Which tab(s) the card appears under, in FEATURED order within each. */
  kinds: WorkKind[];
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
  /**
   * Per-tab overrides on the homepage stack, for a project listed under more
   * than one tab: e.g. a software-only image and one-line category under
   * Software, while Websites keeps the combined one. Other places use the
   * defaults above.
   */
  perKind?: Partial<Record<WorkKind, { mockup?: string; line?: string }>>;
}

export const FEATURED: WorkCardVisual[] = [
  // ── Software ──
  {
    slug: 'unskills-computer-education-crm',
    kinds: ['software'],
    glow: '168,85,247',
    mockup: '/work/unskills-crm-showcase.webp',
    logo: { src: '/work/unskills-logo.webp', width: 356, height: 160 },
  },
  {
    slug: 'smart-agro',
    kinds: ['software'],
    glow: '40,185,76',
    mockup: '/work/smart-agro-mockup.webp',
    logo: { src: '/work/smart-agro-logo.webp', width: 504, height: 160 },
  },
  {
    slug: 'ecommerce-retail-platform',
    kinds: ['software'],
    glow: '217,70,239',
    mockup: '/work/quick-hotels-crm-showcase.webp',
    logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
  },
  {
    slug: 'spectrum-tour-travels',
    kinds: ['software'],
    glow: '249,115,22',
    shots: {
      desktop: '/work/spectrum-tour-travels-desktop.webp',
      mobile: '/work/spectrum-tour-travels-mobile.webp',
    },
    mockup: '/work/spectrum-tour-travels-showcase.webp',
    logo: { src: '/work/spectrum-tour-travels-logo.webp', width: 277, height: 160 },
  },
  // The MLM software. Its online store has its own card and page under
  // Websites ('herbal-vantage-website'), so this one shows only the software
  // (the showcase hero, padded to 2:1).
  {
    slug: 'herbal-vantage',
    kinds: ['software'],
    glow: '34,197,94',
    mockup: '/work/herbal-vantage-software.webp',
    logo: { src: '/work/herbal-vantage-logo.webp', width: 671, height: 160 },
  },
  // ── Websites ──
  {
    slug: 'quick-hotels',
    kinds: ['website'],
    glow: '255,47,134',
    shots: {
      desktop: '/work/quick-hotels-desktop.webp',
      mobile: '/work/quick-hotels-mobile.webp',
    },
    mockup: '/work/quick-hotels-mockup.webp',
    logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
  },
  {
    slug: 'unskills-education-website',
    kinds: ['website'],
    glow: '185,28,28',
    shots: {
      desktop: '/work/unskills-website/home-desktop.webp',
      mobile: '/work/unskills-website/home-mobile.webp',
    },
    mockup: '/work/unskills-website-mockup.webp',
    logo: { src: '/work/unskills-logo.webp', width: 356, height: 160 },
  },
  {
    slug: 'herbal-vantage-website',
    kinds: ['website'],
    glow: '26,107,47',
    shots: {
      desktop: '/work/herbal-vantage-website/home-desktop.webp',
      mobile: '/work/herbal-vantage-website/home-mobile.webp',
    },
    mockup: '/work/herbal-vantage-website-mockup.webp',
    logo: { src: '/work/herbal-vantage-logo.webp', width: 671, height: 160 },
  },
  {
    slug: 'spectrum-tour-travels-website',
    kinds: ['website'],
    glow: '254,189,9',
    shots: {
      desktop: '/work/spectrum-website/home-desktop.webp',
      mobile: '/work/spectrum-website/home-mobile.webp',
    },
    mockup: '/work/spectrum-website-mockup.webp',
    logo: { src: '/work/spectrum-tour-travels-logo.webp', width: 277, height: 160 },
  },
  {
    slug: 'smart-agro-website',
    kinds: ['website'],
    glow: '30,138,70',
    shots: {
      desktop: '/work/smart-agro-website/home-desktop.webp',
      mobile: '/work/smart-agro-website/home-mobile.webp',
    },
    mockup: '/work/smart-agro-website-mockup.webp',
    logo: { src: '/work/smart-agro-logo.webp', width: 504, height: 160 },
  },
  {
    slug: 'quick-agriculture-website',
    kinds: ['website'],
    glow: '31,122,77',
    shots: {
      desktop: '/work/quick-agriculture-website/home-desktop.webp',
      mobile: '/work/quick-agriculture-website/home-mobile.webp',
    },
    logo: { src: '/work/quick-agriculture-logo.webp', width: 512, height: 160 },
  },
  {
    slug: 'ram-tiles-website',
    kinds: ['website'],
    glow: '249,115,6',
    shots: {
      desktop: '/work/ram-tiles-website/home-desktop.webp',
      mobile: '/work/ram-tiles-website/home-mobile.webp',
    },
    logo: { src: '/work/ram-tiles-logo.webp', width: 397, height: 160 },
  },
  {
    slug: 'strataloom-research-website',
    kinds: ['website'],
    glow: '15,163,177',
    shots: {
      desktop: '/work/strataloom-website/home-desktop.webp',
      mobile: '/work/strataloom-website/home-mobile.webp',
    },
    logo: { src: '/work/strataloom-logo.webp', width: 683, height: 160 },
  },
  {
    slug: 'baba-biswanath-travels-website',
    kinds: ['website'],
    glow: '107,123,26',
    shots: {
      desktop: '/work/baba-biswanath-website/home-desktop.webp',
      mobile: '/work/baba-biswanath-website/home-mobile.webp',
    },
    logo: { src: '/work/baba-biswanath-logo.webp', width: 602, height: 160 },
  },
];

const bySlug = new Map(FEATURED.map((f) => [f.slug, f]));

/** Where a project sits in FEATURED (projects not listed sort last). */
export function workOrder(slug: string): number {
  const i = FEATURED.findIndex((f) => f.slug === slug);
  return i === -1 ? FEATURED.length : i;
}

/** A project's card visuals (logo, 2:1 image), if it has any. */
export function getWorkCard(slug: string): WorkCardVisual | undefined {
  return bySlug.get(slug);
}
