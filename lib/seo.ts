import { useEffect } from 'react';
import { ViewState } from '../types';
import { viewToPath } from './router';
import { getCaseStudyBySlug } from './caseStudies';
import { findPost } from './blog';

interface Meta {
  title: string;
  description: string;
}

const SITE = 'Pureflow Studios';
/** Canonical production domain (the custom domain to be connected on Vercel). */
export const BASE_URL = 'https://pureflowdesigns.com';
const DEFAULT_OG = `${BASE_URL}/logo/pureflow-favicon-512.png`;

export const META: Record<ViewState, Meta> = {
  home: {
    title: `${SITE} — Custom Software, CRMs, AI Agents & Web Apps`,
    description:
      'Custom software, CRMs, AI agents, and websites that turn manual chaos into measurable systems. A Lucknow-based design and engineering studio.',
  },
  contact: {
    title: `Contact — ${SITE}`,
    description:
      'Talk to Pureflow Studios about your project. Email support@pureflowdesigns.com or message us on WhatsApp.',
  },
  services: {
    title: `Services — Custom Software, CRMs, AI Agents | ${SITE}`,
    description:
      'Our service offering: custom software, CRMs and dashboards, AI agents, mobile and web apps, brand & content, Meta ads management.',
  },
  'service-software': {
    title: `Custom Software Development — ${SITE}`,
    description:
      'We build bespoke software, internal tools, and dashboards on Next.js + Supabase. No templates, no WordPress — actual software.',
  },
  'service-crm': {
    title: `CRM & Dashboard Development — ${SITE}`,
    description:
      'Commission engines, KYC portals, lead pipelines, custom CRMs — built to replace WhatsApp chaos with a real system.',
  },
  'service-mobile': {
    title: `Mobile App Development — ${SITE}`,
    description:
      'iOS + Android apps under one budget. PWA-first or React Native, depending on what your users actually need.',
  },
  'service-website': {
    title: `Website Development — ${SITE}`,
    description:
      'Marketing sites, booking portals, agency websites. Built on Next.js + Tailwind. Fast, SEO-optimised, designed to convert.',
  },
  'service-social': {
    title: `Social Media & Brand — ${SITE}`,
    description:
      'Content strategy, reel scripts, AI-generated product visuals, brand voice — for travel, healthcare, and edtech founders.',
  },
  'service-ads': {
    title: `Meta Ads Management — ${SITE}`,
    description:
      'Facebook + Instagram ad campaigns that chase ROAS, not vanity metrics. Creative, copy, targeting, and weekly reporting.',
  },
  'get-website-built': {
    title: `Get a Website Built — ${SITE}`,
    description:
      'Tell us what you need. Fixed-price proposal in 48 hours, live in weeks. No retainer required to start.',
  },
  'get-software-built': {
    title: `Get Custom Software Built — ${SITE}`,
    description:
      'CRMs, dashboards, internal tools — get a fixed-price proposal in 48 hours. No middlemen, direct line to the founder.',
  },
  'get-app-built': {
    title: `Get an App Built — ${SITE}`,
    description:
      'Mobile app development for iOS and Android. PWA or native — fixed-price proposal in 48 hours.',
  },
  'get-social-media': {
    title: `Get Social Media Done — ${SITE}`,
    description:
      'Monthly content strategy, reels, and brand-aligned creatives. Pricing in 24 hours.',
  },
  'get-ads': {
    title: `Get Ads Run — ${SITE}`,
    description: 'Meta ads management. Performance-focused, transparently reported, no vanity metrics.',
  },
  'crm-demo': {
    title: `CRM Demo — ${SITE}`,
    description: 'See a live demo of the CRMs and dashboards we build for our clients.',
  },
  'automation-video': {
    title: `AI & Automation — ${SITE}`,
    description: 'See how AI agents and automations are transforming small businesses in real time.',
  },
  'refund-policy': {
    title: `Refund Policy — ${SITE}`,
    description: 'Pureflow Studios refund policy for guaranteed-growth social media engagements.',
  },
  privacy: {
    title: `Privacy Policy — ${SITE}`,
    description:
      'How Pureflow Studios collects, uses, and protects the personal data you share with us.',
  },
  terms: {
    title: `Terms of Service — ${SITE}`,
    description:
      'The terms governing your use of pureflowstudios.com and the services delivered by Pureflow Studios.',
  },
  cookies: {
    title: `Cookie Policy — ${SITE}`,
    description: 'The cookies and similar technologies in use on Pureflow Studios and how to control them.',
  },
  blog: {
    title: `Good Stuff — Blog & Field Notes | ${SITE}`,
    description:
      'Field notes on AI, automation, CRMs, and the boring software that quietly runs growing businesses. From the Pureflow Studios team.',
  },
  'blog-post': {
    title: `Article — ${SITE}`,
    description:
      'Read the full article on the Pureflow Studios blog — practical takes on AI agents, custom software, and modern automation.',
  },
  'start-project': {
    title: `Start a Project — ${SITE}`,
    description:
      'Tell us what you’re building. Six quick questions and we’ll come back with a fixed-price proposal in 48 hours.',
  },
  'book-call': {
    title: `Book a Call — ${SITE}`,
    description:
      'Pick a date and time for a free 15- or 30-minute call with the Pureflow Studios team. Calendar invite sent instantly.',
  },
  work: {
    title: `Our Work — Case Studies | ${SITE}`,
    description:
      'Every case study Pureflow Studios has shipped — custom CRMs, hotel tech, edtech, agritech, and more.',
  },
  'work-post': {
    title: `Case Study — ${SITE}`,
    description:
      'A detailed look at one of the products Pureflow Studios designed, built, and shipped to production.',
  },
  about: {
    title: `About — A small studio, built to ship | ${SITE}`,
    description:
      'Pureflow Studios is a Gen-Z software studio founded by Aviral Singh — 10 people, 100+ products shipped, built on referrals.',
  },
  'not-found': {
    title: `Page not found — ${SITE}`,
    description: "The page you're looking for doesn't exist or may have been moved.",
  },
};

