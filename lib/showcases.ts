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
   *  breathing room. 'browser' = a raw screenshot of a live site, shown in a
   *  coded browser window (address bar from `url`). Default: the image fills
   *  its rounded box edge to edge (finished images on white). */
  frame?: 'tile' | 'browser';
  /** The address shown in a 'browser' frame, e.g. 'unskillseducation.org/courses'. */
  url?: string;
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

/** Icons for the "Under the HOOD." cards (mapped in WebsiteShowcase.tsx). */
export type SiteFeatureIcon =
  | 'search'
  | 'form'
  | 'shield'
  | 'ticket'
  | 'star'
  | 'chat'
  | 'map'
  | 'seo'
  | 'login'
  | 'phone'
  | 'gauge'
  | 'cart';

export interface SitePage {
  name: string;
  path: string;
  /** What the page does for the visitor (and the business), 1–2 sentences. */
  summary: string;
  features: string[];
  /** The page, 2:1 on white from the page prompt, or a raw still in a browser frame. */
  image?: ShowcaseImage;
}

/**
 * A website project. When a showcase has `site`, `/work/<slug>` renders the
 * website layout (components/showcase/WebsiteShowcase.tsx) instead of the
 * software one: what the site had to do, the sitemap, how we built it, page
 * by page, every screen, what's under the hood, the design system and the
 * site today. `problem`, `process` and `products` are not used there.
 */
export interface SiteDetails {
  /** Full URL of the live site. Leave it out to show no "Visit" button
   *  (and leave `links` empty) when the client's site shouldn't be linked. */
  url?: string;
  /** How the address reads on the page, e.g. 'unskillseducation.org'. */
  label: string;
  /** Line beside "The SITEMAP." (a generic one is used when left out). */
  sitemapNote?: string;
  /** "What it had to DO.": the jobs the site was built for (3–4). */
  goals: { title: string; text: string }[];
  /** "The SITEMAP.": the menu as built, one group per top-level item. */
  sitemap: { group: string; pages: string[] }[];
  /** "How we BUILT IT.": the website process, step by step. */
  build: { title: string; text: string }[];
  /** "Page by PAGE.": the key pages, in the order a visitor meets them. */
  pages: SitePage[];
  /** "Every SCREEN.": phone stills (390×844-ish captures). */
  screens: ShowcaseImage[];
  /** "Under the HOOD.": what the site does beyond looking good. */
  builtIn: { icon: SiteFeatureIcon; title: string; text: string }[];
  /** Line under "The site TODAY." (the numbers are `impact`). */
  todayNote?: string;
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
  /** Present on website projects: switches the page to the website layout. */
  site?: SiteDetails;
}

const U = '/work/unskills';
const UW = '/work/unskills-website';
const HW = '/work/herbal-vantage-website';
const SW = '/work/spectrum-website';
const AW = '/work/smart-agro-website';
const QA = '/work/quick-agriculture-website';
const RT = '/work/ram-tiles-website';
const SL = '/work/strataloom-website';
const BB = '/work/baba-biswanath-website';

