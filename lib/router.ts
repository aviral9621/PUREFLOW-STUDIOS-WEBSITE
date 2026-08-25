import { ViewState } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// router — a tiny bidirectional map between the app's `ViewState` (+ optional
// slug) and a real URL path. The app keeps its existing state-machine
// navigation; App.tsx uses these helpers to sync the URL via the History API so
// every page is linkable and indexable.
// ─────────────────────────────────────────────────────────────────────────────

export type RouteState = { view: ViewState; slug: string | null };

// One-to-one (no slug) view ↔ path entries.
const STATIC: Array<[ViewState, string]> = [
  ['home', '/'],
  ['work', '/work'],
  ['services', '/services'],
  ['about', '/about'],
  ['blog', '/blog'],
  ['contact', '/contact'],
  ['crm-demo', '/crm-demo'],
  ['refund-policy', '/refund-policy'],
  ['automation-video', '/automation'],
  ['start-project', '/start-project'],
  ['book-call', '/book-call'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['cookies', '/cookies'],
  ['service-software', '/services/software'],
  ['service-crm', '/services/crm'],
  ['service-mobile', '/services/mobile'],
  ['service-website', '/services/website'],
  ['service-social', '/services/social'],
  ['service-ads', '/services/ads'],
  ['get-website-built', '/get-started/website'],
  ['get-software-built', '/get-started/software'],
  ['get-app-built', '/get-started/mobile'],
  ['get-social-media', '/get-started/social'],
  ['get-ads', '/get-started/ads'],
];

const viewToPathMap = new Map<ViewState, string>(STATIC);
const pathToViewMap = new Map<string, ViewState>(STATIC.map(([v, p]) => [p, v]));

/** Canonical path for the 404 view. Deliberately kept out of `STATIC` so it is
 *  never emitted into the sitemap or prerendered as a real page. */
export const NOT_FOUND_PATH = '/404';

/** Build the URL path for a view (+ slug for work-post / blog-post). */
export function viewToPath(view: ViewState, slug?: string | null): string {
  if (view === 'work-post') return slug ? `/work/${slug}` : '/work';
  if (view === 'blog-post') return slug ? `/blog/${slug}` : '/blog';
  if (view === 'not-found') return NOT_FOUND_PATH;
  return viewToPathMap.get(view) ?? '/';
}

/** Parse a URL path into a view (+ slug). Unknown paths fall back to home. */
export function pathToState(pathname: string): RouteState {
  let p = (pathname || '/').split('?')[0].split('#')[0];
  p = p.replace(/\/+$/, ''); // strip trailing slash(es)
  if (p === '') p = '/';

  const work = p.match(/^\/work\/(.+)$/);
  if (work) return { view: 'work-post', slug: decodeURIComponent(work[1]) };

  const blog = p.match(/^\/blog\/(.+)$/);
  if (blog) return { view: 'blog-post', slug: decodeURIComponent(blog[1]) };

  const view = pathToViewMap.get(p);
  if (view) return { view, slug: null };

  // Unknown path → the 404 view. This previously fell back to `home`, which
  // rendered the homepage under the wrong URL — a soft 404 that search engines
  // index as a duplicate of `/`.
  return { view: 'not-found', slug: null };
}

/** All static (non-slug) routes — used by the sitemap/prerender generator. */
export const STATIC_ROUTES: { view: ViewState; path: string }[] = STATIC.map(([view, path]) => ({
  view,
  path,
}));
