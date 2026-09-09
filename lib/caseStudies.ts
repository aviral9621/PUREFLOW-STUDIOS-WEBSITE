// ─────────────────────────────────────────────────────────────────────────────
// CASE STUDIES — structured, config-driven data for the premium project-detail
// template (`components/casestudy/CaseStudyPage.tsx`).
//
// This is the single source of truth for the new Nebula-style case pages. To add
// a project, append ONE `CaseStudy` object — nothing else. The renderer resolves
// `icon` / `logo` string keys to components, so this file stays plain data.
//
// Routing: the Work listing card for a case study uses `slug`; `App.tsx` renders
// the structured page when `getCaseStudyBySlug(slug)` matches (aliases included).
// ─────────────────────────────────────────────────────────────────────────────

export type DeviceShowcase = {
  /**
   * 'live' embeds the real site in an iframe; 'video'/'image' are fallbacks;
   * 'mockup' renders a designed in-app UI component (for products with no
   * public live URL).
   */
  type: 'live' | 'video' | 'image' | 'mockup';
  /** Live URL, video file, image path, or (for mockup) a display URL. */
  src: string;
  /** Optional poster screenshot shown before a live/video embed loads. */
  poster?: string;
  /** For type 'mockup': which designed mockup component to render. */
  mockup?: 'ai-dashboard' | 'unskills-crm';
};

export interface CaseStudy {
  slug: string;
  /** Extra slugs that should also resolve to this case study (legacy/CMS slugs). */
  matchSlugs?: string[];
  name: string;
  tagline: string;
  category: string;          // hero pill + Work filter tag, e.g. "Hospitality"
  liveUrl: string;           // full URL incl. https://

  /** Optional hero extras: a static image to show in the hero browser frame
   *  (instead of the live/mockup showcase), feature bullets + a custom CTA. */
  hero?: { poster?: string; image?: string; bullets?: string[]; ctaLabel?: string; device?: 'browser' | 'laptop' };

  /** How this project appears as a card in the Work listing / homepage. */
  card?: {
    title?: string;
    description?: string;
    /** Short display name for the showcase card. Defaults to `name`. */
    name?: string;
    /** Pill label on the showcase card — the product type ("Website", "Custom CRM"). */
    type?: string;
    /** Short description for the showcase card. Keep it under ~95 characters. */
    blurb?: string;
    /** Device frame the showcase card renders the preview in. Defaults to 'browser'. */
    device?: 'browser' | 'phone';
    year?: string;
    /** Tailwind gradient classes for the placeholder card mockup. */
    from?: string;
    to?: string;
    /** Render a designed mockup as the card preview (no live URL needed). */
    mockup?: 'ai-dashboard' | 'unskills-crm';
    /** Static image used as the card thumbnail. */
    image?: string;
  };

  snapshot: {
    client: string;
    industry: string;
    services: string;
    platforms: string;
    timeline?: string;       // optional — card is dropped if empty
    stack: string;
  };

  challenge: string;

  whatWeBuilt: [
    { title: string; icon: string; items: string[] },
    { title: string; icon: string; items: string[] },
  ];

  techStack: { name: string; logo: string }[];

  showcase: { desktop: DeviceShowcase; mobile: DeviceShowcase };

  /** Optional designed product-collage rendered in the Visual Showcase slot. */
  productShowcase?: 'stayhub';

  /** One short qualitative sentence — no numbers. */
  outcome: string;
  /** Substring of `outcome` to render in the accent colour. */
  outcomeHighlight?: string;

  /** Optional results row. `icon` is a key resolved by the Outcome section. */
  metrics?: { value: string; label: string; icon?: string }[];

  testimonial?: { quote: string; name: string; role: string; heading?: string } | null;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'quick-hotels',
    matchSlugs: ['end-to-end-hotel-management'],
    name: 'Quick Hotels',
    tagline:
      'A complete booking-and-management ecosystem for budget-friendly stays across India.',
    category: 'Hospitality',
    liveUrl: 'https://quickhotels.co',

    card: {
      title: 'Booking website + custom PMS on one backend',
      description:
        'All-inclusive pricing, split payments and a back-office that stays in sync — automatically.',
      type: 'Website + PMS',
      blurb:
        'A mobile-first booking site and a custom PMS on one backend.',
      device: 'phone',
      year: '2026',
      from: 'from-fuchsia-950/70',
      to: 'to-purple-950/50',
    },

