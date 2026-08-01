import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Gauge,
  Globe2,
  Megaphone,
  Puzzle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { ViewState } from '../types';

type ServiceKey = Extract<
  ViewState,
  'service-software' | 'service-crm' | 'service-mobile' | 'service-website' | 'service-social' | 'service-ads'
>;

interface ServiceDetailPageProps {
  service: ServiceKey;
  onViewChange: (view: ViewState) => void;
  onServicesClick: () => void;
  /** Open the multi-step Start-a-Project flow with this service pre-selected. */
  onStartProjectWithService: (service: string) => void;
}

// Map each service page to the matching ServiceTier value used by the
// StartProjectPage's step-1 "What we wire up?" chip grid.
const SERVICE_PREFILL: Record<ServiceKey, string> = {
  'service-software': 'software',
  'service-crm':      'software',
  'service-mobile':   'mobile',
  'service-website':  'website',
  'service-social':   'not-sure',
  'service-ads':      'not-sure',
};

interface ServiceData {
  eyebrow: string;
  prefix: string;
  bigWord: string;
  description: string;
  leadView: ViewState;
  chips: string[];
  deliverables: [string, string, LucideIcon][];
}

const SERVICES: Record<ServiceDetailPageProps['service'], ServiceData> = {
  'service-software': {
    eyebrow: 'Development',
    prefix: 'Custom software built',
    bigWord: 'FOR YOU.',
    description:
      'Bespoke systems, dashboards, CRMs, ERPs, and internal tools that match the way your business actually works. No templates. No WordPress. Just clean, scalable software.',
    leadView: 'get-software-built',
    chips: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    deliverables: [
      ['Custom Web Apps', 'Full-stack apps built with Next.js and Supabase. Scalable, secure, and tailored to your workflows.', Code2],
      ['Database & Architecture', 'Robust schemas, RLS policies, and APIs that handle growth without re-architecting.', Database],
      ['Dashboards & Analytics', 'Live dashboards and reports that turn raw data into decisions you can act on.', BarChart3],
      ['Auth & Roles', 'Secure authentication, role-based access, and permission systems done right.', ShieldCheck],
      ['Integrations', 'Payment gateways, CRMs, APIs, WhatsApp, email — connected cleanly.', Puzzle],
      ['Deploy & Support', 'Vercel deployment, monitoring, performance tuning, and post-launch maintenance.', Cloud],
    ],
  },
  'service-crm': {
    eyebrow: 'Product',
    prefix: 'CRMs that replace',
    bigWord: 'SPREADSHEET CHAOS.',
    description:
      'One clean operating system for leads, tasks, reporting, commissions, and customer management — instead of 14 WhatsApp groups and a Google Sheet that lies.',
    leadView: 'get-software-built',
    chips: ['CRM Logic', 'Reports', 'Automation', 'Roles', 'APIs'],
    deliverables: [
      ['Lead Pipelines', 'Track every lead, deal stage, and follow-up in one reliable workspace.', Users],
      ['Custom Dashboards', 'Role-specific dashboards for founders, managers, and teams with live visibility.', BarChart3],
      ['Workflow Automation', 'Automate assignments, reminders, approvals, and status updates.', Sparkles],
      ['Commission Engines', 'Custom payout, incentive, target, and team performance logic.', Gauge],
      ['Data Permissions', 'Access levels, audit trails, and approval flows to keep sensitive data safe.', ShieldCheck],
      ['Integrations', 'WhatsApp, payments, email, analytics, and your existing tools — wired in.', Puzzle],
    ],
  },
  'service-mobile': {
    eyebrow: 'Mobile',
    prefix: 'Mobile apps that',
    bigWord: 'PEOPLE ACTUALLY USE.',
    description:
      'PWA-first and React Native experiences that feel fast, focused, and practical across Android and iOS — without doubling your budget.',
    leadView: 'get-app-built',
    chips: ['React Native', 'PWA', 'Android', 'iOS', 'Push'],
    deliverables: [
      ['App UX & Flows', 'Clean user journeys, onboarding, and dashboards shaped around real usage.', Smartphone],
      ['Cross-platform', 'One codebase for Android, iOS, and PWA experiences where it fits.', Code2],
      ['Backend & APIs', 'Secure APIs, auth, storage, and admin controls — fully wired up.', Database],
      ['Push & Notifications', 'Alerts and updates that bring users back without spamming them.', Sparkles],
      ['Performance', 'Fast loading, responsive screens, and mobile-first optimisation.', Gauge],
      ['Launch Support', 'Testing, store releases, updates, and ongoing maintenance.', Cloud],
    ],
  },
  'service-website': {
    eyebrow: 'Web',
    prefix: 'Websites built',
    bigWord: 'TO CONVERT.',
    description:
      'Fast, SEO-friendly marketing sites, booking portals, and business websites that communicate clearly and turn attention into action.',
    leadView: 'get-website-built',
    chips: ['Next.js', 'SEO', 'Tailwind CSS', 'Forms', 'Analytics'],
    deliverables: [
      ['Conversion Pages', 'Home, service, about, contact, and landing pages structured to convert.', Globe2],
      ['Responsive UI', 'Polished layouts across mobile, tablet, and desktop — no broken sections.', Smartphone],
      ['SEO Foundation', 'Metadata, structure, performance, and tech basics for real search visibility.', Gauge],
      ['Forms & Booking', 'Lead forms, booking flows, and WhatsApp links connected to your sales process.', Puzzle],
      ['CMS-ready', 'Reusable sections and scalable structure so the site grows with you.', Code2],
      ['Deploy & Analytics', 'Launch, domain, analytics, performance checks, and post-launch fixes.', Cloud],
    ],
  },
  'service-social': {
    eyebrow: 'Marketing',
    prefix: 'Social media for',
    bigWord: 'CONSISTENT DEMAND.',
    description:
      'Strategy, scripts, visuals, and brand voice that turn scattered content ideas into repeatable monthly output your audience actually engages with.',
    leadView: 'get-social-media',
    chips: ['Strategy', 'Reels', 'Carousels', 'AI Visuals', 'Brand Voice'],
    deliverables: [
      ['Content Strategy', 'Monthly themes, campaign angles, and content pillars matched to goals.', Sparkles],
      ['Reel Scripts', 'Short-form scripts with hooks, structure, and CTAs for consistent posting.', Megaphone],
      ['Carousel Design', 'Educational, promotional, and authority-building creatives for Instagram.', Globe2],
      ['Brand Voice', 'Tone, captions, and repeatable formats that make your brand recognisable.', Users],
      ['AI Product Visuals', 'Generated and edited assets for product, service, and campaign storytelling.', Puzzle],
      ['Monthly Management', 'Planning, delivery, revisions, and publishing — done for you.', Cloud],
    ],
  },
  'service-ads': {
    eyebrow: 'Performance',
    prefix: 'Ads that chase',
    bigWord: 'ROAS, NOT VANITY.',
    description:
      'Meta ad campaigns with practical copy, creative testing, targeting, and optimisation tied to leads, sales, and measurable growth.',
    leadView: 'get-ads',
    chips: ['Meta Ads', 'A/B Tests', 'Funnels', 'Retargeting', 'Reports'],
    deliverables: [
      ['Campaign Strategy', 'Audience, offer, funnel, and budget planning before money hits the ad account.', Megaphone],
      ['Creative Testing', 'Copy, visuals, hooks, and variations tested to find the strongest performers.', Sparkles],
      ['Targeting Setup', 'Cold, warm, retargeting, and lookalike audiences structured around campaign goals.', Users],
      ['Lead Funnels', 'Landing pages, forms, events, and conversion tracking aligned end-to-end.', BarChart3],
      ['Budget Optimisation', 'Daily checks, spend allocation, and scaling decisions based on real data.', Gauge],
      ['Reporting', 'Clear reporting on spend, leads, CPL, winners, losers, and next moves.', ShieldCheck],
    ],
  },
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onViewChange,
  onServicesClick,
  onStartProjectWithService,
}) => {
  const reduced = useReducedMotion();
  const detail = SERVICES[service];
  const startProject = () => onStartProjectWithService(SERVICE_PREFILL[service]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.06] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        {/* Breadcrumb */}
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/45 sm:mb-10" aria-label="Breadcrumb">
          <button onClick={() => onViewChange('home')} className="transition-colors hover:text-white">
            Home
          </button>
          <span>/</span>
          <button onClick={onServicesClick} className="transition-colors hover:text-white">
            Services
          </button>
          <span>/</span>
          <span className="text-white/85">{detail.eyebrow}</span>
        </nav>

        {/* ── Hero ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <p className="gradient-flow-text mb-4 text-[10px] font-bold uppercase tracking-[0.22em]">
            {detail.eyebrow}
          </p>
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            {detail.prefix}
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text={detail.bigWord}
          >
            {detail.bigWord}
          </span>
          <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-white/60 sm:text-base">
            {detail.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {detail.chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex h-8 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 text-[11.5px] font-semibold text-white/85"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff3f8d]" />
                {chip}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={startProject}
            className="mt-9 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] active:scale-[0.99] sm:h-14 sm:px-9 sm:text-[15px]"
          >
            Start this project
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11.5px] text-white/45 sm:gap-x-6">
            {['Fixed-price in 48 hours', '4-week sprints', 'Full code ownership'].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[#ff3f8d]" strokeWidth={2} />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Deliverables ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center text-center sm:mb-12"
        >
          <span className="font-serif italic text-white/95 text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1]">
            What you
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.25rem,5vw,4.5rem)]"
            data-text="ACTUALLY GET."
          >
            ACTUALLY GET.
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {detail.deliverables.map(([title, description, Icon], i) => (
            <motion.article
              key={title}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#08060d] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3f8d]/45 sm:p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/85 bg-black text-white shadow-[0_0_24px_-12px_rgba(255,255,255,0.4)] sm:h-11 sm:w-11">
                <Icon className="h-5 w-5" strokeWidth={1.9} />
              </div>
              <h3 className="font-sans text-[1.05rem] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[1.1rem]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60 sm:text-[13.5px]">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24 sm:px-6 lg:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] p-7 text-center sm:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.14) 0%, transparent 55%)',
            }}
          />
          <h3 className="relative font-sans text-[1.4rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.7rem]">
            Ready to scope this in?
          </h3>
          <p className="relative mt-3 text-[14px] text-white/60 sm:text-[15px]">
            Send a 2-line brief, get a fixed-price proposal in 48 hours.
          </p>
          <button
            onClick={startProject}
            className="relative mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-14 sm:px-9 sm:text-[15px]"
          >
            Start this project
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>
    </main>
  );
};
