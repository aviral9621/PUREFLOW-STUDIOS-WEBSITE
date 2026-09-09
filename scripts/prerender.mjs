// ─────────────────────────────────────────────────────────────────────────────
// Post-build SSG: for every route, write a static dist/<path>/index.html with a
// unique <title> + meta description + canonical + OG/Twitter, plus a hidden,
// crawlable SEO block (h1 + description + internal links). The React app still
// hydrates client-side as usual (it only controls #root). Also emits sitemap.xml.
//
// Keep the PAGES list in sync with lib/seo.ts (META) + lib/caseStudies.ts + lib/blog.ts.
// Run after `vite build` (see package.json).
// ─────────────────────────────────────────────────────────────────────────────
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const BASE_URL = 'https://pureflowdesigns.com';
const SITE = 'Pureflow Studios';
const DEFAULT_OG = `${BASE_URL}/logo/pureflow-favicon-512.png`;

const PAGES = [
  { path: '/', priority: '1.0', h1: 'PureFlow Studios — software, CRMs, AI agents & web apps',
    title: `${SITE} — Custom Software, CRMs, AI Agents & Web Apps`,
    description: 'Custom software, CRMs, AI agents, and websites that turn manual chaos into measurable systems. A Lucknow-based design and engineering studio.' },

  { path: '/work', priority: '0.9', h1: 'Our Work — Case Studies',
    title: `Our Work — Case Studies | ${SITE}`,
    description: 'Every case study Pureflow Studios has shipped — custom CRMs, hotel tech, edtech, travel, herbal commerce, and more.' },

  { path: '/services', priority: '0.9', h1: 'Services',
    title: `Services — Custom Software, CRMs, AI Agents | ${SITE}`,
    description: 'Our service offering: custom software, CRMs and dashboards, AI agents, mobile and web apps, brand & content, Meta ads management.' },
  { path: '/services/software', priority: '0.8', title: `Custom Software Development — ${SITE}`,
    description: 'We build bespoke software, internal tools, and dashboards on Next.js + Supabase. No templates, no WordPress — actual software.' },
  { path: '/services/crm', priority: '0.8', title: `CRM & Dashboard Development — ${SITE}`,
    description: 'Commission engines, KYC portals, lead pipelines, custom CRMs — built to replace WhatsApp chaos with a real system.' },
  { path: '/services/mobile', priority: '0.8', title: `Mobile App Development — ${SITE}`,
    description: 'iOS + Android apps under one budget. PWA-first or React Native, depending on what your users actually need.' },
  { path: '/services/website', priority: '0.8', title: `Website Development — ${SITE}`,
    description: 'Marketing sites, booking portals, agency websites. Built on Next.js + Tailwind. Fast, SEO-optimised, designed to convert.' },
  { path: '/services/social', priority: '0.7', title: `Social Media & Brand — ${SITE}`,
    description: 'Content strategy, reel scripts, AI-generated product visuals, brand voice — for travel, healthcare, and edtech founders.' },
  { path: '/services/ads', priority: '0.7', title: `Meta Ads Management — ${SITE}`,
    description: 'Facebook + Instagram ad campaigns that chase ROAS, not vanity metrics. Creative, copy, targeting, and weekly reporting.' },

  { path: '/about', priority: '0.7', title: `About — A small studio, built to ship | ${SITE}`,
    description: 'Pureflow Studios is a Gen-Z software studio founded by Aviral Singh — 10 people, 100+ products shipped, built on referrals.' },
  { path: '/blog', priority: '0.8', h1: 'Good Stuff — Blog & Field Notes',
    title: `Good Stuff — Blog & Field Notes | ${SITE}`,
    description: 'Field notes on AI, automation, CRMs, and the boring software that quietly runs growing businesses. From the Pureflow Studios team.' },
  { path: '/contact', priority: '0.7', title: `Contact — ${SITE}`,
    description: 'Talk to Pureflow Studios about your project. Email support@pureflowdesigns.com or message us on WhatsApp.' },
  { path: '/crm-demo', priority: '0.5', title: `CRM Demo — ${SITE}`,
    description: 'See a live demo of the CRMs and dashboards we build for our clients.' },
  { path: '/automation', priority: '0.5', title: `AI & Automation — ${SITE}`,
    description: 'See how AI agents and automations are transforming small businesses in real time.' },

  { path: '/get-started/website', priority: '0.5', title: `Get a Website Built — ${SITE}`,
    description: 'Tell us what you need. Fixed-price proposal in 48 hours, live in weeks. No retainer required to start.' },
  { path: '/get-started/software', priority: '0.5', title: `Get Custom Software Built — ${SITE}`,
    description: 'CRMs, dashboards, internal tools — get a fixed-price proposal in 48 hours. No middlemen, direct line to the founder.' },
  { path: '/get-started/mobile', priority: '0.5', title: `Get an App Built — ${SITE}`,
    description: 'Mobile app development for iOS and Android. PWA or native — fixed-price proposal in 48 hours.' },
  { path: '/get-started/social', priority: '0.5', title: `Get Social Media Done — ${SITE}`,
    description: 'Monthly content strategy, reels, and brand-aligned creatives. Pricing in 24 hours.' },
  { path: '/get-started/ads', priority: '0.5', title: `Get Ads Run — ${SITE}`,
    description: 'Meta ads management. Performance-focused, transparently reported, no vanity metrics.' },

  { path: '/start-project', priority: '0.4', title: `Start a Project — ${SITE}`,
    description: 'Tell us what you’re building. Six quick questions and we’ll come back with a fixed-price proposal in 48 hours.' },
  { path: '/book-call', priority: '0.4', title: `Book a Call — ${SITE}`,
    description: 'Pick a date and time for a free 15- or 30-minute call with the Pureflow Studios team.' },
  { path: '/privacy', priority: '0.2', title: `Privacy Policy — ${SITE}`,
    description: 'How Pureflow Studios collects, uses, and protects the personal data you share with us.' },
  { path: '/terms', priority: '0.2', title: `Terms of Service — ${SITE}`,
    description: 'The terms governing your use of pureflowdesigns.com and the services delivered by Pureflow Studios.' },
  { path: '/cookies', priority: '0.2', title: `Cookie Policy — ${SITE}`,
    description: 'The cookies and similar technologies in use on Pureflow Studios and how to control them.' },
  { path: '/refund-policy', priority: '0.2', title: `Refund Policy — ${SITE}`,
    description: 'Pureflow Studios refund policy for guaranteed-growth social media engagements.' },

  // ── Case studies ──
  { path: '/work/quick-hotels', priority: '0.9', h1: 'Quick Hotels',
    title: `Quick Hotels — Hospitality Case Study | ${SITE}`,
    description: 'A complete booking-and-management ecosystem for budget-friendly stays across India.' },
  { path: '/work/herbal-vantage', priority: '0.9', h1: 'Herbal Vantage',
    title: `Herbal Vantage — Herbal & Wellness Case Study | ${SITE}`,
    description: 'A premium herbal store experience — luxury wellness commerce, end to end.' },
  { path: '/work/spectrum-tour-travels', priority: '0.9', h1: 'Spectrum Tour & Travels',
    title: `Spectrum Tour & Travels — Travel & Tourism Case Study | ${SITE}`,
    description: 'A complete travel and tour booking experience — packages, enquiries and trips online.' },
  { path: '/work/unskills-computer-education-crm', priority: '0.9', h1: 'UnSkills CRM',
    title: `UnSkills CRM — CRM for Educational Institutes | ${SITE}`,
    description: 'A complete CRM for educational institutes — leads, admissions, fees, branches and student relationships streamlined into one real-time platform.' },
  { path: '/work/unskills-education-website', priority: '0.8', h1: 'UnSkills Education',
    title: `UnSkills Education — Education Website Case Study | ${SITE}`,
    description: 'A modern education website — courses, admissions and enquiries, all in one place.' },
  { path: '/work/ecommerce-retail-platform', priority: '0.8', h1: 'E-commerce & Retail Platform',
    title: `E-commerce & Retail Platform — Case Study | ${SITE}`,
    description: 'A fast online store with seamless checkout and in-store point-of-sale on one backend.' },
  { path: '/work/healthcare-clinic-system', priority: '0.8', h1: 'Clinic Management System',
    title: `Clinic Management System — Healthcare Case Study | ${SITE}`,
    description: 'Appointments, patient records and billing in one secure clinic platform.' },
  { path: '/work/real-estate-portal', priority: '0.8', h1: 'Real Estate Portal',
    title: `Real Estate Portal — Case Study | ${SITE}`,
    description: 'Property listings, search and enquiry — a portal that turns browsers into leads.' },
  { path: '/work/restaurant-ordering-platform', priority: '0.8', h1: 'Restaurant Ordering Platform',
    title: `Restaurant Ordering Platform — Case Study | ${SITE}`,
    description: 'Online ordering, table booking and a kitchen dashboard for a multi-outlet restaurant.' },

  // ── Blog posts ──
  { path: '/blog/ai-automation-for-small-businesses-2026', priority: '0.7',
    h1: 'How AI Automation Can Help Small Businesses Grow in 2026',
    title: `How AI Automation Can Help Small Businesses Grow in 2026 | ${SITE}`,
    description: 'Not the "fire your team" version. The version where four hours of copy-paste a day quietly disappears and nobody notices except your margins.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80' },
  { path: '/blog/high-performance-website-for-growing-business-2026', priority: '0.7',
    h1: 'Why Every Growing Business Needs a High-Performance Website in 2026',
    title: `Why Every Growing Business Needs a High-Performance Website in 2026 | ${SITE}`,
    description: 'Your site is not a brochure any more. It is the first employee every customer meets — and a slow one costs you real money.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80' },
  { path: '/blog/custom-software-vs-ready-made-software', priority: '0.7',
    h1: 'Custom Software vs Ready-Made Software: Which Is Better for Your Business?',
    title: `Custom Software vs Ready-Made Software: Which Is Better for Your Business? | ${SITE}`,
    description: 'The honest answer is that off-the-shelf wins more often than agencies admit — until one specific thing changes.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80' },
  { path: '/blog/google-gemini-omni-for-small-business', priority: '0.7',
    h1: "Google's Gemini Omni: what it actually means for small businesses",
    title: `Google's Gemini Omni: what it actually means for small businesses | ${SITE}`,
    description: 'Gemini Omni isn’t another chatbot. It’s a multimodal model that can read your CRM, watch your dashboard, and act — here’s how to use it without setting your data on fire.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80' },
];

