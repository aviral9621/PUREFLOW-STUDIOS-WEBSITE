// Content-Security-Policy for the /customsoftware landing (exported from
// ../pureflow-intl-landing into public/customsoftware).
//
// Next.js puts its page data in inline <script> tags. Rather than allowing every
// inline script ('unsafe-inline'), each page's policy lists the SHA-256 of exactly the
// inline scripts that page ships, so an injected script can't run. The hashes change
// whenever the landing is re-exported, so this writes them into vercel.json:
//
//   node scripts/landing-csp.mjs           update vercel.json (export-to-main.sh runs it)
//   node scripts/landing-csp.mjs --check   fail if vercel.json is stale (npm run build runs it,
//                                          so a stale policy can't reach production)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANDING = join(ROOT, 'public', 'customsoftware');
const VERCEL = join(ROOT, 'vercel.json');

const BASE = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "frame-src 'none'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
  // No Trusted Types here (the main site has them): on client-side navigation Next.js's
  // React rewrites the layout's own inline script through innerHTML, which would need a
  // pass-through policy that protects nothing.
];

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === '_next' ? [] : htmlFiles(p);
    return f.endsWith('.html') && f !== '404.html' ? [p] : [];
  });

/** index.html → /customsoftware, work.html → /customsoftware/work, work/x.html → /customsoftware/work/x */
const routeOf = (file) => {
  const rel = relative(LANDING, file).replace(/\.html$/, '').replace(/(^|\/)index$/, '');
  return '/customsoftware' + (rel ? `/${rel}` : '');
};

const hashes = (html) => {
  const out = new Set();
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type=["']application\/(ld\+)?json["']/.test(m[1])) continue; // data, never executed
    out.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
  }
  return [...out];
};

const rules = htmlFiles(LANDING)
  .sort()
  .map((file) => {
    const scriptSrc = ["script-src 'self'", ...hashes(readFileSync(file, 'utf8'))].join(' ');
    const value = [BASE[0], scriptSrc, ...BASE.slice(1)].join('; ');
    return { source: routeOf(file), headers: [{ key: 'Content-Security-Policy', value }] };
  });

const vercel = JSON.parse(readFileSync(VERCEL, 'utf8'));
const isLandingCsp = (h) => h.source.startsWith('/customsoftware') && h.headers.some((x) => x.key === 'Content-Security-Policy');
const next = { ...vercel, headers: [...vercel.headers.filter((h) => !isLandingCsp(h)), ...rules] };
const text = JSON.stringify(next, null, 2) + '\n';

if (process.argv.includes('--check')) {
  if (text !== readFileSync(VERCEL, 'utf8')) {
    console.error('[landing-csp] vercel.json does not match public/customsoftware: run `node scripts/landing-csp.mjs` and commit.');
    process.exit(1);
  }
  console.log(`[landing-csp] ok: ${rules.length} landing pages`);
} else {
  writeFileSync(VERCEL, text);
  console.log(`[landing-csp] wrote ${rules.length} landing policies: ${rules.map((r) => r.source).join(', ')}`);
}
