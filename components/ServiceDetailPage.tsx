import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ViewState } from '../types';
import { PROCESS, SERVICES, WHY, type ServiceKey } from '../lib/services';
import { useAllProjects } from '../hooks/useProjects';
import { toPortfolioItems } from '../lib/portfolio';
import { ProjectShowcaseCard } from './sections/ProjectShowcaseCard';
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
  const isCode = detail.visual === 'code';
  const startProject = () => onStartProjectWithService(detail.prefill);

  const { projects } = useAllProjects();
  const work = useMemo(() => {
    if (detail.work.length === 0) return [];
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return toPortfolioItems(
      detail.work.map((slug) => bySlug.get(slug)).filter((p): p is NonNullable<typeof p> => !!p)
    );
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

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {work.map((item) => (
              <ProjectShowcaseCard
                key={item.id}
                item={item}
                onOpen={(slug) => onOpenProject?.(slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ══ Process ══ */}
      <section className="svc-container svc-section relative z-10">
        <Eyebrow>Our process</Eyebrow>
        <h2 className="svc-h2 mt-5 max-w-[520px]">
          A simple process.
          <br />
          <em className="svc-accent">A powerful outcome.</em>
        </h2>

        <ol className="svc-steps mt-16">
          {PROCESS.map(({ step, title, description, Icon }) => (
            <li key={step} className="svc-step">
              <span className="svc-step__icon">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <span className="mt-6 block font-mono text-[11px] tracking-[0.18em] text-[#C084FC]">
                {step}
              </span>
              <h3 className="mt-2.5 text-[16.5px] font-medium text-[#F4F2F7]">{title}</h3>
              <p className="svc-body mt-2 max-w-[240px] text-[14px]">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ Why Pureflow ══ */}
      <section className="svc-container svc-section relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_2fr] lg:gap-16">
          <div>
            <Eyebrow>Why Pureflow</Eyebrow>
            <h2 className="svc-h2 mt-5">
              More than just
              <br />
              <em className="svc-accent">development.</em>
            </h2>
          </div>

          <ul className="svc-why">
            {WHY.map(({ title, description, Icon }) => (
              <li key={title} className="svc-why__item">
                <Icon className="h-[18px] w-[18px] text-[#C084FC]" strokeWidth={1.6} />
                <h3 className="mt-5 text-[15.5px] font-medium text-[#F4F2F7]">{title}</h3>
                <p className="svc-body mt-2 text-[14px]">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Final CTA ══ */}
      <section className="svc-container relative z-10 pb-28 sm:pb-32">
        <div className="svc-cta">
          <div className="relative z-10 max-w-[560px]">
            <Eyebrow>Let&rsquo;s build together</Eyebrow>
            <h2 className="svc-h2 mt-5">Have a project in mind?</h2>
            <p className="svc-body mt-5 max-w-[460px]">
              Tell us what you&rsquo;re working on. We&rsquo;ll come back with a fixed-price
              proposal in 48 hours.
            </p>
          </div>

          <button type="button" onClick={startProject} className="svc-btn group relative z-10">
            Start a project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </main>
  );
};