// Internal links injected into every page's hidden SEO block (crawl paths).
const SEO_LINKS = [
  ['/', 'Home'], ['/work', 'Work'], ['/services', 'Services'], ['/about', 'About'],
  ['/blog', 'Good Stuff'], ['/contact', 'Contact'],
  ['/work/quick-hotels', 'Quick Hotels case study'],
  ['/work/herbal-vantage', 'Herbal Vantage case study'],
  ['/work/spectrum-tour-travels', 'Spectrum Tour & Travels case study'],
  ['/blog/ai-automation-for-small-businesses-2026', 'AI automation for small businesses'],
  ['/blog/high-performance-website-for-growing-business-2026', 'High-performance websites'],
  ['/blog/custom-software-vs-ready-made-software', 'Custom vs ready-made software'],
  ['/blog/google-gemini-omni-for-small-business', 'Gemini Omni for small business'],
];

const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

function setMeta(html, attr, name, value) {
  const tag = `<meta ${attr}="${name}" content="${escAttr(value)}" />`;
  const re = new RegExp(`<meta\\s+${attr}="${name}"[^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function buildHtml(template, page) {
  const url = BASE_URL + page.path;
  const img = page.image || DEFAULT_OG;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(page.title)}</title>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', img);
  html = setMeta(html, 'name', 'twitter:title', page.title);
  html = setMeta(html, 'name', 'twitter:description', page.description);
  html = setMeta(html, 'name', 'twitter:image', img);

  const canonical = `<link rel="canonical" href="${url}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonical);
  } else {
    html = html.replace('</head>', `    ${canonical}\n  </head>`);
  }

  const links = SEO_LINKS.map(([href, label]) => `<a href="${href}">${escText(label)}</a>`).join(' ');
  const seoBlock =
    `<div id="seo-content" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;">` +
    `<h1>${escText(page.h1 || page.title)}</h1><p>${escText(page.description)}</p><nav>${links}</nav></div>`;
  html = html.replace('</body>', `${seoBlock}</body>`);

  return html;
}

