// ─────────────────────────────────────────────────────────────────────────────
// SSG entry — loaded by scripts/prerender.mjs through Vite's SSR module loader
// after `vite build`. For every indexable route it renders the page's REAL React
// component to static HTML, so crawlers that don't run JavaScript see the same
// headings, copy and links a visitor sees (the prerender then reduces that
// markup to clean semantic HTML and puts it inside #root, where React replaces
// it on mount). It also exposes the route list and the per-route meta, so the
// sitemap, titles and canonicals all come from the app's own sources
// (lib/router.ts, lib/seo.ts, lib/caseStudies.ts, lib/showcases.ts, lib/blog.ts).
//
// Effects never run on the server, so data hooks render their initial state
// (the bundled project/case-study data) and nothing touches the network.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { ViewState } from '../types';
import { STATIC_ROUTES, viewToPath } from '../lib/router';
import { resolveMeta, META } from '../lib/seo';
import { CASE_STUDIES } from '../lib/caseStudies';
import { SHOWCASES } from '../lib/showcases';
import { POSTS } from '../lib/blog';
import { SERVICES, WHY, type ServiceKey } from '../lib/services';
import { ThemeProvider } from '../components/ThemeContext';

const noop = () => {};

/** Lead-form and booking flows: useful pages, but not search landing pages —
 *  kept out of the index and the sitemap (`noindex, follow`). */
const NOINDEX: ViewState[] = [
  'start-project',
  'start',
  'book-call',
  'get-website-built',
  'get-software-built',
  'get-app-built',
  'get-social-media',
  'get-ads',
];

export interface Route {
  view: ViewState;
  slug: string | null;
  path: string;
  index: boolean;
}

export function routes(): Route[] {
  const out: Route[] = STATIC_ROUTES.map(({ view, path }) => ({
    view,
    slug: null,
    path,
    index: !NOINDEX.includes(view),
  }));
  const work = new Set<string>([...SHOWCASES.map((s) => s.slug), ...CASE_STUDIES.map((c) => c.slug)]);
  work.forEach((slug) => out.push({ view: 'work-post', slug, path: viewToPath('work-post', slug), index: true }));
  POSTS.forEach((p) => out.push({ view: 'blog-post', slug: p.slug, path: viewToPath('blog-post', p.slug), index: true }));
  return out;
}

export function meta(view: ViewState, slug: string | null) {
  return { ...resolveMeta(view, slug), h1: META[view]?.title ?? '' };
}

/** The page component(s) the app renders for a route, without the navbar. */
async function page(view: ViewState, slug: string | null): Promise<React.ReactElement> {
  const common = { onViewChange: noop, onOpenProject: noop, onOpenPost: noop, onStartProject: noop } as const;
  switch (view) {
    case 'home': {
      const [{ Hero }, { WorkStack }, { Services }, { Process }, { About }, { FinalCTA }, { GoodStuff }] = await Promise.all([
        import('../components/sections/Hero'),
        import('../components/sections/WorkStack'),
        import('../components/sections/Services'),
        import('../components/sections/Process'),
        import('../components/sections/About'),
        import('../components/sections/FinalCTA'),
        import('../components/sections/GoodStuff'),
      ]);
      return (
        <>
          <Hero onViewChange={noop} onOpenContact={noop} onStartProject={noop} onBookCall={noop} />
          <WorkStack onOpenProject={noop} onStartProject={noop} onViewAll={noop} />
          <Services onViewChange={noop} />
          <Process />
          <About onStartProject={noop} />
          <FinalCTA onOpenContact={noop} onStartProject={noop} onBookCall={noop} />
          <GoodStuff onViewChange={noop} onOpenPost={noop} />
        </>
      );
    }
    case 'services': {
      const { Services } = await import('../components/sections/Services');
      return <Services onViewChange={noop} />;
    }
    case 'service-software':
    case 'service-crm':
    case 'service-mobile':
    case 'service-website':
    case 'service-social':
    case 'service-ads': {
      const { ServiceDetailPage } = await import('../components/ServiceDetailPage');
      return (
        <ServiceDetailPage
          service={view}
          onViewChange={noop}
          onServicesClick={noop}
          onStartProjectWithService={noop}
          onOpenProject={noop}
        />
      );
    }
    case 'work': {
      const { WorkIndexPage } = await import('../components/WorkIndexPage');
      return <WorkIndexPage {...common} />;
    }
    case 'work-post': {
      const { getShowcaseBySlug } = await import('../lib/showcases');
      const { getCaseStudyBySlug } = await import('../lib/caseStudies');
      const sc = getShowcaseBySlug(slug);
      if (sc) {
        const { ShowcasePage } = await import('../components/showcase/ShowcasePage');
        return <ShowcasePage showcase={sc} {...common} />;
      }
      const cs = getCaseStudyBySlug(slug);
      if (!cs) throw new Error(`no case study for ${slug}`);
      const { CaseStudyPage } = await import('../components/casestudy/CaseStudyPage');
      return <CaseStudyPage caseStudy={cs} {...common} />;
    }
    case 'blog': {
      const { BlogIndexPage } = await import('../components/BlogIndexPage');
      return <BlogIndexPage {...common} />;
    }
    case 'blog-post': {
      const { BlogPostPage } = await import('../components/BlogPostPage');
      return <BlogPostPage slug={slug!} {...common} />;
    }
    case 'about': {
      const { AboutPage } = await import('../components/AboutPage');
      return <AboutPage {...common} />;
    }
    case 'contact': {
      const { ContactPage } = await import('../components/ContactPage');
      return <ContactPage {...common} />;
    }
    case 'crm-demo': {
      const { CrmDemoPage } = await import('../components/CrmDemoPage');
      return <CrmDemoPage {...common} />;
    }
    case 'automation-video': {
      const { AutomationPage } = await import('../components/AutomationPage');
      return <AutomationPage {...common} />;
    }
    case 'refund-policy': {
      const { RefundPolicyPage } = await import('../components/RefundPolicyPage');
      return <RefundPolicyPage {...common} />;
    }
    case 'privacy':
    case 'terms':
    case 'cookies': {
      const { LegalPage } = await import('../components/LegalPage');
      return <LegalPage kind={view} {...common} />;
    }
    default:
      throw new Error(`no SSG page for ${view}`);
  }
}

