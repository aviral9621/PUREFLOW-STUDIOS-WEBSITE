// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASES — the editorial project page (`components/showcase/ShowcasePage.tsx`).
//
// A showcase is the long-form story of one client engagement: brief, problem,
// process, every product we shipped, the design language, the impact. It is
// built from still images only (finished mockups, crops of the real UI, stills
// of the live site); nothing on the page embeds a live website.
//
// Routing: `/work/<slug>` renders a showcase when `getShowcaseBySlug` matches
// (aliases included), ahead of the older `CaseStudyPage`. A project moves to
// the new page by adding ONE entry here; its card copy on the homepage and
// the /work index still comes from `lib/caseStudies.ts`.
//
// Copy rules: real facts only. `**double asterisks**` in `brief` and
// `problem` render as emphasis. The page's look (fonts, gradient, colours) is
// Pureflow's own and lives in the component; the client's brand only appears
// as content (logo, palette, type specimens, product imagery).
// ─────────────────────────────────────────────────────────────────────────────

export interface ShowcaseImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** 'tile' = a crop of light UI, shown centred on a light canvas with
   *  breathing room. Default: the image fills its rounded box edge to edge. */
  frame?: 'tile';
}

export type ProductKind = 'crm' | 'app' | 'website';

/**
 * Cut-out cards laid out in rows: each inner array is one row, shown in equal
 * columns on desktop (tablets pair them, phones stack them). Every image in a
 * row must be the same pixel size — scripts/showcase/cut_cards.py pads them to
 * a common white canvas with transparent rounded corners, so they sit directly
 * on the dark page. See docs/project-showcase-playbook.md.
 */
export type CardRows = ShowcaseImage[][];

export interface ShowcaseProduct {
  kind: ProductKind;
  name: string;
  summary: string;
  features: string[];
  /** Feature cards cut from the product's bento image. */
  cards?: CardRows;
  /** Laid out in order: the first image full width, the rest in pairs. */
  gallery: ShowcaseImage[];
  /** A mobile still shown beside the first gallery image (websites/apps). */
  phone?: ShowcaseImage;
}

export interface Showcase {
  slug: string;
  matchSlugs?: string[];
  client: string;
  /** Solid-black logo file; the hero shows it inverted to white. */
  logo: { src: string; width: number; height: number };
  /** What we built, one chip each, e.g. ['CRM', 'Mobile App', 'Website']. */
  focus: string[];
  /** Hero statement: an italic serif lead-in + a short gradient display phrase
   *  (UPPERCASE, ideally ≤ 3 words so it stays on 1–2 lines on a phone). */
  headline: { lead: string; word: string };
  /** Wide hero visual. Falls back to the first product's first image. */
  hero?: ShowcaseImage;

  brief: string;
  facts: { label: string; value: string }[];
  links?: { label: string; href: string }[];

  problem: string;
  /** The "before" cards under the problem, cut from the problem bento. */
  problemCards?: CardRows;
  /** Fallback when there are no cards: crops laid out as a bento. */
  problemGallery?: ShowcaseImage[];

  process: string[];
  products: ShowcaseProduct[];

  /** A finished design-system sheet; replaces the coded swatches/specimens. */
  systemImage?: ShowcaseImage;
  palette: { name: string; hex: string }[];
  type: { family: string; role: string; weights: string; google?: string }[];

  impact: { label: string; value: string; caption: string }[];
  testimonial?: { quote: string; name: string; role: string };
}

const U = '/work/unskills';

