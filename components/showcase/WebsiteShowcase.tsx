import React, { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  FileText,
  Gauge,
  Globe,
  LogIn,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  Ticket,
  type LucideIcon,
} from 'lucide-react';
import { ViewState } from '../../types';
import type { Showcase, SiteDetails, SiteFeatureIcon, SitePage } from '../../lib/showcases';
import { Footer } from '../Footer';
import {
  SECTION,
  WRAP,
  Brief,
  Closing,
  DesignSystem,
  Dot,
  Eyebrow,
  Heading,
  Hero,
  Impact,
  Reveal,
  Still,
  Wash,
  Words,
  Zoomable,
  useSpecimenFonts,
} from './parts';

// ─────────────────────────────────────────────────────────────────────────────
// WebsiteShowcase — the project page for a website (a showcase with `site`).
// A website is judged on what a visitor can find and do, so the story differs
// from the software page (problem → process → modules):
//
//   Hero ················ logo, statement, focus, "Visit <site>", the site
//   The brief ··········· facts + live link
//   What it had to DO. ·· the jobs the site was built for
//   The SITEMAP. ········ the menu as built, as a tree
//   How we BUILT IT. ···· the website process, left to right
//   Page by PAGE. ······· the key pages: what each one does, then the page
//   Every SCREEN. ······· phone stills
//   Under the HOOD. ····· features beyond the looks
//   The design SYSTEM. ·· the client's palette + type
//   The site TODAY. ····· real numbers from the live site
//   In their WORDS. ····· if there's a testimonial
//   LET'S BUILD YOURS.
//
// Same Pureflow look as every other page (parts.tsx). Data: lib/showcases.ts.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  showcase: Showcase;
  onViewChange: (view: ViewState) => void;
  onOpenProject?: (slug: string) => void;
}

export const WebsiteShowcase: React.FC<Props> = ({ showcase: s, onViewChange }) => {
  const reduced = !!useReducedMotion();
  const site = s.site!;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [s.slug]);
  useSpecimenFonts(s.type);

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <Hero
        s={s}
        reduced={reduced}
        onBack={() => onViewChange('work')}
        eyebrow="Website case study"
        visual={s.hero ?? site.pages[0]?.image}
        live={site.url ? { href: site.url, label: site.label } : undefined}
        zoom
      />
      <Brief s={s} reduced={reduced} />
      <Goals site={site} reduced={reduced} />
      <Sitemap site={site} reduced={reduced} />
      <Build site={site} reduced={reduced} />
      <Pages site={site} reduced={reduced} />
      {site.screens.length > 0 && <Screens site={site} reduced={reduced} />}
      {site.builtIn.length > 0 && <Hood site={site} reduced={reduced} />}
      <DesignSystem
        s={s}
        reduced={reduced}
        note="The client’s own brand, carried through every page: their colours, their type."
        zoom
      />
      {s.impact.length > 0 && (
        <Impact s={s} reduced={reduced} lead="The site" word="TODAY." note={site.todayNote} />
      )}
      {s.testimonial && <Words s={s} reduced={reduced} />}
      <Closing
        lead={s.ctaLead ?? 'Need a website that brings in enquiries?'}
        reduced={reduced}
        onStart={() => onViewChange('start-project')}
        onCall={() => onViewChange('book-call')}
      />
      <Footer onViewChange={onViewChange} />
    </main>
  );
};

type SectionProps = { site: SiteDetails; reduced: boolean };

const pad = (n: number) => String(n).padStart(2, '0');

