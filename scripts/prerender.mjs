// ─────────────────────────────────────────────────────────────────────────────
// Post-build SSG. For every route, write dist/<path>/index.html with:
//   • a unique <title>, meta description, canonical, OG/Twitter tags and
//     route JSON-LD (CreativeWork / BlogPosting + BreadcrumbList);
//   • the page's real content, server-rendered from its React component by
//     scripts/ssg-entry.tsx and reduced to clean semantic HTML, inside #root
//     (React replaces it on mount, so visitors never see it twice);
//   • a crawlable link list to every indexable page.
// Also writes 404.html and sitemap.xml.
//
// Routes, titles and canonicals come from the app itself (lib/router.ts,
// lib/seo.ts, lib/caseStudies.ts, lib/showcases.ts, lib/blog.ts) through
// Vite's SSR loader, so this file never needs a hand-kept page list.
// Run after `vite build` (see package.json).
// ─────────────────────────────────────────────────────────────────────────────
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SITE = 'Pureflow Studios';

const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

function setMeta(html, attr, name, value) {
  const tag = `<meta ${attr}="${name}" content="${escAttr(value)}" />`;
  const re = new RegExp(`<meta\\s+${attr}="${name}"[^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

// ── Markup reduction ─────────────────────────────────────────────────────────
// React's static output is always well-formed, so a tag-level pass is enough:
// drop media and decorative layers, keep headings / text / lists / links, and
// strip every attribute except a link's href.

const KEEP = new Set([
  'main', 'header', 'footer', 'nav', 'section', 'article', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'figure', 'figcaption', 'a', 'strong', 'em', 'b', 'i', 'code', 'pre', 'br',
]);
// Removed together with everything inside them.
const DROP = ['svg', 'script', 'style', 'noscript', 'iframe', 'video', 'audio', 'picture', 'canvas', 'form', 'select', 'textarea', 'template'];

function reduce(html) {
  let out = html;
  for (const t of DROP) out = out.replace(new RegExp(`<${t}\\b[\\s\\S]*?<\\/${t}>`, 'gi'), ' ');
  out = out.replace(/<(img|input|source|track|hr|meta|link)\b[^>]*>/gi, ' ');
  out = out.replace(/<!--[\s\S]*?-->/g, '');
  // Rebuild every tag: keep a whitelist (href only on <a>), unwrap the rest.
  out = out.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g, (_, close, tag, attrs) => {
    const t = tag.toLowerCase();
    if (!KEEP.has(t)) return t === 'div' || t === 'span' || t === 'button' || t === 'label' ? ' ' : ' ';
    if (close) return `</${t}>`;
    if (t === 'a') {
      const href = /\shref="([^"]*)"/.exec(attrs)?.[1];
      return href && !href.startsWith('javascript:') ? `<a href="${href}">` : '<a>';
    }
    return `<${t}>`;
  });
  // Unlinked anchors become plain text; collapse whitespace; drop empty elements.
  out = out.replace(/<a>([\s\S]*?)<\/a>/g, '$1').replace(/\s+/g, ' ');
  for (let i = 0; i < 6; i++) out = out.replace(/<(\w+)>\s*<\/\1>/g, ' ');
  return out.trim();
}

/** No skipped levels: a heading may sit at most one level below the previous one
 *  (an <h3> card title straight under the page's <h1> becomes an <h2>). */
function noJumps(html) {
  let prev = 0;
  return html.replace(/<(\/?)h([1-6])>/g, (m, close, n) => {
    if (close) return `</h${noJumps.open.pop() ?? n}>`;
    const lvl = Math.min(Number(n), prev + 1);
    prev = lvl;
    noJumps.open.push(lvl);
    return `<h${lvl}>`;
  });
}
noJumps.open = [];

/** Exactly one <h1>: the page's own, else the route title; any extras become <h2>. */
function oneH1(html, fallback) {
  let seen = false;
  const out = html.replace(/<h1>([\s\S]*?)<\/h1>/g, (m, inner) => {
    if (!seen) {
      seen = true;
      return m;
    }
    return `<h2>${inner}</h2>`;
  });
  return seen ? out : `<h1>${escText(fallback)}</h1>${out}`;
}

// ── Page assembly ────────────────────────────────────────────────────────────

function buildHtml(template, { meta, robots, content, links, jsonLd }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(meta.title)}</title>`);
  html = setMeta(html, 'name', 'description', meta.description);
  html = setMeta(html, 'name', 'robots', robots);
  html = setMeta(html, 'property', 'og:title', meta.title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:url', meta.url);
  html = setMeta(html, 'property', 'og:image', meta.ogImage);
  html = setMeta(html, 'name', 'twitter:title', meta.title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);
  html = setMeta(html, 'name', 'twitter:image', meta.ogImage);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${meta.url}" />`);
  if (jsonLd) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="ld-route">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`
    );
  }
  // Inside #root: visually hidden (no flash before JS), replaced when React mounts.
  const block =
    `<div id="seo-content" style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0">` +
    `${content}<nav aria-label="Site">${links}</nav></div>`;
  return html.replace('<div id="root"></div>', `<div id="root">${block}</div>`);
}

async function run() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');
  const vite = await createServer({
    root: ROOT,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });

  try {
    const ssg = await vite.ssrLoadModule('/scripts/ssg-entry.tsx');
    const routes = ssg.routes();
    const indexable = routes.filter((r) => r.index);
    const links = indexable
      .map((r) => `<a href="${r.path}">${escText(ssg.meta(r.view, r.slug).title.split(' | ')[0])}</a>`)
      .join(' ');

    let thin = 0;
    for (const r of routes) {
      const meta = ssg.meta(r.view, r.slug);
      let content = '';
      if (r.index) {
        const { html, error } = await ssg.render(r.view, r.slug);
        if (error) console.warn(`[prerender] ${r.path}: rendered without page content (${error})`);
        noJumps.open = [];
        content = noJumps(oneH1(reduce(html), meta.title.split(' | ')[0]));
        const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
        if (words < 250) {
          thin++;
          console.warn(`[prerender] ${r.path}: only ${words} words of content`);
        }
      } else {
        content = `<h1>${escText(meta.title.split(' — ')[0].split(' | ')[0])}</h1><p>${escText(meta.description)}</p>`;
      }

      const crumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: ssg.meta('home', null).url },
          ...(r.path === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: meta.title.split(' | ')[0], item: meta.url }]),
        ],
      };
      const html = buildHtml(template, {
        meta,
        robots: r.index ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow',
        content,
        links,
        jsonLd: meta.extraJsonLd ? [crumbs, meta.extraJsonLd] : crumbs,
      });
      const outDir = r.path === '/' ? DIST : join(DIST, r.path);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, 'index.html'), html, 'utf8');
    }

    // Vercel serves dist/404.html, with a real 404 status, for any request that
    // matches no other file. React boots and shows the branded 404 view.
    const nf = ssg.meta('not-found', null);
    const notFound = buildHtml(template, {
      meta: nf,
      robots: 'noindex, follow',
      content: `<h1>Page not found</h1><p>${escText(nf.description)}</p>`,
      links,
      jsonLd: null,
    });
    await writeFile(join(DIST, '404.html'), notFound, 'utf8');

    const lastmod = new Date().toISOString().slice(0, 10);
    const priority = (p) => (p === '/' ? '1.0' : /^\/(work|services|blog)$/.test(p) ? '0.9' : p.split('/').length > 2 ? '0.8' : '0.6');
    const urls = indexable
      .map((r) => `  <url><loc>${ssg.meta(r.view, r.slug).url}</loc><lastmod>${lastmod}</lastmod><priority>${priority(r.path)}</priority></url>`)
      .join('\n');
    await writeFile(
      join(DIST, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      'utf8'
    );

    console.log(
      `[prerender] wrote ${routes.length} routes (${indexable.length} indexable${thin ? `, ${thin} thin` : ''}) + 404.html + sitemap.xml`
    );
  } finally {
    await vite.close();
  }
}

run().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