export const SHOWCASES: Showcase[] = [
  {
    slug: 'unskills-computer-education-crm',
    // The retired UnSkills Education case study's URL (the website has its own page now).
    matchSlugs: ['saas-analytics-dashboard'],
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

  // The four below were moved onto this page with the material we already
  // had: the homepage card image as the hero, the real feature lists (the
  // case-study copy for the websites, the product's own sidebar for the
  // software), colours and fonts read from the live site or sampled from the
  // product screenshots. No problem cards, feature cards or design-system
  // sheet yet, so those sections show text, chips and swatches. Impact and
  // testimonials stay empty until the clients confirm real ones.
  {
    slug: 'quick-hotels',
    matchSlugs: ['end-to-end-hotel-management'],
    client: 'Quick Hotels',
    logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
    focus: ['Booking Website', 'Property Management System'],
    headline: { lead: 'A booking site and PMS for', word: 'BUDGET STAYS.' },
    hero: {
      src: '/work/quick-hotels/hero.webp',
      width: 1672,
      height: 941,
      alt: 'Quick Hotels PMS dashboard with monthly bookings, occupancy by city, today’s check-ins and hotel payouts around it',
    },

    brief:
      'Quick Hotels runs **budget-friendly stays** across Delhi, Bengaluru, Rishikesh, Noida, Mathura and more. The brief was two things on **one backend**: a fast, mobile-first **booking website** for guests and a **property management system** for the team, with every price **GST-inclusive**.',
    facts: [
      { label: 'Industry', value: 'Hospitality' },
      { label: 'Delivered', value: 'Booking website + PMS' },
      { label: 'Services', value: 'Product Design · Web Dev · Custom PMS' },
      { label: 'Stack', value: 'Next.js · Supabase · Razorpay' },
    ],
    links: [{ label: 'quickhotels.co', href: 'https://quickhotels.co' }],

    problem:
      'Most vendors treat a booking site and a hotel back office as **separate projects**, which means **double entry** and availability that never quite matches. Quick Hotels also had one strict rule: **every room price already includes GST**, so the total a guest sees is the total they pay.',
    // Cut from the T4 bento ("Quick hotels sec 2.png"). The finder caught inner
    // panels instead of the cards, so all six boxes were measured by hand.
    problemCards: [
      [
        { src: '/work/quick-hotels/problem-1.webp', width: 604, height: 456, alt: 'Bookings in two places' },
        { src: '/work/quick-hotels/problem-2.webp', width: 604, height: 456, alt: 'Availability never matched' },
        { src: '/work/quick-hotels/problem-3.webp', width: 604, height: 456, alt: 'Surprise tax at checkout' },
      ],
      [
        { src: '/work/quick-hotels/problem-4.webp', width: 604, height: 424, alt: 'Dues chased at the door' },
        { src: '/work/quick-hotels/problem-5.webp', width: 604, height: 424, alt: 'Payouts worked out by hand' },
        { src: '/work/quick-hotels/problem-6.webp', width: 604, height: 424, alt: 'Every new hotel, more chaos' },
      ],
    ],

    process: [
      'Discovery & workflow mapping',
      'Information architecture',
      'UX & interface design',
      'Development & integrations',
      'Testing & launch',
      'Training & support',
    ],

    products: [
      {
        kind: 'website',
        name: 'Guest Booking Website',
        summary:
          'Guests discover and book stays across every Quick Hotels city, on a fast, mobile-first site.',
        features: [
          'Search stays in every city',
          'GST-inclusive pricing',
          'Pay 30% now, the rest at check-in',
          'Secure Razorpay checkout',
        ],
        // Top row of the T5 bento ("Quick hotels sec 3"); boxes measured by hand.
        // The "Every city, one search" note sat in the gutter, so it was erased.
        cards: [
          [
            {
              src: '/work/quick-hotels/crm-card-search.webp',
              width: 632,
              height: 474,
              alt: 'Search every city: guests find and book stays across India',
            },
            {
              src: '/work/quick-hotels/crm-card-pricing.webp',
              width: 632,
              height: 474,
              alt: 'GST-inclusive pricing: the price a guest sees is the price they pay',
            },
            {
              src: '/work/quick-hotels/crm-card-payments.webp',
              width: 632,
              height: 474,
              alt: 'Pay 30% now: confirm with a part payment, settle the rest at check-in',
            },
          ],
        ],
        gallery: [],
      },
      {
        kind: 'crm',
        name: 'Property Management System',
        summary:
          'The team runs rooms, bookings, payments and inventory on the same backend as the website.',
        features: [
          'Bookings & live availability',
          'Payments & balances per booking',
          'Inventory & pricing per property',
          'Role-based staff access',
        ],
        // Bottom row of the same bento.
        cards: [
          [
            {
              src: '/work/quick-hotels/crm-card-availability.webp',
              width: 470,
              height: 392,
              alt: 'Bookings & availability',
            },
            {
              src: '/work/quick-hotels/crm-card-dues.webp',
              width: 470,
              height: 392,
              alt: 'Payments & dues',
            },
            {
              src: '/work/quick-hotels/crm-card-inventory.webp',
              width: 470,
              height: 392,
              alt: 'Inventory & pricing',
            },
            {
              src: '/work/quick-hotels/crm-card-roles.webp',
              width: 470,
              height: 392,
              alt: 'Users & roles',
            },
          ],
        ],
        gallery: [],
      },
    ],

    // The T6 sheet ("Quick hotels sec 4", the owner's chat attachment),
    // flattened at 250 so the Canvas and tile swatches don't turn white.
    systemImage: {
      src: '/work/quick-hotels/design-system.webp',
      width: 1774,
      height: 887,
      alt: 'Quick Hotels design system: colours, typography and components for the website and PMS',
    },
    // Read from quickhotels.co (computed styles): the gold "Perfect", the
    // Search button gradient, the footer navy and the body text.
    palette: [
      { name: 'Gold', hex: '#D4A853' },
      { name: 'Royal Blue', hex: '#1A5FAC' },
      { name: 'Deep Navy', hex: '#0F2645' },
      { name: 'Night Navy', hex: '#0A1B33' },
      { name: 'Ink', hex: '#111827' },
    ],
    type: [
      {
        family: 'Playfair Display',
        role: 'Headings',
        weights: 'Bold · Bold Italic',
        google: 'Playfair+Display:ital,wght@0,700;1,700',
      },
      {
        family: 'Nunito',
        role: 'Interface & body',
        weights: 'Bold · SemiBold · Regular',
        google: 'Nunito:wght@400;600;700',
      },
    ],

    ctaLead: 'Running bookings and rooms in two systems?',
    // Real facts only: 12 active hotels (the PMS dashboard), "1000+ happy
    // guests" (quickhotels.co's own claim), five cities on the site, and
    // GST-inclusive pricing (the brief). The hero image's revenue and
    // occupancy figures are demo values, so they are not repeated here.
    impact: [
      { label: 'Hotels', value: '12', caption: 'hotels run from one PMS' },
      { label: 'Guests', value: '1000+', caption: 'happy guests booked online' },
      { label: 'Cities', value: '5+', caption: 'cities on one booking site' },
      { label: 'Pricing', value: '100%', caption: 'of prices shown GST-inclusive' },
    ],
  },

  {
    slug: 'ecommerce-retail-platform',
    client: 'Quick Hotels',
    logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
    focus: ['Hotel Management Software'],
    headline: { lead: 'One dashboard to run', word: 'EVERY HOTEL.' },
    hero: {
      // Same PMS-dashboard hero as /work/quick-hotels: it shows this product.
      src: '/work/quick-hotels/hero.webp',
      width: 1672,
      height: 941,
      alt: 'Quick Hotels PMS dashboard with monthly bookings, occupancy by city, today’s check-ins and hotel payouts around it',
    },

    brief:
      'Quick Hotels lists **many hotels across India** and earns a commission on each booking. The brief was **one system to run every property**: hotels and rooms, bookings and check-ins, services, invoices and finance, leads, staff roles and **payouts to hotels**, with a live dashboard across all of them.',
    facts: [
      { label: 'Industry', value: 'Hospitality' },
      { label: 'Delivered', value: 'Hotel Management Software' },
      { label: 'Services', value: 'Product Design · Custom Software Development' },
    ],

    problem:
      'Every property has its own rooms, bookings, check-ins and **dues to collect before guests leave**. On top of that, the platform has to track its own **commission and GST** and release the **right payout to each hotel**. All of it had to come out of one set of numbers.',
    // The same six problem cards as /work/quick-hotels.
    problemCards: [
      [
        { src: '/work/quick-hotels/problem-1.webp', width: 604, height: 456, alt: 'Bookings in two places' },
        { src: '/work/quick-hotels/problem-2.webp', width: 604, height: 456, alt: 'Availability never matched' },
        { src: '/work/quick-hotels/problem-3.webp', width: 604, height: 456, alt: 'Surprise tax at checkout' },
      ],
      [
        { src: '/work/quick-hotels/problem-4.webp', width: 604, height: 424, alt: 'Dues chased at the door' },
        { src: '/work/quick-hotels/problem-5.webp', width: 604, height: 424, alt: 'Payouts worked out by hand' },
        { src: '/work/quick-hotels/problem-6.webp', width: 604, height: 424, alt: 'Every new hotel, more chaos' },
      ],
    ],

    process: [
      'Discovery & workflow mapping',
      'Information architecture',
      'UX & interface design',
      'Development & integrations',
      'Testing with the operations team',
      'Launch, training & support',
    ],

    products: [
      {
        kind: 'crm',
        name: 'Hotel Management System',
        summary:
          'One dashboard for every property: bookings, check-ins, rooms and dues, plus the platform’s commission, GST and hotel payouts.',
        // The product's own sidebar and dashboard modules.
        features: [
          'Live dashboard across hotels',
          'Hotels & rooms',
          'Bookings',
          'Check-in / check-out',
          'Room inventory',
          'Services',
          'Invoices & finance',
          'Commission & GST analytics',
          'Hotel payouts',
          'Leads',
          'Users & roles',
        ],
        // The PMS row of the Quick Hotels feature bento.
        cards: [
          [
            {
              src: '/work/quick-hotels/crm-card-availability.webp',
              width: 470,
              height: 392,
              alt: 'Bookings & availability',
            },
            { src: '/work/quick-hotels/crm-card-dues.webp', width: 470, height: 392, alt: 'Payments & dues' },
            {
              src: '/work/quick-hotels/crm-card-inventory.webp',
              width: 470,
              height: 392,
              alt: 'Inventory & pricing',
            },
            { src: '/work/quick-hotels/crm-card-roles.webp', width: 470, height: 392, alt: 'Users & roles' },
          ],
        ],
        gallery: [],
      },
    ],

    systemImage: {
      src: '/work/quick-hotels/design-system.webp',
      width: 1774,
      height: 887,
      alt: 'Quick Hotels design system: colours, typography and components for the website and PMS',
    },
    // Sampled from the product's dashboard (sidebar, active item, primary
    // button, page, headings); the button blue matches quickhotels.co.
    palette: [
      { name: 'Sidebar Navy', hex: '#0E1A33' },
      { name: 'Active Blue', hex: '#3175F1' },
      { name: 'Brand Blue', hex: '#1A5FAC' },
      { name: 'Canvas', hex: '#F7F8FA' },
      { name: 'Ink', hex: '#1D2436' },
    ],
    type: [],

    ctaLead: 'Running more than one hotel?',
    // Real facts only (see /work/quick-hotels): 12 hotels in the PMS, the
    // site's own 1000+ guests, five cities, GST-inclusive pricing.
    impact: [
      { label: 'Hotels', value: '12', caption: 'hotels run from one PMS' },
      { label: 'Guests', value: '1000+', caption: 'happy guests booked online' },
      { label: 'Cities', value: '5+', caption: 'cities on one booking site' },
      { label: 'Pricing', value: '100%', caption: 'of prices shown GST-inclusive' },
    ],
  },

  {
    slug: 'spectrum-tour-travels',
    matchSlugs: ['ai-workflow-system'],
    client: 'Spectrum Tour & Travels',
    logo: { src: '/work/spectrum-tour-travels-logo.webp', width: 277, height: 160 },
    focus: ['Travel CRM'],
    headline: { lead: 'One CRM for a', word: 'TRAVEL AGENCY.' },
    hero: {
      src: '/work/spectrum/hero.webp',
      width: 1672,
      height: 941,
      alt: 'Spectrum CRM dashboard with monthly revenue, leads by source, upcoming tours and a WhatsApp quotation around it',
    },

    brief:
      'Spectrum Tour & Travels sells **domestic and international tour packages**. The brief was a **CRM built for a travel agency**: leads, **tour packages and quotations**, bookings and invoices, an **IVR system** for calls, and the tools to run their **website** (bookings, packages, promo codes, reviews, blog and landing pages) from the same place.',
    facts: [
      { label: 'Industry', value: 'Travel & Tourism' },
      { label: 'Delivered', value: 'Travel CRM' },
      { label: 'Services', value: 'Product Design · Custom Software Development' },
    ],
    links: [{ label: 'spectrumtourtravels.com', href: 'https://spectrumtourtravels.com/' }],

    problem:
      'A travel agency juggles **enquiries, itineraries and quotes**, then bookings, invoices and **customer payments that arrive over weeks**. Calls, the website and the office all had to land in **one system**, so nobody quotes a trip twice or misses a payment.',
    // Cut from the T4 bento ("Spectrum Sec- 2.png"). Same width both rows so
    // the columns line up; the top row's cards are taller, so its own height.
    problemCards: [
      [
        { src: '/work/spectrum/problem-1.webp', width: 596, height: 494, alt: 'Enquiries everywhere' },
        { src: '/work/spectrum/problem-2.webp', width: 596, height: 494, alt: 'Itineraries built by hand' },
        { src: '/work/spectrum/problem-3.webp', width: 596, height: 494, alt: 'Quotes lost in follow-up' },
      ],
      [
        { src: '/work/spectrum/problem-4.webp', width: 596, height: 420, alt: 'Payments chased by memory' },
        { src: '/work/spectrum/problem-5.webp', width: 596, height: 420, alt: 'Vendors and cash on paper' },
        { src: '/work/spectrum/problem-6.webp', width: 596, height: 420, alt: 'Staff tasks on WhatsApp' },
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
        name: 'Travel CRM',
        summary:
          'From enquiry to booked trip in one system, with the agency’s website run from the same dashboard.',
        // The product's own sidebar.
        features: [
          'Lead management',
          'Tour package builder',
          'Quotation management',
          'Booking management',
          'Invoice generator',
          'IVR system',
          'Website bookings',
          'Showcase packages',
          'Promo codes',
          'Reviews',
          'Blog & landing pages',
          'Website builder',
          'Attendance & tasks',
          'Vendors & petty cash',
          'Accounts & salaries',
        ],
        // Cut from the T5 bento ("Spectrum sec 3.png"). Card B's and F's left
        // borders were too faint for the finder, so the boxes were measured by
        // hand. Top row 596×470, bottom row 466×425.
        cards: [
          [
            {
              src: '/work/spectrum/crm-card-packages.webp',
              width: 596,
              height: 470,
              alt: 'Tour package builder: a day-wise itinerary priced as you build it',
            },
            {
              src: '/work/spectrum/crm-card-leads.webp',
              width: 596,
              height: 470,
              alt: 'Leads & IVR: every call and web enquiry lands as a lead',
            },
            {
              src: '/work/spectrum/crm-card-quotations.webp',
              width: 596,
              height: 470,
              alt: 'Quotations & bookings: from quote to confirmed trip',
            },
          ],
          [
            {
              src: '/work/spectrum/crm-card-invoices.webp',
              width: 466,
              height: 425,
              alt: 'Invoices & payments',
            },
            {
              src: '/work/spectrum/crm-card-website.webp',
              width: 466,
              height: 425,
              alt: 'Website manager',
            },
            {
              src: '/work/spectrum/crm-card-vendors.webp',
              width: 466,
              height: 425,
              alt: 'Vendors & accounts',
            },
            {
              src: '/work/spectrum/crm-card-workforce.webp',
              width: 466,
              height: 425,
              alt: 'Workforce',
            },
          ],
        ],
        gallery: [],
      },
    ],

    // The T6 sheet ("Spectrum sec 4.png"), flattened at 250 so the Canvas and
    // Cream swatches don't turn white. Its swatches match their hex labels.
    systemImage: {
      src: '/work/spectrum/design-system.webp',
      width: 1774,
      height: 887,
      alt: 'Spectrum CRM design system: colours, typography and components',
    },
    // Read from spectrumtourtravels.com (computed styles, 2026-09-30): the
    // yellow CTA, its darker gold, the navy hero/footer; plus two of the CRM's
    // stat colours sampled from its dashboard. Fonts are the website's.
    palette: [
      { name: 'Sunshine Yellow', hex: '#FEBD09' },
      { name: 'Deep Gold', hex: '#DFA300' },
      { name: 'Night Navy', hex: '#0B1F33' },
      { name: 'Leads Blue', hex: '#1E40AF' },
      { name: 'Revenue Green', hex: '#066251' },
    ],
    type: [
      {
        family: 'Unbounded',
        role: 'Headings',
        weights: 'Bold · SemiBold',
        google: 'Unbounded:wght@600;700',
      },
      {
        family: 'Manrope',
        role: 'Interface & body',
        weights: 'SemiBold · Medium · Regular',
        google: 'Manrope:wght@400;500;600',
      },
    ],

    ctaLead: 'Running a travel business on spreadsheets?',
    // The live dashboard's own figures (Sept 2026), the same ones in the hero
    // image. Swap in before/after gains once the client confirms some; never
    // invent them.
    impact: [
      // +34.8% on the dashboard, rounded so it fits the card.
      { label: 'Leads', value: '+35%', caption: 'more leads this month' },
      { label: 'Revenue', value: '₹4.1L', caption: 'revenue tracked this month' },
      { label: 'Tours', value: '29', caption: 'trips in the next 30 days' },
      { label: 'Payments', value: '47', caption: 'payments tracked to the rupee' },
    ],
  },

  {
    slug: 'herbal-vantage',
    client: 'Herbal Vantage',
    logo: { src: '/work/herbal-vantage-logo.webp', width: 671, height: 160 },
    focus: ['MLM Software', 'E-commerce Website'],
    headline: { lead: 'An MLM system and a store for', word: 'HERBAL WELLNESS.' },
    hero: {
      src: '/work/herbal-vantage/hero.webp',
      width: 1672,
      height: 941,
      alt: 'Herbal Vantage MLM dashboard with monthly sales, new members, recent payouts and KYC approvals around it',
    },

    brief:
      'Herbal Vantage sells **Ayurvedic healthcare products** through a **network of members** and an **online store**. The brief was both halves: an **MLM system** to run members, packages, E-Pins, KYC, wallets and **payouts**, and a premium storefront that feels as trustworthy as the products.',
    facts: [
      { label: 'Industry', value: 'Herbal & Wellness' },
      { label: 'Delivered', value: 'MLM Software · E-commerce Website' },
      { label: 'Services', value: 'Product Design · Web Dev · Custom Software' },
      { label: 'Store stack', value: 'Next.js · Tailwind · Vercel' },
    ],
    links: [{ label: 'The online store', href: 'https://herbal-vantage-website.vercel.app/' }],

    problem:
      'A direct-selling business runs on trust and exact numbers: every member’s **PV, level and payout** has to be right, and **KYC and fund requests** need approving before money moves. Customers, meanwhile, judge the brand by how **premium and trustworthy** the store feels.',
    // Cut from the T4 bento ("Herbal Sec 2.png"); cards 02, 04 and 05 were
    // measured by hand. Same width both rows, each row its own height.
    problemCards: [
      [
        { src: '/work/herbal-vantage/problem-1.webp', width: 600, height: 456, alt: 'A network on spreadsheets' },
        { src: '/work/herbal-vantage/problem-2.webp', width: 600, height: 456, alt: 'Payouts worked out by hand' },
        { src: '/work/herbal-vantage/problem-3.webp', width: 600, height: 456, alt: 'KYC on WhatsApp' },
      ],
      [
        { src: '/work/herbal-vantage/problem-4.webp', width: 600, height: 424, alt: 'Fund requests in a register' },
        { src: '/work/herbal-vantage/problem-5.webp', width: 600, height: 424, alt: 'Wallet balances disputed' },
        { src: '/work/herbal-vantage/problem-6.webp', width: 600, height: 424, alt: 'Orders never reached PV' },
      ],
    ],

    process: [
      'Discovery & workflow mapping',
      'Information architecture',
      'UX & interface design',
      'Development & integrations',
      'Testing & launch',
      'Training & support',
    ],

    products: [
      {
        kind: 'crm',
        name: 'MLM Software',
        summary:
          'The admin system for the member network: packages, E-Pins, KYC, wallets, PV reports and payouts in one place.',
        // The admin panel's own sidebar.
        features: [
          'Member management',
          'Package management',
          'E-Pin management',
          'KYC management',
          'Fund requests',
          'Wallet management',
          'Payout management',
          'PV & sales reports',
          'Order management',
          'Product management',
          'Payment channels',
          'Sub-admin management',
        ],
        // Cut from the T5 bento ("Herbal Sec 3.png"). Cards A, B and E had
        // borders too faint for the finder, so they were measured by hand.
        // Top row 620×464, bottom row 470×420.
        cards: [
          [
            {
              src: '/work/herbal-vantage/crm-card-network.webp',
              width: 620,
              height: 464,
              alt: 'Member network: every member’s downline, level and sponsor in one tree',
            },
            {
              src: '/work/herbal-vantage/crm-card-payouts.webp',
              width: 620,
              height: 464,
              alt: 'PV & payouts: level-wise PV and commissions, calculated automatically',
            },
            {
              src: '/work/herbal-vantage/crm-card-kyc.webp',
              width: 620,
              height: 464,
              alt: 'KYC & fund requests: approve documents and top-ups before money moves',
            },
          ],
          [
            {
              src: '/work/herbal-vantage/crm-card-packages.webp',
              width: 470,
              height: 420,
              alt: 'Packages & E-Pins',
            },
            {
              src: '/work/herbal-vantage/crm-card-wallets.webp',
              width: 470,
              height: 420,
              alt: 'Wallets',
            },
            {
              src: '/work/herbal-vantage/crm-card-reports.webp',
              width: 470,
              height: 420,
              alt: 'PV & sales reports',
            },
            {
              src: '/work/herbal-vantage/crm-card-orders.webp',
              width: 470,
              height: 420,
              alt: 'Orders & products',
            },
          ],
        ],
        gallery: [],
      },
      {
        kind: 'website',
        name: 'Online Store',
        summary:
          'An editorial Ayurvedic storefront with a fast, low-friction path from browsing to checkout.',
        features: [
          'Editorial product showcase',
          'Shop by health goal',
          'Mobile-first browsing',
          'Trust-building product pages',
          'Low-friction checkout',
        ],
        gallery: [],
      },
    ],

    // The T6 sheet ("Herbal Sec 4.png"), flattened at 250 so the Cream, Mint
    // Tint and Canvas swatches don't turn white. Its swatches match their labels.
    systemImage: {
      src: '/work/herbal-vantage/design-system.webp',
      width: 1774,
      height: 887,
      alt: 'Herbal Vantage design system: colours, typography and components',
    },
    // Read from the store (computed styles): body ink, heading green,
    // "Add to Cart" green, the gold accent and the cream section background.
    palette: [
      { name: 'Forest Ink', hex: '#0F2D18' },
      { name: 'Herbal Green', hex: '#1A6B2F' },
      { name: 'Leaf', hex: '#1B8A4D' },
      { name: 'Ayurveda Gold', hex: '#C9A020' },
      { name: 'Cream', hex: '#F7F5F0' },
    ],
    type: [
      {
        family: 'Playfair Display',
        role: 'Headings',
        weights: 'Bold',
        google: 'Playfair+Display:wght@700',
      },
      {
        family: 'DM Sans',
        role: 'Interface & body',
        weights: 'SemiBold · Medium · Regular',
        google: 'DM+Sans:wght@400;500;600',
      },
    ],

    ctaLead: 'Running a direct-selling business on spreadsheets?',
    // The live dashboard's own figures (30 Sept 2026), the same ones in the
    // hero image: 69 members, 60 active (87%), total PV 45,58,200, total
    // sales ₹48,61,258. Scale, not before/after; never invent gains.
    impact: [
      { label: 'Members', value: '69', caption: 'members in one network' },
      { label: 'Active', value: '87%', caption: 'of members active' },
      { label: 'PV', value: '45.6L', caption: 'PV tracked level by level' },
      { label: 'Sales', value: '₹48.6L', caption: 'sales tracked in one place' },
    ],
  },

  // ── UnSkills: the institute website (website layout) ──────────────────────
  // Everything below is read off the live site (2026-10-01): the menus, the
  // course counts, the centres, the Google rating. Images: playbook §11.
  // Everything below is read off the live site (2026-10-01): the menus, the
  // course counts, the centres, the Google rating. Page images are raw stills
  // in a browser frame until the generated page images arrive (playbook §6 W*).
  {
    slug: 'unskills-education-website',
    client: 'UnSkills Computer Education',
    logo: { src: '/work/unskills-logo.webp', width: 356, height: 160 },
    focus: ['Institute Website', 'Online Admissions', 'Certificate Verification'],
    headline: { lead: 'The online home of a', word: '102-CENTRE NETWORK.' },
    hero: {
      src: `${UW}/hero.webp`,
      width: 1672,
      height: 941,
      alt: 'The UnSkills website on desktop and mobile, with course search, verification and Google reviews',
    },

    brief:
      'UnSkills Computer Education teaches computer, NIELIT, university, typing and beautician courses from Mariahu, Jaunpur, with **102 authorised centres** across Uttar Pradesh and beyond. The brief was a website that does the institute’s front-desk work in public: a **searchable catalogue of 158 courses**, **online admission**, and **instant verification** of any student, certificate or marksheet, connected to the UnSkills CRM.',
    facts: [
      { label: 'Industry', value: 'Education' },
      { label: 'Delivered', value: 'Institute website + Student Zone' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'React · Vite · Supabase · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: the owner doesn't want the live site linked from the page.
      label: 'unskillseducation.org',
      sitemapNote: 'The menu as built: 6 menus, so every course, form and check is two clicks from the homepage.',
      goals: [
        {
          title: 'Make 158 courses easy to find',
          text: 'Nine categories, one search by name, code or keyword, and a details page for every course.',
        },
        {
          title: 'Turn a visit into an admission',
          text: 'Enroll Now on every course, an online application, and call and WhatsApp buttons on every page.',
        },
        {
          title: 'Prove every certificate is real',
          text: 'Anyone can check a registration, certificate or marksheet by its number, in seconds.',
        },
        {
          title: 'Grow the franchise network',
          text: 'The franchise process, the requirements and every authorised centre, in one place.',
        },
      ],
      sitemap: [
        { group: 'Home', pages: ['Courses', 'Franchise partners', 'Faculty', 'Placed students', 'Google reviews', 'FAQ'] },
        { group: 'Courses', pages: ['Computer Software', 'Hardware & Networking', 'Skills Development', 'NIELIT Govt.', 'University', 'Beautician', 'Typing', 'Internship & Summer Training', 'Professional'] },
        { group: 'Student Zone', pages: ['Apply Online', 'Online Exam Form', 'Download Admit Card', 'Download Forms', 'Student Login'] },
        { group: 'Verification', pages: ['Student', 'Certificate', 'Marksheet', 'Employer'] },
        { group: 'Franchise', pages: ['Franchisee process', 'Requirements', 'Authorised centres'] },
        { group: 'More', pages: ['About Us', 'Gallery', 'Online Courses', 'Internships', 'Careers', 'Blog', 'Contact'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Every course, form and verification mapped into one menu.' },
        { title: 'Wireframes', text: 'One template per page type: listing, course, form, lookup.' },
        { title: 'Visual design', text: 'The UnSkills red, gold and Outfit type, on a calm white canvas.' },
        { title: 'Build & connect', text: 'React on Vercel, with courses and students from the CRM’s data.' },
        { title: 'SEO & launch', text: 'A title, description and sitemap entry for every page.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Admissions banners up top, then everything a parent checks before calling: government registrations, popular courses, faculty, placed students and Google reviews.',
          features: ['Admission banners', 'Govt. registrations', 'Popular courses', 'Google reviews', 'FAQ'],
          image: {
            src: `${UW}/page-home.webp`,
            width: 1774,
            height: 887,
            alt: 'The UnSkills homepage: admissions banner, government registrations and Google reviews',
          },
        },
        {
          name: 'Courses',
          path: '/courses',
          summary:
            '158 courses across 9 categories, searchable by name, code or keyword, each with its duration, eligibility and an Enroll Now button.',
          features: ['Search', 'Category filters', 'Course codes', 'Duration & eligibility', 'Enroll Now'],
          image: {
            src: `${UW}/page-courses.webp`,
            width: 1774,
            height: 887,
            alt: 'The UnSkills course catalogue: search, 9 categories and course cards',
          },
        },
        {
          name: 'Verification',
          path: '/student/verify',
          summary:
            'Students, parents and employers look up a registration number and confirm the enrolment, behind a security check. Certificates, marksheets and employer checks have their own pages.',
          features: ['Student lookup', 'Certificate check', 'Marksheet check', 'Employer check', 'Security code'],
          image: {
            src: `${UW}/page-verify.webp`,
            width: 1774,
            height: 887,
            alt: 'UnSkills student verification: registration number, security check and four ways to verify',
          },
        },
        {
          name: 'Franchise',
          path: '/franchise',
          summary:
            'How to become an authorised UnSkills centre: four steps, the eligibility requirements, and the agreement form to download.',
          features: ['4-step process', 'Requirements', 'Agreement download', 'Authorised centres'],
          image: {
            src: `${UW}/page-franchise.webp`,
            width: 1774,
            height: 887,
            alt: 'The UnSkills franchise page: four steps, requirements and authorised centres',
          },
        },
      ],
      screens: [
        { src: `${UW}/home-mobile.webp`, width: 585, height: 1266, alt: 'UnSkills homepage on a phone' },
        { src: `${UW}/courses-mobile.webp`, width: 585, height: 1266, alt: 'Course catalogue on a phone' },
        { src: `${UW}/verify-mobile.webp`, width: 585, height: 1266, alt: 'Student verification on a phone' },
        { src: `${UW}/franchise-mobile.webp`, width: 585, height: 1266, alt: 'Franchise page on a phone' },
      ],
      builtIn: [
        { icon: 'search', title: 'Course search', text: 'Search 158 courses by name, code or keyword, or filter by category.' },
        { icon: 'form', title: 'Online admission', text: 'Apply Online, the exam form and admit cards, without visiting the centre.' },
        { icon: 'shield', title: 'Four verifications', text: 'Student, certificate, marksheet and employer checks, behind a security code.' },
        { icon: 'star', title: 'Google reviews', text: 'The 4.8 rating and real student reviews, straight from Google.' },
        { icon: 'chat', title: 'Call & WhatsApp', text: 'Enquiry, call and WhatsApp buttons that follow you down every page.' },
        { icon: 'map', title: 'Centre network', text: 'Every authorised centre with its city and centre code.' },
        { icon: 'login', title: 'Student login', text: 'One click from the site into the student portal on the UnSkills CRM.' },
        { icon: 'seo', title: 'Local SEO', text: 'Page titles and descriptions written for courses in Jaunpur and UP.' },
      ],
      todayNote: 'The numbers on unskillseducation.org today.',
    },

    palette: [
      { name: 'UnSkills Red', hex: '#B91C1C' },
      { name: 'Maroon', hex: '#7F1D1D' },
      { name: 'Gold', hex: '#FACC15' },
      { name: 'Ink', hex: '#0A0A0A' },
      { name: 'Canvas', hex: '#F8FAFC' },
    ],
    systemImage: {
      src: `${UW}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'UnSkills website design system: colours, Outfit and Inter type, and core components',
    },
    type: [
      { family: 'Outfit', role: 'Headings', weights: 'SemiBold · Bold · ExtraBold', google: 'Outfit:wght@600;700;800' },
      { family: 'Inter', role: 'Body & interface', weights: 'Regular · Medium · SemiBold' },
    ],

    impact: [
      { label: 'Courses', value: '158', caption: 'listed across 9 categories' },
      { label: 'Centres', value: '102', caption: 'authorised UnSkills centres' },
      { label: 'Google rating', value: '4.8', caption: 'from 124 Google reviews' },
      { label: 'Students', value: '2,000+', caption: 'enrolled, as the institute reports' },
    ],
    ctaLead: 'Need a website that brings in admissions?',
  },

  // ── Herbal Vantage: the online store (website layout) ─────────────────────
  // Read off the live store (2026-10-01): menu, 26 products in 8 categories,
  // prices and PV, the six documents on /legal. Products, logins and orders
  // come from the Herbal Vantage CRM's API (the MLM software, slug
  // 'herbal-vantage'). Images: playbook §11.
  {
    slug: 'herbal-vantage-website',
    client: 'Herbal Vantage Private Limited',
    logo: { src: '/work/herbal-vantage-logo.webp', width: 671, height: 160 },
    focus: ['Ayurvedic Online Store', 'Distributor Price & PV', 'Legal & Trust Pages'],
    headline: { lead: 'A storefront where every order earns', word: 'PV POINTS.' },
    hero: {
      src: `${HW}/hero.webp`,
      width: 1672,
      height: 941,
      alt: 'The Herbal Vantage store on desktop and mobile, with category filters, distributor price and PV points',
    },

    brief:
      'Herbal Vantage Private Limited makes 100% Ayurvedic healthcare products and sells them to families and through a **direct-selling network** of distributors. The brief was one store for both: a **catalogue of 26 products** with online payment or cash on delivery, the **distributor price and PV on every product**, credited to the distributor’s portal in the Herbal Vantage CRM, and the company’s **registrations and certificates** on show for first-time buyers.',
    facts: [
      { label: 'Industry', value: 'Ayurveda & Wellness' },
      { label: 'Delivered', value: 'Online store + Legal & trust pages' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'React · Vite · Tailwind CSS · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'herbal-vantage-website.vercel.app',
      sitemapNote: 'The menu as built: 5 menus and the policies, so every product, policy and certificate is two clicks from the homepage.',
      goals: [
        {
          title: 'Sell 26 products online',
          text: 'Eight categories, a page for every product, and a cart that takes online payment or cash on delivery.',
        },
        {
          title: 'Reward distributors on every order',
          text: 'The distributor price and the PV each product earns, credited to the distributor’s portal after login.',
        },
        {
          title: 'Prove the company is genuine',
          text: 'Incorporation, ISO, Startup India, GST, TAN and PAN documents, and the nodal and grievance officers.',
        },
        {
          title: 'Make ordering easy',
          text: 'Free delivery over ₹4,999, shop by health goal, and WhatsApp on every page.',
        },
      ],
      sitemap: [
        { group: 'Home', pages: ['Best-sellers', 'Shop by health goal', 'Our promise', 'Customer reviews', 'Cart & checkout'] },
        { group: 'Products', pages: ['Oral Care', 'Immunity', 'Wellness', 'Women’s Health', 'Kids Health', 'Hair Care', 'Body Care', 'Skin Care'] },
        { group: 'About Us', pages: ['Our story', 'Director’s Message', 'Legal Certifications'] },
        { group: 'Gallery', pages: ['Founder’s Gallery'] },
        { group: 'Contact', pages: ['Customer care', 'Nodal & grievance officers', 'Send us a message'] },
        { group: 'Policies', pages: ['Shipping', 'Return, Refund & Exchange', 'Cancellation', 'Privacy', 'Terms of Use', 'Direct Seller Contract', 'Direct Selling Rules'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Every product, policy and legal document mapped into one menu.' },
        { title: 'Wireframes', text: 'One template per page type: catalogue, product, cart, checkout, document.' },
        { title: 'Visual design', text: 'The Herbal Vantage greens and gold, with Playfair Display headings, on a warm cream canvas.' },
        { title: 'Build & connect', text: 'React on Vercel, with products, logins and orders from the Herbal Vantage CRM.' },
        { title: 'SEO & launch', text: 'A title and description for every page and every product.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Ayurvedic Wellness banners, a trust strip (10K+ families, ISO, GMP, free delivery over ₹4,999), best-sellers with their price and PV, shop by health goal, and Google reviews.',
          features: ['Hero banners', 'Trust strip', 'Best-sellers', 'Shop by health goal', 'Reviews'],
          image: {
            src: `${HW}/page-home.webp`,
            width: 1774,
            height: 887,
            alt: 'The Herbal Vantage homepage: trust strip, shop by health goal and the promise in numbers',
          },
        },
        {
          name: 'Products',
          path: '/products',
          summary:
            'All 26 products in one catalogue, filtered by 8 categories. Every card shows the offer, the PV it earns, the price against MRP and Add to Cart.',
          features: ['Category filters', 'Offer badges', 'PV points', 'Price vs MRP', 'Add to Cart'],
          image: {
            src: `${HW}/page-products.webp`,
            width: 1774,
            height: 887,
            alt: 'The Herbal Vantage catalogue: 8 categories, product cards with PV and free delivery over ₹4,999',
          },
        },
        {
          name: 'Product page',
          path: '/product/vantage-superdento-cream',
          summary:
            'The distributor price, the saving against MRP and the PV the order earns, then the certifications and tabs for benefits, how to use, ingredients and details.',
          features: ['Distributor price', 'PV earned', 'Quantity & cart', 'Certifications', 'Benefits & ingredients'],
          image: {
            src: `${HW}/page-product.webp`,
            width: 1774,
            height: 887,
            alt: 'A Herbal Vantage product page: distributor price, PV credited to the portal and certifications',
          },
        },
        {
          name: 'Legal & Certifications',
          path: '/legal',
          summary:
            'Six government and quality documents, each viewable full size, then the company’s CIN and its nodal and grievance officers, as the e-commerce rules require.',
          features: ['Incorporation', 'ISO 9001:2015', 'Startup India', 'GST · TAN · PAN', 'Grievance officer'],
          image: {
            src: `${HW}/page-legal.webp`,
            width: 1774,
            height: 887,
            alt: 'Herbal Vantage legal page: six documents, full-size view and the grievance officer',
          },
        },
      ],
      screens: [
        { src: `${HW}/home-mobile.webp`, width: 585, height: 1266, alt: 'Herbal Vantage homepage on a phone' },
        { src: `${HW}/products-mobile.webp`, width: 585, height: 1266, alt: 'Product catalogue on a phone' },
        { src: `${HW}/product-mobile.webp`, width: 585, height: 1266, alt: 'A product page on a phone' },
        { src: `${HW}/legal-mobile.webp`, width: 585, height: 1266, alt: 'Legal & Certifications on a phone' },
      ],
      builtIn: [
        { icon: 'cart', title: 'Cart & checkout', text: 'Pay online or cash on delivery, with free delivery over ₹4,999.' },
        { icon: 'ticket', title: 'Distributor price', text: 'The DP, the MRP and the saving, on every product.' },
        { icon: 'star', title: 'PV on every order', text: 'Each product shows the PV it earns; logged-in distributors get it in their portal.' },
        { icon: 'login', title: 'One login', text: 'The same login as the Herbal Vantage CRM, so orders reach the right distributor.' },
        { icon: 'shield', title: 'Legal documents', text: 'Six registrations and certificates, each viewable full size.' },
        { icon: 'search', title: 'Find any product', text: 'A search in the header and 8 category filters on the catalogue.' },
        { icon: 'chat', title: 'WhatsApp', text: 'A WhatsApp button on every page, and a contact form.' },
        { icon: 'seo', title: 'Product SEO', text: 'Every product page has its own title and description.' },
      ],
      todayNote: 'The numbers on the Herbal Vantage store today.',
    },

    palette: [
      { name: 'Deep Green', hex: '#1A6B2F' },
      { name: 'Forest', hex: '#0F2D18' },
      { name: 'Lime', hex: '#7DC832' },
      { name: 'Gold', hex: '#C9A020' },
      { name: 'Cream', hex: '#FAF3DC' },
    ],
    systemImage: {
      src: `${HW}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'Herbal Vantage store design system: greens and gold, Playfair Display and DM Sans, and core components',
    },
    type: [
      { family: 'Playfair Display', role: 'Headings', weights: 'Bold', google: 'Playfair+Display:wght@700' },
      { family: 'DM Sans', role: 'Body & interface', weights: 'Regular · Medium · Bold' },
    ],

    impact: [
      { label: 'Products', value: '26', caption: 'on sale, in 8 categories' },
      { label: 'Documents', value: '6', caption: 'registrations and certificates online' },
      { label: 'Google rating', value: '4.8', caption: 'from 500+ reviews, as the company reports' },
      { label: 'Families', value: '10K+', caption: 'served, as the company reports' },
    ],
    ctaLead: 'Need a store that pays your distributors too?',
  },

  // ── Spectrum Tour & Travels: the tour booking website (website layout) ───
  // Read off spectrumtourtravels.com (2026-10-02): menu and footer, the 10
  // upcoming departures, the trip page, the 5-step planner. Next.js on
  // Vercel with Supabase. The travel CRM has its own page (slug
  // 'spectrum-tour-travels'). Images: playbook §11.
  {
    slug: 'spectrum-tour-travels-website',
    client: 'Spectrum Tour-Travels',
    logo: { src: '/work/spectrum-tour-travels-logo.webp', width: 277, height: 160 },
    focus: ['Tour Booking Website', 'Live Departures & Seats', 'Custom Trip Planner'],
    headline: { lead: 'Group tours that show', word: 'REAL SEATS.' },
    hero: {
      src: `${SW}/hero.webp`,
      width: 1672,
      height: 941,
      alt: 'The Spectrum Tour-Travels website on desktop and mobile, with departures, the departure calendar and online booking',
    },

    brief:
      'Spectrum Tour-Travels runs fixed-departure group tours and tailor-made holidays across India and abroad from Arambagh, Hooghly, West Bengal. The brief was a site that sells trips the way the team does: **upcoming departures with real dates and seats**, a **page for every trip** with the day-wise plan and hotels, **online booking with Razorpay** (pay in full or 30% to hold the seats), and a **five-step planner for custom trips**, with call and WhatsApp on every page.',
    facts: [
      { label: 'Industry', value: 'Travel & Tourism' },
      { label: 'Delivered', value: 'Tour booking website' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'Next.js · Supabase · Razorpay · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'spectrumtourtravels.com',
      sitemapNote: 'The menu as built: 5 menus and a footer, so every trip, date and form is two clicks from the homepage.',
      goals: [
        {
          title: 'Show every departure',
          text: 'Ten upcoming group tours with dates, prices and seats, straight from the booking system.',
        },
        {
          title: 'Sell the trip on one page',
          text: 'Day-wise itinerary, inclusions, exclusions, hotels and dates & pricing, beside Book this trip with Razorpay.',
        },
        {
          title: 'Plan custom trips',
          text: 'A five-step form: personal details, trip details, accommodation, meal plan and purpose of tour.',
        },
        {
          title: 'Turn a visit into a call',
          text: 'Call and WhatsApp on every page, and WhatsApp Now on every tour package.',
        },
      ],
      sitemap: [
        { group: 'Group Tours', pages: ['Domestic Tours', 'International Tours'] },
        { group: 'Upcoming Departures', pages: ['Himalayan Trails', 'Beach & Islands', 'Family Holidays', 'Departure calendar'] },
        { group: 'Tour Packages', pages: ['Domestic', 'International', 'Himalayan Trails', 'Trip pages'] },
        { group: 'Customised Trips', pages: ['Personal details', 'Trip details', 'Accommodation', 'Meal plan', 'Purpose of tour'] },
        { group: 'More', pages: ['Contact Us', 'About Us', 'Reviews', 'Blog', 'My Trips'] },
        { group: 'Legal', pages: ['Terms & Conditions', 'Privacy Policy', 'Refund & Cancellation', 'Travel Agreement', 'Rules & Regulations'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Every trip, departure and policy mapped into one menu.' },
        { title: 'Wireframes', text: 'One template per page type: listing, trip, calendar, form.' },
        { title: 'Visual design', text: 'The Spectrum yellow and navy, with Unbounded headings, over full-bleed travel photos.' },
        { title: 'Build & connect', text: 'Next.js on Vercel, with trips, dates and seats from Supabase and payments by Razorpay.' },
        { title: 'SEO & launch', text: 'A title and description for every main page, and a sitemap entry for every trip.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'A full-bleed hero with Explore Upcoming Trips and Plan a Custom Journey, the community numbers, destinations, domestic and international group tours, Ladakh packages, why Spectrum and FAQs.',
          features: ['Hero & two CTAs', 'Social proof', 'Destinations', 'Group tours', 'FAQ'],
          image: {
            src: `${SW}/page-home.webp`,
            width: 1774,
            height: 887,
            alt: 'The Spectrum homepage: community numbers, destinations and why Spectrum',
          },
        },
        {
          name: 'Upcoming Departures',
          path: '/upcoming-departures',
          summary:
            'Ten fixed-date group tours, soonest first, each with its dates, price against the old price and Popular or Sold out tags, plus theme filters and a departure calendar.',
          features: ['Theme filters', 'Sort', 'Dates & prices', 'Sold-out tags', 'Departure calendar'],
          image: {
            src: `${SW}/page-departures.webp`,
            width: 1774,
            height: 887,
            alt: 'Spectrum upcoming departures: theme filters, tour cards and the departure calendar',
          },
        },
        {
          name: 'Trip page',
          path: '/trips/jannat-e-kashmir',
          summary:
            'Duration, starting price and the next departure up top, a photo gallery, then the overview, day-wise itinerary, inclusions, exclusions, hotels and dates & pricing, beside Book this trip.',
          features: ['Trip facts', 'Photo gallery', 'Day-wise itinerary', 'Hotels by category', 'Book this trip'],
          image: {
            src: `${SW}/page-trip.webp`,
            width: 1774,
            height: 887,
            alt: 'A Spectrum trip page: the trip at a glance, the day-wise itinerary and online booking',
          },
        },
        {
          name: 'Customised Trips',
          path: '/customised-trips',
          summary:
            'A five-step planner for a trip on your own dates: personal details, trip details, accommodation preferences, meal plan and the purpose of the tour.',
          features: ['5 steps', 'Trip details', 'Accommodation', 'Meal plan', 'Purpose of tour'],
          image: {
            src: `${SW}/page-custom.webp`,
            width: 1774,
            height: 887,
            alt: 'The Spectrum custom trip planner: five steps, the fields it asks for and the privacy line',
          },
        },
      ],
      screens: [
        { src: `${SW}/home-mobile.webp`, width: 585, height: 1266, alt: 'Spectrum homepage on a phone' },
        { src: `${SW}/departures-mobile.webp`, width: 585, height: 1266, alt: 'Upcoming departures on a phone' },
        { src: `${SW}/trip-mobile.webp`, width: 585, height: 1266, alt: 'A trip page with Book Now on a phone' },
        { src: `${SW}/custom-mobile.webp`, width: 585, height: 1266, alt: 'The custom trip planner on a phone' },
      ],
      builtIn: [
        { icon: 'ticket', title: 'Real dates & seats', text: 'Departures, dates and seats come straight from the booking system.' },
        { icon: 'map', title: 'Departure calendar', text: 'Every fixed departure on one calendar, by date.' },
        { icon: 'form', title: 'Custom trip planner', text: 'Five steps that capture dates, stays, meals and the purpose of the trip.' },
        { icon: 'cart', title: 'Book & pay online', text: 'Pick a date and travellers, see the total with GST, and pay in full or 30% by Razorpay.' },
        { icon: 'chat', title: 'Call & WhatsApp', text: 'On every page, and WhatsApp Now on every tour package.' },
        { icon: 'search', title: 'Filters & sort', text: 'Filter tours by theme or region, sort by price or popularity.' },
        { icon: 'login', title: 'My Trips', text: 'A sign-in for travellers to see their trips.' },
        { icon: 'seo', title: 'Travel SEO', text: 'Titles and descriptions written for group tours from West Bengal.' },
      ],
      todayNote: 'The numbers on spectrumtourtravels.com today.',
    },

    palette: [
      { name: 'Spectrum Yellow', hex: '#FEBD09' },
      { name: 'Deep Gold', hex: '#E0A800' },
      { name: 'Heading Navy', hex: '#192A3D' },
      { name: 'Ink', hex: '#0F172A' },
      { name: 'Ivory', hex: '#FDFAF3' },
    ],
    systemImage: {
      src: `${SW}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'Spectrum Tour-Travels website design system: yellow and navy, Unbounded and Manrope, and core components',
    },
    type: [
      { family: 'Unbounded', role: 'Headings', weights: 'Bold', google: 'Unbounded:wght@700' },
      { family: 'Manrope', role: 'Body & interface', weights: 'Regular · SemiBold · Bold', google: 'Manrope:wght@400;600;700' },
    ],

    impact: [
      { label: 'Departures', value: '10', caption: 'fixed-date group tours open now' },
      { label: 'Packages', value: '8', caption: 'tour packages, quoted to your dates' },
      { label: 'Google reviews', value: '200+', caption: 'on Google, as the company reports' },
      { label: 'Facebook', value: '100K+', caption: 'community, as the company reports' },
    ],
    ctaLead: 'Need a website that fills your departures?',
  },

  // ── Smart Agro: the online agri-shop (website layout) ─────────────────────
  // Read off smartagrocare.in (2026-10-02; Marathi by default, captured in
  // English at /en): 30 products (sitemap), 6 crops, 8 crop problems, 3
  // languages, voice search, COD, order tracking. Next.js on Vercel with
  // Supabase. The Agri Business Management System has its own page (slug
  // 'smart-agro'). Images: playbook §11.
  {
    slug: 'smart-agro-website',
    client: 'Smart Agro Care',
    logo: { src: '/work/smart-agro-logo.webp', width: 504, height: 160 },
    focus: ['Agri E-commerce Website', 'Shop by Crop & Problem', 'Marathi · Hindi · English'],
    headline: { lead: 'A farm shop that speaks the', word: 'FARMER’S LANGUAGE.' },
    hero: {
      src: `${AW}/hero.webp`,
      width: 1672,
      height: 940,
      alt: 'The Smart Agro shop on desktop and mobile, with crop problems, shop by crop and three languages',
    },

    brief:
      'Smart Agro Care sells organic fertilizers, pesticides and crop nutrition from Jalgaon, Maharashtra, to farmers across the country. The brief was a shop that works the way farmers think: **by crop and by problem**, not by product name, **in Marathi, Hindi and English**, with **cash on delivery**, ordering on WhatsApp and free advice from an expert.',
    facts: [
      { label: 'Industry', value: 'Agriculture' },
      { label: 'Delivered', value: 'Online agri-shop' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'Next.js · Supabase · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'smartagrocare.in',
      sitemapNote: 'The shop as built: by crop, by problem and by category, so the right product is two clicks from the homepage.',
      goals: [
        {
          title: 'Start from the crop',
          text: 'Six crops and eight crop problems, each with the products that treat it.',
        },
        {
          title: 'Speak the farmer’s language',
          text: 'The whole shop in Marathi, Hindi and English, with voice search.',
        },
        {
          title: 'Make paying easy',
          text: 'Cash on delivery, free delivery on prepaid orders, or order on WhatsApp in one message.',
        },
        {
          title: 'Advise before selling',
          text: 'Free crop advice and an expert on WhatsApp who tells you which product to use.',
        },
      ],
      sitemap: [
        { group: 'Shop', pages: ['Combos', 'Fertilizers', 'Pesticides', 'Product pages'] },
        { group: 'Shop by Crop', pages: ['Cotton', 'Sugarcane', 'Banana', 'Soybean', 'Wheat', 'Vegetables'] },
        { group: 'By Problem', pages: ['Weak growth', 'Flower drop', 'Borers', 'Fungus', 'Sucking pests', 'Yellowing', 'Weak roots', 'Soil health'] },
        { group: 'Orders', pages: ['Cart', 'Wishlist', 'Track Order', 'Login'] },
        { group: 'Help', pages: ['Customer Support', 'FAQ', 'Blog', 'About', 'Affiliate'] },
        { group: 'Policies', pages: ['Shipping', 'Return & Refund', 'Cancellation', 'Payment', 'Warranty', 'Privacy', 'Terms'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Every product mapped to the crops and problems it is for.' },
        { title: 'Wireframes', text: 'One template per page type: listing, crop, problem, product, tracking.' },
        { title: 'Visual design', text: 'The Smart Agro greens with Poppins headings, readable in Devanagari and English.' },
        { title: 'Build & connect', text: 'Next.js on Vercel, with products and orders from Supabase, in three languages.' },
        { title: 'SEO & launch', text: 'A title, description and sitemap entry for every product, crop and page.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Genuine farm inputs delivered to your door: cash on delivery and free expert advice up top, then best sellers, kits & combos, what’s wrong with your crop, shop by crop and Google reviews.',
          features: ['Trust chips', 'Best sellers', 'Kits & combos', 'Crop problems', 'Google reviews'],
          image: {
            src: `${AW}/page-home.webp`,
            width: 1774,
            height: 887,
            alt: 'The Smart Agro homepage: trust chips, farmer numbers and how to order',
          },
        },
        {
          name: 'Shop by Crop',
          path: '/crop/cotton',
          summary:
            'Six crops, each with its own page of recommended products and combos, every card showing the price, pack size, stock and Add to Cart.',
          features: ['6 crops', 'Recommended products', 'Combos', 'In-stock status', 'Add to Cart'],
          image: {
            src: `${AW}/page-crop.webp`,
            width: 1774,
            height: 887,
            alt: 'Smart Agro shop by crop: six crops, products for cotton and voice search',
          },
        },
        {
          name: 'Shop by Problem',
          path: '/problem/yellowing',
          summary:
            'Pick what’s wrong with the crop, such as yellowing leaves, and see the products that treat it. Not sure? Send a photo of the crop on WhatsApp and an expert replies.',
          features: ['8 crop problems', 'Matching products', 'Photo on WhatsApp', 'Expert reply'],
          image: {
            src: `${AW}/page-problem.webp`,
            width: 1774,
            height: 887,
            alt: 'Smart Agro shop by problem: eight crop problems, what treats yellowing leaves and WhatsApp advice',
          },
        },
        {
          name: 'Product page',
          path: '/product/daivik-capsule',
          summary:
            'Price with stock, Add to Cart, Buy Now and Order on WhatsApp, then the promises a farmer checks: genuine product, easy returns, cash on delivery and delivery in about 7 days.',
          features: ['Buy Now', 'Order on WhatsApp', 'Cash on delivery', 'Delivery time', 'Expert support'],
          image: {
            src: `${AW}/page-product.webp`,
            width: 1774,
            height: 887,
            alt: 'A Smart Agro product page: three ways to buy, cash on delivery and order tracking',
          },
        },
      ],
      screens: [
        { src: `${AW}/home-mobile.webp`, width: 585, height: 1266, alt: 'Smart Agro homepage on a phone' },
        { src: `${AW}/crop-mobile.webp`, width: 585, height: 1266, alt: 'Shop by crop on a phone' },
        { src: `${AW}/problem-mobile.webp`, width: 585, height: 1266, alt: 'Shop by problem on a phone' },
        { src: `${AW}/product-mobile.webp`, width: 585, height: 1266, alt: 'A product page on a phone' },
      ],
      builtIn: [
        { icon: 'chat', title: 'Three languages', text: 'The whole shop in Marathi, Hindi and English, switched from the header.' },
        { icon: 'search', title: 'Voice search', text: 'Search fertilizers, pesticides and seeds by typing or speaking.' },
        { icon: 'map', title: 'By crop & problem', text: 'Six crops and eight crop problems, each with matching products.' },
        { icon: 'cart', title: 'Cash on delivery', text: 'Pay when it arrives, or prepay for free delivery.' },
        { icon: 'phone', title: 'Order on WhatsApp', text: 'Send a name and address, or a photo of the crop for advice.' },
        { icon: 'ticket', title: 'Track Order', text: 'By order ID, India Post tracking number or mobile number.' },
        { icon: 'star', title: 'Kits & combos', text: 'Products used together, in one pack, for less.' },
        { icon: 'seo', title: 'Product SEO', text: 'A title, description and sitemap entry for every product and crop.' },
      ],
      todayNote: 'The numbers on smartagrocare.in today.',
    },

    palette: [
      { name: 'Agro Green', hex: '#1E8A46' },
      { name: 'Forest', hex: '#104129' },
      { name: 'Leaf', hex: '#4CAE4F' },
      { name: 'Harvest Orange', hex: '#F57A00' },
      { name: 'Smart Red', hex: '#CF4217' },
    ],
    systemImage: {
      src: `${AW}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'Smart Agro website design system: greens and logo red, Poppins and Inter, and core components',
    },
    type: [
      { family: 'Poppins', role: 'Headings', weights: 'SemiBold · Bold', google: 'Poppins:wght@600;700' },
      { family: 'Inter', role: 'Body & interface', weights: 'Regular · Medium · SemiBold' },
    ],

    impact: [
      { label: 'Products', value: '30', caption: 'on sale, by crop and by problem' },
      { label: 'Languages', value: '3', caption: 'Marathi, Hindi and English' },
      { label: 'Farmers', value: '2,200+', caption: 'served, as the company reports' },
      { label: 'Orders', value: '2,800+', caption: 'delivered, as the company reports' },
    ],
    ctaLead: 'Need a shop your customers can use in their own language?',
  },

  // ── Quick Agriculture: the network's website (website layout) ─────────────
  // Read off quickagriculture.in (2026-10-03; quickagriculture.com is a
  // parked domain): 5 pages + 3 research articles (sitemap), 6 services.
  // Static Next.js on Vercel. The site's own figures don't all agree (10,000+
  // farmers trained vs 50K+ connected), so only labelled claims are used, and
  // its named testimonials are not repeated. Images: playbook §11.
  {
    slug: 'quick-agriculture-website',
    client: 'Quick Agriculture',
    logo: { src: '/work/quick-agriculture-logo.webp', width: 512, height: 160 },
    focus: ['Network Website', 'Services & Research', 'Membership Enquiries'],
    headline: { lead: 'One site for farmers, students and', word: 'INSTITUTIONS.' },
    hero: {
      src: `${QA}/hero.webp`,
      width: 1672,
      height: 941,
      alt: 'The Quick Agriculture website on desktop and mobile, with six services, three audiences and Become a Member',
    },

    brief:
      'Quick Agriculture is a digital agriculture network based in Agra that trains farmers, guides students’ research and supports farmer collectives across India. The brief was one site for **three audiences**: farmers, students and institutions, that explains **six services**, publishes the network’s **research**, and turns each visit into a **membership enquiry** on WhatsApp or email.',
    facts: [
      { label: 'Industry', value: 'Agriculture & Education' },
      { label: 'Delivered', value: 'Network website' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'Next.js · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'quickagriculture.in',
      sitemapNote: 'The menu as built: five pages and the research articles, with Become a Member on every one.',
      goals: [
        {
          title: 'Explain six services simply',
          text: 'Training, research consultancy, FPO development, soil testing, drone farming and AI, one card each.',
        },
        {
          title: 'Speak to three audiences',
          text: 'Farmers, students and institutions each see where they fit, from the first screen.',
        },
        {
          title: 'Show the research',
          text: 'Articles on soil health, smart farming and crop protection, with date and read time.',
        },
        {
          title: 'Turn visits into members',
          text: 'Become a Member on every page, and WhatsApp, email and the office one tap away.',
        },
      ],
      sitemap: [
        { group: 'Home', pages: ['Who we are', 'What we do', 'Our impact', 'Latest research', 'Join the network'] },
        { group: 'About', pages: ['Who we are', 'Our promise', 'Our impact'] },
        { group: 'Services', pages: ['Agriculture Training', 'Research Consultancy', 'Farmer Training & FPO', 'Organic Farming & Soil Testing', 'Precision & Drone Farming', 'AI in Agriculture'] },
        { group: 'Research & Training', pages: ['Biochar + Compost', 'Drone-Based Monitoring', 'Botanical Pest Repellents'] },
        { group: 'Contact', pages: ['WhatsApp', 'Email', 'Office & Maps', 'Social channels', 'Newsletter'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Six services, three audiences and the research mapped into five pages.' },
        { title: 'Wireframes', text: 'One template per page type: landing, services, article list, article, contact.' },
        { title: 'Visual design', text: 'Deep field greens and harvest gold, DM Sans headings and one illustration style.' },
        { title: 'Build & launch', text: 'A static Next.js site on Vercel, fast on a phone in the field.' },
        { title: 'SEO', text: 'A title, description and sitemap entry for every page and article.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Growing India’s farming future: who the network is for, its four promises, the six services, impact figures, the latest research and Join India’s Digital Agriculture Network.',
          features: ['Hero & two CTAs', 'Four promises', 'Six services', 'Impact', 'Latest research'],
          image: {
            src: `${QA}/page-home.webp`,
            width: 1774,
            height: 887,
            alt: 'The Quick Agriculture homepage: four promises, built on credibility and join the network',
          },
        },
        {
          name: 'Services',
          path: '/services',
          summary:
            'Six ways we help you grow: agriculture training, research consultancy, farmer training & FPO development, organic farming & soil testing, precision & drone farming, and AI in agriculture.',
          features: ['6 services', 'Illustrated cards', 'For farmers & students', 'Our promise'],
          image: {
            src: `${QA}/page-services.webp`,
            width: 1774,
            height: 887,
            alt: 'Quick Agriculture services: six services, one line each, for farmers and students',
          },
        },
        {
          name: 'Research & Training',
          path: '/research',
          summary:
            'Knowledge that moves the field forward: articles on soil health, smart farming and crop protection, each with its topic, date and read time.',
          features: ['Topic tags', 'Article cards', 'Date & read time', 'Article pages'],
          image: {
            src: `${QA}/page-research.webp`,
            width: 1774,
            height: 887,
            alt: 'Quick Agriculture research: topic tags, dated articles and plain-word findings',
          },
        },
        {
          name: 'Contact',
          path: '/contact',
          summary:
            'Let’s grow together: WhatsApp, email and the Agra office with a Maps link, plus Facebook, Instagram, YouTube and Telegram.',
          features: ['WhatsApp chat', 'Email', 'Office & Maps', 'Social channels'],
          image: {
            src: `${QA}/page-contact.webp`,
            width: 1774,
            height: 887,
            alt: 'Quick Agriculture contact: WhatsApp first, the office on Maps and every channel',
          },
        },
      ],
      screens: [
        { src: `${QA}/home-mobile.webp`, width: 585, height: 1266, alt: 'Quick Agriculture homepage on a phone' },
        { src: `${QA}/services-mobile.webp`, width: 585, height: 1266, alt: 'Services on a phone' },
        { src: `${QA}/research-mobile.webp`, width: 585, height: 1266, alt: 'Research & Training on a phone' },
        { src: `${QA}/contact-mobile.webp`, width: 585, height: 1266, alt: 'Contact on a phone' },
      ],
      builtIn: [
        { icon: 'form', title: 'Become a Member', text: 'A membership call to action in the header of every page.' },
        { icon: 'chat', title: 'WhatsApp first', text: 'Start a chat from the contact page and the footer.' },
        { icon: 'map', title: 'Office on Maps', text: 'The Agra office address opens straight in Google Maps.' },
        { icon: 'search', title: 'Research articles', text: 'Topic tags, dates and read times, with a page for each article.' },
        { icon: 'star', title: 'One illustration style', text: 'Every scene and service card drawn in the same friendly 3D style.' },
        { icon: 'phone', title: 'Built for phones', text: 'A mobile hero with the key number up top and big tap targets.' },
        { icon: 'ticket', title: 'Newsletter', text: 'Agriculture updates by email, sign-up in the footer.' },
        { icon: 'seo', title: 'SEO', text: 'A title, description and sitemap entry for every page and article.' },
      ],
      todayNote: 'What’s on quickagriculture.in today.',
    },

    palette: [
      { name: 'Field Green', hex: '#0F4D31' },
      { name: 'Action Green', hex: '#1F7A4D' },
      { name: 'Mint', hex: '#5FCF90' },
      { name: 'Harvest Gold', hex: '#C68800' },
      { name: 'Cream', hex: '#FBF9F3' },
    ],
    systemImage: {
      src: `${QA}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'Quick Agriculture website design system: field green and wheat gold, DM Sans and Inter, and core components',
    },
    type: [
      { family: 'DM Sans', role: 'Headings', weights: 'SemiBold · Bold', google: 'DM+Sans:wght@600;700' },
      { family: 'Inter', role: 'Body & interface', weights: 'Regular · Medium · SemiBold' },
    ],

    impact: [
      { label: 'Services', value: '6', caption: 'for farmers, students and institutions' },
      { label: 'Research', value: '3', caption: 'articles published on the site' },
      { label: 'States', value: '12', caption: 'covered by field training, as the network reports' },
      { label: 'Farmers', value: '10,000+', caption: 'trained, as the network reports' },
    ],
    ctaLead: 'Need a website that turns visitors into members?',
  },

  // ── Ram Tiles: the showroom's catalogue website (website layout) ──────────
  // Read off ramtiles.com (2026-10-03): 1,149 products and 45 product
  // categories (its sitemaps), the homepage sections, the two showrooms.
  // WordPress + WooCommerce + Elementor (the posts' author is Pureflow's
  // account). Its About Us and How to Place an Order pages are empty, so they
  // aren't shown. Images: playbook §11.
  {
    slug: 'ram-tiles-website',
    client: 'Ram Tiles',
    logo: { src: '/work/ram-tiles-logo.webp', width: 397, height: 160 },
    focus: ['Tile Catalogue Website', 'Online Orders', 'Showroom Finder'],
    headline: { lead: 'A whole tile showroom,', word: 'ONLINE.' },
    hero: {
      src: `${RT}/hero.webp`,
      width: 1672,
      height: 941,
      alt: 'The Ram Tiles website on desktop and mobile, with flooring tiles, price per box and the two showrooms',
    },

    brief:
      'Ram Tiles sells floor, wall, roofing and parking tiles, sanitary ware, kitchen sinks and fittings from two showrooms in Lucknow. The brief was the whole showroom online: a **catalogue of 1,149 products in 40+ categories**, each tile with its **size and price per box**, **Place Order Now** on every product, and **directions to both showrooms** for buyers who want to see the tiles first.',
    facts: [
      { label: 'Industry', value: 'Building Materials' },
      { label: 'Delivered', value: 'Catalogue website + online orders' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'WordPress · WooCommerce · Elementor' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'ramtiles.com',
      sitemapNote: 'The catalogue as built: 11 families and 40+ categories, each tile two taps from the homepage.',
      goals: [
        {
          title: 'Put the whole range online',
          text: '1,149 products, from 12x18 wall tiles to 32x64 marble slabs, sorted into 40+ categories.',
        },
        {
          title: 'Show the price up front',
          text: 'Price per box, size, finish and carton weight on every product page.',
        },
        {
          title: 'Turn a look into an order',
          text: 'Place Order Now, Add to cart and Enquire Now on every product.',
        },
        {
          title: 'Bring buyers to the showroom',
          text: 'Both Lucknow showrooms on a map with directions, open 10am to 10pm, all 7 days.',
        },
      ],
      sitemap: [
        { group: 'Tiles', pages: ['Roofing', 'Wall', 'Flooring', 'Parking', 'Step & Riser'] },
        { group: 'Fitting', pages: ['Tile Adhesives', 'Tile Grout', 'Tile Spacers', 'Epoxy Tile System'] },
        { group: 'Bath & Kitchen', pages: ['Kitchen Sinks', 'Sanitary Ware', 'Wash Basins'] },
        { group: 'Decor', pages: ['Rangoli & Border', 'Posters', 'Breeze Jali', 'Cement Tiles'] },
        { group: 'Visit Store', pages: ['Arjunganj, Lucknow', 'Budheswar, Dubagga'] },
        { group: 'Help', pages: ['Contact Us', 'Blogs', 'Refund & Return Policy', 'Terms & Conditions'] },
      ],
      build: [
        { title: 'Sitemap & content', text: '1,149 products sorted into tile families, sizes and categories.' },
        { title: 'Wireframes', text: 'One template per page type: category grid, listing, product, store finder.' },
        { title: 'Visual design', text: 'The Ram Tiles orange and black, with Montserrat headings, letting the tiles lead.' },
        { title: 'Build & connect', text: 'WordPress with WooCommerce for the catalogue and cart, built in Elementor.' },
        { title: 'SEO & launch', text: 'A title, description and sitemap entry for every product and category.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Find Your Perfect Tile up top, then every family as a row of picture cards with its size: roofing, wall, flooring, parking, step & riser, chemicals, sinks, sanitary ware and more.',
          features: ['Hero & CTA', 'Tile families', 'Sizes on every card', 'Floating cart'],
          image: {
            src: `${RT}/page-home.webp`,
            width: 1774,
            height: 887,
            alt: 'The Ram Tiles homepage: every tile with its size, sanitary ware and parking tiles',
          },
        },
        {
          name: 'Category',
          path: '/glazed-vitrified-tiles',
          summary:
            'A full category in one grid: 192 glazed vitrified tiles, each with its design sheet, and sorting by popularity, rating, latest or price.',
          features: ['192 results', 'Design sheets', 'Sorting', 'Product grid'],
          image: {
            src: `${RT}/page-category.webp`,
            width: 1774,
            height: 887,
            alt: 'Ram Tiles glazed vitrified tiles: 192 results, the real design sheet and 40+ categories',
          },
        },
        {
          name: 'Product page',
          path: '/product/6001200-glazed-vitrified-tiles',
          summary:
            'The tile’s design sheet, price per box, quality, design, care, delivery and carton weight, then Place Order Now, Add to cart, Enquire Now and Where to Buy.',
          features: ['Price per box', 'Carton weight', 'Place Order Now', 'Enquire Now', 'Share'],
          image: {
            src: `${RT}/page-product.webp`,
            width: 1774,
            height: 887,
            alt: 'A Ram Tiles product page: price per box, Place Order Now and call or WhatsApp',
          },
        },
        {
          name: 'Visit Store',
          path: '/visit-store',
          summary:
            'Visit Shop For Better Experience: both showrooms marked on a map of Lucknow, each with a Direction button, and the shop hours and phone numbers in the footer.',
          features: ['Showroom map', 'Two showrooms', 'Directions', 'Shop hours'],
          image: {
            src: `${RT}/page-store.webp`,
            width: 1774,
            height: 887,
            alt: 'Ram Tiles Visit Store: two Lucknow showrooms with directions, open every day',
          },
        },
      ],
      screens: [
        { src: `${RT}/home-mobile.webp`, width: 585, height: 1266, alt: 'Ram Tiles homepage on a phone' },
        { src: `${RT}/category-mobile.webp`, width: 585, height: 1266, alt: 'A tile category on a phone' },
        { src: `${RT}/product-mobile.webp`, width: 585, height: 1266, alt: 'A product page on a phone' },
        { src: `${RT}/store-mobile.webp`, width: 585, height: 1266, alt: 'Visit Store on a phone' },
      ],
      builtIn: [
        { icon: 'cart', title: 'Cart & orders', text: 'WooCommerce cart with Place Order Now on every product.' },
        { icon: 'search', title: 'Search & sort', text: 'Search the range, and sort any category by popularity, rating or price.' },
        { icon: 'ticket', title: 'Price per box', text: 'Every tile with its price per box, size and carton weight.' },
        { icon: 'map', title: 'Showroom finder', text: 'Both Lucknow showrooms on a map, with directions.' },
        { icon: 'form', title: 'Enquire Now', text: 'An enquiry and Where to Buy on every product.' },
        { icon: 'chat', title: 'Share on WhatsApp', text: 'Send any tile to family or a contractor in one tap.' },
        { icon: 'phone', title: 'App-style mobile bar', text: 'Category, Visit Shop, Contact and Search, always at the bottom.' },
        { icon: 'seo', title: 'Product SEO', text: 'A sitemap entry for every product and category.' },
      ],
      todayNote: 'The numbers on ramtiles.com today.',
    },

    palette: [
      { name: 'Ram Orange', hex: '#F97306' },
      { name: 'Dial Red', hex: '#CD201F' },
      { name: 'Ink', hex: '#070707' },
      { name: 'Peach', hex: '#F8DDC5' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    systemImage: {
      src: `${RT}/design-system.webp`,
      width: 1774,
      height: 887,
      alt: 'Ram Tiles website design system: orange and black, Montserrat and DM Sans, and core components',
    },
    type: [
      { family: 'Montserrat', role: 'Headings', weights: 'SemiBold · Bold · Black', google: 'Montserrat:wght@600;700;900' },
      { family: 'DM Sans', role: 'Body & interface', weights: 'Light · Regular · Medium' },
    ],

    impact: [
      { label: 'Products', value: '1,149', caption: 'tiles, fittings and sanitary ware online' },
      { label: 'Categories', value: '40+', caption: 'from roofing tiles to sinks' },
      { label: 'Showrooms', value: '2', caption: 'in Lucknow, with directions' },
      { label: 'Open', value: '7 days', caption: '10am to 10pm, every day of the week' },
    ],
    ctaLead: 'Need your whole showroom online?',
  },

  // ── Strataloom Research: research firm website + panel (website layout) ───
  // Read off strataloomresearch.com (2026-10-03; strataloom.com is only a
  // parked domain): 6 services, the panel book's regions and quality steps,
  // the sign-up, 4 languages (i18next: en, es, fr, ar with RTL). React + Vite
  // on Vercel, Supabase sign-in, hCaptcha, Resend. Panel size, markets and
  // study counts are the company's own figures. Page images are raw stills in
  // a browser frame until generated ones arrive (website case-study guide).
  {
    slug: 'strataloom-research-website',
    client: 'Strataloom Research',
    logo: { src: '/work/strataloom-logo.webp', width: 683, height: 160 },
    focus: ['Research Firm Website', 'Panelist Sign-up', 'Four Languages'],
    headline: { lead: 'Winning research clients and the', word: 'PANEL BEHIND THEM.' },
    hero: {
      src: `${SL}/home-desktop.webp`,
      width: 1600,
      height: 1000,
      alt: 'The Strataloom Research homepage: Insights That Power Global Innovation',
      frame: 'browser',
      url: 'strataloomresearch.com',
    },

    brief:
      'Strataloom Research is a market research firm based in Lucknow that runs surveys and studies for brands across many markets. The brief was a site for **two audiences**: companies looking for a research partner, who need the **six services, the panel book and the certifications**, and the public, who **join the panel to earn rewards** for surveys. All of it in **English, Spanish, French and Arabic**.',
    facts: [
      { label: 'Industry', value: 'Market Research' },
      { label: 'Delivered', value: 'Research firm website + panel sign-up' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'React · Vite · Supabase · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'strataloomresearch.com',
      sitemapNote: 'The menu as built: services and resources in two drop-downs, and Join Panel on every page.',
      goals: [
        {
          title: 'Win research clients',
          text: 'Six services with their own pages, a quote request, and a reply promised within 24 hours.',
        },
        {
          title: 'Prove the quality',
          text: 'ISO 27001, ISO 9001, ISO 20252 and ESOMAR 37, plus double opt-in and AI fraud checks on the panel.',
        },
        {
          title: 'Grow the panel',
          text: 'A sign-up that credits 50 points instantly, protected by hCaptcha, with gift cards to redeem.',
        },
        {
          title: 'Speak every market',
          text: 'The whole site in English, Spanish, French and Arabic, with Arabic laid out right to left.',
        },
      ],
      sitemap: [
        { group: 'About', pages: ['Who we are', 'Research scope', 'Quality & integrity'] },
        { group: 'Services', pages: ['Qualitative', 'Quantitative', 'Online', 'Global CATI', 'Business', 'Other services'] },
        { group: 'Resources', pages: ['Blogs', 'Panel Book'] },
        { group: 'Careers', pages: ['Our principles', 'Open roles'] },
        { group: 'Contact', pages: ['Send a message', 'Request a quote', 'FAQ'] },
        { group: 'Join Panel', pages: ['Sign up', 'Log in', 'Rewards'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Two journeys mapped: clients to services and quotes, the public to the panel.' },
        { title: 'Wireframes', text: 'One template per page type: service, panel book, article, sign-up, contact.' },
        { title: 'Visual design', text: 'Strataloom teal, navy and amber with Satoshi type, built to read right to left too.' },
        { title: 'Build & connect', text: 'React on Vercel, with Supabase sign-in, hCaptcha and Resend email.' },
        { title: 'SEO & launch', text: 'A title, description and sitemap entry for every page, in four languages.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Insights That Power Global Innovation: the firm’s numbers up top, what it does, the six services, its certifications and the latest articles.',
          features: ['Hero & two CTAs', 'Key numbers', 'Six services', 'Certifications', 'Blog'],
          image: {
            src: `${SL}/home-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'The Strataloom Research homepage: Insights That Power Global Innovation',
            frame: 'browser',
            url: 'strataloomresearch.com',
          },
        },
        {
          name: 'Services',
          path: '/services',
          summary:
            'Six services, each with a picture, a short line and its own page: qualitative, quantitative, online, global CATI, business research and other services.',
          features: ['6 services', 'Service pages', 'Capabilities', 'Quote request'],
          image: {
            src: `${SL}/services-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'Strataloom Research services: six research services',
            frame: 'browser',
            url: 'strataloomresearch.com/services',
          },
        },
        {
          name: 'Panel Book',
          path: '/panel-book',
          summary:
            '10 million voices, one reliable source: the panel by region, how its data is kept clean, and the panel book to download.',
          features: ['Panel numbers', 'Regions & countries', 'Double opt-in', 'AI fraud detection', 'Download'],
          image: {
            src: `${SL}/panel-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'Strataloom Research panel book: 10 million voices, one reliable source',
            frame: 'browser',
            url: 'strataloomresearch.com/panel-book',
          },
        },
        {
          name: 'Join Panel',
          path: '/join-panel',
          summary:
            'Share your opinion, earn real rewards: 50 points on sign-up, the gift cards to redeem, and a sign-up and log-in form protected by hCaptcha.',
          features: ['Sign up & log in', '50 welcome points', 'Reward partners', 'hCaptcha', 'Language switch'],
          image: {
            src: `${SL}/join-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'Strataloom Research Join Panel: create your account and get 50 points',
            frame: 'browser',
            url: 'strataloomresearch.com/join-panel',
          },
        },
      ],
      screens: [
        { src: `${SL}/home-mobile.webp`, width: 585, height: 1266, alt: 'Strataloom Research homepage on a phone' },
        { src: `${SL}/services-mobile.webp`, width: 585, height: 1266, alt: 'Services on a phone' },
        { src: `${SL}/panel-mobile.webp`, width: 585, height: 1266, alt: 'Panel book on a phone' },
        { src: `${SL}/join-mobile.webp`, width: 585, height: 1266, alt: 'Join Panel on a phone' },
      ],
      builtIn: [
        { icon: 'chat', title: 'Four languages', text: 'English, Spanish, French and Arabic, with Arabic right to left.' },
        { icon: 'login', title: 'Panel accounts', text: 'Sign up and log in to the panel, with Supabase behind it.' },
        { icon: 'star', title: 'Welcome rewards', text: '50 points credited the moment a panelist signs up.' },
        { icon: 'shield', title: 'Bot protection', text: 'hCaptcha on every sign-up keeps the panel clean.' },
        { icon: 'form', title: 'Quote requests', text: 'A contact form for quotes, panel support and partnerships.' },
        { icon: 'ticket', title: 'Panel book', text: 'The full panel book, ready to download.' },
        { icon: 'search', title: 'Service pages', text: 'Each of the six services with its own page and capabilities.' },
        { icon: 'seo', title: 'SEO', text: 'A title, description and sitemap entry for every page.' },
      ],
      todayNote: 'What’s on strataloomresearch.com today.',
    },

    palette: [
      { name: 'Strataloom Teal', hex: '#0FA3B1' },
      { name: 'Deep Navy', hex: '#0B1F3B' },
      { name: 'Insight Amber', hex: '#F4A300' },
      { name: 'Mist', hex: '#F4F6F8' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    type: [
      { family: 'Satoshi', role: 'Headings & body', weights: 'Regular · Bold · Black' },
    ],

    impact: [
      { label: 'Services', value: '6', caption: 'research services, each with its own page' },
      { label: 'Languages', value: '4', caption: 'English, Spanish, French and Arabic' },
      { label: 'Panel', value: '10M+', caption: 'panel members, as the company reports' },
      { label: 'Markets', value: '42+', caption: 'markets covered, as the company reports' },
    ],
    ctaLead: 'Need a site that wins clients and signs up users?',
  },

  // ── Baba Biswanath Travels: group tours & pilgrimages (website layout) ────
  // Read off bababiswanathtravels.com (2026-10-03; babavishwanathtravels.com
  // is a different company): 12 open departures, 14 tour pages (sitemap), 39
  // destinations for customized tours, the enquiry and payment pages. Next.js
  // on Vercel. The payment page's bank details are not shown here. "10+ years"
  // is the company's own claim. Page images are raw stills in a browser frame
  // until generated ones arrive (website case-study guide).
  {
    slug: 'baba-biswanath-travels-website',
    client: 'Baba Biswanath Bhraman Sangi',
    logo: { src: '/work/baba-biswanath-logo.webp', width: 602, height: 160 },
    focus: ['Group Tours Website', 'Pilgrimage Yatras', 'WhatsApp Enquiries'],
    headline: { lead: 'Yatras and group tours,', word: 'BOOKED TOGETHER.' },
    hero: {
      src: `${BB}/home-desktop.webp`,
      width: 1600,
      height: 1000,
      alt: 'The Baba Biswanath homepage: Yatra, Sea & Sky — Travelled Together',
      frame: 'browser',
      url: 'bababiswanathtravels.com',
    },

    brief:
      'Baba Biswanath Bhraman Sangi is a Kolkata travel planner that runs group tours and pilgrimage yatras across India and abroad. The brief was a site that shows **every open departure with its dates and price**, gives **every tour its own page** with the route, offers the same destinations as **private customized tours**, and turns interest into an **enquiry on WhatsApp**, with no payment needed to ask.',
    facts: [
      { label: 'Industry', value: 'Travel & Pilgrimage' },
      { label: 'Delivered', value: 'Group tours website' },
      { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
      { label: 'Stack', value: 'Next.js · Vercel' },
    ],

    problem: '',
    process: [],
    products: [],

    site: {
      // No `url`: not linked unless the client agrees (guide, rule 2).
      label: 'bababiswanathtravels.com',
      sitemapNote: 'The menu as built: group tours, upcoming trips and customized tours, with Make a Payment always one click away.',
      goals: [
        {
          title: 'Show every open departure',
          text: 'Twelve group departures, soonest first, each with its dates, price and saving.',
        },
        {
          title: 'Sell the tour on one page',
          text: 'The route night by night, the story of the place, and the price beside the dates.',
        },
        {
          title: 'Turn interest into an enquiry',
          text: 'Pick a date and travellers, then send it on WhatsApp. No advance needed to enquire.',
        },
        {
          title: 'Offer private trips too',
          text: '39 destinations in India and abroad, arranged on your own dates for your own group.',
        },
      ],
      sitemap: [
        { group: 'Group Tours', pages: ['Domestic trips', 'International trips', 'Tour pages'] },
        { group: 'Upcoming Trips', pages: ['By destination', 'Dates & prices', 'About departures'] },
        { group: 'Customized Tours', pages: ['Domestic', 'International', 'Who travels this way', 'Enquiry'] },
        { group: 'About', pages: ['How this started', 'Travel with us'] },
        { group: 'Contact', pages: ['Call', 'WhatsApp', 'Email'] },
        { group: 'Make a Payment', pages: ['Bank transfer', 'UPI QR', 'Policies'] },
      ],
      build: [
        { title: 'Sitemap & content', text: 'Group departures, private tours and payments mapped into one menu.' },
        { title: 'Wireframes', text: 'One template per page type: listing, tour, destinations, payment.' },
        { title: 'Visual design', text: 'Olive and lime from the logo, Playfair Display headlines over full-bleed travel photos.' },
        { title: 'Build & launch', text: 'Next.js on Vercel, fast on a phone, with WhatsApp enquiries built in.' },
        { title: 'SEO', text: 'A title, description and sitemap entry for every tour and page.' },
      ],
      pages: [
        {
          name: 'Home',
          path: '/',
          summary:
            'Yatra, Sea & Sky — Travelled Together: Plan My Trip and View Upcoming Trips up top, then every destination, the upcoming group departures and the two ways to travel.',
          features: ['Hero & two CTAs', 'Destinations', 'Group departures', 'Two ways to travel', 'WhatsApp'],
          image: {
            src: `${BB}/home-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'The Baba Biswanath homepage: Yatra, Sea & Sky — Travelled Together',
            frame: 'browser',
            url: 'bababiswanathtravels.com',
          },
        },
        {
          name: 'Upcoming Trips',
          path: '/upcoming-trips',
          summary:
            'Fixed dates, fixed price: twelve group departures by destination, each card with its days, route, price, saving and dates.',
          features: ['Destination filter', '12 departures', 'Dates & prices', 'Savings', 'FAQ'],
          image: {
            src: `${BB}/upcoming-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'Baba Biswanath upcoming trips: departures by destination',
            frame: 'browser',
            url: 'bababiswanathtravels.com/upcoming-trips',
          },
        },
        {
          name: 'Tour page',
          path: '/tour/vizag-araku',
          summary:
            'The tour’s photo, days and region, the story of the place and the route night by night, beside the price, a departure date, the travellers and Send Enquiry on WhatsApp.',
          features: ['Price & saving', 'Departure date', 'Travellers', 'WhatsApp enquiry', 'Route'],
          image: {
            src: `${BB}/tour-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'A Baba Biswanath tour page: Vizag – Araku with price, date and WhatsApp enquiry',
            frame: 'browser',
            url: 'bababiswanathtravels.com/tour/vizag-araku',
          },
        },
        {
          name: 'Customized Tours',
          path: '/customized-tours',
          summary:
            'Your own group, your own dates: 39 destinations in India and abroad, who travels this way, the four steps from idea to departure, and an enquiry form.',
          features: ['39 destinations', 'Domestic & international', 'Four steps', 'Enquiry form'],
          image: {
            src: `${BB}/custom-desktop.webp`,
            width: 1600,
            height: 1000,
            alt: 'Baba Biswanath customized tours: your own group, your own dates',
            frame: 'browser',
            url: 'bababiswanathtravels.com/customized-tours',
          },
        },
      ],
      screens: [
        { src: `${BB}/home-mobile.webp`, width: 585, height: 1266, alt: 'Baba Biswanath homepage on a phone' },
        { src: `${BB}/upcoming-mobile.webp`, width: 585, height: 1266, alt: 'Upcoming trips on a phone' },
        { src: `${BB}/tour-mobile.webp`, width: 585, height: 1266, alt: 'A tour page on a phone' },
        { src: `${BB}/custom-mobile.webp`, width: 585, height: 1266, alt: 'Customized tours on a phone' },
      ],
      builtIn: [
        { icon: 'chat', title: 'WhatsApp enquiries', text: 'Every tour sends its date and travellers straight to WhatsApp.' },
        { icon: 'ticket', title: 'Dates & prices', text: 'Each departure with its dates, price and saving, soonest first.' },
        { icon: 'map', title: 'Route by night', text: 'Every tour’s route, stop by stop, with the nights in each.' },
        { icon: 'search', title: 'Destination filter', text: 'Upcoming trips filtered by destination, with trip counts.' },
        { icon: 'form', title: 'Custom tour enquiry', text: 'A form for private trips on your own dates.' },
        { icon: 'cart', title: 'Make a Payment', text: 'Bank transfer and a UPI QR, with a reminder to confirm first.' },
        { icon: 'phone', title: 'Call from any page', text: 'The phone number in the header and a WhatsApp button on every page.' },
        { icon: 'seo', title: 'Tour SEO', text: 'A title, description and sitemap entry for every tour.' },
      ],
      todayNote: 'The numbers on bababiswanathtravels.com today.',
    },

    palette: [
      { name: 'Olive', hex: '#6B7B1A' },
      { name: 'Lime', hex: '#B6D047' },
      { name: 'River Teal', hex: '#0E86AE' },
      { name: 'Ink', hex: '#14262E' },
      { name: 'Canvas', hex: '#FBFCF8' },
    ],
    type: [
      { family: 'Playfair Display', role: 'Headlines', weights: 'Medium · Bold', google: 'Playfair+Display:wght@500;700' },
      { family: 'DM Sans', role: 'Headings & interface', weights: 'Regular · SemiBold · Bold', google: 'DM+Sans:wght@400;600;700' },
    ],

    impact: [
      { label: 'Departures', value: '12', caption: 'group departures open now' },
      { label: 'Tours', value: '14', caption: 'tour pages, each with its route' },
      { label: 'Destinations', value: '39', caption: 'for customized tours, in India and abroad' },
      { label: 'Experience', value: '10+', caption: 'years arranging journeys, as the company reports' },
    ],
    ctaLead: 'Need a website that fills your group departures?',
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