const Goals: React.FC<SectionProps> = ({ site, reduced }) => (
  <section className={SECTION}>
    <Wash at="15% 0%" />
    <div className={`relative ${WRAP}`}>
      <Reveal reduced={reduced}>
        <Heading lead="What it had to" word="DO." />
      </Reveal>
      <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {site.goals.map((g, i) => (
          <Reveal key={g.title} reduced={reduced} delay={i * 0.06}>
            <div className="flex h-full gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-col sm:gap-0 sm:rounded-[22px] sm:p-7">
              <span className="sc-num w-10 flex-none text-[30px] leading-none sm:w-auto sm:text-[48px]">{pad(i + 1)}</span>
              <div>
                <h3 className="text-[17px] font-semibold leading-[1.3] tracking-[-0.01em] text-white sm:mt-6 sm:text-[20px]">
                  {g.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-white/60 sm:mt-3 sm:text-[15px] sm:leading-[1.65]">
                  {g.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/** The menu as a tree: the domain on top, one branch per top-level item. */
const Sitemap: React.FC<SectionProps> = ({ site, reduced }) => {
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <Reveal reduced={reduced} className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading lead="The" word="SITEMAP." />
          <p className="max-w-[520px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">
            The menu as built: {site.sitemap.length} menus, so every course, form and check is two clicks from
            the homepage.
          </p>
        </Reveal>

        <Reveal reduced={reduced} delay={0.08} className="mt-12 sm:mt-16">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-5 py-2.5 font-mono text-[12px] text-white/85 sm:text-[13px]">
              <Globe className="h-4 w-4 text-[#d946ef]" />
              {site.label}
            </span>
          </div>
          {/* Trunk + branch rail (desktop only; phones read the groups as a list). */}
          <div aria-hidden="true" className="mx-auto hidden h-8 w-px bg-white/[0.14] lg:block" />
          <div
            aria-hidden="true"
            className="hidden h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent lg:block"
          />
          <ul
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-0 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
            style={{ ['--n' as string]: site.sitemap.length }}
          >
            {site.sitemap.map((g) => (
              <li key={g.group} className="flex flex-col">
                <span aria-hidden="true" className="mx-auto hidden h-6 w-px bg-white/[0.14] lg:block" />
                <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:rounded-[20px] sm:p-5">
                  <p className="flex items-center gap-2 text-[15px] font-semibold text-white">
                    <Dot />
                    {g.group}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-l border-white/[0.1] pl-3">
                    {g.pages.map((pg) => (
                      <li key={pg} className="text-[13px] leading-[1.45] text-white/55 sm:text-[13.5px]">
                        {pg}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

/** The website process as a left-to-right line of steps (a list on phones). */
const Build: React.FC<SectionProps> = ({ site, reduced }) => (
  <section className={SECTION}>
    <Wash at="85% 0%" />
    <div className={`relative ${WRAP}`}>
      <Reveal reduced={reduced}>
        <Heading lead="How we" word="BUILT IT." />
      </Reveal>
      <ol
        className="relative mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-6"
        style={{ ['--n' as string]: site.build.length }}
      >
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] opacity-50 lg:block"
        />
        {site.build.map((b, i) => (
          <Reveal key={b.title} reduced={reduced} delay={i * 0.06}>
            <li className="relative flex gap-5 lg:block">
              <span
                aria-hidden="true"
                className="mt-1 block h-[15px] w-[15px] flex-none rounded-full border-2 border-[#050505] bg-gradient-to-r from-[#ff2f86] to-[#a855f7] shadow-[0_0_16px_rgba(217,70,239,0.6)] lg:mt-0"
              />
              <div className="lg:mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">Step {pad(i + 1)}</p>
                <h3 className="mt-2 text-[18px] font-semibold text-white sm:text-[19px]">{b.title}</h3>
                <p className="mt-2 max-w-[340px] text-[14.5px] leading-[1.6] text-white/55">{b.text}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

const Pages: React.FC<SectionProps> = ({ site, reduced }) => (
  <section className={SECTION}>
    <div className={WRAP}>
      <Reveal reduced={reduced}>
        <Eyebrow>{site.pages.length} key pages</Eyebrow>
        <Heading lead="Page by" word="PAGE." className="mt-5" />
      </Reveal>
      {site.pages.map((p, i) => (
        <PageBlock key={p.path} p={p} index={i} reduced={reduced} />
      ))}
    </div>
  </section>
);

/** One page: name and what it does on top, the page image full width below
 *  (a 2:1 image with callouts needs the width to stay readable). */
const PageBlock: React.FC<{ p: SitePage; index: number; reduced: boolean }> = ({ p, index, reduced }) => (
  <article className="mt-14 border-t border-white/[0.08] pt-10 sm:mt-20 sm:pt-14">
    <Reveal reduced={reduced} className="grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
      <div>
        <div className="flex items-end gap-4">
          <span className="sc-num text-[44px] leading-[0.9] sm:text-[56px]">{pad(index + 1)}</span>
          <h3 className="font-anton text-[clamp(2rem,3.6vw,2.9rem)] uppercase leading-[0.95] tracking-[0.01em] text-white">
            {p.name}
          </h3>
        </div>
        <p className="mt-4 font-mono text-[12px] text-white/40">{p.path}</p>
      </div>
      <div>
        <p className="max-w-[560px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">{p.summary}</p>
        {p.features.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.features.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-white/80"
              >
                <Dot />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
    {p.image && (
      <Reveal reduced={reduced} delay={0.06} className="mt-8 sm:mt-12">
        <Zoomable image={p.image}>
          <Still image={p.image} className="shadow-[0_40px_120px_-50px_rgba(217,70,239,0.45)]" />
        </Zoomable>
      </Reveal>
    )}
  </article>
);

/** Phone stills in a coded phone frame, side by side. */
const Screens: React.FC<SectionProps> = ({ site, reduced }) => (
  <section className={SECTION}>
    <Wash />
    <div className={`relative ${WRAP}`}>
      <Reveal reduced={reduced} className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <Heading lead="Built for every" word="SCREEN." />
        <p className="max-w-[520px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">
          Most visitors arrive on a phone. Every page is designed for a thumb first, then scaled up.
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
        style={{ ['--n' as string]: site.screens.length }}
      >
        {site.screens.map((img, i) => (
          <Reveal key={img.src} reduced={reduced} delay={i * 0.06} className={i % 2 ? 'lg:mt-12' : ''}>
            <div className="overflow-hidden rounded-[26px] border-[5px] border-[#1d1b22] bg-black shadow-[0_40px_80px_-40px_rgba(217,70,239,0.5)] sm:rounded-[34px] sm:border-[7px]">
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const ICONS: Record<SiteFeatureIcon, LucideIcon> = {
  search: Search,
  form: FileText,
  shield: ShieldCheck,
  ticket: Ticket,
  star: Star,
  chat: MessageCircle,
  map: MapPin,
  seo: Globe,
  login: LogIn,
  phone: Smartphone,
  gauge: Gauge,
  cart: ShoppingCart,
};

const Hood: React.FC<SectionProps> = ({ site, reduced }) => (
  <section className={SECTION}>
    <div className={WRAP}>
      <Reveal reduced={reduced} className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <Heading lead="Under the" word="HOOD." />
        <p className="max-w-[520px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">
          A good-looking site is the start. These are the things it does for the business every day.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-2.5 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {site.builtIn.map((f, i) => {
          const Icon = ICONS[f.icon];
          return (
            <Reveal key={f.title} reduced={reduced} delay={(i % 4) * 0.05}>
              <div className="flex h-full gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:block sm:rounded-[22px] sm:p-6">
                <span className="inline-flex h-fit flex-none rounded-xl bg-gradient-to-br from-[#ff2f86]/60 to-[#a855f7]/60 p-px">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#0d0b12] sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-white sm:mt-5 sm:text-[17px]">{f.title}</h3>
                  <p className="mt-1 text-[14px] leading-[1.55] text-white/55 sm:mt-2 sm:text-[14.5px] sm:leading-[1.6]">
                    {f.text}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
