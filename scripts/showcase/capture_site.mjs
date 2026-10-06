#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// capture_site.mjs — step A1 of docs/website-case-study-guide.md.
//
// Captures a client's live website for a website case study:
//   • <page>-desktop.png  1440×900 @1.5x  (what the image prompts attach)
//   • <page>-mobile.png   390×844 @2x, touch + iPhone UA
//   • home-desktop-full.png / home-mobile-full.png (whole homepage)
//   • logo.<ext>          the header logo, original file
//   • site-facts.json     per page: title, description, headings, menu and
//                         footer links, numbers on the page, fonts, sizes,
//                         the most-used button/background colours
//   • site-facts.md       the same, readable
// into ~/Downloads/<site>-website-stills/ (or --out).
//
// Usage:
//   node scripts/showcase/capture_site.mjs https://www.example.com
//       → captures the homepage and prints the menu, so you can pick pages
//   node scripts/showcase/capture_site.mjs https://www.example.com / /courses /contact
//       → captures those pages (the homepage is always included)
//   options: --out <dir>  --wait <ms, default 4000>
//
// Needs playwright-core (a devDependency) and a Chromium:
//   npx playwright-core install chromium     (once, if launch fails)
// ─────────────────────────────────────────────────────────────────────────────
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium, devices } from 'playwright-core';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const outArg = opt('--out');
const WAIT = Number(opt('--wait', '4000'));
const [site, ...paths] = args;
if (!site || !/^https?:\/\//.test(site)) {
  console.error('Usage: node scripts/showcase/capture_site.mjs https://www.example.com [/path …] [--out dir]');
  process.exit(1);
}
const origin = new URL(site).origin;
const host = new URL(site).host.replace(/^www\./, '');
const OUT = outArg ?? join(homedir(), 'Downloads', `${host.split('.')[0]}-website-stills`);
const list = ['/', ...paths.filter((p) => p !== '/')];
const nameOf = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase());

let browser;
try {
  browser = await chromium.launch();
} catch {
  try {
    browser = await chromium.launch({ channel: 'chrome' });
  } catch (e) {
    console.error('Could not start Chromium. Run:  npx playwright-core install chromium\n', e.message.split('\n')[0]);
    process.exit(1);
  }
}
await mkdir(OUT, { recursive: true });

const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
const mob = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

/** Load, let carousels/counters settle, close popups (never "accept"), back to top. */
async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(WAIT);
  await page.keyboard.press('Escape').catch(() => {});
  await page
    .evaluate(() => {
      const close = [...document.querySelectorAll('button, [role=button], a')].filter((b) =>
        /^(×|✕|x|close|dismiss|no thanks|not now|maybe later)$/i.test((b.innerText || b.getAttribute('aria-label') || '').trim())
      );
      close.slice(0, 3).forEach((b) => b.click());
    })
    .catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
}

