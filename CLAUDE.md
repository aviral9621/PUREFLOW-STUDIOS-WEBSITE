# Pureflow Studios website

Vite + React 19 + Tailwind v4 + framer-motion single-page app (custom router in
`lib/router.ts`, views in `App.tsx`). Dev server: `npm run dev` (port 3000).
Build: `npm run build` (Vite, then `scripts/prerender.mjs` for per-route SEO HTML).

## A website link to showcase: follow the website guide
When a teammate gives a **website link** (or says "make the website case study / add this
website to our work / give me the prompts for this site"), read
**`docs/website-case-study-guide.md`** in full and run its **Phase A** end to end without
waiting for step-by-step instructions: capture the site (`scripts/showcase/capture_site.mjs`),
build the page with real screenshots, write every image prompt, and send the hand-off
message. When the teammate brings the generated images back, run **Phase B**.

## Showing client work: read the playbook first
Anything about **project showcases**, the **homepage work cards**, **image/mockup
prompts** for a project, or **adding a project's images** follows
**`docs/project-showcase-playbook.md`**. Read it in full before starting. It has
the workflow, Pureflow's design rules, the prompt templates, the image scripts
(`scripts/showcase/`) and a log of every project done so far.

Non-negotiables (details in the playbook):
- Pureflow's own look everywhere: Instrument Serif italic lead-in + an Anton
  gradient word (`hero-automation-text`) with a glow for headings, Inter for body,
  brand gradient `#ff2f86 → #d946ef → #a855f7` on near-black. The client's brand
  only appears inside images and swatches.
- Real material only: real screenshots, the real logo (solid black on cards), real
  features and numbers. Blur real customer names in screenshots.
- Still images only; no live-site iframes in the work stack or showcase pages.
- Cards cut from a bento are the same size within each row
  (`scripts/showcase/cut_cards.py`).
- When asked for a *prompt*, give the prompt; don't build it in code instead.
- Check at 1440 / 1024 / 820 / 390 wide and send screenshots.
- Commit or push only when asked. `git pull` before starting.

## SEO (keep it intact)
- Canonical origin is **`https://www.pureflowstudios.in`** (`BASE_URL` in `lib/seo.ts`).
  pureflowdesigns.com redirects there (`vercel.json`). Never hard-code another domain.
- `npm run build` prerenders every route (`scripts/prerender.mjs` + `scripts/ssg-entry.tsx`):
  the page's real React content goes into `#root` for crawlers, and titles,
  descriptions, canonicals, the sitemap and noindex flags all come from `lib/seo.ts`,
  `lib/router.ts` and the data files. A new page/route needs a case in
  `ssg-entry.tsx` (`page()`), or it ships without crawlable content.
- Titles 30–60 chars (`fitTitle`), descriptions ≤155 (`fitDescription`); one `<h1>`
  per page and no skipped heading levels.
- The Content-Security-Policy lives in `vercel.json`. A new third-party script,
  iframe or API host must be added there. Test with a production build first.
