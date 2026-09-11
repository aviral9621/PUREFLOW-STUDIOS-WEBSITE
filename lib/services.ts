import {
  BarChart3,
  Blocks,
  Cloud,
  Code2,
  Compass,
  Database,
  Gauge,
  Globe2,
  Handshake,
  Layers,
  LifeBuoy,
  Megaphone,
  PenTool,
  Puzzle,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { ViewState } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES — content for the service detail pages.
//
// Kept out of the component so the page is composition and the copy is data.
// Every field earns its place: each section of the page answers exactly one
// question, and anything that does not answer one is not here.
//
// `work` holds slugs from `lib/caseStudies.ts` — real projects only. A service
// with nothing shipped under it leaves the array empty and the page drops the
// Selected Work section rather than showing invented case studies.
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceKey = Extract<
  ViewState,
  | 'service-software'
  | 'service-crm'
  | 'service-mobile'
  | 'service-website'
  | 'service-social'
  | 'service-ads'
>;

export interface Deliverable {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface ServiceDetail {
  /** Small uppercase label above the headline. */
  eyebrow: string;
  /** Headline, split so the closing phrase can carry the italic accent. */
  headline: string;
  headlineAccent: string;
  /** Two sentences at most — what this service is, in plain terms. */
  intro: string;
  /** What we build inside this service. Exactly six, one sentence each. */
  deliverables: Deliverable[];
  /**
   * Which hero mark this service gets. 'code' is the laptop-and-editor scene,
   * which only makes sense where the deliverable is software; 'abstract' is the
   * neutral sphere for the marketing services.
   */
  visual: 'code' | 'abstract';
  /** Four capability labels floating beside the laptop, for the 'code' visual. */
  visualChips?: string[];
  /**
   * A ready-made hero image, served from the `public/` folder. When set it
   * replaces the drawn scene entirely. Give the path without an extension —
   * the page serves `.webp` and falls back to `.png`, so both must exist.
   */
  heroImage?: string;
  /** Alt text, required whenever `heroImage` is set. */
  heroImageAlt?: string;
  /** Technology chips. Real stack, not a logo wall. */
  tech: string[];
  /** Label above the chips. Only the build services are 'Built with'. */
  techLabel?: string;
  /** Case-study slugs. Empty means the page omits Selected Work entirely. */
  work: string[];
  /** Which lead form this service routes into. */
  leadView: ViewState;
  /** Pre-selected chip on the Start-a-Project flow. */
  prefill: string;
}

/** Shared across every service — the way we work does not change per service. */
export const PROCESS: { step: string; title: string; description: string; Icon: LucideIcon }[] = [
  { step: '01', title: 'Discover', description: 'Understand your goals, workflow and constraints.', Icon: Search },
  { step: '02', title: 'Design', description: 'Map the flows and design the interface around them.', Icon: PenTool },
  { step: '03', title: 'Build', description: 'Develop, test and iterate with you in the loop.', Icon: Code2 },
  { step: '04', title: 'Launch', description: 'Deploy, monitor and support what comes next.', Icon: Rocket },
];

/** Why work with us — four claims we can actually stand behind. */
export const WHY: { title: string; description: string; Icon: LucideIcon }[] = [
  { title: 'Business-focused', description: 'We build for the outcome, not the feature list.', Icon: Target },
  { title: 'Direct team', description: 'You talk to the people writing the code.', Icon: Users },
  { title: 'Built to scale', description: 'Architecture that holds up as you grow.', Icon: Layers },
  { title: 'Long-term partner', description: 'We stay involved well beyond launch.', Icon: Handshake },
];

export const SERVICES: Record<ServiceKey, ServiceDetail> = {
  'service-software': {
    eyebrow: 'Development',
    headline: 'Custom software',
    headlineAccent: 'built for real growth.',
    intro:
      'We design and build custom web applications, internal tools and automations that fit your business — not the other way around.',
    deliverables: [
      { title: 'Custom Web Applications', description: 'Full-stack apps shaped around your workflows, not a template.', Icon: Code2 },
      { title: 'Internal Tools', description: 'Systems your team actually wants to open every morning.', Icon: Workflow },
      { title: 'Dashboards & Analytics', description: 'Operational data turned into decisions you can act on.', Icon: BarChart3 },
      { title: 'Database & Architecture', description: 'Schemas and APIs that survive the next three years of growth.', Icon: Database },
      { title: 'Integrations & APIs', description: 'Payments, messaging and your existing tools, wired in cleanly.', Icon: Puzzle },
      { title: 'Auth, Roles & Infra', description: 'Secure access, permissions and deployment done properly.', Icon: ShieldCheck },
    ],
    visual: 'code',
    visualChips: ['Web Applications', 'Internal Tools', 'Automations', 'API Integrations'],
    heroImage: '/services/custom-software-hero',
    heroImageAlt:
      'A laptop running a code editor, with Web Applications, Internal Tools, Automations and API Integrations shown alongside',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    work: ['quick-hotels', 'unskills-computer-education-crm', 'ecommerce-retail-platform'],
    leadView: 'get-software-built',
    prefill: 'software',
  },

  'service-crm': {
    eyebrow: 'Product',
    headline: 'One system, not',
    headlineAccent: 'fourteen spreadsheets.',
    intro:
      'Leads, follow-ups, payments and reporting in one place, with the logic your business actually runs on built in.',
    deliverables: [
      { title: 'Lead Pipelines', description: 'Every enquiry, stage and follow-up in one reliable place.', Icon: Users },
      { title: 'Role Dashboards', description: 'Founders, managers and staff each see what they need.', Icon: BarChart3 },
      { title: 'Workflow Automation', description: 'Assignments, reminders and approvals that run themselves.', Icon: Sparkles },
      { title: 'Commission & Payouts', description: 'Incentive and target logic modelled on your real rules.', Icon: Gauge },
      { title: 'Permissions & Audit', description: 'Access levels and trails that keep sensitive data safe.', Icon: ShieldCheck },
      { title: 'Integrations', description: 'WhatsApp, payments, email and analytics connected in.', Icon: Puzzle },
    ],
    visual: 'code',
    visualChips: ['Lead Pipelines', 'Role Dashboards', 'Automations', 'Integrations'],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    work: ['unskills-computer-education-crm', 'ecommerce-retail-platform', 'quick-hotels'],
    leadView: 'get-software-built',
    prefill: 'software',
  },

  'service-mobile': {
    eyebrow: 'Mobile',
    headline: 'Apps people open',
    headlineAccent: 'more than once.',
    intro:
      'PWA-first and React Native builds that feel fast on a mid-range Android, without doubling the budget for a second platform.',
    deliverables: [
      { title: 'App UX & Flows', description: 'Journeys designed around how people actually use the thing.', Icon: Smartphone },
      { title: 'Cross-platform Build', description: 'Android, iOS and PWA from a single maintained codebase.', Icon: Code2 },
      { title: 'Backend & APIs', description: 'Auth, storage and admin controls wired up end to end.', Icon: Database },
      { title: 'Push & Notifications', description: 'Timely nudges that bring people back without spamming.', Icon: Sparkles },
      { title: 'Performance', description: 'Fast on mid-range devices and patchy connections.', Icon: Gauge },
      { title: 'Release & Support', description: 'Testing, store submissions, updates and maintenance.', Icon: Cloud },
    ],
    visual: 'code',
    visualChips: ['Mobile Apps', 'Offline Ready', 'Push & Alerts', 'Backend APIs'],
    tech: ['React Native', 'TypeScript', 'PWA', 'Supabase'],
    work: ['quick-hotels', 'unskills-education-website'],
    leadView: 'get-app-built',
    prefill: 'mobile',
  },

  'service-website': {
    eyebrow: 'Web',
    headline: 'Sites built to',
    headlineAccent: 'earn the enquiry.',
    intro:
      'Marketing sites, booking portals and storefronts built to be fast on a phone, readable by search engines and clear about the next step.',
    deliverables: [
      { title: 'Conversion Pages', description: 'Structure and copy layout aimed at one clear action.', Icon: Globe2 },
      { title: 'Responsive UI', description: 'Designed on a phone first, then scaled up to desktop.', Icon: Smartphone },
      { title: 'SEO Foundation', description: 'Metadata, structure and performance search engines reward.', Icon: Gauge },
      { title: 'Forms & Booking', description: 'Enquiry and booking flows connected to your sales process.', Icon: Puzzle },
      { title: 'Editable Sections', description: 'Reusable blocks so your team can update without us.', Icon: Blocks },
      { title: 'Deploy & Analytics', description: 'Launch, domains, analytics and post-launch fixes.', Icon: Cloud },
    ],
    visual: 'code',
    visualChips: ['Marketing Sites', 'Booking Flows', 'SEO Foundation', 'Analytics'],
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    work: ['herbal-vantage', 'spectrum-tour-travels', 'unskills-education-website'],
    leadView: 'get-website-built',
    prefill: 'website',
  },

  'service-social': {
    eyebrow: 'Marketing',
    headline: 'Content that shows up',
    headlineAccent: 'every single week.',
    intro:
      'Strategy, scripts and visuals that turn scattered posting into a monthly rhythm your audience recognises.',
    deliverables: [
      { title: 'Content Strategy', description: 'Monthly themes and pillars tied to what you sell.', Icon: Compass },
      { title: 'Reel Scripts', description: 'Hooks, structure and CTAs written for short-form.', Icon: Megaphone },
      { title: 'Carousel Design', description: 'Educational and authority-building creatives for Instagram.', Icon: Layers },
      { title: 'Brand Voice', description: 'Tone and formats that make your posts recognisable.', Icon: Users },
      { title: 'Product Visuals', description: 'Generated and edited assets for campaign storytelling.', Icon: Sparkles },
      { title: 'Monthly Delivery', description: 'Planning, revisions and publishing, handled for you.', Icon: Cloud },
    ],
    visual: 'abstract',
    tech: ['Content Strategy', 'Reels', 'Carousels', 'Brand Voice', 'AI Visuals'],
    techLabel: "What's included",
    work: [],
    leadView: 'get-social-media',
    prefill: 'not-sure',
  },

  'service-ads': {
    eyebrow: 'Performance',
    headline: 'Campaigns measured in',
    headlineAccent: 'leads, not likes.',
    intro:
      'Meta campaigns with tested creative, deliberate targeting and reporting tied to the numbers that matter to your business.',
    deliverables: [
      { title: 'Campaign Strategy', description: 'Audience, offer and budget planned before spend starts.', Icon: Compass },
      { title: 'Creative Testing', description: 'Hooks and visuals tested to find what actually converts.', Icon: Sparkles },
      { title: 'Targeting Setup', description: 'Cold, warm, retargeting and lookalike audiences structured.', Icon: Users },
      { title: 'Lead Funnels', description: 'Landing pages, forms and conversion tracking aligned.', Icon: Puzzle },
      { title: 'Budget Optimisation', description: 'Daily checks and scaling decisions based on real data.', Icon: Gauge },
      { title: 'Clear Reporting', description: 'Spend, leads, cost per lead and what we change next.', Icon: LifeBuoy },
    ],
    visual: 'abstract',
    tech: ['Meta Ads', 'A/B Testing', 'Retargeting', 'Funnels', 'Analytics'],
    techLabel: "What's included",
    work: [],
    leadView: 'get-ads',
    prefill: 'not-sure',
  },
};
