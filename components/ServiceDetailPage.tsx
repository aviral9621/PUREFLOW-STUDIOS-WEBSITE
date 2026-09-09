import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ViewState } from '../types';
import { PROCESS, SERVICES, WHY, type ServiceKey } from '../lib/services';
import { useAllProjects } from '../hooks/useProjects';
import { toPortfolioItems } from '../lib/portfolio';
import { ProjectShowcaseCard } from './sections/ProjectShowcaseCard';
import { HeroVisual } from './service/HeroVisual';

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

        <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="max-w-[600px]">
            <Eyebrow>{detail.eyebrow}</Eyebrow>

            <h1 className="svc-h1 mt-5">
              {detail.headline}{' '}
              <em className="svc-accent">{detail.headlineAccent}</em>
            </h1>

            <p className="svc-lead mt-6 max-w-[520px]">{detail.intro}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <button type="button" onClick={startProject} className="svc-btn group">
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onViewChange('work')}
                className="svc-link group"
              >
                See our work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {detail.assurances.map(([text, Icon]) => (
                <li key={text} className="flex items-center gap-2.5 text-[13.5px] text-[#96939F]">
                  <Icon className="h-4 w-4 text-[#C084FC]" strokeWidth={1.6} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ══ What we build ══ */}
      <section className="svc-container svc-section relative z-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <Eyebrow>What we build</Eyebrow>
            <h2 className="svc-h2 mt-5">
              Everything you need to
              <br />
              <em className="svc-accent">build, scale and grow.</em>
            </h2>
          </div>
          <p className="svc-body max-w-[440px] md:justify-self-end">
            Six things we deliver inside this service. If your project needs only two of
            them, that is the project we scope.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {detail.deliverables.map(({ title, description, Icon }, i) => (
            <article key={title} className="svc-cell group">
              <div className="flex items-start justify-between">
                <span className="svc-cell__icon">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-white/20">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-7 text-[16.5px] font-medium tracking-[-0.01em] text-[#F4F2F7]">
                {title}
              </h3>
              <p className="svc-body mt-2.5 text-[14px]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ══ Technology ══ */}
      <section className="svc-container svc-section relative z-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.15fr] md:items-start md:gap-16">
          <div>
            <Eyebrow>Technologies we work with</Eyebrow>
            <h2 className="svc-h2 mt-5">
              Modern tools.
              <br />
              <em className="svc-accent">Better results.</em>
            </h2>
          </div>

          <div>
            <ul className="flex flex-wrap gap-2.5">
              {detail.tech.map((name) => (
                <li key={name} className="svc-chip">
                  {name}
                </li>
              ))}
            </ul>
            <p className="svc-body mt-7 max-w-[440px] text-[14px]">
              We pick tools for the requirement, not for whatever happens to be popular
              this year.
            </p>
          </div>
        </div>
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
