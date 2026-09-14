import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ViewState } from '../types';
import { PROCESS, PROCESS_DEFAULT_ACTIVE, SERVICES, WHY, type ServiceKey } from '../lib/services';
import { useAllProjects } from '../hooks/useProjects';
import { toPortfolioItems } from '../lib/portfolio';
import { SelectedWorkCard, toSelectedWorkItem } from './sections/SelectedWorkCard';
import { HeroVisual } from './service/HeroVisual';
import { CodeEditorVisual } from './service/CodeEditorVisual';
import { TechMark } from './service/TechMark';

// ─────────────────────────────────────────────────────────────────────────────
// ServiceDetailPage — the page behind each card in the Services section.
//
// Section order follows one question each: what do you build (hero) → what can
// you build for me (deliverables) → can you build it well (technology) → have
// you built this before (work) → what will it feel like (process) → why you
// (why) → what next (CTA).
//
// Selected Work renders real case studies only. A service with nothing shipped
// under it drops the section rather than filling it with invented projects.
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceDetailPageProps {
  service: ServiceKey;
  onViewChange: (view: ViewState) => void;
  onServicesClick: () => void;
  onStartProjectWithService: (service: string) => void;
  onOpenProject?: (slug: string) => void;
}

/** What every engagement includes, whichever service brought you here. */
const ASSURANCES = [
  'Fixed-price proposals',
  'Scope doc in 48 hours',
  '30-day post-launch support',
  'GST invoices included',
];