function setMeta(name: string, value: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setRouteJsonLd(json: unknown) {
  let el = document.getElementById('ld-route') as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'ld-route';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

/**
 * Resolve the final SEO fields for a route (view + optional slug). Shared shape
 * so the build-time prerender script can mirror this logic.
 */
export function resolveMeta(view: ViewState, slug?: string | null) {
  let m = META[view] ?? META.home;
  let ogImage = DEFAULT_OG;
  let extraJsonLd: Record<string, unknown> | null = null;

  if (view === 'work-post' && slug) {
    const cs = getCaseStudyBySlug(slug);
    if (cs) {
      m = { title: `${cs.name} — ${cs.category} Case Study | ${SITE}`, description: cs.tagline };
      extraJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: cs.name,
        about: cs.category,
        description: cs.tagline,
        url: `${BASE_URL}${viewToPath(view, slug)}`,
        creator: { '@type': 'Organization', name: SITE },
      };
    }
  } else if (view === 'blog-post' && slug) {
    const p = findPost(slug);
    if (p) {
      m = { title: `${p.title} | ${SITE}`, description: p.excerpt };
      ogImage = p.image || DEFAULT_OG;
      extraJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        image: p.image,
        datePublished: p.date,
        author: { '@type': 'Person', name: p.author },
        publisher: { '@type': 'Organization', name: SITE },
        url: `${BASE_URL}${viewToPath(view, slug)}`,
        articleSection: p.category,
      };
    }
  }

  const url = `${BASE_URL}${viewToPath(view, slug)}`;
  return { title: m.title, description: m.description, url, ogImage, extraJsonLd };
}

/** Updates <title>, description, canonical, OG/Twitter + JSON-LD when the route changes. */
export function useDocumentMeta(view: ViewState, slug?: string | null) {
  useEffect(() => {
    const { title, description, url, ogImage, extraJsonLd } = resolveMeta(view, slug);

    document.title = title;
    setMeta('description', description);
    setCanonical(url);

    // Unknown URLs are served the SPA shell with a 200, so `noindex` is what
    // actually keeps them out of search results (Google executes JS and honours
    // this). Reset it on every other route so the tag never leaks between views.
    setMeta(
      'robots',
      view === 'not-found'
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1'
    );

    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', ogImage, 'property');

    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: title.split(' — ')[0].split(' | ')[0], item: url },
      ],
    };
    setRouteJsonLd(extraJsonLd ? [breadcrumb, extraJsonLd] : breadcrumb);
  }, [view, slug]);
}
