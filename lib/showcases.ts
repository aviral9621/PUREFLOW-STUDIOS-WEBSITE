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
  /** One line under "Our PROCESS." Default: "From the first workshop to launch day." */
  processNote?: string;
  products: ShowcaseProduct[];

  /** A finished design-system sheet; replaces the coded swatches/specimens. */
  systemImage?: ShowcaseImage;
  palette: { name: string; hex: string }[];
  type: { family: string; role: string; weights: string; google?: string }[];

  /** Real results only; leave empty (the section is hidden) until there are some. */
  impact: { label: string; value: string; caption: string }[];
  testimonial?: { quote: string; name: string; role: string };
  /** Serif line above "LET'S BUILD YOURS." Default: "Running your business on spreadsheets?" */
  ctaLead?: string;
}

const U = '/work/unskills';

export const SHOWCASES: Showcase[] = [
  {
    slug: 'unskills-computer-education-crm',
    // The retired UnSkills Education case study's URLs.
    matchSlugs: ['unskills-education-website', 'saas-analytics-dashboard'],
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

    processNote: 'From the first workshop to the day every branch went live.',
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

    ctaLead: 'Running an institute on spreadsheets?',
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
  {
    slug: 'smart-agro',
    client: 'Smart Agro',
    logo: { src: '/work/smart-agro-logo.webp', width: 504, height: 160 },
    focus: ['Agri Business Management System'],
    headline: { lead: 'One system for an entire', word: 'AGRI BUSINESS.' },
    hero: {
      src: '/work/smart-agro/hero.webp',
      width: 1672,
      height: 941,
      alt: 'Smart Agro dashboard with monthly sales, leads this week, recent orders and WhatsApp follow-ups around it',
    },

    brief:
      'Smart Agro (Laxmi Agro) sells seeds, fertilisers and crop-protection products through a sales team, an online store and WhatsApp. The brief was **one system for the whole business**: leads and sellers, **WhatsApp and Meta Ads**, the online store and orders, quotations, **stock across every godown**, and **GST-ready accounting**.',
    facts: [
      { label: 'Industry', value: 'Agriculture · Farm inputs' },
      { label: 'Delivered', value: 'Agri Business Management System' },
      { label: 'Services', value: 'Product Design · Custom Software Development' },
      { label: 'Stack', value: 'Next.js · Supabase · WhatsApp Cloud API · Meta Lead Ads' },
    ],

    problem:
      'Leads arrived from **WhatsApp, Facebook, Instagram and forms**, and had to be shared fairly across a team of sellers. WhatsApp at scale usually means **paying a third-party provider**. Orders, stock in **multiple godowns** and the books all had to agree, with **GST returns** out of the same numbers.',
    // Cut from the T4 bento ("Smart Sec - 2.png"); every card 596×414.
    problemCards: [
      [
        { src: '/work/smart-agro/problem-1.webp', width: 596, height: 414, alt: 'Leads everywhere' },
        { src: '/work/smart-agro/problem-2.webp', width: 596, height: 414, alt: 'Leads shared unfairly' },
        { src: '/work/smart-agro/problem-3.webp', width: 596, height: 414, alt: 'Follow-ups slipped through' },
      ],
      [
        { src: '/work/smart-agro/problem-4.webp', width: 596, height: 414, alt: 'Paying per WhatsApp message' },
        { src: '/work/smart-agro/problem-5.webp', width: 596, height: 414, alt: 'Stock in separate registers' },
        { src: '/work/smart-agro/problem-6.webp', width: 596, height: 414, alt: 'Books never matched' },
      ],
    ],

    process: [
      'Discovery & workflow mapping',
      'Information architecture',
      'UX & interface design',
      'Development & integrations',
      'Testing with the sales team',
      'Launch, training & support',
    ],

    products: [
      {
        kind: 'crm',
        name: 'Agri Business Management System',
        summary:
          'One system for the whole business: the sales team works its leads, the store and orders run through it, and stock and accounts stay in sync.',
        features: [
          'Leads, auto-distributed',
          'Meta Ads auto-sync',
          'WhatsApp automation, no BSP fees',
          'Team roles & permissions',
          'Seller targets',
          'E-commerce & orders',
          'Quotations',
          'Inventory & godowns',
          'Accounting & GST',
          'Affiliate commissions',
        ],
        // Cut from the T5 bento ("Smart Sec - 3.png"). Top row 500×466 (the wide
        // leads card is scaled to fit), bottom row 456×404.
        cards: [
          [
            {
              src: '/work/smart-agro/crm-card-leads.webp',
              width: 500,
              height: 466,
              alt: 'Leads & Meta Ads: every lead in one list, auto-assigned to a seller',
            },
            {
              src: '/work/smart-agro/crm-card-whatsapp.webp',
              width: 500,
              height: 466,
              alt: 'WhatsApp automation: enquiry to order with no third-party BSP fees',
            },
            {
              src: '/work/smart-agro/crm-card-orders.webp',
              width: 500,
              height: 466,
              alt: 'E-commerce & orders: from the online store to dispatch',
            },
          ],
          [
            {
              src: '/work/smart-agro/crm-card-targets.webp',
              width: 456,
              height: 404,
              alt: 'Targets & team roles',
            },
            {
              src: '/work/smart-agro/crm-card-inventory.webp',
              width: 456,
              height: 404,
              alt: 'Inventory & godowns',
            },
            {
              src: '/work/smart-agro/crm-card-quotations.webp',
              width: 456,
              height: 404,
              alt: 'Quotations',
            },
            {
              src: '/work/smart-agro/crm-card-accounting.webp',
              width: 456,
              height: 404,
              alt: 'Accounting & GST',
            },
          ],
        ],
        gallery: [],
      },
    ],

    // The T6 sheet ("Smart Sec - 4.png"), flattened at 250 so the Canvas swatch
    // (#F7F8F7) doesn't turn white. Its swatches match their hex labels.
    systemImage: {
      src: '/work/smart-agro/design-system.webp',
      width: 1774,
      height: 887,
      alt: 'Smart Agro design system: colours, typography and components',
    },
    // Sampled from the logo (red, green), the product (forest, leaf) and the
    // store's fonts (smartagrocare.in: Poppins headings, Inter body).
    palette: [
      { name: 'Smart Red', hex: '#D01A1B' },
      { name: 'Agro Green', hex: '#307120' },
      { name: 'Forest', hex: '#01411D' },
      { name: 'Leaf', hex: '#28B94C' },
      { name: 'Canvas', hex: '#F7F8F7' },
    ],
    type: [
      {
        family: 'Poppins',
        role: 'Headings',
        weights: 'SemiBold · Bold',
        google: 'Poppins:wght@600;700',
      },
      { family: 'Inter', role: 'Interface & body', weights: 'SemiBold · Medium · Regular' },
    ],

    ctaLead: 'Running your agri business on spreadsheets?',
    // Scale, not before/after: these are the live dashboard's own totals
    // (the owner chose to show Smart Agro's real figures). Swap in real
    // before/after gains once the client confirms them; never invent them.
    impact: [
      { label: 'Leads', value: '11,898', caption: 'leads handled in one system' },
      { label: 'Orders', value: '2,678', caption: 'orders from store to dispatch' },
      { label: 'Revenue', value: '₹56.4L', caption: 'sales tracked in one place' },
      { label: 'WhatsApp', value: '86%', caption: 'of leads come in on WhatsApp' },
    ],
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