    snapshot: {
      client: 'Quick Hotels',
      industry: 'Hospitality',
      services: 'Product Design · Web Dev · Custom PMS',
      platforms: 'Website + PMS',
      timeline: '4 weeks',
      stack: 'Next.js · Supabase · Razorpay',
    },

    challenge:
      'Quick Hotels runs budget-friendly stays across multiple Indian cities — Delhi, Bengaluru, Rishikesh, Noida, Mathura and more. They needed two things most vendors treat as separate projects: a fast, mobile-first website where guests discover and book rooms, and an internal system to manage those rooms, payments and inventory behind the scenes. The hard part was getting both halves to speak to one source of truth — no double-entry, no mismatched availability — while honouring one strict rule: every room price already includes GST, so a guest is never surprised by tax added at checkout.',

    whatWeBuilt: [
      {
        title: 'Guest Website',
        icon: 'globe',
        items: [
          'Search and browse stays across every Quick Hotels city',
          'Transparent, all-inclusive pricing — taxes and fees built in, never added at the end',
          'Flexible split payments — pay 30% now to confirm, settle the rest at check-in',
          'Secure checkout through Razorpay',
        ],
      },
      {
        title: 'Property Management System',
        icon: 'dashboard',
        items: [
          'Manage bookings, rooms and live availability in one place',
          'Track payments and outstanding balances against each reservation',
          'Keep inventory and pricing accurate across every property',
          'Role-based access so the right staff see the right tools',
        ],
      },
    ],

    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'React', logo: 'react' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
      { name: 'Vercel', logo: 'vercel' },
      { name: 'Razorpay', logo: 'razorpay' },
    ],

    showcase: {
      // Point at the canonical www host so the iframe skips the root → www
      // 307 redirect hop (smoother load). The visible "Open live site" link
      // still uses the short brand URL (liveUrl) above.
      desktop: { type: 'live', src: 'https://www.quickhotels.co/' },
      mobile: { type: 'live', src: 'https://www.quickhotels.co/' },
    },

    outcome:
      'A single connected platform that runs bookings and operations — with zero pricing surprises.',
    outcomeHighlight: 'surprises',

    metrics: [],
    testimonial: null,
  },

  // ── Herbal Vantage — premium herbal e-commerce (live) ──────────────────────
  {
    slug: 'herbal-vantage',
    name: 'Herbal Vantage',
    tagline: 'A premium herbal store experience — luxury wellness commerce, end to end.',
    category: 'Herbal & Wellness',
    liveUrl: 'https://herbal-vantage-website.vercel.app/',

    card: {
      title: 'Premium Herbal Store Experience',
      description:
        'Modern herbal e-commerce with a luxury product showcase, smooth shopping flow, clean UI and a conversion-focused design system.',
      type: 'E-commerce',
      blurb:
        'An editorial herbal storefront with a frictionless checkout.',
      year: '2026',
      from: 'from-emerald-950/70',
      to: 'to-purple-950/50',
    },

    snapshot: {
      client: 'Herbal Vantage',
      industry: 'Herbal & Wellness',
      services: 'Product Design · Web Dev · E-commerce',
      platforms: 'E-commerce Website',
      timeline: '5 weeks',
      stack: 'Next.js · Tailwind · Vercel',
    },

    challenge:
      'Herbal Vantage sells premium wellness and herbal products that live or die on how trustworthy and premium the storefront feels. They needed an online store that looked as refined as the products themselves — a luxury showcase with a fast, frictionless path from browsing to checkout — without the clutter and template feel of typical e-commerce builds.',

    whatWeBuilt: [
      {
        title: 'Luxury Storefront',
        icon: 'globe',
        items: [
          'Editorial product showcase with rich imagery and clean typography',
          'Fast, mobile-first browsing across the full catalogue',
          'Clear product detail pages built to build trust and intent',
          'A cohesive, premium design system applied end to end',
        ],
      },
      {
        title: 'Conversion & Commerce',
        icon: 'dashboard',
        items: [
          'A streamlined, low-friction add-to-cart and checkout flow',
          'Considered layout and CTAs to guide buyers to purchase',
          'Reusable components for quick catalogue and campaign updates',
          'Optimised, globally delivered front end for speed',
        ],
      },
    ],

    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'React', logo: 'react' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
      { name: 'Vercel', logo: 'vercel' },
    ],

    showcase: {
      desktop: { type: 'live', src: 'https://herbal-vantage-website.vercel.app/' },
      mobile: { type: 'live', src: 'https://herbal-vantage-website.vercel.app/' },
    },

    outcome:
      'A storefront that feels as premium as the products — turning browsers into confident buyers.',
    outcomeHighlight: 'confident buyers',

    metrics: [],
    testimonial: null,
  },

  // ── Spectrum Tour & Travels — travel booking website (live) ────────────────
  {
    slug: 'spectrum-tour-travels',
    matchSlugs: ['ai-workflow-system'],
    name: 'Spectrum Tour & Travels',
    tagline: 'A complete travel and tour booking experience — packages, enquiries and trips online.',
    category: 'Travel & Tourism',
    liveUrl: 'https://spectrumtourtravels.com/',

    card: {
      title: 'Travel & Tour Booking Website',
      description:
        'A modern travel website with curated tour packages, destination showcases, a smooth enquiry-to-booking flow and a clean, trust-building design.',
      name: 'Spectrum Travels',
      type: 'Website',
      blurb:
        'Curated tour packages, destinations and a smooth enquiry flow.',
      year: '2026',
      from: 'from-sky-950/70',
      to: 'to-indigo-950/50',
    },

    snapshot: {
      client: 'Spectrum Tour & Travels',
      industry: 'Travel & Tourism',
      services: 'Product Design · Web Dev · SEO',
      platforms: 'Website',
      timeline: '4 weeks',
      stack: 'Responsive Web · SEO',
    },

    challenge:
      'Spectrum Tour & Travels needed an online presence that turns browsers into enquiries — a fast, trustworthy website that showcases destinations and tour packages clearly and makes it effortless for travellers to reach out and book.',

    whatWeBuilt: [
      {
        title: 'Travel Storefront',
        icon: 'globe',
        items: [
          'Destination and tour-package showcase with rich imagery',
          'Clear package detail pages built to inspire and inform',
          'Fast, mobile-first browsing across every trip',
          'A clean, trust-building design with strong calls to action',
        ],
      },
      {
        title: 'Enquiries & Reach',
        icon: 'dashboard',
        items: [
          'A smooth enquiry-to-booking flow for travellers',
          'Quick contact and WhatsApp paths to convert interest fast',
          'SEO-ready structure to get found by the right travellers',
          'Reusable sections for easy package and offer updates',
        ],
      },
    ],

    techStack: [
      { name: 'Responsive Web', logo: '' },
      { name: 'SEO', logo: '' },
      { name: 'Tour Packages', logo: '' },
      { name: 'Booking Enquiry', logo: '' },
    ],

    showcase: {
      desktop: { type: 'live', src: 'https://spectrumtourtravels.com/' },
      mobile: { type: 'live', src: 'https://spectrumtourtravels.com/' },
    },

    outcome:
      'A travel site that turns curious visitors into booked trips — clear, fast and trustworthy.',
    outcomeHighlight: 'booked trips',

    metrics: [],
    testimonial: null,
  },

  // ── UnSkills CRM — CRM for educational institutes (designed mockup) ─────────
  {
    slug: 'unskills-computer-education-crm',
    name: 'UnSkills CRM',
    tagline:
      'A complete CRM solution for educational institutes to streamline leads, admissions, fees, and student relationships — all in one place.',
    category: 'CRM Management',
    liveUrl: '',

    hero: {
      image: '/unskill%20crm%20dash.png',
      bullets: [
        'Centralized Lead & Enquiry Management',
        'Admission & Student Management',
        'Fee & Collection Tracking',
        'Task Automation & Follow-ups',
        'Real-time Reports & Analytics',
      ],
      ctaLabel: 'Request a Demo',
    },

    card: {
      title: 'A complete CRM for educational institutes',
      description:
        'Leads, admissions, fees, branches and student relationships — streamlined into one real-time platform with full reports and automation.',
      type: 'Custom CRM',
      blurb:
        'Leads, admissions, fees and eight branches in one live dashboard.',
      year: '2025',
      from: 'from-indigo-950/70',
      to: 'to-fuchsia-950/50',
      mockup: 'unskills-crm',
    },

    snapshot: {
      client: 'UnSkills CRM',
      industry: 'Education',
      services: 'CRM Development',
      platforms: 'Web',
      timeline: '12 weeks',
      stack: 'Next.js · Node.js · PostgreSQL · AWS',
    },

    challenge:
      'A multi-branch educational institute was running leads, admissions, fees and student records across spreadsheets, WhatsApp and disconnected tools — with no single view of enquiries, collections or branch performance. They needed one CRM that centralises the whole student lifecycle, automates follow-ups, and gives the head office real-time numbers across every branch.',

    whatWeBuilt: [
      {
        title: 'Leads, Admissions & Students',
        icon: 'dashboard',
        items: [
          'Centralized lead & enquiry capture with status pipelines',
          'Admission and student management across all branches',
          'Task automation and follow-up reminders for staff',
          'Role-based access and per-branch wallets & approvals',
        ],
      },
      {
        title: 'Fees, Reports & Automation',
        icon: 'globe',
        items: [
          'Fee, due, overdue and collection tracking in real time',
          'Revenue, profit, expenses and discount analytics',
          'Trial-class and conversion tracking, end to end',
          'A live head-office dashboard across every branch',
        ],
      },
    ],

    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'Node.js', logo: '' },
      { name: 'PostgreSQL', logo: '' },
      { name: 'AWS', logo: '' },
    ],

    showcase: {
      desktop: { type: 'mockup', src: 'https://crm.unskills.app', mockup: 'unskills-crm' },
      mobile: { type: 'mockup', src: 'https://crm.unskills.app', mockup: 'unskills-crm' },
    },

    outcome:
      'One CRM streamlines leads, admissions, fees and students — with real-time numbers across every branch.',
    outcomeHighlight: 'real-time numbers',

    metrics: [
      { value: '+42%', label: 'More Admissions Converted', icon: 'up' },
      { value: '+35%', label: 'Faster Fee Collection', icon: 'wallet' },
      { value: '+28%', label: 'Revenue Growth', icon: 'rupee' },
      { value: '−60%', label: 'Manual Data Entry', icon: 'clock' },
    ],
    testimonial: {
      quote:
        'PureFlow gave us one place to run every branch — leads, admissions and fees finally live in a single system, and our team stopped drowning in spreadsheets.',
      name: 'UnSkills Leadership',
      role: 'Computer Education Institute',
    },
  },

  // ── Additional portfolio projects (representative work) ─────────────────────
  {
    slug: 'unskills-education-website',
    matchSlugs: ['saas-analytics-dashboard'],
    name: 'UnSkills Education',
    tagline: 'A modern education website — courses, admissions and enquiries, all in one place.',
    category: 'Education / EdTech',
    liveUrl: 'https://www.unskillseducation.org/',
    card: {
      title: 'A modern education & admissions website',
      description: 'Course catalogue, clear program pages and a smooth enquiry-to-admission flow on a fast, SEO-ready site.',
      type: 'Website',
      blurb:
        'A course catalogue and a clean enquiry-to-admission flow.',
      device: 'phone',
      year: '2025',
      from: 'from-indigo-950/70',
      to: 'to-fuchsia-950/50',
    },
    snapshot: { client: 'UnSkills Education', industry: 'Education / EdTech', services: 'Product Design · Web Dev · SEO', platforms: 'Website', timeline: '5 weeks', stack: 'Next.js · Tailwind · Vercel' },
    challenge:
      'UnSkills needed a public website that builds trust and turns visitors into admission enquiries — clearly showcasing its courses and making it effortless to apply or get in touch.',
    whatWeBuilt: [
      { title: 'Courses & Admissions', icon: 'globe', items: ['Course catalogue with clear program pages', 'A smooth enquiry-to-admission flow', 'Fast, mobile-first browsing', 'Trust-building design and clear CTAs'] },
      { title: 'Reach & Performance', icon: 'dashboard', items: ['SEO-ready structure to get found', 'Quick contact and WhatsApp shortcuts', 'Optimised, globally delivered front end', 'Easy content and course updates'] },
    ],
    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'React', logo: 'react' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
      { name: 'Vercel', logo: 'vercel' },
    ],
    showcase: {
      desktop: { type: 'live', src: 'https://www.unskillseducation.org/' },
      mobile: { type: 'live', src: 'https://www.unskillseducation.org/' },
    },
    outcome: 'A website that turns curious visitors into admission enquiries — clear, fast and trustworthy.',
    outcomeHighlight: 'admission enquiries',
    metrics: [],
    testimonial: null,
  },

  {
    slug: 'ecommerce-retail-platform',
    name: 'Modern Hospitality Management Platform',
    tagline:
      'An all-in-one hotel operations system designed to manage bookings, guest inquiries, occupancy, revenue analytics, and business performance from a single centralized dashboard.',
    category: 'Quick Hotel CRM',
    liveUrl: '',
    hero: {
      image: '/quickhotel%20crm.png',
      device: 'laptop',
      bullets: [
        'Centralized bookings & reservations',
        'Guest inquiry & lead management',
        'Live occupancy & revenue analytics',
        'Business performance at a glance',
      ],
    },
    card: {
      title: 'Quick Hotels CRM',
      description: 'A modern hospitality management platform — bookings, leads, occupancy and revenue analytics in one dashboard.',
      name: 'Quick Hotels CRM',
      type: 'SaaS Dashboard',
      blurb:
        'Bookings, leads, occupancy and revenue in one dashboard.',
      year: '2025',
      from: 'from-fuchsia-950/70',
      to: 'to-purple-950/50',
      image: '/quickhotel%20crm.png',
    },
    snapshot: { client: 'Retail Brand', industry: 'E-commerce', services: 'Web Dev · Payments · POS', platforms: 'Web + POS', timeline: '7 weeks', stack: 'Next.js · Stripe · Tailwind' },
    challenge:
      'Online and in-store sales lived in separate systems with mismatched stock and no single view of orders. They needed one platform where the storefront and the counter share the same inventory and payments.',
    whatWeBuilt: [
      { title: 'Storefront & Checkout', icon: 'globe', items: ['Fast, mobile-first product browsing', 'Secure one-page checkout', 'Live inventory and pricing', 'SEO-ready product pages'] },
      { title: 'Retail POS & Ops', icon: 'dashboard', items: ['In-store POS sharing one backend', 'Orders, refunds and stock in sync', 'Sales and inventory reporting', 'Role-based staff access'] },
    ],
    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'Stripe', logo: '' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
    ],
    showcase: {
      desktop: { type: 'image', src: '/quickhotel%20crm.png' },
      mobile: { type: 'image', src: '/quickhotel%20crm.png' },
    },
    productShowcase: 'stayhub',
    outcome: 'A digital experience that drives bookings and delights guests.',
    outcomeHighlight: 'delights',
    metrics: [
      { value: '+45%', label: 'Increase in Direct Bookings', icon: 'up' },
      { value: '+38%', label: 'Higher Guest Engagement', icon: 'users' },
      { value: '+30%', label: 'Revenue Growth', icon: 'wallet' },
      { value: '−28%', label: 'Reduction in Support Tickets', icon: 'clock' },
    ],
    testimonial: {
      heading: 'What Our Guests Say',
      quote:
        'Quick Hotel made our stay seamless from start to finish. The booking was effortless, the experience was exceptional, and the comfort was beyond expectations.',
      name: 'Sarah Mitchell',
      role: 'Travel Enthusiast',
    },
  },

  {
    slug: 'healthcare-clinic-system',
    name: 'Clinic Management System',
    tagline: 'Appointments, patient records and billing in one secure clinic platform.',
    category: 'Healthcare',
    liveUrl: 'https://piratesmensfashion.com/',
    card: {
      title: 'Secure clinic & patient management',
      description: 'Appointments, records, prescriptions and billing in one system.',
      type: 'Web App',
      blurb:
        'Appointments, records, prescriptions and billing in one system.',
      year: '2025',
      from: 'from-sky-950/70',
      to: 'to-indigo-950/50',
    },
    snapshot: { client: 'Healthcare Provider', industry: 'Healthcare', services: 'Product Design · Web Dev', platforms: 'Web App', timeline: '10 weeks', stack: 'Next.js · Supabase · Node.js' },
    challenge:
      'Patient records, appointments and billing were spread across paper and disconnected apps — slow, error-prone and hard to keep secure. They needed one careful, access-controlled system for the whole clinic workflow.',
    whatWeBuilt: [
      { title: 'Patients & Appointments', icon: 'dashboard', items: ['Patient records with full history', 'Appointment scheduling and reminders', 'Prescriptions and visit notes', 'Role-based, access-controlled data'] },
      { title: 'Billing & Insight', icon: 'globe', items: ['Invoicing and payment tracking', 'Daily collection and dues overview', 'Doctor and department reporting', 'Secure, audit-friendly records'] },
    ],
    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'Node.js', logo: '' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
    ],
    showcase: {
      desktop: { type: 'live', src: 'https://piratesmensfashion.com/' },
      mobile: { type: 'live', src: 'https://piratesmensfashion.com/' },
    },
    outcome: 'The whole clinic runs from one secure system — records, appointments and billing finally in sync.',
    outcomeHighlight: 'one secure system',
    metrics: [],
    testimonial: null,
  },

  {
    slug: 'real-estate-portal',
    name: 'Real Estate Portal',
    tagline: 'Property listings, search and enquiry — a portal that turns browsers into leads.',
    category: 'Real Estate',
    liveUrl: '',
    hero: { image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=72&auto=format&fit=crop' },
    card: {
      title: 'Property listings & enquiry portal',
      description: 'Rich property listings, smart search and a frictionless enquiry-to-visit flow.',
      type: 'Website',
      blurb: 'Rich property listings, smart search and a frictionless enquiry flow.',
      year: '2025',
      from: 'from-emerald-950/70',
      to: 'to-teal-950/50',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=70&auto=format&fit=crop',
    },
    snapshot: { client: 'Property Developer', industry: 'Real Estate', services: 'Web Dev · SEO', platforms: 'Website', timeline: '6 weeks', stack: 'Next.js · Tailwind · Vercel' },
    challenge:
      'Listings were hard to browse and enquiries leaked through scattered forms and calls. They needed a fast, trustworthy portal that showcases properties well and makes enquiring effortless.',
    whatWeBuilt: [
      { title: 'Listings & Search', icon: 'globe', items: ['Rich property listings with galleries', 'Map and filter-based search', 'Clear, trust-building detail pages', 'Fast, mobile-first, SEO-ready'] },
      { title: 'Enquiries & Leads', icon: 'dashboard', items: ['Smooth enquiry-to-visit flow', 'Lead capture and follow-up tracking', 'WhatsApp and contact shortcuts', 'Easy listing updates for the team'] },
    ],
    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'Vercel', logo: 'vercel' },
    ],
    showcase: {
      desktop: { type: 'image', src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=72&auto=format&fit=crop' },
      mobile: { type: 'image', src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=72&auto=format&fit=crop' },
    },
    outcome: 'A property portal that looks the part and turns curious visitors into booked site visits.',
    outcomeHighlight: 'booked site visits',
    metrics: [],
    testimonial: null,
  },

  {
    slug: 'restaurant-ordering-platform',
    name: 'Restaurant Ordering Platform',
    tagline: 'Online ordering, table booking and a kitchen dashboard for a multi-outlet restaurant.',
    category: 'Food & Hospitality',
    liveUrl: '',
    hero: { image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=72&auto=format&fit=crop' },
    card: {
      title: 'Online ordering + kitchen dashboard',
      description: 'Online ordering, table reservations and a live kitchen view across multiple outlets.',
      name: 'Restaurant Ordering',
      type: 'Web + Admin',
      blurb: 'Online ordering, table bookings and a live kitchen view per outlet.',
      year: '2025',
      from: 'from-amber-950/70',
      to: 'to-orange-950/50',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=70&auto=format&fit=crop',
    },
    snapshot: { client: 'Restaurant Group', industry: 'Food & Hospitality', services: 'Web Dev · Ordering · Admin', platforms: 'Web + Admin', timeline: '8 weeks', stack: 'Next.js · Supabase · Razorpay' },
    challenge:
      'Orders came through phone, chat and walk-ins with no single view, and the kitchen had no live queue. They needed one platform for online ordering, reservations and a real-time kitchen dashboard across outlets.',
    whatWeBuilt: [
      { title: 'Ordering & Booking', icon: 'globe', items: ['Online menu and ordering', 'Table reservations', 'Secure payments via Razorpay', 'Mobile-first, fast checkout'] },
      { title: 'Kitchen & Admin', icon: 'dashboard', items: ['Live kitchen order queue', 'Multi-outlet menu and pricing', 'Sales and order reporting', 'Role-based staff access'] },
    ],
    techStack: [
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'Razorpay', logo: 'razorpay' },
      { name: 'Tailwind CSS', logo: 'tailwind' },
    ],
    showcase: {
      desktop: { type: 'image', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=72&auto=format&fit=crop' },
      mobile: { type: 'image', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=72&auto=format&fit=crop' },
    },
    outcome: 'Orders, bookings and the kitchen run from one platform — across every outlet, in real time.',
    outcomeHighlight: 'in real time',
    metrics: [],
    testimonial: null,
  },
];

// Alias map: canonical slug + any matchSlugs all point at the same case study.
const bySlug = new Map<string, CaseStudy>();
for (const cs of CASE_STUDIES) {
  bySlug.set(cs.slug, cs);
  cs.matchSlugs?.forEach((alias) => bySlug.set(alias, cs));
}

export function getCaseStudyBySlug(slug: string | null | undefined): CaseStudy | null {
  return slug ? bySlug.get(slug) ?? null : null;
}