export const SHOWCASES: Showcase[] = [
  {
    slug: 'unskills-computer-education-crm',
    client: 'UnSkills Computer Education',
    logo: { src: '/work/unskills-logo.webp', width: 356, height: 160 },
    focus: ['Institute Management System'],
    headline: { lead: 'One management system for a', word: 'MULTI-BRANCH INSTITUTE.' },
    hero: {
      src: `${U}/hero.webp`,
      width: 1672,
      height: 941,
      alt: 'UnSkills CRM dashboard with fee, admission and payment highlights',
    },

    brief:
      'UnSkills runs computer-education centres across multiple branches. The brief was **one institute management system** that ties the whole institute together: **students, staff, branches, fees, courses and exams**, run by the head office and every branch from the same place.',
    facts: [
      { label: 'Industry', value: 'Education' },
      { label: 'Delivered', value: 'Institute Management System' },
      { label: 'Services', value: 'Product Design · Custom Software Development' },
      { label: 'Stack', value: 'Next.js · Node.js · PostgreSQL · AWS' },
    ],

    problem:
      'Leads, admissions and fees lived across **spreadsheets, WhatsApp groups and disconnected tools**. Branches had no shared record of a student, follow-ups slipped through the cracks, and the head office had **no real-time view** of numbers across branches. Every new branch added to the chaos.',
    problemCards: [
      [
        { src: `${U}/problem-1.webp`, width: 574, height: 440, alt: 'Spreadsheets everywhere' },
        {
          src: `${U}/problem-2.webp`,
          width: 574,
          height: 440,
          alt: 'WhatsApp groups for everything',
        },
        { src: `${U}/problem-3.webp`, width: 574, height: 440, alt: 'No single student record' },
      ],
      [
        { src: `${U}/problem-4.webp`, width: 574, height: 440, alt: 'Follow-ups slipped through' },
        { src: `${U}/problem-5.webp`, width: 574, height: 440, alt: 'No real-time numbers' },
        {
          src: `${U}/problem-6.webp`,
          width: 574,
          height: 440,
          alt: 'Every new branch, more chaos',
        },
      ],
    ],

    process: [
      'Discovery & workflow mapping',
      'Information architecture',
      'UX & interface design',
      'Development & integrations',
      'Testing with branch teams',
      'Launch, training & support',
    ],

    // Only the software on this page; the app and the website get their own
    // showcase sections later.
    products: [
      {
        kind: 'crm',
        name: 'Institute Management System',
        summary:
          'The operating system of the institute. The head office sees every branch live; each branch runs its own students, staff and fees.',
        features: [
          'Student management',
          'Staff management',
          'Branch management',
          'Accounting & fees',
          'Leads & WhatsApp',
          'Course management',
          'Coding lab',
          'Certificate generation',
          'Mark sheet generation',
        ],
        cards: [
          [
            {
              src: `${U}/crm-card-students.webp`,
              width: 620,
              height: 470,
              alt: 'Student management',
            },
            { src: `${U}/crm-card-leads.webp`, width: 620, height: 470, alt: 'Leads & WhatsApp' },
            { src: `${U}/crm-card-fees.webp`, width: 620, height: 470, alt: 'Fees & accounting' },
          ],
          [
            {
              src: `${U}/crm-card-branches.webp`,
              width: 432,
              height: 392,
              alt: 'Branches & staff',
            },
            {
              src: `${U}/crm-card-courses.webp`,
              width: 432,
              height: 392,
              alt: 'Courses & batches',
            },
            { src: `${U}/crm-card-coding-lab.webp`, width: 432, height: 392, alt: 'Coding lab' },
            {
              src: `${U}/crm-card-certificates.webp`,
              width: 432,
              height: 392,
              alt: 'Certificates & mark sheets',
            },
          ],
        ],
        gallery: [],
      },
    ],

    systemImage: {
      src: `${U}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'UnSkills CRM design system: colours, typography and components',
    },
    // Sampled from the logo and the live CRM (buttons, status icons, surfaces).
    palette: [
      { name: 'UnSkills Crimson', hex: '#AC2038' },
      { name: 'Action Red', hex: '#E1292A' },
      { name: 'Ink', hex: '#111111' },
      { name: 'Gold', hex: '#B08848' },
      { name: 'Canvas', hex: '#F9F9FB' },
    ],
    type: [
      {
        family: 'Outfit',
        role: 'Headings',
        weights: 'Semibold · Medium',
        google: 'Outfit:wght@500;600',
      },
      { family: 'Inter', role: 'Interface & body', weights: 'Semibold · Medium · Regular' },
    ],

    impact: [
      { label: 'Admissions', value: '+42%', caption: 'more admissions converted' },
      { label: 'Fee collection', value: '+35%', caption: 'faster fee collection' },
      { label: 'Revenue', value: '+28%', caption: 'revenue growth' },
      { label: 'Manual work', value: '−60%', caption: 'less manual data entry' },
    ],
    testimonial: {
      quote:
        'PureFlow gave us one place to run every branch — leads, admissions and fees finally live in a single system, and our team stopped drowning in spreadsheets.',
      name: 'UnSkills Leadership',
      role: 'Computer Education Institute',
    },
  },
];

const bySlug = new Map<string, Showcase>();
SHOWCASES.forEach((s) => {
  bySlug.set(s.slug, s);
  s.matchSlugs?.forEach((alias) => bySlug.set(alias, s));
});

export function getShowcaseBySlug(slug: string | null | undefined): Showcase | null {
  return slug ? (bySlug.get(slug) ?? null) : null;
}