// ── Supplementary sections ──────────────────────────────────────────────────
// Listing and demo pages show a project/post/service as one line and a link;
// for crawlers that don't run JavaScript, add the short summary each of those
// items already has in the site's data. Nothing here is new copy.

const esc = (t: string) =>
  t.replace(/\*\*/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SERVICE_ORDER: ServiceKey[] = [
  'service-software',
  'service-crm',
  'service-website',
  'service-mobile',
  'service-social',
  'service-ads',
];

const serviceSummaries = (heading: string) =>
  `<section><h2>${esc(heading)}</h2>` +
  SERVICE_ORDER.map((k) => {
    const sv = SERVICES[k];
    return `<h3><a href="${viewToPath(k)}">${esc(`${sv.headline} ${sv.headlineAccent}`)}</a></h3><p>${esc(sv.intro)}</p>`;
  }).join('') +
  `</section>`;

const deliverables = (k: ServiceKey, heading: string) => {
  const sv = SERVICES[k];
  return (
    `<section><h2>${esc(heading)}</h2><p>${esc(sv.intro)}</p>` +
    sv.deliverables.map((d) => `<h3>${esc(d.title)}</h3><p>${esc(d.description)}</p>`).join('') +
    `</section>`
  );
};

function supplement(view: ViewState): string {
  switch (view) {
    case 'work':
      return (
        `<section><h2>Case studies</h2>` +
        CASE_STUDIES.map(
          (c) =>
            `<h3><a href="${viewToPath('work-post', c.slug)}">${esc(c.card?.name ?? c.name)}</a></h3>` +
            `<p>${esc([c.card?.showcaseLine, c.tagline].filter(Boolean).join(': '))}</p>` +
            `<p>${esc(`Industry: ${c.snapshot.industry}. Services: ${c.snapshot.services}. Platforms: ${c.snapshot.platforms}.`)}</p>`
        ).join('') +
        `</section>`
      );
    case 'services':
      return serviceSummaries('What we build');
    case 'contact':
      return serviceSummaries('What we can help with');
    case 'blog':
      return (
        `<section><h2>Latest articles</h2>` +
        POSTS.map(
          (p) =>
            `<h3><a href="${viewToPath('blog-post', p.slug)}">${esc(p.title)}</a></h3>` +
            `<p>${esc(p.excerpt)}</p><p>${esc(`${p.category} · ${p.readTime} · by ${p.author}`)}</p>`
        ).join('') +
        `</section>`
      );
    case 'crm-demo':
      return (
        deliverables('service-crm', 'What goes into a custom CRM') +
        `<section><h2>Why teams work with Pureflow</h2>` +
        WHY.map((w) => `<h3>${esc(w.title)}</h3><p>${esc(w.description)}</p>`).join('') +
        `</section>`
      );
    case 'automation-video':
      return deliverables('service-software', 'Custom software and automation we build');
    default:
      return '';
  }
}

/** Static markup of a route's content plus the site footer; '' if it can't render. */
export async function render(view: ViewState, slug: string | null): Promise<{ html: string; error?: string }> {
  try {
    const { Footer } = await import('../components/Footer');
    const el = await page(view, slug);
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <LazyMotion features={domAnimation}>
          {el}
          <Footer onViewChange={noop} />
        </LazyMotion>
      </ThemeProvider>
    );
    return { html: html + supplement(view) };
  } catch (e) {
    return { html: '', error: (e as Error).message };
  }
}