async function run() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');

  for (const page of PAGES) {
    const html = buildHtml(template, page);
    const outDir = page.path === '/' ? DIST : join(DIST, page.path);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), html, 'utf8');
  }

  // Vercel serves dist/404.html for any request that matches no other static
  // file, and serves it with a real 404 status. Writing the SPA shell here means
  // an unknown URL gets the correct status code *and* the branded 404 view:
  // React boots as usual and `pathToState` maps the unknown path to `not-found`.
  //
  // Deliberately not added to PAGES — it must stay out of the sitemap, and it is
  // the one page that should never be indexed.
  const notFoundHtml = setMeta(
    buildHtml(template, {
      path: '/404',
      title: `Page not found — ${SITE}`,
      description: "The page you're looking for doesn't exist or may have been moved.",
      h1: 'Page not found',
    }),
    'name',
    'robots',
    'noindex, follow'
  );
  await writeFile(join(DIST, '404.html'), notFoundHtml, 'utf8');

  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (p) =>
      `  <url><loc>${BASE_URL}${p.path}</loc><lastmod>${lastmod}</lastmod>` +
      `<priority>${p.priority || '0.5'}</priority></url>`
  ).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  console.log(`[prerender] wrote ${PAGES.length} routes + 404.html + sitemap.xml`);
}

run().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