/** Everything Claude needs to write the case study from the real page. */
function readFacts() {
  const hex = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return null;
    return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const txt = (e) => (e?.innerText || '').replace(/\s+/g, ' ').trim();
  const style = (e) => {
    if (!e) return null;
    const c = getComputedStyle(e);
    return { font: c.fontFamily.split(',')[0].replace(/["']/g, ''), weight: c.fontWeight, size: c.fontSize, color: hex(c.color) };
  };
  const links = (root) =>
    root
      ? [...root.querySelectorAll('a')]
          .map((a) => ({ text: txt(a), href: a.getAttribute('href') }))
          .filter((l) => l.text && l.href && !l.href.startsWith('javascript'))
      : [];
  const header = document.querySelector('header') || document.querySelector('nav');
  const footer = document.querySelector('footer');
  const count = new Map();
  [...document.querySelectorAll('a, button, [class*="btn"], [class*="badge"], [class*="pill"]')].forEach((e) => {
    const h = hex(getComputedStyle(e).backgroundColor);
    if (h && h !== '#FFFFFF' && h !== '#000000') count.set(h, (count.get(h) || 0) + 1);
  });
  const numbers = [];
  document.querySelectorAll('h1,h2,h3,h4,p,span,strong,div').forEach((e) => {
    if (e.children.length) return;
    const t = txt(e);
    if (/^[₹$]?\d[\d,.]*\s*(\+|%|k|K|L|Cr|★)?$/.test(t)) numbers.push({ value: t, context: txt(e.parentElement?.parentElement).slice(0, 90) });
  });
  const logo = header?.querySelector('img');
  return {
    url: location.href,
    title: document.title,
    description: document.querySelector('meta[name=description]')?.content ?? '',
    h1: [...document.querySelectorAll('h1')].map(txt),
    h2: [...document.querySelectorAll('h2')].map(txt).slice(0, 40),
    h3: [...document.querySelectorAll('h3')].map(txt).slice(0, 60),
    menu: links(header),
    footer: links(footer),
    buttons: [...new Set([...document.querySelectorAll('button, a[class*="btn"], a[class*="button"]')].map(txt).filter(Boolean))].slice(0, 40),
    numbers: numbers.slice(0, 40),
    type: { h1: style(document.querySelector('h1')), h2: style(document.querySelector('h2')), h3: style(document.querySelector('h3')), body: style(document.querySelector('p')) },
    colours: [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([h, n]) => `${h} ×${n}`),
    logo: logo ? { src: logo.currentSrc || logo.src, alt: logo.alt, width: logo.naturalWidth, height: logo.naturalHeight } : null,
    text: txt(document.querySelector('main') || document.body).slice(0, 6000),
  };
}

const facts = [];
for (const p of list) {
  const name = nameOf(p);
  for (const [ctx, tag] of [
    [desk, 'desktop'],
    [mob, 'mobile'],
  ]) {
    const page = await ctx.newPage();
    try {
      await page.goto(origin + p, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await settle(page);
      await page.screenshot({ path: join(OUT, `${name}-${tag}.png`) });
      if (name === 'home') await page.screenshot({ path: join(OUT, `home-${tag}-full.png`), fullPage: true });
      if (tag === 'desktop') facts.push({ page: p, name, ...(await page.evaluate(readFacts)) });
      console.log(`✓ ${name}-${tag}.png`);
    } catch (e) {
      console.warn(`✗ ${p} (${tag}): ${e.message.split('\n')[0]}`);
    }
    await page.close();
  }
}

// The header logo, original file.
const logo = facts[0]?.logo;
if (logo?.src) {
  try {
    const res = await fetch(logo.src);
    const ext = extname(new URL(logo.src).pathname) || '.png';
    await writeFile(join(OUT, `logo${ext}`), Buffer.from(await res.arrayBuffer()));
    console.log(`✓ logo${ext}  (${logo.width}×${logo.height}, from ${logo.src})`);
  } catch (e) {
    console.warn(`✗ logo: ${e.message}`);
  }
}

await writeFile(join(OUT, 'site-facts.json'), JSON.stringify(facts, null, 2));
const md = facts
  .map(
    (f) => `## ${f.page}  (${f.title})

- Description: ${f.description}
- H1: ${f.h1.join(' | ')}
- H2: ${f.h2.join(' | ')}
- Numbers: ${f.numbers.map((n) => `${n.value} (${n.context})`).join(' · ')}
- Type: h1 ${JSON.stringify(f.type.h1)} · h2 ${JSON.stringify(f.type.h2)} · body ${JSON.stringify(f.type.body)}
- Colours (buttons/badges, most used first): ${f.colours.join(', ')}
- Buttons: ${f.buttons.join(' · ')}
- Menu: ${f.menu.map((l) => `${l.text} → ${l.href}`).join(' · ')}
- Footer: ${f.footer.map((l) => `${l.text} → ${l.href}`).join(' · ')}
`
  )
  .join('\n');
await writeFile(join(OUT, 'site-facts.md'), `# ${host}: site facts (captured ${new Date().toISOString().slice(0, 10)})\n\n${md}`);
await browser.close();

console.log(`\nSaved to ${OUT}`);
if (paths.length === 0 && facts[0]) {
  const menu = [...new Map(facts[0].menu.filter((l) => l.href.startsWith('/') && l.href.length > 1).map((l) => [l.href, l])).values()];
  console.log('\nMenu links on the homepage (pick 3–4 key pages and run again with their paths):');
  menu.forEach((l) => console.log(`  ${l.href.padEnd(32)} ${l.text}`));
}