/** Small uppercase section label. The only place the accent colour repeats. */
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="svc-eyebrow">{children}</p>
);

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onViewChange,
  onServicesClick,
  onStartProjectWithService,
  onOpenProject,
}) => {
  const detail = SERVICES[service];
  const reduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(PROCESS_DEFAULT_ACTIVE);
  const isCode = detail.visual === 'code';
  const startProject = () => onStartProjectWithService(detail.prefill);

  const { projects } = useAllProjects();
  const work = useMemo(() => {
    if (detail.work.length === 0) return [];
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return toPortfolioItems(
      detail.work.map((slug) => bySlug.get(slug)).filter((p): p is NonNullable<typeof p> => !!p)
    ).map(toSelectedWorkItem);
  }, [projects, detail.work]);

  return (
    <main className="svc-page relative min-h-[100svh] overflow-hidden">
      {/* One atmospheric wash for the whole page, not a glow per section */}
      <div className="svc-page__wash pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />

      {/* ══ Hero ══ */}
      <section className="svc-container relative z-10 pt-28 sm:pt-32 lg:pt-36">
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-[12px] text-[#96939F]" aria-label="Breadcrumb">
          <button onClick={() => onViewChange('home')} className="transition-colors hover:text-[#F4F2F7]">
            Home
          </button>
          <span className="text-white/20">/</span>
          <button onClick={onServicesClick} className="transition-colors hover:text-[#F4F2F7]">
            Services
          </button>
          <span className="text-white/20">/</span>
          <span className="text-[#F4F2F7]">{detail.eyebrow}</span>
        </nav>

        {/* The visual column is a definite width, not `auto`: the visual inside
            it is `w-full`, which resolves to zero against a content-sized track
            and silently empties the right half of the hero. The code scene needs
            more room than the abstract one before its code stops being legible. */}
        <div
          className={`grid items-center gap-14 lg:gap-9 xl:gap-9 ${
            isCode
              ? 'lg:grid-cols-[minmax(0,1fr)_470px] xl:grid-cols-[minmax(0,1fr)_620px]'
              : 'lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_460px]'
          }`}
        >
          {/* Stacked, the image leads and the copy follows. The DOM keeps the
              headline first, so a screen reader still meets the page's subject
              before its illustration. */}
          <div className="order-2 max-w-[660px] lg:order-1">
            <p className="svc-eyebrow flex items-center gap-2.5">
              <span className="svc-eyebrow__dot" />
              {detail.eyebrow}
            </p>

            {/* The accent phrase takes its own line, so the gradient always
                starts a line rather than landing mid-sentence wherever the
                text happens to wrap. */}
            <h1 className="svc-h1 mt-6">
              {detail.headline}
              <span className="svc-accent block">{detail.headlineAccent}</span>
            </h1>

            <p className="svc-lead mt-6 max-w-[500px]">{detail.intro}</p>

            <div className="svc-actions mt-10 flex items-center gap-3 sm:gap-4">
              <button type="button" onClick={startProject} className="svc-btn group">
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onViewChange('work')}
                className="svc-btn-ghost group"
              >
                See our work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

          </div>

          {/* The scene fits its column. It used to spill past the container's
              right edge, which read as a graphic falling off the page. */}
          <div className="svc-hero-visual order-1 flex justify-center lg:order-2 lg:justify-end">
            {detail.heroImage ? (
              /* WebP first, PNG for the handful of browsers without it. The
                 intrinsic size is declared so the hero never reflows once the
                 image lands. */
              <picture className="svc-hero-img">
                <source srcSet={`${detail.heroImage}.webp`} type="image/webp" />
                <img
                  src={`${detail.heroImage}.png`}
                  alt={detail.heroImageAlt ?? ''}
                  width={1200}
                  height={800}
                  loading="eager"
                  decoding="async"
                />
              </picture>
            ) : isCode ? (
              <CodeEditorVisual
                chips={detail.visualChips ?? detail.deliverables.map((d) => d.title)}
              />
            ) : (
              <HeroVisual />
            )}
          </div>
        </div>

        {/* The stack runs the full width under the hero rather than inside the
            copy column. In the column it squeezed the headline, forced the
            chips onto two rows, and made the left side tall enough to leave the
            image stranded in a lot of empty space. */}
        <div className="mt-16 border-t border-white/[0.07] pt-10">
          <Eyebrow>{detail.techLabel ?? 'Built with'}</Eyebrow>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {detail.tech.map((name) => (
              <li key={name} className="svc-tech">
                {/* Only the build services carry brand marks. On the marketing
                    pages these chips are capabilities, not libraries, and an
                    initials badge beside one reads as a logo that failed to
                    load. */}
                {isCode && <TechMark name={name} className="svc-tech__mark" />}
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ What we build ══ */}
      <section className="svc-build svc-container svc-section relative z-10">
        {/* Two soft washes at the section's edges. Purely atmospheric, sitting
            behind the content and never crossing where text reads. */}
        <div className="svc-build__glow" aria-hidden="true" />

        <header className="relative grid gap-9 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-16">
          <div>
            <p className="svc-eyebrow svc-eyebrow--rule">What we build</p>
            <h2 className="svc-h2 svc-h2--strong mt-6">
              Everything you need to
              <em className="svc-accent block">build, scale and grow.</em>
            </h2>
          </div>

          <p className="svc-note">
            Six things we deliver inside this service. If your project needs only two of
            them, that is the project we scope.
          </p>
        </header>

        <ul className="svc-cards">
          {detail.deliverables.map(({ title, description, Icon }, i) => (
            <li key={title}>
              <button type="button" onClick={startProject} className="svc-card">
                <span className="svc-card__top">
                  <span className="svc-card__icon">
                    <Icon className="h-[21px] w-[21px]" strokeWidth={1.6} />
                  </span>
                  <span className="svc-card__num">{String(i + 1).padStart(2, '0')}</span>
                </span>

                <h3 className="svc-card__title">{title}</h3>
                <p className="svc-card__desc">{description}</p>

                <span className="svc-card__link">
                  Learn more
                  <ArrowRight className="svc-card__arrow h-4 w-4" strokeWidth={2} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ Selected work — real projects only ══ */}
      {work.length > 0 && (
        <section className="svc-container svc-section relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Selected work</Eyebrow>
              <h2 className="svc-h2 mt-5">
                Real businesses.
                <br />
                <em className="svc-accent">Real software.</em>
              </h2>
            </div>
            <button onClick={() => onViewChange('work')} className="svc-link group">
              View all work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Same card as the homepage "Selected work" grid — see
              sections/SelectedWorkCard.tsx. The middle card of a full row
              carries the purple emphasis, exactly as it does there. */}
          <div className="mt-10 grid grid-cols-1 justify-items-center gap-4 sm:mt-14 sm:grid-cols-2 sm:justify-items-stretch sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {work.map((item, i) => (
              <SelectedWorkCard
                key={item.slug}
                item={{ ...item, featured: work.length === 3 && i === 1 }}
                index={i + 1}
                onOpen={(slug) => onOpenProject?.(slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ══ Process ══ */}
      <section className="pr-section svc-container svc-section relative z-10">
        <span aria-hidden="true" className="pr-glow" />

        <div className="pr-head relative z-10">
          <Eyebrow>Our process</Eyebrow>
          <p className="pr-kicker mt-4">From first call to</p>
          <h2 className="mt-1">
            <span className="hero-automation-text pr-display" data-text="LIVE IN 4 WEEKS.">
              LIVE IN 4 WEEKS.
            </span>
          </h2>
        </div>

        <ol className="pr-steps">
          {PROCESS.map(({ step, week, title, description, tags, Icon }, i) => (
            <li
              key={step}
              className={`pr-step ${i === activeStep ? 'is-active' : ''} ${
                i < activeStep ? 'is-lit' : ''
              }`}
              onMouseEnter={() => setActiveStep(i)}
            >
              {/* The rail segment reaching the next node. */}
              {i < PROCESS.length - 1 && (
                <motion.span
                  aria-hidden="true"
                  className="pr-line"
                  /* opacity carries the mobile rail, which is vertical and so is
                     not drawn by scaleX. */
                  initial={reduced ? false : { scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: reduced ? 0 : 0.12 + i * 0.16,
                  }}
                />
              )}

              <motion.span
                className="pr-node"
                initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : i * 0.16 }}
              >
                <Icon className="h-[19px] w-[19px]" strokeWidth={1.5} aria-hidden="true" />
              </motion.span>

              <motion.div
                className="pr-body"
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: reduced ? 0 : 0.1 + i * 0.16,
                }}
              >
                <span className="pr-num">{step}</span>
                <span className="pr-week">{week}</span>
                <h3 className="pr-title">{title}</h3>
                <p className="pr-desc">{description}</p>
                <ul className="pr-tags">
                  {tags.map((t) => (
                    <li key={t} className="pr-tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ Why Pureflow ══ */}
      <section className="why-section svc-container svc-section relative z-10">
        {/* Gradient the icon strokes pick up via `stroke: url(#whyGrad)`. */}
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            <linearGradient id="whyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff2f8a" />
              <stop offset="0.55" stopColor="#e52cff" />
              <stop offset="1" stopColor="#8b3dff" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,2fr)] lg:items-start lg:gap-14">
          <div className="why-head">
            <span className="why-pill">Why Pureflow</span>

            <h2 className="mt-6">
              <span className="hero-automation-text why-display" data-text="MORE THAN">
                MORE THAN
              </span>
              <span className="hero-automation-text why-display" data-text="JUST CODE.">
                JUST CODE.
              </span>
            </h2>

            <p className="why-tagline mt-4">We build the business, not the backlog.</p>
          </div>

          <ul className="why-cards">
            {WHY.map(({ title, description, Icon }) => (
              <li key={title} className="why-card">
                <Icon className="why-card__icon" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="why-card__title">{title}</h3>
                <p className="why-card__desc">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Final CTA ══ */}
      {/* `svc-section` for the top margin: every other section on this page
          carries it, and without it the card butts straight up against the end
          of "Why Pureflow". */}
      <section className="svc-container svc-section relative z-10 pb-24 sm:pb-32">
        <div className="cta-card">
          <span aria-hidden="true" className="cta-card__grid" />
          <span aria-hidden="true" className="cta-card__glow" />

          <div className="cta-card__inner">
            <span className="cta-pill">
              <span aria-hidden="true" className="cta-pill__dot" />
              Taking new projects
            </span>

            {/* Kept to one line at every width — see `.cta-display`. Wrapped,
                this always breaks at the hyphen ("BOOK THE 45- / MINUTE CALL."),
                and the usual fix, a non-breaking hyphen, is not available:
                Anton has no U+2011, so it would render that one glyph from a
                fallback face in the middle of the heading. */}
            <h2 className="mt-7">
              <span className="hero-automation-text cta-display" data-text="BOOK THE 45-MINUTE CALL.">
                BOOK THE 45-MINUTE CALL.
              </span>
            </h2>

            <p className="cta-lead mt-5">
              You&rsquo;ve seen how we work. Tell us what you&rsquo;re building and we&rsquo;ll come
              back with a fixed-price proposal in 48 hours.
            </p>

            <div className="cta-actions mt-9">
              <button type="button" onClick={() => onViewChange('book-call')} className="svc-btn group">
                Book a 45-min call
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button type="button" onClick={startProject} className="cta-ghost">
                Send project details
              </button>
            </div>

            <ul className="cta-assurances">
              {ASSURANCES.map((item) => (
                <li key={item} className="cta-assurance">
                  <Check className="h-[15px] w-[15px] flex-none" strokeWidth={2.4} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};
