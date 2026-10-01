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
];

const bySlug = new Map<string, Showcase>();
SHOWCASES.forEach((s) => {
  bySlug.set(s.slug, s);
  s.matchSlugs?.forEach((alias) => bySlug.set(alias, s));
});

export function getShowcaseBySlug(slug: string | null | undefined): Showcase | null {
  return slug ? (bySlug.get(slug) ?? null) : null;
}
