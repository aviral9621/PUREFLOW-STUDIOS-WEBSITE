# Project Showcase Playbook

> **For the AI agent reading this.** This is the rulebook for how Pureflow Studios
> shows its client work: the **homepage work cards** and the **project showcase
> pages** (`/work/<slug>`). When a teammate says *"make the showcase for
> <project>"*, *"give me the prompts for <project>"* or *"add these images to
> <project>"*, follow the workflow in section 4 step by step. The rules in
> sections 2 and 9 were decided deliberately with the owner; don't improvise
> on them. When you finish something, update the **log** (section 11).

---

## 0. Quick start

| The teammate asks… | Do this |
|---|---|
| "Make the showcase for X" (new project) | §4 steps 1–2: collect facts + real material, then write the prompts for **every** image slot (§6), each in one copy-paste code block, with the list of files to attach. Stop and wait for the images. |
| "Here are the images for X" | §4 steps 4–6: process them with the scripts (§7), wire them into the data (§8), verify at 4 widths, send screenshots. |
| "Make the showcase for X" (a **website**) | The same, but with the website layout (§1 C) and the website image slots (§3): T1 card, W2 hero, one W3 spotlight per key page, T6 design system. |
| "Give me the prompt for <one section> of X" | Only that prompt (§6 templates), filled in with X's real details. **Don't build code instead of a prompt.** |
| "Push it" | Commit on `main` with a descriptive message, then push. Never commit or push without being asked. |

Files you will touch:

| What | Where |
|---|---|
| Project cards (homepage, /work, services pages) | `lib/workCards.ts` (`FEATURED`: order, tabs, image, logo) |
| Showcase page data | `lib/showcases.ts` (one `Showcase` entry per project) |
| Showcase page layout | `components/showcase/ShowcasePage.tsx` (software), `WebsiteShowcase.tsx` (websites), `parts.tsx` (shared pieces) |
| Card copy (name, one-liner) | `lib/caseStudies.ts` (`card.name`, `card.blurb`) |
| Images | `public/work/<slug>-*.webp` (homepage) and `public/work/<client>/*.webp` (showcase) |
| SEO for a showcase URL | `lib/seo.ts` (automatic) + the entry in `scripts/prerender.mjs` |
| Image scripts | `scripts/showcase/*.py` (§7) |

---

## 1. The two surfaces

### A. Homepage work section (`WorkStack.tsx`, right under the hero)
- A one-line intro, then **Software / Websites / Apps tabs**. Switching drops the old
  cards away and raises the new ones in from below. Behind the cards, `DotGlow.tsx`
  draws a faint dot grid with a pink/violet glow that follows the cursor (it drifts on
  touch screens and stays still with reduced motion).
- The page fades to a light canvas (`#f4f2f7`), the navbar goes light (black logo)
  via `lib/pageTone.ts`, and project cards **stack** as you scroll (sticky, each new
  card slides over the last). It ends with "Liked what you saw? / LET'S BUILD YOURS."
- **Card** = white rounded card. The top bar has the **client logo in solid black**
  (or the name as text if there is no logo), a one-line description and a black
  "View project" pill. Under that, **one 2:1 image on pure white** (`mockup`), fitted
  and never cropped.
- **No category pill** ("Website + PMS" etc.) on the card. It was removed on purpose.

### B. Project showcase page (`/work/<slug>`, `ShowcasePage.tsx`)
The long editorial case study. The **layout** takes its cue from agency case studies
(e.g. onething.design's Royal Enfield page); the **look is 100% Pureflow's** (§2).
Sections, top to bottom:

| # | Section | Data (`lib/showcases.ts`) | Visual |
|---|---|---|---|
| 1 | **Hero**: "All work" link, "CASE STUDY" eyebrow, client logo (black file shown inverted to white), headline (serif lead-in + gradient phrase), "Project focus" chips | `logo`, `headline`, `focus` | `hero` image (16:9) |
| 2 | **The BRIEF.** + a facts card (Industry, Delivered, Services, Stack) | `brief`, `facts`, `links?` | none |
| 3 | **The PROBLEM.** + 6 "before" cards | `problem`, `problemCards` | cut-out cards (§7) |
| 4 | **Our PROCESS.**: numbered steps | `process` | none |
| 5 | **What we DELIVERED.**: one block per product, e.g. "01 INSTITUTE MANAGEMENT SYSTEM": summary, feature chips, feature cards | `products[]` (`name`, `summary`, `features`, `cards`) | cut-out cards (§7) |
| 6 | **The design SYSTEM.** | `systemImage` (or coded `palette` + `type` if no image) | design-system sheet (2:1) |
| 7 | **The IMPACT.**: four number cards | `impact` | none |
| 8 | **In their WORDS.**: testimonial | `testimonial?` | none |
| 9 | **LET'S BUILD YOURS.**: a centred CTA panel with a gradient edge, both buttons and 3 promises | none | none |

**Not on the page:** a "More work" section (removed). **Scope:** one showcase = one
product line. If a client has a CRM + app + website, the showcase covers what the
owner says to cover. For UnSkills that is only the institute management system;
the app and the website get their own showcases later.

### C. Website showcase page (`/work/<slug>` with `site`, `WebsiteShowcase.tsx`)
A website is judged on what a visitor can find and do, so its page tells a different
story from the software one (no problem bento, no module list). A showcase gets this
layout by having a `site` block (§8). Same Pureflow look (§2), same shared pieces
(`parts.tsx`: hero, brief, design system, numbers, CTA).

| # | Section | Data (`site.*` unless noted) | Visual |
|---|---|---|---|
| 1 | **Hero**: "WEBSITE CASE STUDY", logo, headline, focus chips, a gradient **"Visit <site> ↗"** button (only when `site.url` is set; UnSkills has none, on the owner's request) | `headline`, `focus`, `site.url/label` | `hero` (W2 image; until then a raw still in a coded browser frame) |
| 2 | **The BRIEF.** + facts + live link | `brief`, `facts`, `links` | none |
| 3 | **What it had to DO.**: 3–4 numbered goal cards | `goals` | coded |
| 4 | **The SITEMAP.**: the menu as built, a tree under the domain | `sitemap` | coded |
| 5 | **How we BUILT IT.**: the website process as a line of steps | `build` | coded |
| 6 | **Page by PAGE.**: each key page: number + name + path, summary + chips, then the page image full width (tap to zoom) | `pages` | W3 spotlight per page (until then the raw still in a browser frame) |
| 7 | **Built for every SCREEN.**: phone stills in coded phone frames | `screens` | real mobile captures (no generation needed) |
| 8 | **Under the HOOD.**: 8 feature cards with icons | `builtIn` | coded |
| 9 | **The design SYSTEM.** | `systemImage` or `palette` + `type` | T6 sheet |
| 10 | **The site TODAY.**: four real numbers from the live site | `impact` + `site.todayNote` | none |
| 11 | In their WORDS (if any) + **LET'S BUILD YOURS.** | `testimonial?`, `ctaLead` | none |

Raw screenshots use `frame: 'browser'` (+ `url` for the address bar); finished
images on white use no frame. Swap them in by changing `src`/size and dropping
`frame`.

---

## 2. Pureflow's design language (never the client's)

The client's colours and fonts appear **only as content**: their logo, the
design-system image, and the product images. Everything else is ours.

**Fonts** (already loaded site-wide)
- **Anton**, via class `hero-automation-text`: big display words, UPPERCASE, animated
  pink→purple gradient. Also product names (`font-anton`, white).
- **Instrument Serif italic** (`font-serif italic`): the lead-in line above a display word.
- **Inter**: all body copy and UI text.
- **JetBrains Mono** (`font-mono`, 11px, uppercase, wide tracking): tiny labels.
- Bebas Neue is only the navbar wordmark. Don't use it elsewhere.

**The heading pattern (every section)**
```
<span class="font-serif italic">The</span>              ← lead-in, white/95
<span class="sc-glow"><span class="hero-automation-text sc-display" data-text="PROBLEM.">PROBLEM.</span></span>
```
In `ShowcasePage.tsx`: `<Heading lead="The" word="PROBLEM." />`. The `.sc-glow` class
puts a soft pink/violet bloom behind the gradient word. Keep the gradient word
**short** (1–2 words, or up to 3 for the hero) so it fits a 390px phone.

**Colours**
- Brand gradient: `#ff2f86 → #d946ef → #a855f7` (buttons, gradient text, dots, rules).
- Page: near-black `#050505`, with radial violet/pink washes
  (`rgba(124,58,237,0.14)`, `rgba(255,47,134,0.05)`).
- Text: white; body `text-white/65`; muted `text-white/45–55`.
- Hairlines: `border-white/[0.06–0.12]`.

**Components**
- Eyebrows: `gradient-flow-text`, 11px bold uppercase, tracking 0.24em.
- Numbers (process steps, product index, impact figures): `.sc-num` (Anton in the gradient).
- Chips: rounded-full, `border-white/[0.12] bg-white/[0.03]`, with a gradient dot.
- Primary button: gradient pill "Start a project ↗" with a pink glow. Secondary:
  outline pill "Book a 15-min call".
- Panels and fact boxes: `rounded-2xl sm:rounded-[22px] border-white/[0.08] bg-white/[0.02]`.

**Spacing**
- Content width `max-w-[1240px]`, side padding `px-5 sm:px-8 lg:px-12`.
- Sections: `py-20 sm:py-28 lg:py-32`, separated by a `border-white/[0.06]` hairline.
- Heading → content: `mt-12 sm:mt-16`. Card grids: `gap-3 sm:gap-4`.

**Motion**: content fades up once on scroll (`Reveal`, 0.8s, ease `[0.16,1,0.3,1]`).
Respect reduced motion. Nothing embeds a live website; **stills only**.

---

## 3. Image slots

| Slot | Ratio / size | Background | Style | Prompt |
|---|---|---|---|---|
| Homepage card, **website** project | 2:1 (2400×1200) | pure white | laptop + phone mockup showing the real site | §6 T1 |
| Homepage card, **software** project | 2:1 | pure white | feature showcase: headline + feature tabs + real dashboard | §6 T2 |
| Showcase **hero** | 16:9 (2400×1350) | pure white | the real dashboard as a flat window (**no devices**) + 3 floating cards + hand-drawn arrows and notes | §6 T3 |
| Showcase **problem** | 2:1 | pure white | bento of **6 "before" cards**, 3×2 | §6 T4 |
| Showcase **product features** | 2:1 | pure white | bento of **7 feature cards**, 3 + 4 | §6 T5 |
| Showcase **design system** | 2:1 | pure white | colour / typography / components sheet | §6 T6 |
| (Optional) software explainer | 2:1 | pure white | bento with 2 big + 4 small cards and arrows (HeloFlow style) | §6 T7 |
| **Website** showcase hero | 16:9 | pure white | flat browser window + flat phone screen (no device bodies) + 4 callout cards + arrows and notes | §6 W2 |
| **Website** page spotlight (one per key page) | 2:1 | pure white | flat browser window of the page (left ~62%) + 3 zoom-in callout cards with connector lines (right) | §6 W3 |
| **Website** design system | 2:1 | pure white | T6, with the site's own components (buttons, pills, a course/product card, search, floating buttons) | §6 T6 |

Website stills for the prompts: capture them with Playwright (§4 step 2) into
`~/Downloads/<client>-website-stills/` (`<page>-desktop.png` 1440×900 @1.5x,
`<page>-mobile.png` 390×844 @2x). The same captures, resized to WebP, are the
page's interim images and its "Every SCREEN" phones.

The problem and features bentos get **cut into individual cards** (§7). The hero,
design system and homepage images are used whole.

---

## 4. Workflow (step by step)

**Step 0: Sync.** `git pull` first. Others work on this repo too.

**Step 1: Intake.** Ask the teammate for anything missing:
1. Project name, client, and **what type** it is (website / CRM / PMS / app / …) and
   **which part** this showcase covers.
2. The real **feature list** (what we actually built).
3. **Screenshots** of the real product (dashboard, key screens). Remind them to
   **blur or crop real customer names, phone numbers and IDs** before sharing or
   attaching them to an image tool.
4. Facts: industry, services, stack, and real impact numbers + testimonial if any
   (never invent them).
Also read the project's entry in `lib/caseStudies.ts`.

**Step 2: Real material.**
- **Logo**: download the original from the client's live site (inspect the header
  `<img>`, e.g. `https://www.quickhotels.co/logo.webp`). Never redraw it. It needs a
  transparent background.
- **Brand colours**: sample them from the logo and the product (pick the median
  colour of an icon or button, not a single pixel). **Fonts**:
  `getComputedStyle(el).fontFamily` on the client's site/product.
- **Website stills** (if needed): Playwright at 1440×900 @1.5x and 390×844 @2x
  (isMobile). Wait for network idle + ~4s, dismiss cookie/notice popups, and keep a
  frame where any carousel is fully in place.

**Step 3: Prompts.** Fill the templates in §6 for every slot you need. Give the
teammate each prompt in its own code block, plus **what to attach** (dashboard
screenshot, logo, website screenshots) and the follow-up fix lines (§6, end).

**Step 4: Process the images** the teammate sends back (usually into `~/Downloads`)
with the scripts in §7. Look at every output before using it.

**Step 5: Wire it up** (§8).

**Step 6: Verify.**
- `npx tsc --noEmit -p .` and `npx vite build --outDir <temp dir>` must pass.
- Run the dev server (`npm run dev`, port 3000) and look at the page at
  **1440×900, 1024×768, 820×1180 and 390×844**. The Browser pane doesn't render
  while hidden; headless Playwright screenshots are fine.
- Check that every card in a row is the same size, no text is clipped, headings fit on
  a phone, and there's no horizontal scroll.
- Send the teammate screenshots. **Commit/push only when asked.**

**Step 7: Log it** in §11 (status, decisions, the prompts actually used).

---

## 5. Prompt rules (every prompt must say these)

- **Format:** exactly 2:1 (2400×1200), or 16:9 for the hero; "if 2:1 isn't possible, 16:9".
- **Background:** flat pure white `#FFFFFF`, seamless: no border, frame, gradient,
  vignette, texture, props, hands or people.
- **Margin:** ~4–6% white around everything; nothing touches the edges.
- **Exact text:** list every string and number, then say *"every word and number
  exactly as written, no gibberish, no invented names or numbers."*
- **Real names:** *"use ONLY the names given; never copy names from the reference screenshot."*
- **Logo:** *"copy the attached logo exactly; do not redesign it"* + a one-line description.
- **No empty states** (no ₹0, no "no data"). Fill every tile, chart and list with
  plausible demo data in the client's context (₹, Indian number format, Indian names and cities).
- **Hand-drawn arrows and notes:** loose marker arrows + short handwritten notes, in
  the client's accent colour + charcoal. They must never cover UI text. In bentos that
  will be **cut into cards**, notes must sit **inside a card's own boundary**, never in
  the gap between cards (a note in the gap gets clipped and has to be erased).
- **No devices** for software images unless a mockup is explicitly wanted: *"show the
  software UI directly: no laptop, no phone, no device, no browser chrome."*
- **No official third-party logos** (Booking.com, MakeMyTrip…): platform names as plain text chips.
- Card titles and the headline must stay readable at 1200px wide.
- No watermark, no captions, no device brand logos.

**Lessons learned**
1. A bare dashboard means nothing to a visitor. Software images need a headline that
   says what it is and every feature as a labelled tab or card.
2. Generated "floating cards over a laptop" looks dated here. The owner wants the UI flat
   on white with arrows, no device.
3. Bento notes in the gutters get clipped when cutting. Keep them inside the cards.
4. Generated images sometimes copy real names from the screenshot. Blur the screenshot
   and say "use only the names given".
5. When the teammate asks for a *prompt*, give the prompt. Don't build it in code instead.

---

## 6. Prompt templates

Fill every `{{…}}` with the project's real details. Delete lines that don't apply.

### T1: Homepage card, website (device mockup)
```
Create a clean, premium, photorealistic product mockup for a web-design agency portfolio, showing ONE website ("{{CLIENT}}") on a laptop and a smartphone.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No gradient, no vignette, no texture, no table, no props, no hands, no text outside the screens.

COMPOSITION
- A modern silver/space-grey laptop (MacBook Pro style, thin black bezel) seen straight on, very slightly from above (about 5°), centred slightly left, screen about 62% of the image width.
- A modern smartphone (iPhone 15 Pro style, black frame, Dynamic Island) standing in front of the laptop's lower-right corner, overlapping its edge by about 10%, about 70% of the laptop screen's height.
- Both devices rest on one invisible floor line near the bottom (about 6% margin). About 8% white margin on the left, right and top. Only a very soft, short, neutral contact shadow. No reflections, no colour glow.
- Soft, even studio light. Crisp, Apple product-shot quality.

LAPTOP SCREEN — replicate the attached desktop screenshot exactly, flat and undistorted:
- {{nav bar + every nav label; hero headline (exact words, style, accent colours); subtext; buttons; search/booking bar with every field}}

PHONE SCREEN — replicate the attached mobile screenshot exactly:
- {{mobile header, hero, headline, key block below (exact words)}}

LOGO (copy the attached logo exactly; do not redesign it)
- {{one-line description}}

QUALITY RULES
- All on-screen text sharp and spelled exactly; no gibberish, no invented words, no extra UI.
- Colour palette: {{site palette}}.
- Minimal, clean, professional. No watermark, captions, badges or device logos.
```
Attach: the desktop screenshot, the mobile screenshot and the logo.

### T2: Homepage card, software (feature showcase)
```
Create a clean, modern SaaS marketing hero image for "{{PRODUCT}}", {{one line: what it is, e.g. "an all-in-one management system for schools & institutes"}}. Someone seeing it for the first time must understand in 3 seconds: (1) what the product is, (2) every feature it has, (3) what the real dashboard looks like.
Style: a polished product-launch motion-graphics still. Crisp flat UI, soft shadows, rounded corners. No laptop, no phone, no browser chrome, no people.

FORMAT
- Exactly 2:1 (2400 × 1200 px). Background: flat pure white (#FFFFFF), seamless. About 5% margin on the left, right and top; the dashboard may run off the bottom edge.

LAYOUT, TOP TO BOTTOM, CENTRED
1) HEADLINE (top ~22%): a small pill with the logo + "{{PRODUCT}}". The headline, one line, bold near-black (#0D0B12): "{{The All-in-One X for Y}}" with "{{Y}}" in {{accent + hex}}. A one-line grey subheadline: "{{what it manages — one dashboard}}".
2) FEATURE TABS ROW: {{6–8}} rounded pill tabs, each with a line icon in a tiny pastel circle and a bold label: {{Feature 1 (icon)}}, … All equal; none selected.
3) THE DASHBOARD WINDOW (lower ~60%, ~80% of the width): recreate the attached dashboard faithfully. Sidebar: {{logo + items, Dashboard active}}. Header: {{title + welcome line + dropdowns}}. Stat cards: {{label + exact value + icon colour each}}. Below: {{alert strips / charts from the screenshot, exact text}}.
4) OPTIONAL: two small floating proof cards (~14% of the width) overlapping the window's sides: {{artefacts the software produces}}. They must not cover the headline, the tabs or the numbers.

LOGO (copy the attached logo exactly; do not redesign it): {{description}}

QUALITY RULES
- Every word and number exactly as written; no gibberish; use ONLY the names given.
- The headline and tab labels must stay readable at 1200 px wide. Palette: {{palette}}. No watermark, devices or scenery.
```
Attach: the dashboard screenshot (names blurred) and the logo.

### T3: Showcase hero (flat UI + floating cards + arrows)
```
Create a premium SaaS hero image for a software agency case study of "{{PRODUCT}}", {{one-line what it is}}. Show the software UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px). Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no desk, no people. About 5% margin; nothing touches the edges.

MAIN ELEMENT — THE DASHBOARD WINDOW (centre, ~68% of the width)
- A flat, front-facing app window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on white. No device frame.
- Recreate the attached dashboard faithfully, fully filled: {{sidebar items (active one), top bar, header, every stat card with exact values, alert strips, fee/finance tiles}}.

FLOATING CARDS (white, 20px corners, thin border, soft shadow, tilted 3–5°, slightly overlapping the window's edges)
- Top-left: {{chart card, exact title + values}}
- Bottom-left: {{second chart card}}
- Right: {{list card, e.g. recent payments, with 4 named rows}}
- Bottom-right: {{a small chip, e.g. "Reminder sent on WhatsApp ✓"}}

HAND-DRAWN ARROWS + NOTES: loose, slightly wobbly marker arrows (~3px, {{accent hex}}), short notes in a casual handwritten marker script (charcoal #1F2937, one key word in the accent). They sit in white space; they never cover UI text. Exactly these:
a) {{card}} → {{tile}}: "{{note}}"   b) …   c) …   d) top centre: "{{headline note}}" with an arrow into the dashboard   e) {{chip}} → {{tile}}: "{{note}}"

LOGO (copy the attached logo exactly): {{description}}

QUALITY RULES
- Every word and number exactly as written; no gibberish; use ONLY the names given; never copy names from the reference screenshot. No empty states, no zero values. No devices, no watermark, no borders.
```
Attach: the dashboard screenshot (names blurred) and the logo.

### T4: Showcase problem bento (6 "before" cards)
```
Create a clean, modern SaaS explainer image: "Before {{PRODUCT}} — how {{the client}} used to run". Style: a bento grid of 6 rounded cards on white, each showing one everyday problem as a small, realistic UI illustration, with a few playful hand-drawn notes. Honest and slightly chaotic INSIDE each card; the overall image stays neat, balanced and premium.

FORMAT
- Exactly 2:1 (2400 × 1200 px). Background: flat pure white (#FFFFFF), seamless. No border, no devices, no people photos (small avatars inside the UI are fine). About 4% margin.

VISUAL LANGUAGE
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding, EQUAL size, equal gaps.
- Each card: a small illustration panel on top (very light grey #F7F7F9), then a number "01"…"06" in {{accent hex}}, a bold near-black title and one short grey line.
- What's broken is marked with small red/pink badges (#E11D48 on #FFE4E6).
- Handwritten notes: short, casual marker script, {{accent}} + charcoal, with a short curved arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER (top-right corner of the illustration panel). Never put a note in the gap between cards.

LAYOUT: 3 columns × 2 rows, all cards the same size.
Card 01 — "{{title}}". Line: "{{line}}". Illustration: {{concrete mini-UI with exact labels}}. Note inside the card: "{{note}}".
Card 02 … Card 06 — same structure.

QUALITY RULES
- Every word and number exactly as written; no gibberish; no invented names or numbers.
- Card titles readable at 1200 px wide. No watermark, device frames or scenery.
```
Good problem ideas for business software: spreadsheets everywhere · WhatsApp groups
for everything · no single customer record · follow-ups slipped through · no real-time
numbers · every new branch/location = more chaos.

### T5: Showcase product feature bento (7 cards)
```
Create a clean, modern SaaS feature image for "{{PRODUCT}}", {{what it is}}. Style: a bento grid of 7 rounded feature cards, each with a pastel icon tile, a bold title, one short description line and a compact, realistic UI illustration fully filled with data. A few playful hand-drawn arrows and handwritten notes. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 (2400 × 1200 px). Background: flat pure white (#FFFFFF), seamless. No border, no headline, no people photos. About 4% margin.

VISUAL LANGUAGE
- Match the attached screenshot: {{surfaces, font, icon style}}. Accent: {{hex}} for charts/active/buttons; green (#16A34A) paid/done; amber (#F59E0B) pending.
- Cards: white, 24px corners, thin light-grey border, very soft shadow, generous padding, equal gaps. Header: a pastel icon tile + a bold near-black title + one grey line.
- Hand-drawn notes: 4–5 short notes in a casual marker script ({{accent}} + charcoal), each with a short curved arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER; none in the gaps between cards.

LAYOUT: top row 3 cards (~40% / 30% / 30%), bottom row 4 equal cards.
Card A — icon {{}}. Title "{{}}". Line "{{}}". UI: {{exact mini-UI}}. Note: "{{}}".
… Card G.

LOGO (copy the attached logo exactly): once, small, inside Card A's top-right corner.

QUALITY RULES
- Every word and number exactly as written; use ONLY the names given; no empty states.
- Card titles readable at 1200 px wide. No devices, watermark or borders.
```
Attach: the dashboard screenshot (names blurred) and the logo.

### T6: Design system sheet
```
Create a clean, premium DESIGN SYSTEM sheet for "{{PRODUCT}}", in the style of a professional agency style-guide page. It shows the colour palette, typography and core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 (2400 × 1200 px). Background: flat pure white (#FFFFFF), seamless. No border, devices or people. About 5% margin.

GENERAL STYLE
- 3 zones with generous spacing and thin #E5E7EB dividers; each zone has a small uppercase grey label: "COLOUR", "TYPOGRAPHY", "COMPONENTS". Swatches and cards: 20px corners, very soft shadow. 3 hand-drawn notes in {{accent}} + charcoal, in white space only.

ZONE 1 — COLOUR (left half)
- "Brand": 4 tall swatches, each with the name in bold + the hex in a small monospace pill: {{Name #HEX × 4}}
- "Status": 5 swatches: {{Success/Info/Warning/Danger/Accent with sampled hexes}}
- "Neutrals": 3 small swatches: {{Canvas #…, White #FFFFFF (thin grey outline), Text #…}}
- Note with an arrow at the brand swatches: "Taken straight from the logo".

ZONE 2 — TYPOGRAPHY (top right)
- Two specimen cards: a huge "Aa" in {{Heading font}} + "{{Heading font}}", "Headings & numbers", weights; a huge "Aa" in {{Body font}} + "{{Body font}}", "Interface & body text", weights. One sample line in each.
- A type scale list: {{"Page title · Font Weight Size" → "Dashboard"}}, …

ZONE 3 — COMPONENTS (bottom right, one tidy row of real UI pieces)
- {{primary button, secondary button, 3 status pills, a stat card, a search input, the active sidebar item}}
- Note: "Same pieces across every screen".

LOGO: the attached logo, small, top-left, with "Design System" beside it. Copy it exactly.

QUALITY RULES
- Every hex code, name and word exactly as written; each swatch exactly its hex colour; no extra colours or fonts. Aligned to a clear grid. No watermark.
```
Attach: the logo. Sample the hexes yourself (§4 step 2) before filling this in.

### T7: Software explainer bento (HeloFlow style, optional)
Two big cards on top (~56% / 44%) and four equal cards below. Each card has an icon
tile, a bold title, a one-line subtitle and a compact filled UI. Card A is always "the
dashboard"; card B is the product's signature flow (a vertical chain of 3–4 step
cards joined by curved arrows); cards C–F are the other key modules. A one-line
headline and a row of small grey module chips sit on top. Arrows + notes as in §5.
The filled examples for Spectrum CRM and Quick Hotels PMS are in §11.

### W2: Website showcase hero (flat screens + callouts)
Like T3, but for a website: a flat **browser window** (minimal light-grey bar, three
dots, an address pill with the real domain) showing the homepage, and a flat **phone
screen** (36px corners, thin black outline, no body/notch) showing one mobile page,
overlapping its lower-right corner. Four white callout cards lift real pieces out of
the site (search, a form, reviews, a contact chip), and five hand-drawn arrows + notes
in the client's accent say what each does. No device bodies. The filled example for
UnSkills is in §11.

### W3: Website page spotlight (one per key page)
2:1 on white. Left ~62%: the page as a flat browser window (address pill = the page's
URL), recreated from the desktop capture. Right ~30%: one column of **three callout
cards**, each a small bold label + the real part of the page magnified ~1.6×, joined
to the exact spot by a thin connector line ending in a dot. Two handwritten notes.
Write every visible string of the page into the prompt. Filled examples (Home, Courses,
Verification, Franchise) are in §11.

### Follow-up fixes (send as an edit to the same image, not a fresh generation)
- Garbled text: *"Keep the layout. Fix the text so it matches exactly: …"*
- Wrong names: *"Replace every person's name with the names given in the prompt."*
- A device crept in: *"Remove the laptop/device completely; show only the flat UI on white."*
- Notes covering UI: *"Move the handwritten notes into white space inside the cards; don't cover any text."*
- Logo redrawn: *"Use the attached logo exactly, unchanged."*
- Format: *"Same image, 2:1, on a flat pure white background, no border."*
- Empty values: *"Fill every tile and chart with the numbers given; no empty states."*

---

## 7. Processing the images (`scripts/showcase/`)

Requires Python 3 with `pillow`, `numpy` and `scipy` (`pip3 install pillow numpy scipy`).

**Whole images** (homepage mockup, showcase hero, design system): near-white → pure white, WebP.
```bash
python3 scripts/showcase/flatten_white.py ~/Downloads/<file>.png public/work/<client>/hero.webp
```

**Bentos → individual cards** (problem, product features):
```bash
# 1. find the cards (prints JSON rows + writes <image>.cards.png with red boxes; LOOK at it)
python3 scripts/showcase/find_cards.py ~/Downloads/<bento>.png > /tmp/boxes.json
# 2. cut them to equal-size, rounded, transparent-corner cards
python3 scripts/showcase/cut_cards.py ~/Downloads/<bento>.png /tmp/boxes.json public/work/<client> \
    --prefix problem- --size 574x440
python3 scripts/showcase/cut_cards.py ~/Downloads/<bento>.png /tmp/boxes.json public/work/<client> \
    --prefix crm-card- --names students,leads,fees,branches,courses,coding-lab,certificates \
    --size 620x470,432x392
```
- **Every card in a row comes out the same pixel size.** Each card is cropped just inside
  its grey border and centred on a white canvas of the row's `--size`. A card bigger
  than the canvas is scaled down to fit (never up). Choose `--size` so most cards fit
  unscaled with ~10–20px of white around them. Omit `--size` to let the script pick.
- A card whose handwritten note ran past its edge: rub the note out with
  `--erase <name>:x0,y0,x1,y1` (coordinates in that card's own pixels, before padding),
  e.g. `--erase 2:297,0,523,73`.
- `find_cards.py` splits two cards that a note joined together and snaps every box to
  the card's own border. If the overlay still looks wrong, write the boxes JSON by hand.
- The scripts print each output's width/height. Copy them into the data.

**Logos → solid black** (homepage cards; the showcase hero inverts it to white):
```bash
python3 scripts/showcase/black_logo.py logo-original.png public/work/<slug>-logo.webp
```
Coloured, gold and grey parts become black; white knock-outs stay white. The logo must
have a transparent background, or the script refuses it.

Keep each image ≲ 150 KB (cards are 15–35 KB each).

---

## 8. Wiring it up

### Project card: `lib/workCards.ts`, `FEATURED` array
```ts
{
  slug: 'quick-hotels',                       // must exist in lib/caseStudies.ts
  kinds: ['website'],                         // tab(s): 'software' | 'website' | 'app'
  glow: '255,47,134',                         // tint for the fallback card style
  mockup: '/work/quick-hotels-mockup.webp',   // 2:1 on white → replaces the screenshot frames
  logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
},
```
The array order is the card order within each tab (Software / Websites / Apps; a tab with
no projects shows a "coming soon" card). The card's one-liner is `card.blurb` in
`lib/caseStudies.ts`.

**Everywhere else:** the /work index and the services pages show the same project with
`components/sections/WorkCard.tsx`, the homepage card in miniature (black logo, one-line
category from `card.showcaseLine`, the same 2:1 image). So one `FEATURED` entry updates
every page. Which projects a services page lists is its `work` array in `lib/services.ts`.
/work follows the `FEATURED` order.

### Showcase page: `lib/showcases.ts`, one `Showcase` entry
```ts
{
  slug: 'unskills-computer-education-crm',    // URL: /work/<slug>
  client: 'UnSkills Computer Education',
  logo: { src: '/work/unskills-logo.webp', width: 356, height: 160 },
  focus: ['Institute Management System'],     // "Project focus" chips
  headline: { lead: 'One management system for a', word: 'MULTI-BRANCH INSTITUTE.' },
  hero: { src: `${U}/hero.webp`, width: 1672, height: 941, alt: '…' },
  brief: '… **bold** …', facts: [{ label: 'Industry', value: 'Education' }, …],
  problem: '… **bold** …',
  problemCards: [[{ src: `${U}/problem-1.webp`, width: 574, height: 440, alt: 'Spreadsheets everywhere' }, …], [ … ]],
  process: ['Discovery & workflow mapping', …],
  products: [{ kind: 'crm', name: 'Institute Management System', summary: '…', features: ['…'],
               cards: [[ …3 top cards… ], [ …4 bottom cards… ]], gallery: [] }],
  systemImage: { src: `${U}/design-system.webp`, width: 1774, height: 887, alt: '…' },
  palette: [ … ], type: [ … ],               // used only when there's no systemImage
  impact: [{ label: 'Admissions', value: '+42%', caption: 'more admissions converted' }, …],
  testimonial: { quote: '…', name: '…', role: '…' },
  processNote: '…',                          // optional line under "Our PROCESS."
  ctaLead: 'Running an institute on spreadsheets?', // optional serif line in the CTA
}
```
- Sections without real material are left out: `impact: []` hides The IMPACT, no
  `testimonial` hides In their WORDS, no `problemCards` shows the problem as text only,
  and a product without `cards`/`gallery` shows its name, summary and chips only.
  **Never fill them with invented content.**
- Every image in one card row must have the **same width/height** (§7).
- `App.tsx` renders a showcase for `/work/<slug>` automatically, ahead of the older
  `CaseStudyPage`. `lib/seo.ts` builds the title/description/canonical from it.
  **Also update** that URL's entry in `scripts/prerender.mjs` (h1/title/description).
- Old URLs that should open this showcase go in `matchSlugs` (they canonicalise to `slug`).

### Website showcase: add `site` to the entry
```ts
{
  slug: 'unskills-education-website', client: '…', logo: { … }, focus: ['Institute Website', …],
  headline: { lead: 'The online home of a', word: '102-CENTRE NETWORK.' },
  hero: { src: `${UW}/home-desktop.webp`, width: 1600, height: 1000, alt: '…', frame: 'browser', url: 'unskillseducation.org' },
  brief: '…', facts: [ … ], links: [{ label: 'unskillseducation.org', href: 'https://…' }],
  problem: '', process: [], products: [],      // not used by the website layout
  site: {
    url: 'https://…', label: 'unskillseducation.org',
    goals: [{ title, text }, …],                // 3–4
    sitemap: [{ group: 'Courses', pages: ['Computer Software', …] }, …],
    build: [{ title: 'Sitemap & content', text: '…' }, …],
    pages: [{ name: 'Courses', path: '/courses', summary: '…', features: ['Search', …], image: { … } }, …],
    screens: [{ src: `${UW}/home-mobile.webp`, width: 585, height: 1266, alt: '…' }, …],
    builtIn: [{ icon: 'search', title: 'Course search', text: '…' }, …],   // icons: SiteFeatureIcon
    todayNote: 'The numbers on <site> today.',
  },
  palette: [ … ], type: [ … ], impact: [ …real numbers from the live site… ], ctaLead: '…',
}
```
The project also needs a `lib/caseStudies.ts` entry (card name, `showcaseLine`,
`card.image` = the desktop still) and a `FEATURED` entry with `kinds: ['website']` and
`shots` (the card shows the stills until its T1 `mockup` exists).

---

## 9. Do / Don't

**Do**
- Use only real material: real screenshots, the real logo, real features, real numbers.
- Keep our look (§2) everywhere; the client's brand only inside images and swatches.
- Keep images 2:1 (16:9 for the hero) on pure white; cards equal-size per row.
- Keep client logos solid black on white cards.
- Check at 4 widths and send screenshots before calling it done.
- Log what you did in §11.

**Don't**
- Don't embed live websites (iframes) on the homepage stack or showcase pages.
- Don't bring back the category pill, the client-name strip under the hero, the
  "Trusted by…" marquee, or a "More work" section on showcase pages.
- Don't add `overflow-hidden` to the homepage work section or its ancestors (it breaks
  the sticky stack), don't use `vh` in the stack (use `px`/`svh`), don't give that
  section a `z-index`/`transform`, and don't scroll-scrub the light/dark switch.
- Don't copy a reference site's fonts or colours. It gives us layout ideas only.
- Don't invent claims, metrics, names or client quotes.
- Don't commit or push unless asked.

---

## 10. Checklist before "done"

- [ ] Real logo (transparent) → black version; real brand hexes sampled; real fonts read
- [ ] Every image slot filled; whole images flattened to white; bentos cut with equal sizes per row
- [ ] Clipped notes erased; no grey border lines inside padded cards
- [ ] Data entry complete; widths/heights match the files; `alt` text on every image
- [ ] `prerender.mjs` entry updated for the URL
- [ ] `tsc` + `vite build` pass; checked at 1440 / 1024 / 820 / 390; no horizontal scroll
- [ ] Screenshots sent; §11 log updated; committed/pushed only if asked

---

## 11. Log

### Status

| Project | Homepage card | Showcase page |
|---|---|---|
| **UnSkills: Institute Management System** | ✅ T2 feature showcase + black logo | ✅ live: hero, 6 problem cards, 7 feature cards, design system |
| **Smart Agro: Agri Business Management System** | ✅ hub image (below) + black logo | ✅ live at `/work/smart-agro`: hero (T3 image, `smart-agro/hero.webp`), brief, problem (6 cut cards), process, features (7 cut cards), design system (T6 image), impact (live dashboard totals: 11,898 leads · 2,678 orders · ₹56.4L · 86% via WhatsApp; scale, not before/after). No testimonial yet |
| **Quick Hotels** (website) | ✅ T1 mockup + black logo | ✅ live at `/work/quick-hotels`: hero (T3, PMS dashboard), problem (6 cut cards), process, features (website: 3 cut cards, PMS: 4 cut cards), design system (T6 image), impact (real facts only: 12 hotels from the PMS, 1000+ guests (quickhotels.co's own claim), 5+ cities, 100% GST-inclusive prices; the hero image's revenue/occupancy are demo and not repeated). No testimonial yet |
| **Herbal Vantage** (MLM software + online store) | ✅ black logo · tab: Software only (the store has its own card, row below): software-only image `herbal-vantage-software.webp` (the showcase hero padded to 2:1), line "MLM Software for Direct Selling" | ✅ live at `/work/herbal-vantage`: hero (T3), problem (6 cut cards), process, MLM Software features (7 cut cards), Online Store (chips only), design system (T6 image), impact (live dashboard figures: 69 members, 87% active (60/69), PV 45.6L, sales ₹48.6L; scale, not before/after). No testimonial yet |
| **Quick Hotels CRM/PMS** (`ecommerce-retail-platform`) | ✅ T7 image + black logo · tab: Software | ✅ live at `/work/ecommerce-retail-platform` (the Software-tab card): reuses the `public/work/quick-hotels/` assets: PMS-dashboard hero, the 6 problem cards, the 4 PMS feature cards, the design-system sheet, and the same real-facts impact. The old page's retail/POS copy, metrics and testimonial were placeholders and are not used |
| **Spectrum: travel CRM** (`spectrum-tour-travels`) | ✅ T7 CRM image + black logo · tab: Software | ✅ live at `/work/spectrum-tour-travels`: hero (T3), problem (6 cut cards), process, features (7 cut cards), design system (T6 image), impact (live dashboard figures: +35% leads (34.8%, rounded to fit), ₹4.1L revenue, 29 upcoming tours, 47 payments tracked; not before/after). Covers the CRM, not the website. No testimonial yet |
| **UnSkills: institute website** (`unskills-education-website`) | ✅ T1 mockup `unskills-website-mockup.webp` + black logo · tab: Websites | ✅ live at `/work/unskills-education-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Courses, Verification, Franchise), T6 design system, real phone stills. Wide images open full screen on tap (`Zoomable`). Numbers are the site's own (158 courses, 102 centres, 4.8 from 124 Google reviews, 2,000+ students) |
| **Herbal Vantage: online store** (`herbal-vantage-website`) | ✅ T1 mockup `herbal-vantage-website-mockup.webp` + black logo · tab: Websites · line "Ayurvedic Store + PV Rewards" | ✅ live at `/work/herbal-vantage-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Products, Product page, Legal & Certifications), T6 design system, real phone stills. Numbers from the store: 26 products / 8 categories, 6 legal documents; 4.8 from 500+ reviews and 10K+ families labelled as the company's own claims. Not linked to the live site |
| **Spectrum: tour booking website** (`spectrum-tour-travels-website`) | ✅ T1 mockup `spectrum-website-mockup.webp` + black logo · tab: Websites · line "Group Tour Booking Website" | ✅ live at `/work/spectrum-tour-travels-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Upcoming Departures, Trip page, Customised Trips), T6 design system, real phone stills. Counts from the site: 10 departures, 8 packages; 200+ Google reviews and 100K+ Facebook labelled as the company's own. Not linked to the live site |
| **Smart Agro: agri shop website** (`smart-agro-website`) | ✅ T1 mockup `smart-agro-website-mockup.webp` + black logo · tab: Websites · line "Agri E-commerce Website" | ✅ live at `/work/smart-agro-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Shop by Crop, Shop by Problem, Product page), T6 design system, real phone stills. 30 products / 3 languages from the site; 2,200+ farmers and 2,800+ orders labelled as the company's own. Not linked. Note: smartagrocare.in returned DEPLOYMENT_DISABLED (402) on 2026-10-03 |
| **Quick Agriculture: network website** (`quick-agriculture-website`) | ✅ T1 mockup `quick-agriculture-website-mockup.webp` + black logo · tab: Websites · line "Agriculture Network Website" | ✅ live at `/work/quick-agriculture-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Services, Research & Training, Contact), T6 design system, real phone stills. Counts from the site: 6 services, 3 articles; 12 states and 10,000+ farmers labelled as the network's own (its figures disagree elsewhere; named testimonials not used). Not linked |
| **Ram Tiles: tile catalogue website** (`ram-tiles-website`) | ✅ T1 mockup `ram-tiles-website-mockup.webp` + black logo · tab: Websites · line "Tile Catalogue + Online Orders" | ✅ live at `/work/ram-tiles-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Category, Product page, Visit Store), T6 design system, real phone stills. Counts from the site: 1,149 products, 40+ categories, 2 showrooms, open 7 days. Its About Us and How to Place an Order pages are empty (not shown). Not linked |
| **Strataloom Research: research firm website + panel** (`strataloom-research-website`) | ✅ T1 mockup `strataloom-website-mockup.webp` + black logo · tab: Websites · line "Market Research Website + Panel" | ✅ live at `/work/strataloom-research-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Services, Panel Book, Join Panel), T6 design system, real phone stills. 6 services and 4 languages from the site; 10M+ panel and 42+ markets labelled as the company's own. Not linked |
| **Baba Biswanath Travels: group tours website** (`baba-biswanath-travels-website`) | ✅ T1 mockup `baba-biswanath-website-mockup.webp` + one-colour logo · tab: Websites · line "Group Tours & Pilgrimage Website" | ✅ live at `/work/baba-biswanath-travels-website` in the **website layout**: W2 hero, 4 W3 page spotlights (Home, Upcoming Trips, Tour page, Customized Tours), T6 design system, real phone stills. Counts from the site: 12 departures, 14 tours, 39 destinations; "10+ years" labelled as the company's own. Payment page (bank details) not shown. Not linked |
| UnSkills mobile app | not started | not started |

Removed from the site on the owner's request: UnSkills Education (its old URLs open the
UnSkills showcase), Clinic Management System, Real Estate Portal, Restaurant Ordering.
Don't bring them back.

### UnSkills: Institute Management System (`/work/unskills-computer-education-crm`)

**Decisions**
- The showcase covers **only the institute management system** (not the app or the
  website). Project focus: "Institute Management System". Headline: *"One management
  system for a"* **MULTI-BRANCH INSTITUTE.**
- The product section is "01 INSTITUTE MANAGEMENT SYSTEM" with 9 feature chips:
  Student, Staff, Branch management; Accounting & fees; Leads & WhatsApp; Course
  management; Coding lab; Certificate generation; Mark sheet generation.
- The old website URL `/work/unskills-education-website` opens its own older page again.
- Impact numbers (+42% / +35% / +28% / −60%) and the testimonial come from the
  existing project data. Have the owner confirm them with the client before relying on them.

**Brand material (sampled)**
- Logo: `https://www.unskillseducation.org/logo.png` → `public/work/unskills-logo.webp` (black).
- UnSkills Crimson `#AC2038`, Gold `#B08848` (logo); Action Red `#E1292A` (CRM buttons);
  Success `#1CCB5D`, Info `#4086FA`, Warning `#FAA416`, Danger `#E4292D`, Accent
  Purple `#7B54F3` (CRM status icons); Canvas `#F9F9FB`, Slate Text `#5C657B`, Ink `#111111`.
- Fonts (from the live CRM): **Outfit** (headings), **Inter** (UI/body).

**Assets** (`public/work/unskills/`)
- `hero.webp` 1672×941 (flattened)
- `problem-1…6.webp` 574×440 each (cards 2 and 4 had clipped notes erased)
- `crm-card-{students,leads,fees}.webp` 620×470 (students scaled 0.89 to fit);
  `crm-card-{branches,courses,coding-lab,certificates}.webp` 432×392
- `design-system.webp` 1774×887. Homepage card: `public/work/unskills-crm-showcase.webp`.

Commands used:
```bash
python3 scripts/showcase/flatten_white.py "~/Downloads/unskill crm.png" public/work/unskills/hero.webp
python3 scripts/showcase/find_cards.py "the admin.png" > admin.json
python3 scripts/showcase/cut_cards.py "the admin.png" admin.json public/work/unskills --prefix crm-card- \
  --names students,leads,fees,branches,courses,coding-lab,certificates --size 620x470,432x392
python3 scripts/showcase/find_cards.py "the problem unskill.png" > problem.json
python3 scripts/showcase/cut_cards.py "the problem unskill.png" problem.json public/work/unskills --prefix problem- \
  --size 574x440 --erase 2:297,0,523,73 --erase 4:397,0,571,44 --erase 4:502,37,571,55
python3 scripts/showcase/flatten_white.py "~/Downloads/the design system.png" public/work/unskills/design-system.webp
```

**Prompts used** (attach the logo, plus the dashboard screenshot with real names blurred)

<details><summary>Homepage card (T2), produced <code>unskills-crm-showcase.webp</code></summary>

```
Redo this image from scratch. Create a clean, modern SaaS marketing hero image for "UnSkills CRM", an all-in-one management system for schools, coaching centres and computer institutes. Someone seeing it for the first time must understand in 3 seconds: (1) what the product is, (2) every feature it has, (3) what the real dashboard looks like.

Style: polished product-launch motion-graphics still. Crisp flat UI, soft shadows, rounded corners, gentle depth, slight "just animated in" energy. Not a device mockup: no laptop, no phone, no browser chrome, no people.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No gradient, no texture, no scenery.
- About 5% white margin on the left, right and top. The dashboard window may run off the bottom edge.

LAYOUT, TOP TO BOTTOM, EVERYTHING CENTRED

1) HEADLINE BLOCK (top ~22% of the image)
- A small pill above the headline: the UnSkills logo (see logo spec) plus "UnSkills CRM" in dark grey.
- Headline, large, bold, dark near-black (#0D0B12), clean geometric sans-serif (Inter / SF Pro style), one line:
  "The All-in-One CRM for Schools & Institutes"
  with the words "Schools & Institutes" in crimson red (#D6203A).
- Subheadline, one line, medium grey (#6B6B76), smaller:
  "Admissions, staff, branches, fees, courses and exams — managed from one dashboard."

2) FEATURE TABS ROW (directly under the headline)
- One horizontal row of 8 rounded pill tabs, evenly spaced, each with a small line icon on the left and a short bold label:
  1. Student Management (graduation-cap icon)
  2. Staff Management (id-badge icon)
  3. Branch Management (building icon)
  4. Accounting (₹ rupee icon)
  5. Coding Lab (</> icon)
  6. Course Management (open-book icon)
  7. Certificate Generation (award-ribbon icon)
  8. Mark Sheet Generation (clipboard-list icon)
- Each tab: white fill, thin light-grey border, soft shadow, dark text, icon inside a tiny pastel circle (each tab a different soft colour: blue, green, purple, amber, dark slate, teal, gold, rose).
- All 8 tabs look equally important. None is "selected". They read as a feature list.

3) THE DASHBOARD WINDOW (lower ~60%, wide, centred, about 80% of the image width)
- Recreate the attached UnSkills CRM dashboard screenshot faithfully as a clean app window with rounded top corners and a soft large shadow. Keep its exact look: white and very light grey (#F5F5F7) surfaces, thin borders, Inter font, crimson-red accent, pastel icon tiles.
- Left sidebar: the UnSkills logo with "UnSkills CRM" at the top. Section label "MAIN", then Dashboard (ACTIVE: light-red background, crimson text and icon, thin red left bar), Branches, Users, Leads, WhatsApp. Section label "ACADEMICS", then Students, Coding Lab, Courses, Batches, Study Material.
- Top bar: title "Dashboard", a search icon, a bell with a red badge "26", and a small avatar with "Super Admin".
- Page header: "Dashboard" (bold) with "Welcome back! Here's your institute overview" underneath. On the right, two dropdown buttons: "UnSkills Computer Education" and "This Month".
- Section label "OVERVIEW", then a grid of stat cards (label, big bold value, pastel icon tile top-right):
  Row 1: "Total Students 1,698" (blue), "New Admissions 67" with a small green "↑ 12% vs last month" (green), "Active Students 1,221" (green), "Total Revenue ₹2,62,400" (green ₹).
  Row 2: "Completed Students 443" (purple cap), "Pending Fees ₹39,10,800" (amber warning), "Expenses ₹88,000" (orange), "Profit ₹1,74,400" (green trend arrow).
- Below the cards, two full-width alert strips (the window may be cut by the bottom edge here):
  • Mint-green strip: wallet icon, "Pending Wallet Recharge Request", subtext "1 branch is waiting on your approval", and a green "Review →" button.
  • Lavender strip: graduation icon, "Trial Classes Ended", subtext "148 trial students completed their demo period", and a purple "Review →" button.

4) TWO SMALL FLOATING PROOF CARDS (optional, keep them small, about 14% of the image width each)
- Overlapping the dashboard's left edge, tilted about 4°: a mini "Certificate of Completion" (cream, thin gold border, UnSkills logo, gold seal) with a small green tick badge "Auto-generated".
- Overlapping the dashboard's right edge, tilted about -4°: a mini "Mark Sheet" card (3 subject rows with marks and a green "Grade A+" pill).
- They must not cover the headline, the tabs or the stat numbers.

LOGO (copy the attached UnSkills logo exactly; do not redesign it)
- A black circle with a gold ring containing a white "Un", joined to a rounded white badge with a thin gold border containing "Skills" in crimson red, with "Unlock Skills" in small grey text below.

QUALITY RULES
- Every word must be spelled exactly as written above, sharp and legible. No gibberish, no extra words, no invented numbers.
- The headline and the 8 tab labels must stay readable when the image is shown at 1200 px wide.
- Clean, balanced, uncluttered, generous spacing. Premium, trustworthy B2B software look.
- Colour palette: white and light grey, near-black text, crimson-red accent, gold from the logo, soft pastel icon colours.
- No watermark, no device frames, no browser chrome, no people, no background scenery.
```
</details>

<details><summary>Showcase hero (T3), produced <code>hero.webp</code></summary>

```
Create a premium SaaS hero image for a software agency case study of "UnSkills CRM", a management system for multi-branch computer-education institutes. Show the software UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px).
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no people.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT — THE DASHBOARD WINDOW (centre, about 68% of the image width)
- A flat, front-facing app window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on the white background. It is just the UI panel itself: no device frame, no bezel, no stand.
- Recreate the attached UnSkills CRM dashboard faithfully (same layout, colours, icons, Inter-style font), fully filled:
  • Left sidebar: the UnSkills logo + "UnSkills CRM". MAIN: Dashboard (active: light-red background, crimson text, thin red left bar), Branches, Users, Leads, WhatsApp. ACADEMICS: Students, App, Internships, Coding Lab, Courses, Batches, Study Material. Then Settings, Profile, Logout (red).
  • Top bar: "Dashboard", a search icon, a bell with a red "27" badge, "Super Admin".
  • Header: "Dashboard" / "Welcome back! Here's your institute overview", with dropdowns "UnSkills Computer Education" and "This Month".
  • OVERVIEW stat cards (label, bold value, pastel icon tile top-right):
    Row 1: "Total Students 1,701", "New Admissions 70" with a green "↑ 12% vs last month", "Dropped Students 34", "Active Students 1,218".
    Row 2: "Completed Students 449", "Total Revenue ₹2,64,200", "Pending Fees ₹3,90,450", "Expenses ₹88,000".
    Row 3: "Profit ₹1,76,200", "Discount Given ₹22,730".
  • Alert strips: mint "Pending Wallet Recharge Request · 1 branch is waiting on your approval · Review →"; lavender "Trial Classes Ended · 151 trial students completed their demo period · Review →".
  • FEE MANAGEMENT tiles: "Today's Collection ₹42,600" (green), "Today's Due ₹18,500" (blue), "Overdue Fees ₹1,26,000" (red), "Total Pending ₹3,90,450" (amber).

FLOATING CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–5°, overlapping the window's edges slightly, as if popping out of the UI)
- Top-left: "Monthly Fee Collection", a smooth crimson line chart Apr → Sep with a light crimson fill, the peak labelled "Jun · ₹11,80,000".
- Bottom-left: "Admission Growth", 6 crimson bars Apr → Sep, with a small green chip "↑ 12% this month".
- Right: "Recent Payments", 4 rows, each with a ₹ icon, a name, a student ID, an amount and a green "Received" pill: "Aarav Sharma · UCE/2471 · ₹1,100", "Priya Verma · UCE/2468 · ₹1,100", "Rohan Gupta · UCE/2459 · ₹1,000", "Sneha Yadav · UCE/2452 · ₹500".
- Bottom-right: a small chip with a green WhatsApp-style chat icon and "Fee reminder sent on WhatsApp ✓".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in crimson (#D6203A). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in crimson, slightly tilted. They sit in the white space and never cover any UI text, number or chart.
Add exactly these 5:
a) From "Monthly Fee Collection" → curved arrow to the "Total Revenue ₹2,64,200" tile. Note: "Fees tracked live".
b) From "Admission Growth" → curved arrow to the "New Admissions 70" tile. Note: "Admissions up 12%".
c) From "Recent Payments" → curved arrow to the "Today's Collection ₹42,600" tile. Note: "Every rupee, receipted".
d) Top centre, above the window: note "8 branches. One dashboard." with a short arrow curving down into the dashboard.
e) From the WhatsApp chip → short arrow to the "Overdue Fees ₹1,26,000" tile. Note under the chip: "Follow-ups on autopilot".

LOGO (copy the attached UnSkills logo exactly; do not redesign it)
- A black circle with a gold ring and a white "Un", joined to a white badge with a thin gold border and "Skills" in crimson, with "Unlock Skills" in tiny grey text below.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states, no zero values.
- Clean, balanced, generous spacing; the arrows guide the eye without clutter.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Problem bento (T4), produced <code>problem-1…6.webp</code></summary>

The version used put some notes in the gaps between cards, so two got clipped and were
erased. **For the next run, add:** *"Every note stays inside its own card's border."*

```
Create a clean, modern SaaS explainer image titled around one idea: "Before UnSkills CRM — how a multi-branch computer institute used to run". Style: a bento grid of 6 rounded cards on white, each showing one everyday problem as a small, realistic UI illustration, with a few playful hand-drawn arrows and handwritten notes. It should feel honest and slightly chaotic inside each card, but the overall image stays neat, balanced and premium.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no devices, no people photos (small avatars/initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding, equal gaps.
- Each card has a small illustration area on top (very light grey #F7F7F9 panel), then a small number ("01" to "06") in crimson (#D6203A), a bold near-black title and one short grey line.
- UI inside the illustrations: Inter-style sans-serif, thin borders, line icons, muted greys. What's broken is marked with small red/pink badges (#E11D48 text on #FFE4E6).
- Hand-drawn elements: 4–5 loose curved marker arrows and short handwritten notes in a casual marker script, crimson and dark charcoal. They sit in the gaps and never cover card text.

LAYOUT: 3 columns × 2 rows, all cards the same size.

Card 01 — "Spreadsheets everywhere"
Line: "Admissions, fees and batches in separate files, a different copy at every branch."
Illustration: a slightly messy stack of 4 spreadsheet file rows with green Excel-style sheet icons: "Admissions_2026.xlsx", "Fees_final_v3.xlsx" with a red badge "3 versions", "Fees_final_v3 (2).xlsx", "Batches_Kanpur_old.xlsx" (faded). Two rows slightly overlapping and tilted.

Card 02 — "WhatsApp groups for everything"
Line: "Enquiries, fee reminders and staff updates buried in group chats."
Illustration: a chat list with 3 group rows, each with a round group icon and a green unread badge: "Admission enquiries · 148", "Fee reminders · 63", "Branch staff · 99+". A tiny "typing…" line under the first row.

Card 03 — "No single student record"
Line: "The same student, different details at different branches."
Illustration: two small side-by-side student cards with the same avatar: "Aarav Sharma · Lucknow HQ · Fees: Paid" (green pill) and "Aarav Sharma · Kanpur · Fees: Pending" (amber pill), with a red "≠" circle between them.

Card 04 — "Follow-ups slipped through"
Line: "Enquiries went cold because nobody owned the call back."
Illustration: a list of 3 lead rows with a missed-call icon: "New enquiry · ADCA" with a red badge "6 days, no call", "Trial class · Tally" with "3 days, no call", "Fee query · DCA" with "Missed call".

Card 05 — "No real-time numbers"
Line: "Head office only knew fees and admissions once someone compiled a report."
Illustration: a KPI tile "Total fees collected" whose value is greyed-out dashes "₹ – – , – –", a small red clock line "Waiting on branch reports", and two faded rows "Admissions this month · ?" and "Pending dues · ?".

Card 06 — "Every new branch, more chaos"
Line: "Each new centre meant more files, more groups and more calls."
Illustration: a small "Head office" pill at the top, connected by tangled dashed lines to 4 branch pills at the bottom: "Lucknow", "Kanpur", "Varanasi", and a highlighted red-outlined pill "+1 new centre".

HAND-DRAWN NOTES (in the gaps between cards, with short curved arrows)
- Between cards 01 and 02: "Which file is the latest?" pointing at "3 versions".
- Near card 02: "148 unread…" pointing at the badge.
- Between cards 04 and 05: "Leads lost" pointing at "6 days, no call".
- Near card 06: "It only got worse" pointing at "+1 new centre".

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no extra text, no invented names or numbers.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Neat and balanced overall: the "mess" lives inside the small illustrations, not in the layout.
- No watermark, no device frames, no browser chrome, no background scenery.
```
</details>

<details><summary>Product feature bento (T5), produced <code>crm-card-*.webp</code></summary>

```
Create a clean, modern SaaS feature image for "UnSkills CRM", the admin system for a multi-branch computer-education institute. Style: a bento grid of 7 rounded feature cards, each with a pastel icon tile, a bold title, one short description line, and a compact, realistic UI illustration fully filled with data. Add a few playful hand-drawn arrows and handwritten notes that connect the cards, like a product-launch explainer. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no headline, no people photos (small round avatars and initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached UnSkills CRM screenshot: white and very light grey (#F7F7F9) surfaces, thin light-grey borders, Inter-style sans-serif (Outfit-style bold for card titles), line icons, pastel icon tiles (blue, green, purple, amber, red, teal).
- Accent: UnSkills crimson (#D6203A) for charts, active tabs and main buttons. Green (#16A34A) for paid/present/done, amber (#F59E0B) for pending.
- Cards: white, 24px rounded corners, thin light-grey border, very soft shadow, generous padding, equal gaps.
- Card header: a rounded-square pastel icon tile, then a bold near-black title and one short grey line.
- Hand-drawn elements: 5 loose curved marker arrows plus short handwritten notes in a casual marker script, crimson and dark charcoal. They sit in the gaps and never cover UI text.

LAYOUT
Top row: 3 cards (widths ~40% / 30% / 30%). Bottom row: 4 equal cards.

TOP ROW

Card A (widest) — icon: graduation cap. Title: "Student management". Line: "Every student's details, fees and exams in one record."
UI: a student profile panel. A round avatar and "Aarav Sharma", with a grey line under it: "UCE/2471 · ADCA · Morning A · Lucknow HQ". A tab row "Profile · Fees · Attendance · Exams" with "Fees" active (crimson underline). Beneath:
- "Fees paid ₹8,400 of ₹12,000" with a crimson progress bar at 70%.
- "Attendance 92%" with a green mini progress ring.
- "Next exam · Semester 2 · 12 Oct".
- Two green chips: "ID card ✓", "Admit card ✓".
Handwritten note with an arrow pointing at the profile: "One student, one record".

Card B — icon: funnel. Title: "Leads & WhatsApp". Line: "From enquiry to admission, automatically."
UI: a vertical flow of 4 small steps joined by short curved arrows:
- "New enquiry" with a green WhatsApp-style chat icon · "Ritika Singh · ADCA"
- "Trial class booked" · "Mon, 10:00 AM"
- "Auto reminder sent" · a tiny green chat bubble "See you tomorrow at 10 👋"
- "Admission confirmed ✓" (green pill)
Handwritten note: "No lead slips through".

Card C — icon: ₹. Title: "Fees & accounting". Line: "Collections, dues, expenses and receipts."
UI: a 2×2 grid of mini tiles: "Today's Collection ₹42,600" (green), "Today's Due ₹18,500" (blue), "Overdue ₹1,26,000" (red), "Expenses ₹88,000" (amber); under it a receipt row "Receipt #UCE-2471 · ₹1,100 · Received" with a green pill.
Handwritten note with an arrow at the collection tile: "Every rupee tracked".

BOTTOM ROW

Card D — icon: building. Title: "Branches & staff". Line: "Run every centre and team from head office."
UI: a mini branch list with student counts: "Lucknow HQ · 642", "Kanpur · 318", "Varanasi · 276", "Prayagraj · 214"; a chip "8 branches · 24 staff"; a row "Staff attendance today 22/24" with a thin green bar and 4 overlapping initials avatars.

Card E — icon: open book. Title: "Courses & batches". Line: "Courses, batches and study material in one place."
UI: course chips "ADCA", "DCA", "Tally Prime", "Python", "Web Design"; a batch row "Morning A · 32 students · 9:00 AM"; a file row with a small PDF icon "Study material · MS Office Notes.pdf".

Card F — icon: </>. Title: "Coding lab". Line: "Students write and run code inside the CRM."
UI: a small dark code editor (#1E1E2E) with 3 lines of colourful Python: `name = "Aarav"` / `print("Hello, UnSkills!")` / `print(f"Welcome, {name}!")`, a green "Run ▶" button, and an output strip "Hello, UnSkills! · Welcome, Aarav!".

Card G — icon: award ribbon. Title: "Certificates & mark sheets". Line: "Generated in one click, ready to verify."
UI: a mini cream certificate "Certificate of Completion · Aarav Sharma · ADCA" with a gold seal, slightly overlapping a mini "Mark Sheet — Semester 1" (MS Office 92 · Tally Prime 88 · Internet & Email 95) with a green "Grade A+" pill.
Handwritten note with an arrow: "Auto-generated ✓".

LOGO (copy the attached UnSkills logo exactly; do not redesign it)
- A black circle with a gold ring and a white "Un", joined to a white badge with a thin gold border and "Skills" in crimson, with "Unlock Skills" in tiny grey text below. Use it once, small, inside Card A's top-right corner.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states; every tile, list and chart is filled.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Balanced, uncluttered, equal gaps between cards.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Design system sheet (T6), produced <code>design-system.webp</code></summary>

```
Create a clean, premium DESIGN SYSTEM sheet for "UnSkills CRM", in the style of a professional design-agency case study (like a Figma style-guide page). It shows the product's colour palette, typography and core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, Inter Medium): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows with short handwritten notes in a casual marker script, crimson (#AC2038) and dark charcoal. They sit in the white space and never cover text.

ZONE 1 — COLOUR (left half of the image)

Row 1: "Brand", 4 large tall swatches side by side. Each shows its colour as a solid block, then the name in bold and the hex code in a small monospace pill:
- "UnSkills Crimson" #AC2038
- "Action Red" #E1292A
- "Ink" #111111
- "Gold" #B08848

Row 2: "Status", 5 smaller square swatches, same labelling:
- "Success" #1CCB5D
- "Info" #4086FA
- "Warning" #FAA416
- "Danger" #E4292D
- "Accent Purple" #7B54F3

Row 3: "Neutrals", 3 small swatches:
- "Canvas" #F9F9FB (with a thin grey outline so it shows on white)
- "White" #FFFFFF (with a thin grey outline)
- "Slate Text" #5C657B

Handwritten note with an arrow pointing at the Crimson and Gold swatches: "Taken straight from the logo".

ZONE 2 — TYPOGRAPHY (top right)

Two specimen cards side by side:
- Card 1: a huge "Aa" set in Outfit SemiBold, then "Outfit", "Headings & numbers", and the weights "SemiBold · Medium". A small line of sample text in Outfit: "Welcome back! Here's your institute overview".
- Card 2: a huge "Aa" set in Inter SemiBold, then "Inter", "Interface & body text", and the weights "SemiBold · Medium · Regular". A small line of sample text in Inter: "Collect fees, track admissions and manage every branch."

Under the two cards, a type-scale list (a left column showing each style's name and size, a right column showing that style as rendered text):
- "Page title · Outfit SemiBold 28" → "Dashboard"
- "Stat value · Outfit SemiBold 24" → "₹2,64,200"
- "Card title · Inter SemiBold 16" → "Monthly Fee Collection"
- "Body · Inter Regular 14" → "Welcome back! Here's your institute overview"
- "Label · Inter Medium 11 · Uppercase" → "OVERVIEW"

ZONE 3 — COMPONENTS (bottom right, one tidy row of real UI pieces from the CRM)
- A primary button: solid Action Red (#E1292A), white text "Add Student" with a small user-plus icon.
- A secondary button: white with a thin grey border, "Collect Fee" with a ₹ icon.
- Three status pills: "Paid" (green on light green), "Pending" (amber on light amber), "Overdue" (red on light red).
- A stat card: "Total Students" / "1,701", with a pastel blue icon tile top-right.
- A search input: "Search students, courses or batches…" with a magnifier icon.
- A sidebar item in its active state: a light-red background, crimson icon and text "Dashboard", and a thin crimson bar on the left.
Handwritten note with an arrow at the components: "Same pieces across every screen".

LOGO
- Place the attached UnSkills logo small in the top-left corner above Zone 1, with "Design System" beside it in Outfit SemiBold. Copy the logo exactly; do not redesign it.

QUALITY RULES
- Every hex code, name and word exactly as written above, sharp and legible. No gibberish, no extra colours or fonts, no invented values.
- Swatch colours must match their hex codes exactly.
- Balanced, airy, professional; aligned to a clear grid.
- No watermark, no devices, no captions beyond what's specified.
```
</details>

### Smart Agro: Agri Business Management System (`/work/smart-agro`)

**Decisions**
- The owner found the dense bento (a headline + 8 filled mini-UI cards) **too cluttered**,
  and a simplified dashboard **too plain**. The one that worked is a **hub layout**:
  - the REAL dashboard, recreated exactly (every sidebar item, stat cards, alert strips, charts) in the centre;
  - 4 features per side as **plain text** (icon + bold title + one grey line);
  - one thin arrow from each feature to the exact dashboard element it powers;
  - no logo on top, no handwritten notes, one compact headline.
  **Use this hub layout as the default for software homepage cards.**
- The live dashboard figures (₹56,40,104 revenue etc.) are the client's real numbers.
  The owner chose to show them; ask before doing that for another client.
- The IMPACT shows the live dashboard's own totals (11,898 leads, 2,678 orders, ₹56.4L revenue, 86% of leads via WhatsApp), not before/after gains, because the client hasn't given any. Replace them with real before/after figures once the client confirms some; never invent them. No testimonial yet.
- "Product bid" in the owner's brief was read as product **batches** per godown. Confirm before reusing.

**Brand material (sampled)**
- Logo: `https://www.smartagrocare.in/smart-agro-cr.png` (transparent) → `public/work/smart-agro-logo.webp` (black, drop-shadow removed).
- Smart Red `#D01A1B`, Agro Green `#307120` (logo); Forest `#01411D`, Leaf `#28B94C` (product); Canvas `#F7F8F7`.
- Fonts: Poppins (headings), Inter (body), from smartagrocare.in.
- Images: `public/work/smart-agro-mockup.webp` (1774×887, homepage card and /work index card); `public/work/smart-agro/hero.webp` (1672×941, showcase hero, from "Smart Sec - 1.png" made with the T3 prompt below, flattened with the Node port of `flatten_white.py`).
- `public/work/smart-agro/problem-1…6.webp` 596×414 each, cut from "Smart Sec - 2.png" (T4 prompt below). The auto-finder missed cards 04 and 05 (a gap in their faint borders let the fill in), so their boxes were written by hand: row 2 = `[40,494,595,860]`, `[611,494,1165,860]`, `[1180,494,1734,861]`; row 1 was found as `[40,107,595,480]`, `[611,107,1165,480]`, `[1180,108,1735,481]`. One canvas for both rows so all six match. No notes were clipped.
- `public/work/smart-agro/crm-card-{leads,whatsapp,orders}.webp` 500×466 and `crm-card-{targets,inventory,quotations,accounting}.webp` 456×404, cut from "Smart Sec - 3.png" (T5 prompt below); all 7 found automatically. The leads card (747 px wide) is scaled 0.67 to fit its row, as UnSkills' student card was; a bigger canvas would only shrink its two neighbours, because the grid gives every card in a row the same width.
- `public/work/smart-agro/design-system.webp` 1774×887 from "Smart Sec - 4.png" (T6 prompt below). Flattened at **250, not 247**: the Canvas swatch (#F7F8F7 → ~#F8F9F9) would otherwise turn pure white and look like the White swatch. Every swatch was checked against its hex label (max difference 9/255). The sheet's top-left lockup is a redrawn "Smart Agro / LAXMI AGRO CRM" wordmark without the leaf mark, not the attached logo; regenerate with "Use the attached logo exactly" if the owner wants it exact.

<details><summary>Hub image prompt (the version that was used)</summary>

```
Create a premium, clean SaaS feature image for "Smart Agro", a complete business management system for agriculture companies. Idea: ONE real system in the centre, its features around it, each connected by a thin arrow to the exact part of the dashboard it powers. The dashboard must look like a real, fully working product. Clean and balanced, never cluttered. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no gradient, no texture, no people, no logo outside the dashboard.
- About 5% white margin on the left, right and top. The dashboard window may run off the bottom edge.

TYPE & COLOUR
- Geometric sans-serif throughout (Plus Jakarta Sans / Inter style). Near-black #0F172A, grey #64748B, leaf green #22A447 as the accent, forest green #0F5132 for the dashboard sidebar.
- Feature icons: simple line icons in leaf green inside identical soft-green rounded squares (#EAF7EE).

LAYOUT: 3 COLUMNS

1) HEADLINE (top ~12%, centred, one compact line, bold, about 5% of the image height)
"One system. Every part of your agri business." with "Every part of your agri business." in leaf green. No subheadline, no chips, no logo.

2) CENTRE: THE DASHBOARD (≈56% of the image width, centred)
A flat app window: 16px rounded corners, a thin light-grey border, a large, very soft shadow. Recreate the attached Smart Agro dashboard EXACTLY (same layout, spacing, colours, icons, font), fully filled:
• SIDEBAR (forest green, white text): the Smart Agro logo tile + "Smart Agro" / "LAXMI AGRO CRM"; "Dashboard" active (leaf-green pill); "SALES & CRM": Leads (›), Pending Activities (red "99+"), Targets, Customers; "AFFILIATE": Affiliate Applications, Affiliate Commissions; "OPERATIONS": Products, Product Reviews, Website, Blog, Inventory, Quotations, Orders; thin dividers; a user card at the bottom (green "A", "Aviral", "Admin").
• TOP BAR: "Good morning, Aviral ☀️" / "Here's what's happening with your business today."; a bell with a red "3"; a user pill (green "A", "Aviral", "Admin", chevron).
• STAT CARDS (4, each with a pastel icon tile, an uppercase label, a bold value, a sparkline): "TOTAL REVENUE" ₹56,40,104 · "↑ 140% vs last 7 days"; "TOTAL ORDERS" 2,678 · "42 today"; "TOTAL LEADS" 11,898 · "↑ 362% vs last 7 days"; "TOTAL PRODUCTS" 70 · "5 new this month".
• ALERT STRIPS: amber "You need to talk to 5,947 leads" / "No status change or note for over 24 hours. Tap to open the follow-up list."; amber "Stock is zero — 2 orders are waiting. Refill the stock." / "No invoice or dispatch until refilled."; soft red "4 products in negative stock — restock needed" / "Sold beyond available stock."; two half-width strips: amber "115 awaiting dispatch · Tap to manage queue", soft red "26 low stock products · Tap to restock".
• BOTTOM: "Sales Overview" (Last 7 days; leaf-green area chart, 0–80k, 20–26 Sep, peak 24 Sep) and "Leads by Source" (a donut "11,898 Total"; WhatsApp 86%, Manual 8%, Facebook 3%, Instagram 2%, Phone 1%; "Top Source · WhatsApp · 86%").

3) LEFT COLUMN (≈19% width, right-aligned, evenly spaced over the dashboard's height; icon tile + bold title + one grey line, no boxes):
"Leads, auto-distributed" / "Every lead to the right seller, instantly" · "Team roles & targets" / "Sellers see only their leads and goals" · "Quotations" / "Professional quotes in a few clicks" · "E-commerce & orders" / "Online store to dispatch, one flow"

4) RIGHT COLUMN (same style, left-aligned):
"Accounting & GST" / "Books, GST returns and reports" · "WhatsApp automation" / "Built in. No third-party BSP fees" · "Inventory & godowns" / "Stock and batches in every godown" · "Meta Ads auto-sync" / "Facebook & Instagram leads flow straight in"

5) CONNECTOR ARROWS: thin smooth curves (1.5px, #9AD9AE) with small arrowheads, entering the window only at its edge, never crossing each other or any text:
Leads → "Leads" sidebar item; Team roles → "Targets"; Quotations → "Quotations"; E-commerce → "Orders"; Accounting → the stat card row; WhatsApp → the "5,947 leads" strip; Inventory → the "26 low stock products" strip; Meta Ads → the "Leads by Source" donut.

QUALITY RULES
- Every word and number exactly as written, sharp and legible; no gibberish, no extra text, no invented names or numbers.
- Only: the headline, the dashboard, 8 features, 8 arrows. No handwritten notes, no decorations. Symmetrical and balanced.
- Feature titles readable at 1200 px wide. No devices, watermark, borders or logo outside the dashboard.
```
</details>

### UnSkills: institute website (`/work/unskills-education-website`)

**Decisions**
- First project in the website layout (§1 C). Headline: *"The online home of a"*
  **102-CENTRE NETWORK.** Focus: Institute Website · Online Admissions · Certificate
  Verification. The old URL (an alias of the CRM showcase until now) is this page again.
- Everything is read off unskillseducation.org (2026-10-01): menus and footer links (the
  sitemap), 9 categories / 158 courses (the /courses page's own counts), 102 active
  centres, 4.8 from 124 Google reviews, 2,000+ students (the homepage counter). The site
  is a Vite + React SPA on Vercel with Supabase storage; Student Login goes to
  crm.unskillseducation.org.
- "Connected to the UnSkills CRM" / "courses and students from the CRM's data" in the
  brief and build steps: confirm with the owner.

**Brand material (sampled)**
- Red #B91C1C (buttons, pills, top strip), Maroon #7F1D1D → Ink #0A0A0A (page banners),
  Gold #FACC15 (breadcrumbs, "Courses"), logo Crimson #AC2038, Call Blue #155DFC,
  WhatsApp Green #25D366, TOP badge #92730A on #FDF6DC, Canvas #F8FAFC.
- Fonts: **Outfit** Bold (headings: page title 48, section 36, card 15), **Inter** (body 16).

**Assets**
- Stills: `~/Downloads/unskills-website-stills/` (home, courses, verify, franchise,
  about, contact, register × desktop/mobile, plus home full-page).
- `public/work/unskills-website/{home,courses,verify,franchise}-desktop.webp` 1600×1000 and
  `-mobile.webp` 585×1266 (interim page images + the "Every SCREEN" phones).

**Prompts** (attach the logo `public/work/unskills-logo.webp`'s colour original
`https://www.unskillseducation.org/logo.png`, plus the stills named in each prompt)

<details><summary>Homepage card (T1), for <code>public/work/unskills-website-mockup.webp</code>. Attach home-desktop.png, courses-mobile.png, logo</summary>

```
Create a clean, premium, photorealistic product mockup for a web-design agency portfolio, showing ONE website ("UnSkills Computer Education", an institute website) on a laptop and a smartphone.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No gradient, no vignette, no texture, no table, no props, no hands, no text outside the screens.

COMPOSITION
- A modern space-grey laptop (MacBook Pro style, thin black bezel) seen straight on, very slightly from above (about 5°), centred slightly left, screen about 62% of the image width.
- A modern smartphone (iPhone 15 Pro style, black frame, Dynamic Island) standing in front of the laptop's lower-right corner, overlapping its edge by about 10%, about 70% of the laptop screen's height.
- Both devices rest on one invisible floor line near the bottom (about 6% margin). About 8% white margin on the left, right and top. Only a very soft, short, neutral contact shadow. No reflections, no colour glow.
- Soft, even studio light. Crisp, Apple product-shot quality.

LAPTOP SCREEN — replicate the attached desktop screenshot (home-desktop.png) exactly, flat and undistorted:
- A thin red top strip (#B91C1C) with white text: "+91 83828 98686", "unskillseducation@gmail.com", small social icons, "Free Online Test", "Institute Login".
- A white header: the UnSkills logo on the left; menu "Home" (active, red text with a red underline), "About Us", "Courses", "Student Zone", "Verification", "Gallery", "Franchise", "Contact", "More"; a red rounded button "Student Login" on the right.
- The hero banner on a very light grey background with thin diagonal red lines and dotted patterns:
  • top-left: "Unskill Computer Education" (bold, underlined in red) and "An ISO 9001:2015 Certified Organization";
  • centre: the headline "Explore All Our Courses" (bold, near-black) with a short thick red underline;
  • left: a smiling young woman in a grey blazer, arms crossed, in front of a pale pink circle;
  • a 3 × 3 grid of white cards, each with a dark-red left edge, a pale-pink icon tile and a bold title + grey subline: "Computer Software Courses / MS Office & More", "Hardware & Networking / Repair & Maintenance", "Skills Development Course / Vocational Training", "NIELIT Govt. Courses / CCC, BCC, O Level", "University Courses / BCA, MCA, B.Sc IT", "Beautician Courses / Professional Beauty", "Summer Training / Short-term Projects", "Typing Course / Hindi & English Speed", "Diploma Courses / ADCA, DCA, PGDCA";
  • right: a solid red box "9+ Courses Available" with "Something for everyone", and below it a white box with a red border, an alarm-clock icon and "Batch Starting Soon";
  • along the bottom: a dark-red strip with white bold text "Admissions Open 2026-27 | Call Us Today | Govt. Scholarship Available for Eligible Students".
- Three round floating buttons on the right edge, stacked: red (#B91C1C) with a pencil icon, blue (#155DFC) with a phone icon, green (#25D366) with a WhatsApp icon.

PHONE SCREEN — replicate the attached mobile screenshot (courses-mobile.png) exactly:
- A red top strip: "+91 83828 98686", small icons, "Free Test", "Institute".
- A white header: a hamburger icon on the left, the UnSkills logo in the centre, a red rounded button with a search icon and "COURSES" on the right.
- A banner with a diagonal gradient from dark red (#7F1D1D) to near-black (#0A0A0A): "HOME / COURSES" in small gold capitals (#FACC15); the title "Our Courses" in bold white with the word "Courses" in gold (#FACC15); under it in white: "158+ professional courses across 9 categories — from computer software to beautician arts."
- On a very light grey canvas: a white search box "Search by course name, code, or keyword"; a red pill "All Courses 158" and a white outlined pill "Computer Software Courses"; the line "Showing 158 courses".
- One white course card: "CTP902" in small grey monospace, a pale-gold "TOP" badge with 5 gold stars, the bold title "Certificate in Tally Prime", two grey lines "basic of Ms word excel and Basic of financial accounting, Manual Accounting Tally prime", and a grey chip "3 Months".
- A round red "+" floating button at the bottom right.

LOGO (copy the attached UnSkills logo exactly; do not redesign it)
- A black circle with a gold ring and a white "Un", joined to a rounded white badge with a thin gold border and "Skills" in crimson, with "Unlock Skills" in tiny grey text below.

QUALITY RULES
- All on-screen text sharp and spelled exactly as written above; no gibberish, no invented words, no extra UI. Keep "Unskill Computer Education" exactly as written (it's the site's own wording).
- Colour palette: UnSkills red #B91C1C, maroon #7F1D1D, gold #FACC15, near-black #0A0A0A, light canvas #F8FAFC, white; Outfit-style bold headings and Inter-style body text, as in the screenshots.
- Minimal, clean, professional. No watermark, captions, badges or device logos.
```
</details>

<details><summary>Showcase hero (W2), for <code>unskills-website/hero.webp</code>. Attach home-desktop.png, verify-mobile.png, logo</summary>

```
Create a premium hero image for a web-design agency case study of the "UnSkills Computer Education" website: an institute website where students find courses, apply online and verify certificates. Show the website DIRECTLY as flat screens: no laptop, no tablet, no monitor, no device bodies. Style: a clean website-launch explainer with floating UI callout cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px).
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no people outside the screens.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT 1 — THE DESKTOP PAGE (centre-left, about 62% of the image width)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on white. On top, a minimal light-grey bar with three small grey dots on the left and a rounded address pill reading "unskillseducation.org". No other browser chrome.
- Inside, recreate the attached homepage screenshot (home-desktop.png) faithfully and fully filled:
  • thin red top strip (#B91C1C) with "+91 83828 98686", "unskillseducation@gmail.com", "Free Online Test", "Institute Login";
  • white header: the UnSkills logo; menu "Home" (active, red underline), "About Us", "Courses", "Student Zone", "Verification", "Gallery", "Franchise", "Contact", "More"; red button "Student Login";
  • hero: "Unskill Computer Education" / "An ISO 9001:2015 Certified Organization", the headline "Explore All Our Courses" with a red underline, the smiling woman in a grey blazer on a pale pink circle, the 3 × 3 grid of course-category cards ("Computer Software Courses", "Hardware & Networking", "Skills Development Course", "NIELIT Govt. Courses", "University Courses", "Beautician Courses", "Summer Training", "Typing Course", "Diploma Courses", each with its grey subline from the screenshot), the red "9+ Courses Available" box and the "Batch Starting Soon" box;
  • the dark-red strip "Admissions Open 2026-27 | Call Us Today | Govt. Scholarship Available for Eligible Students";
  • the three round floating buttons on the right: red pencil, blue (#155DFC) phone, green (#25D366) WhatsApp.

MAIN ELEMENT 2 — THE PHONE PAGE (right, overlapping the browser window's lower-right corner, about 22% of the image width)
- A flat phone-shaped screen: 36px rounded corners, a thin black outline, a soft shadow. No phone body, no buttons, no notch.
- Inside, recreate the attached mobile screenshot (verify-mobile.png): red top strip; white header with hamburger, UnSkills logo and red "COURSES" button; a dark-red-to-black banner with "Student Verification" in bold white and "Home / Student Verification" in gold (#FACC15); a white card "Look up a UnSkills Student" with a red ID-card icon, the field "Registration Number *" showing "UCE/246237", a "Security check *" row with a captcha box, a refresh button and "Type the code", and a red button "Verify Student".

FLOATING CALLOUT CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–4°, slightly overlapping the window's edges, as if lifted out of the site)
- Top-left: "Search 158 courses": a search box "Search by course name, code, or keyword…" and four pills: red "All Courses 158", white "Computer Software 21", "Hardware & Networking 21", "NIELIT Govt. 3".
- Bottom-left: "Verification": four small rows with icons and green ticks: "Student", "Certificate", "Marksheet", "Employer".
- Top-right (above the phone): "Google reviews": a big "4.8", five gold stars, "124 reviews on Google", and three round initial avatars "AS", "AM", "HK" with short star rows (no full names).
- Bottom-right chip: a green WhatsApp icon and a blue phone icon with "Call & WhatsApp on every page".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in UnSkills red (#B91C1C). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in red, slightly tilted. They sit in the white space and never cover any UI text.
Add exactly these 5:
a) From "Search 158 courses" → curved arrow to the 3 × 3 course-category grid. Note: "9 categories, 2 taps"
b) From "Verification" → curved arrow to the phone's "Verify Student" button. Note: "Certificates checked in seconds"
c) From "Google reviews" → curved arrow to the browser window. Note: "4.8 on Google"
d) Top centre, above the browser window: note "One site for students, parents & employers" with a short arrow curving down into the page.
e) From the "Call & WhatsApp" chip → short arrow to the floating buttons on the browser's right edge. Note: "Enquiries from every page"

LOGO (copy the attached UnSkills logo exactly; do not redesign it)
- A black circle with a gold ring and a white "Un", joined to a white badge with a thin gold border and "Skills" in crimson, with "Unlock Skills" in tiny grey text below.

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text. Use only the initials given; never copy names from the screenshots.
- Palette: UnSkills red #B91C1C, maroon #7F1D1D, gold #FACC15, near-black #0A0A0A, canvas #F8FAFC, call blue #155DFC, WhatsApp green #25D366.
- No devices, no watermark, no borders around the image.
```
</details>

<details><summary>Page spotlight (W3): Home, for <code>unskills-website/page-home.webp</code>. Attach home-desktop.png, logo</summary>

```
Create a clean website case-study image that spotlights ONE page of the "UnSkills Computer Education" website: the Home page. Style: a flat browser window of the real page on the left and three zoom-in callout cards on the right, joined to the page by thin connector lines, with two playful handwritten notes. Show the website directly: no laptop, no phone, no device of any kind.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no people outside the page. About 5% white margin; nothing touches the edges.

LEFT — THE PAGE (about 62% of the width, vertically centred)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow. On top, a minimal light-grey bar with three small grey dots and a rounded address pill reading "unskillseducation.org". No other browser chrome.
- Inside, recreate the attached screenshot (home-desktop.png) faithfully, flat and undistorted:
  • the thin red top strip (#B91C1C) with "+91 83828 98686", "unskillseducation@gmail.com", "Free Online Test", "Institute Login";
  • the white header: UnSkills logo; menu "Home" (active, red underline), "About Us", "Courses", "Student Zone", "Verification", "Gallery", "Franchise", "Contact", "More"; red button "Student Login";
  • the hero: "Unskill Computer Education" / "An ISO 9001:2015 Certified Organization", the headline "Explore All Our Courses" with a red underline, the smiling woman in a grey blazer on a pale pink circle, the 3 × 3 grid of course-category cards ("Computer Software Courses", "Hardware & Networking", "Skills Development Course", "NIELIT Govt. Courses", "University Courses", "Beautician Courses", "Summer Training", "Typing Course", "Diploma Courses", each with its grey subline), the red "9+ Courses Available" box and the "Batch Starting Soon" box;
  • the dark-red strip "Admissions Open 2026-27 | Call Us Today | Govt. Scholarship Available for Eligible Students";
  • under it, the start of the next section: "STAY UPDATED" in small red capitals and the heading "News & Announcements";
  • the three round floating buttons on the right edge: red pencil, blue (#155DFC) phone, green (#25D366) WhatsApp.

RIGHT — THREE CALLOUT CARDS (one column, about 30% of the width, evenly spaced)
- White cards, 20px rounded corners, thin light-grey border (#E5E7EB), very soft shadow. Each has a small bold near-black label on top and, under it, the real part of the page magnified about 1.6×, crisp and fully legible.
- A thin smooth connector line (1.5px, #B91C1C at 60%) runs from each card's left edge to a small red dot on the exact spot it magnifies in the page. Lines never cross each other or any text.
- Card 1, label "Admissions, front and centre": the dark-red strip "Admissions Open 2026-27 | Call Us Today | Govt. Scholarship Available for Eligible Students". Connector to that strip.
- Card 2, label "Government verified": a white panel titled "Government Registrations & Legal Status" with three rows, each with a small seal icon and a green tick: "Udyam Registration", "Tally Education Empanelment", "Marg ERP Authorized Training Partner". Connector to the area just below the hero.
- Card 3, label "Google reviews": a big "4.8", five gold stars, "124 reviews on Google ↗", and three round initial avatars "AS", "AM", "HK" with short star rows (no full names). Connector to the area just below the hero.

HANDWRITTEN NOTES
- Two short notes in a casual handwritten marker script, dark charcoal (#1F2937) with one key word in red (#B91C1C), each with a short loose curved arrow. They sit in white space and never cover UI text:
  a) beside card 2: "Trust before the first call"
  b) top-left above the page: "Admissions open, right up top", arrow to the red strip

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text, no extra UI. Never copy people's names from the screenshot.
- Palette: UnSkills red #B91C1C, maroon #7F1D1D, gold #FACC15, near-black #0A0A0A, canvas #F8FAFC; bold Outfit-style headings and Inter-style body text, as in the screenshot.
- No devices, no watermark, no border around the image.
```
</details>

<details><summary>Page spotlight (W3): Courses, for <code>unskills-website/page-courses.webp</code>. Attach courses-desktop.png, logo</summary>

```
Create a clean website case-study image that spotlights ONE page of the "UnSkills Computer Education" website: the Courses page. Style: a flat browser window of the real page on the left and three zoom-in callout cards on the right, joined to the page by thin connector lines, with two playful handwritten notes. Show the website directly: no laptop, no phone, no device of any kind.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no people outside the page. About 5% white margin; nothing touches the edges.

LEFT — THE PAGE (about 62% of the width, vertically centred)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow. On top, a minimal light-grey bar with three small grey dots and a rounded address pill reading "unskillseducation.org/courses". No other browser chrome.
- Inside, recreate the attached screenshot (courses-desktop.png) faithfully, flat and undistorted:
  • the red top strip and the white header as on the site, with "Courses" active (red text, red underline) and the red "Student Login" button;
  • a banner with a diagonal gradient from dark red (#7F1D1D) to near-black (#0A0A0A): "HOME / COURSES" in small gold capitals (#FACC15), the title "Our Courses" in bold white with "Courses" in gold, and "158+ professional courses across 9 categories — from computer software to beautician arts." in white;
  • on a light canvas: a wide white search box "Search by course name, code, or keyword...";
  • two rows of category pills with counts: red "All Courses 158"; white outlined "Computer Software Courses 21", "Hardware & Networking 21", "Skills Development Course 14", "NIELIT Govt. Courses 3", "University Courses 6", "Beautician Courses 14", "Internship & Summer Training 8", "Typing Course 11", "Professional Courses 60";
  • "Showing 158 courses";
  • a row of four white course cards: "CTP902 · TOP ★★★★★ · Certificate in Tally Prime", "DT501 · TOP ★★★★★ · Diploma in Tally Prime with GST", "CSC-106 ★★★★★ · MS Word · 1 Months", "CSC-105 ★★★★★ · Office Automation · 3 Months", each with two grey description lines;
  • the three round floating buttons on the right edge: red pencil, blue phone, green WhatsApp.

RIGHT — THREE CALLOUT CARDS (one column, about 30% of the width, evenly spaced)
- White cards, 20px rounded corners, thin light-grey border (#E5E7EB), very soft shadow. Each has a small bold near-black label on top and, under it, the real part of the page magnified about 1.6×, crisp and fully legible.
- A thin smooth connector line (1.5px, #B91C1C at 60%) runs from each card's left edge to a small red dot on the exact spot it magnifies in the page. Lines never cross each other or any text.
- Card 1, label "Search by name, code or keyword": the white search box with "tally" typed in it and a blinking cursor. Connector to the search box.
- Card 2, label "9 categories": the pills "All Courses 158" (red), "Computer Software Courses 21", "Hardware & Networking 21", "NIELIT Govt. Courses 3", "Beautician Courses 14". Connector to the pill rows.
- Card 3, label "Every course, one card": a full course card: "USCE-101" in grey monospace, the title "ADCA – Advance Diploma in Computer Application", the grey line "A comprehensive 1-year programme covering Hindi & English typing, Basic Computer Course, Tally with GST…", a chip "12 Months", a red button "Enroll Now" and an outlined button "Details". Connector to the first course card.

HANDWRITTEN NOTES
- Two short notes in a casual handwritten marker script, dark charcoal (#1F2937) with one key word in red (#B91C1C), each with a short loose curved arrow. They sit in white space and never cover UI text:
  a) beside card 2: "Any course in 2 taps"
  b) beside card 3: "Enroll Now on every course"

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text, no extra UI. Never copy people's names from the screenshot.
- Palette: UnSkills red #B91C1C, maroon #7F1D1D, gold #FACC15, near-black #0A0A0A, canvas #F8FAFC; bold Outfit-style headings and Inter-style body text, as in the screenshot.
- No devices, no watermark, no border around the image.
```
</details>

<details><summary>Page spotlight (W3): Verification, for <code>unskills-website/page-verify.webp</code>. Attach verify-desktop.png, logo</summary>

```
Create a clean website case-study image that spotlights ONE page of the "UnSkills Computer Education" website: the Student Verification page. Style: a flat browser window of the real page on the left and three zoom-in callout cards on the right, joined to the page by thin connector lines, with two playful handwritten notes. Show the website directly: no laptop, no phone, no device of any kind.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no people outside the page. About 5% white margin; nothing touches the edges.

LEFT — THE PAGE (about 62% of the width, vertically centred)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow. On top, a minimal light-grey bar with three small grey dots and a rounded address pill reading "unskillseducation.org/student/verify". No other browser chrome.
- Inside, recreate the attached screenshot (verify-desktop.png) faithfully, flat and undistorted:
  • the red top strip and the white header as on the site, with "Verification" active (red text, red underline) and the red "Student Login" button;
  • a banner with a diagonal gradient from dark red (#7F1D1D) to near-black: "Student Verification" in large bold white and "Home / Student Verification" in gold (#FACC15);
  • overlapping the banner's bottom edge, a white card with 16px corners: a red ID-card icon and the bold title "Look up a UnSkills Student"; the grey text "Enter a student's Registration Number (e.g. UCE/246237) to confirm enrolment and view all enrolled courses. To verify a certificate or marksheet, use the dedicated Certificate Verification or Marksheet Verification pages." with "Certificate Verification" and "Marksheet Verification" in red; the field "Registration Number *" with the placeholder "e.g. UCE/246237" and the hint "Enter exactly as printed on the student ID card / registration slip."; "Security check *" with a captcha image, a round refresh button and an input "Type the code"; a wide red button "Verify Student" with a search icon;
  • the three round floating buttons on the right edge: red pencil, blue phone, green WhatsApp.

RIGHT — THREE CALLOUT CARDS (one column, about 30% of the width, evenly spaced)
- White cards, 20px rounded corners, thin light-grey border (#E5E7EB), very soft shadow. Each has a small bold near-black label on top and, under it, the real part of the page magnified about 1.6×, crisp and fully legible.
- A thin smooth connector line (1.5px, #B91C1C at 60%) runs from each card's left edge to a small red dot on the exact spot it magnifies in the page. Lines never cross each other or any text.
- Card 1, label "Look up by registration number": the field "Registration Number *" filled with "UCE/246237". Connector to that field.
- Card 2, label "Security check": the captcha box, the refresh button and the input with "Hu36s" typed in it. Connector to the security-check row.
- Card 3, label "Four ways to verify": a 2 × 2 grid of small tiles, each with a red line icon and a green tick: "Student Verification", "Certificate Verification", "Marksheet Verification", "Employer Verification". Connector to the red links in the card's text.

HANDWRITTEN NOTES
- Two short notes in a casual handwritten marker script, dark charcoal (#1F2937) with one key word in red (#B91C1C), each with a short loose curved arrow. They sit in white space and never cover UI text:
  a) beside card 3: "Employers check in seconds"
  b) top-left above the page: "No more fake certificates", arrow to the "Verify Student" button

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text, no extra UI. Never copy people's names from the screenshot.
- Palette: UnSkills red #B91C1C, maroon #7F1D1D, gold #FACC15, near-black #0A0A0A, canvas #F8FAFC; bold Outfit-style headings and Inter-style body text, as in the screenshot.
- No devices, no watermark, no border around the image.
```
</details>

<details><summary>Page spotlight (W3): Franchise, for <code>unskills-website/page-franchise.webp</code>. Attach franchise-desktop.png, logo</summary>

```
Create a clean website case-study image that spotlights ONE page of the "UnSkills Computer Education" website: the Franchise page. Style: a flat browser window of the real page on the left and three zoom-in callout cards on the right, joined to the page by thin connector lines, with two playful handwritten notes. Show the website directly: no laptop, no phone, no device of any kind.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no people outside the page. About 5% white margin; nothing touches the edges.

LEFT — THE PAGE (about 62% of the width, vertically centred)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow. On top, a minimal light-grey bar with three small grey dots and a rounded address pill reading "unskillseducation.org/franchise". No other browser chrome.
- Inside, recreate the attached screenshot (franchise-desktop.png) faithfully, flat and undistorted:
  • the red top strip and the white header as on the site, with "Franchise" active (red text, red underline) and the red "Student Login" button;
  • a banner with a diagonal gradient from dark red (#7F1D1D) to near-black: "— FRANCHISE WITH US —" in small gold capitals, the title "Franchisee Process" in large bold white, and "Become an authorised partner of UnSkills Computer Education and bring quality computer education to your region. Read the requirements carefully before applying." in white;
  • overlapping the banner's bottom edge, four white step cards, each with a faint large number in the top-right: "Read the Requirements" / "Carefully review the eligibility criteria below." (01), "Download Agreement Form" / "Get the GIITSSS / GIEPL agreement form from our Downloads page." (02), "Fill & Submit Documents" / "Complete the form and submit it with required documents to the Corporate Office." (03), "Approval & Onboarding" / "Once approved, our team will begin your branch onboarding & training." (04);
  • below: "ELIGIBILITY" in small red capitals, the heading "Franchise Requirements" with a short gold underline, and two white cards with red icon tiles: "Educational Qualifications" with "Candidate should be a graduate in any discipline." and "Financial Qualifications" with "Ability to mobilise resources through internal and external means." and "Capability to personally invest 100% of the total project cost.";
  • the three round floating buttons on the right edge: red pencil, blue phone, green WhatsApp.

RIGHT — THREE CALLOUT CARDS (one column, about 30% of the width, evenly spaced)
- White cards, 20px rounded corners, thin light-grey border (#E5E7EB), very soft shadow. Each has a small bold near-black label on top and, under it, the real part of the page magnified about 1.6×, crisp and fully legible.
- A thin smooth connector line (1.5px, #B91C1C at 60%) runs from each card's left edge to a small red dot on the exact spot it magnifies in the page. Lines never cross each other or any text.
- Card 1, label "Four steps to a branch": the four step cards in a 2 × 2 grid with "01", "02", "03", "04" in red and their titles. Connector to the step cards.
- Card 2, label "Clear requirements": the "Educational Qualifications" card with its red icon tile, a gold tick and "Candidate should be a graduate in any discipline." Connector to that card.
- Card 3, label "102 active centres": three rows, each with a small round logo placeholder in red, a bold name, a grey city and a monospace code: "UnSkills Computer Education · Jaunpur, Uttar Pradesh · UCE-UP-003", "UnSkills College of IT · Jaunpur, Uttar Pradesh · UCE-UP-005", "Ideal Computer Centre · Dumka, Jharkhand · UCE-JH-002". Connector to the bottom of the page.

HANDWRITTEN NOTES
- Two short notes in a casual handwritten marker script, dark charcoal (#1F2937) with one key word in red (#B91C1C), each with a short loose curved arrow. They sit in white space and never cover UI text:
  a) beside card 1: "Partners apply online"
  b) beside card 3: "102 centres, one list"

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text, no extra UI. Never copy people's names from the screenshot.
- Palette: UnSkills red #B91C1C, maroon #7F1D1D, gold #FACC15, near-black #0A0A0A, canvas #F8FAFC; bold Outfit-style headings and Inter-style body text, as in the screenshot.
- No devices, no watermark, no border around the image.
```
</details>

<details><summary>Design system (T6, website components), for <code>unskills-website/design-system.webp</code>. Attach the logo</summary>

```
Create a clean, premium DESIGN SYSTEM sheet for the "UnSkills Computer Education" website, in the style of a professional design-agency case study (like a Figma style-guide page). It shows the colour palette, typography and the website's core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, Inter SemiBold): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows in UnSkills red (#B91C1C) with short handwritten notes in a casual marker script, dark charcoal (#1F2937) with one key word in red. They sit in white space and never cover text.

ZONE 1 — COLOUR (left half)
- Row 1, "Brand": 4 large tall swatches side by side, each a solid block with the name in bold and the hex in a small monospace pill:
  "UnSkills Red #B91C1C", "Maroon #7F1D1D", "Gold #FACC15", "Logo Crimson #AC2038".
- Row 2, "Actions": 3 medium swatches: "Call Blue #155DFC", "WhatsApp Green #25D366", "Badge Gold #92730A" (shown on its pale background #FDF6DC).
- Row 3, "Neutrals": 3 small swatches: "Ink #0A0A0A", "Canvas #F8FAFC" (thin grey outline), "White #FFFFFF" (thin grey outline).
- A small horizontal gradient bar under the swatches from #7F1D1D to #0A0A0A, labelled "Page banner".
- Note with an arrow at the brand swatches: "Red & gold, straight from the logo".

ZONE 2 — TYPOGRAPHY (top right)
- Two specimen cards side by side:
  • a huge "Aa" in Outfit Bold, with "Outfit", "Headings & course titles", "SemiBold · Bold · ExtraBold" and the sample line "Our Courses" with "Courses" in gold (#FACC15) on a small dark-red chip;
  • a huge "Aa" in Inter Regular, with "Inter", "Body, menus & forms", "Regular · Medium · SemiBold" and the sample line "158+ professional courses across 9 categories".
- A type scale list (thin dividers; each line: role in grey, specs in small monospace, sample in that style):
  "Page title · Outfit Bold 48" → "Our Courses"
  "Section title · Outfit Bold 36" → "Popular Courses"
  "Card title · Outfit Bold 15" → "Certificate in Tally Prime"
  "Body · Inter Regular 16" → "Learn from industry-certified professionals"
  "Eyebrow · Inter SemiBold, letter-spaced" → "HOME / COURSES"

ZONE 3 — COMPONENTS (bottom right, one tidy row of real website pieces)
- A red rounded button "Enroll Now"; an outlined button "Details"; a red button "Student Login".
- A red pill "All Courses 158" and a white outlined pill "Typing Course 11".
- A small course card: "USCE-113" in grey monospace, a pale-gold "TOP" badge with 5 gold stars, the bold title "CTP – Tally Prime with GST", a grey chip "4 Months".
- A search input "Search by course name, code, or keyword…" with a search icon.
- The three round floating buttons stacked: red pencil, blue phone, green WhatsApp.
- Note: "Same pieces on every page".

LOGO: the attached UnSkills logo, small, top-left, with "Design System" beside it in Outfit Bold. Copy the logo exactly; do not redesign it (a black circle with a gold ring and a white "Un", joined to a white badge with a thin gold border and "Skills" in crimson, "Unlock Skills" in tiny grey below).

QUALITY RULES
- Every hex code, name and word exactly as written; each swatch exactly its hex colour; no extra colours or fonts. Aligned to a clear grid. No watermark.
```
</details>

**Used 2026-10-01** (from the owner's ChatGPT downloads, flattened with `flatten_white.py`):
`unskills-website-mockup.webp` 1774×887 (card), `unskills-website/hero.webp` 1672×941,
`page-{home,courses,verify,franchise}.webp` 1774×887 each, `design-system.webp` 1774×887.
Known nit: in the hero's desktop top strip the email reads "askillseducation@gmail.com"
(tiny, under the browser bar). Fix with: *"Keep the layout. Fix the text in the red top
strip so it reads exactly: +91 83828 98686 · unskillseducation@gmail.com"*.

### Quick Hotels (website): homepage card

The mockup prompt (T1) was filled with the quickhotels.co homepage: the glass nav, "Find
Your *Perfect* Stay" with "Perfect" in gold italic, and the booking bar with WHERE TO /
CHECK-IN / CHECK-OUT / GUESTS & ROOMS plus a blue Search button. The logo is the stacked
"Quick / Hotels" wordmark (from `https://www.quickhotels.co/logo.webp`, turned black).
Files: `public/work/quick-hotels-mockup.webp`, `public/work/quick-hotels-logo.webp`.

### Herbal Vantage: online store (`/work/herbal-vantage-website`)

Done with the website case-study guide (2026-10-01/02). Separate from the MLM software
page (`herbal-vantage`), which now sits under the Software tab only.

**Decisions**
- Headline *"A storefront where every order earns"* **PV POINTS.** Focus: Ayurvedic Online
  Store · Distributor Price & PV · Legal & Trust Pages. Key pages: Home, Products,
  Product page (`/product/vantage-superdento-cream`), Legal & Certifications.
- Read off herbal-vantage-website.vercel.app (herbalvantage.com is a different server):
  menu + footer (sitemap), 26 products in 8 categories (the catalogue; the homepage says
  "23+"), DP price / MRP / PV per product, six documents on /legal. The site's code:
  React + Vite + Tailwind on Vercel, Razorpay + cash on delivery, products/logins/orders
  from the Herbal Vantage CRM API (`herbal-vantage-crm.vercel.app`).
- Not linked (no `url`, no `links`, `liveUrl: ''`). The site's reviews carry full names:
  not used. The site's "Important Notice" pop-up was hidden for the stills, never agreed to.
- `site.sitemapNote` added (the sitemap caption was UnSkills-only text).

**Brand material** (from the site's CSS): Deep Green #1A6B2F, Forest #0F2D18, Lime
#7DC832, Gold #C9A020, Cream #FAF3DC, Off-white #F7F5F0, Cart Green #1B8A4D, Offer badge
#E6C17A, WhatsApp #25D366. Fonts: **Playfair Display** Bold (60/48/36/16), **DM Sans**
body, **DM Mono** eyebrows.

**Images → files** (generated from `~/Downloads/herbal-vantage-website-stills/`, logo =
`logo-full.png`, emblem + wordmark)
| Generated image | File |
|---|---|
| Herbal Vantage Ayurvedic Website Mockup | `public/work/herbal-vantage-website-mockup.webp` (card) |
| Ayurvedic E-Commerce Showcase Infographic | `public/work/herbal-vantage-website/hero.webp` 1672×941 |
| Ayurvedic Wellness Website Showcase | `…/page-home.webp` 1774×887 |
| Herbal Vantage Ayurvedic Product Showcase | `…/page-products.webp` 1774×887 |
| Herbal Vantage Product Showcase Infographic | `…/page-product.webp` 1774×887 |
| Ayurvedic Legal Certifications Showcase | `…/page-legal.webp` 1774×887 |
| Herbal Vantage Design System Board | `…/design-system.webp` 1774×887 |

**Known glitches** (small; fix by editing the same image if wanted): page-products note
reads "Distriductors see PV instantly"; page-legal's sixth tile is clipped to "Income Tax
Departm"; page-home's product cards show "BEST SELLER" badges the real cards don't have.

### Spectrum Tour & Travels: tour booking website (`/work/spectrum-tour-travels-website`)

Done with the website case-study guide (2026-10-02/03). Separate from the travel CRM
page (`spectrum-tour-travels`, Software tab).

**Decisions**
- Headline *"Group tours that show"* **REAL SEATS.** Focus: Tour Booking Website · Live
  Departures & Seats · Custom Trip Planner. Key pages: Home, Upcoming Departures, Trip
  page (`/trips/jannat-e-kashmir`), Customised Trips.
- Read off spectrumtourtravels.com: Next.js on Vercel, trips/dates/seats from Supabase,
  booking with Razorpay ("Pay in full or 30% now to confirm your seats"). Not linked.

**Brand** (site CSS): Yellow #FEBD09, Deep Gold #E0A800, Heading Navy #192A3D, Ink
#0F172A, Ivory #FDFAF3; calendar Seats #16A34A / Full #DC2626. Fonts: **Unbounded**
(headings), **Manrope** (body).

**Images → files** (prompts: `~/Downloads/spectrum-website-stills/PROMPTS.md`; extra
close-ups made for them: `home-destinations-desktop.png`, `departure-calendar-desktop.png`,
`trip-booking-desktop.png`)
| Generated image | File |
|---|---|
| Spectrum Tour-Travels Website Mockup | `public/work/spectrum-website-mockup.webp` (card) |
| Spectrum Tour-Travels Booking Showcase | `public/work/spectrum-website/hero.webp` 1672×941 |
| Spectrum Tour Travels Homepage Mockup | `…/page-home.webp` 1774×887 |
| Upcoming Departures Travel UI Showcase | `…/page-departures.webp` 1774×887 |
| Annotated Kashmir Trip Planning UI Mockup | `…/page-trip.webp` 1774×887 |
| Custom Travel Planning UI Showcase | `…/page-custom.webp` 1774×887 |
| Spectrum Tour-Travels Design System | `…/design-system.webp` 1774×887 |

**Known glitches** (tiny): page-home card 1 reads "Community on mFacebook" and
"Google — Reviews"; page-trip shows the "Everything in writing" note twice.

### Smart Agro: agri shop website (`/work/smart-agro-website`)

Done with the website case-study guide (2026-10-02/03). Separate from the Agri Business
Management System page (`smart-agro`, Software tab).

**Decisions**
- Headline *"A farm shop that speaks the"* **FARMER’S LANGUAGE.** Focus: Agri E-commerce
  Website · Shop by Crop & Problem · Marathi · Hindi · English. Key pages: Home, Shop by
  Crop (`/crop/cotton`), Shop by Problem (`/problem/yellowing`), Product page
  (`/product/daivik-capsule`).
- The site opens in Marathi; the stills were captured in English at `/en/` (Marathi
  homepage kept in `~/Downloads/smart-agro-website-stills/marathi/`). Next.js on Vercel,
  Supabase, i18n en/hi/mr, voice search, COD, India Post tracking. Not linked.
- Reviews on the site carry real names: only the numbers are used.
- On 2026-10-03 smartagrocare.in returned **402 DEPLOYMENT_DISABLED**; the full-size logo
  came from `~/Downloads/smart-agro-refs/2-logo-original.png` instead.

**Brand** (site CSS + stills): Agro Green #1E8A46, button #15803D, Forest #104129, Leaf
#4CAE4F, Logo Red #D01A1B, WhatsApp #25D466, Buy Now #F57A00, Best Seller #F97316, Combo
#7C3AED, Mint #F4FEF9. Fonts: **Poppins** (headings), **Inter** (body).

**Images → files** (prompts: `~/Downloads/smart-agro-website-stills/PROMPTS.md`; extra
close-ups: `home-crop-problems-desktop.png`, `home-trust-stats-desktop.png`,
`home-how-to-order-desktop.png`, `home-combos-desktop.png`)
| Generated image | File |
|---|---|
| Smart Agro E-Commerce Mockup | `public/work/smart-agro-website-mockup.webp` (card) |
| Smart Agro Farmer E‑Commerce Mockup | `public/work/smart-agro-website/hero.webp` 1672×940 |
| Smart Agro Website Feature Showcase | `…/page-home.webp` 1774×887 |
| Smart Agro Cotton Marketplace Mockup | `…/page-crop.webp` 1774×887 |
| Smart Agro Yellowing Leaves Guide | `…/page-problem.webp` 1774×887 |
| Smart Agro Product Page Infographic | `…/page-product.webp` 1774×887 |
| Smart Agro Design System Poster | `…/design-system.webp` 1774×887 |

**Known glitches** (tiny, at page size unreadable): page-product top strip "Your tusted
partner"; page-crop "300 CR" for "300 GR"; page-home "Panchgayya Combo".

### Quick Agriculture: network website (`/work/quick-agriculture-website`)

Done with the website case-study guide (2026-10-03). quickagriculture.in (the .com is a
parked domain); static Next.js on Vercel. Not linked.

**Decisions**
- Headline *"One site for farmers, students and"* **INSTITUTIONS.** Focus: Network
  Website · Services & Research · Membership Enquiries. Key pages: Home, Services,
  Research & Training, Contact.
- The homepage animates sections in on scroll, so a plain full-page capture comes out
  blank below the fold. Capture each section after scrolling it into view
  (`home-{services,impact,research,credibility,join}-desktop.png` in the stills folder).
- The site's own numbers disagree (10,000+ trained vs 50K+ connected vs 1M+ lives), and
  its testimonials name people at ICAR/MANAGE/GBPUAT: kept out of prompts and impact.
- Card logo: mark + wordmark, solid black (`quick-agriculture-logo.webp`); the colour
  original for prompts is `logo.png` in the stills folder (white + gold, transparent).

**Brand**: Field Green #0F4D31, Action Green #1F7A4D, Banner #135B39, Mint #5FCF90,
Harvest Gold #C68800 (logo), Cream #FBF9F3. Fonts: **DM Sans** (headings), **Inter** (body).

**Images → files** (prompts: `~/Downloads/quick-agriculture-website-stills/PROMPTS.md`)
| Generated image | File |
|---|---|
| Quick Agriculture Website Mockup | `public/work/quick-agriculture-website-mockup.webp` (card) |
| Growing India’s Farming Future | `public/work/quick-agriculture-website/hero.webp` 1672×941 |
| Quick Agriculture Network Showcase | `…/page-home.webp` 1774×887 |
| Quick Agriculture Services Overview | `…/page-services.webp` 1774×887 |
| Quick Agriculture Feature Showcase | `…/page-research.webp` 1774×887 |
| Quick Agriculture Contact Page Mockup | `…/page-contact.webp` 1774×887 |
| Quick Agriculture Design System | `…/design-system.webp` 1774×887 |

No text glitches found.

### Ram Tiles: tile catalogue website (`/work/ram-tiles-website`)

Done with the website case-study guide (2026-10-03). ramtiles.com: WordPress +
WooCommerce + Elementor (the site's author is Pureflow's account). Not linked.

**Decisions**
- Headline *"A whole tile showroom,"* **ONLINE.** Focus: Tile Catalogue Website · Online
  Orders · Showroom Finder. Key pages: Home, Category (`/glazed-vitrified-tiles`, 192
  results), Product page (`/product/6001200-glazed-vitrified-tiles`), Visit Store.
- Lower homepage images lazy-load, so the full-page capture showed grey boxes; the
  category sections were captured again one by one (`home-{wall,flooring,parking,
  sanitary,sinks}-desktop.png`). The site's own spellings ("Gloossy", "Mordern",
  "Porcerlain", "Steenless", "CALACTTA") were kept in the prompts on purpose.

**Brand**: Ram Orange #F97306, Peach #F8DDC5, Logo Red #CF2E2E, Price Red #FF0000,
Footer heading #D72D07, Ink #070707, panels #EFEFEF / #F4F4F4. Fonts: **Montserrat**
(headings), **DM Sans** (body).

**Images → files** (prompts: `~/Downloads/ram-tiles-website-stills/PROMPTS.md`)
| Generated image | File |
|---|---|
| Ram Tiles Website Mockup | `public/work/ram-tiles-website-mockup.webp` (card) |
| Ram Tiles Website Showcase | `public/work/ram-tiles-website/hero.webp` 1672×941 |
| Ram Tiles Homepage Mockup and Tile Callouts | `…/page-home.webp` 1774×887 |
| Ram Tiles Category Page Showcase | `…/page-category.webp` 1774×887 |
| RAM Tiles Product Showcase Callouts | `…/page-product.webp` 1774×887 |
| RAM TILES Showroom Visit Mockup | `…/page-store.webp` 1774×887 |
| Ram Tiles Design System Poster | `…/design-system.webp` 1774×887 |

**Known glitches** (tiny): hero header button reads "Pind a Store"; page-store map label
"Ahamamau" (the site's map says "Ahmamau").

### Strataloom Research: research firm website + panel (`/work/strataloom-research-website`)

Done with the website case-study guide (2026-10-03/04). strataloomresearch.com (strataloom.com
is a parked domain): React + Vite on Vercel, Supabase sign-in, hCaptcha, Resend, i18next
en/es/fr/ar (Arabic right to left). Not linked.

**Decisions**
- Headline *"Winning research clients and the"* **PANEL BEHIND THEM.** Focus: Research
  Firm Website · Panelist Sign-up · Four Languages. Key pages: Home, Services, Panel Book,
  Join Panel.
- Homepage and panel-book sections were captured one by one after scrolling them into
  view (`home-{services,quality,about}-desktop.png`, `panel-{regions,integrity}-desktop.png`).
  The Join Panel phone still first came out blank (slow fade-in): re-captured with a 9 s wait.
- Card logo: the white original made solid black (`strataloom-logo.webp`).

**Brand**: Teal #0FA3B1, Deep Navy #0B1F3B, Insight Amber #F4A300, Chat Violet #6D4FD8,
Mist #F4F6F8. Font: **Satoshi** throughout.

**Images → files** (prompts: `~/Downloads/strataloom-website-stills/PROMPTS.md`)
| Generated image | File |
|---|---|
| Strataloom Research Website and App Mockup | `public/work/strataloom-website-mockup.webp` (card) |
| Strataloom Research UX Showcase | `public/work/strataloom-website/hero.webp` 1672×941 |
| Strataloom Research Website Showcase | `…/page-home.webp` 1774×887 |
| Strataloom Services Page Showcase | `…/page-services.webp` 1774×887 |
| Strataloom Research Panel Book Infographic | `…/page-panel.webp` 1774×887 |
| Strataloom Research Signup Feature Callout | `…/page-join.webp` 1774×887 |
| Strataloom Research Design System | `…/design-system.webp` 1774×887 |

No text glitches found (the Arabic "العربية" in the hero came out right).

### Baba Biswanath Travels: group tours website (`/work/baba-biswanath-travels-website`)

Done with the website case-study guide (2026-10-03/04). bababiswanathtravels.com ("Baba
Biswanath Bhraman Sangi"; babavishwanathtravels.com is a different company). Next.js on
Vercel. Not linked.

**Decisions**
- Headline *"Yatras and group tours,"* **BOOKED TOGETHER.** Focus: Group Tours Website ·
  Pilgrimage Yatras · WhatsApp Enquiries. Key pages: Home, Upcoming Trips, Tour page
  (`/tour/vizag-araku`), Customized Tours.
- The payment page shows the bank account and UPI: listed as a feature, never imaged.
- Card logo is a one-colour version of the round emblem plus the name set in type (the
  real logo is a full-colour badge); swap in an official one-colour logo if the client
  has one. The colour badge (`logo.png` in the stills folder) is what the prompts use.
- Section stills were captured one by one, plus full-length captures of the tour and
  custom-tour pages (`tour-route`, `custom-{destinations,who-steps,form}-desktop.png`).

**Brand**: Olive #6B7B1A, Lime #B6D047, Deep Teal-Green #094B3C, River Teal #0E86AE, Price
Red-Orange #C2410C, Save Pink #FCEDE8, WhatsApp #25D366, Ink #14262E, Canvas #FBFCF8.
Fonts: **Playfair Display** (hero), **DM Sans** (headings), **Inter** (body), a script
accent ("Journey Awaits").

**Images → files** (prompts: `~/Downloads/baba-biswanath-website-stills/PROMPTS.md`)
| Generated image | File |
|---|---|
| Tropical Travel Website Device Mockup | `public/work/baba-biswanath-website-mockup.webp` (card) |
| Travel Together_ Yatra, Sea & Sky | `public/work/baba-biswanath-website/hero.webp` 1672×941 |
| Travel Together, Explore More | `…/page-home.webp` 1774×887 |
| Twelve Trips, Open Now | `…/page-upcoming.webp` 1774×887 |
| Tour Page Callouts and Booking UI | `…/page-tour.webp` 1774×887 |
| Customized Tours Website Showcase | `…/page-custom.webp` 1774×887 |
| Baba Biswanath Travel Design System | `…/design-system.webp` 1774×887 |

**Known glitches** (tiny): the small Bengali line "ভ্রমণ সঙ্গী" under the name is slightly
off in places; unreadable at page size.

### Prepared, not yet used

<details><summary>Quick Hotels design system sheet (T6): for <code>/work/quick-hotels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>quick-hotels/design-system.webp</code> (from the owner's chat attachment, 1774×887; flattened at 250; swatches within 10/255 of their labels except Deep Navy, rendered lighter at #122E56 for #0F2645)</summary>

Brand row and fonts read from quickhotels.co (computed styles, 2026-09-30): gold #D4A853, Search
gradient #1A5FAC → #0F2645, footer navy #0A1B33, body #111827; Playfair Display + Nunito. PMS row
sampled from its dashboard: sidebar #0E1A33, active #3175F1, ink #1D2436, tiles #E6F7EF / #FFF4E0,
canvas #F7F8FA. Attach the logo only. When it comes back: flatten at 250 (four near-white
swatches) to `public/work/quick-hotels/design-system.webp` and set `systemImage`.

```
Create a clean, premium DESIGN SYSTEM sheet for "Quick Hotels", a hotel booking website and property management system (PMS) on one backend, in the style of a professional design-agency case study (like a Figma style-guide page). It shows the colour palette, typography and core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, Nunito SemiBold): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows in royal blue (#1A5FAC) with short handwritten notes in a casual marker script, dark charcoal (#1F2937) with one key word in deep gold (#B8860B). They sit in the white space and never cover text.

ZONE 1 — COLOUR (left half of the image)

Row 1: "Brand", 4 large tall swatches side by side. Each shows its colour as a solid block, then the name in bold and the hex code in a small monospace pill:
- "Stay Gold" #D4A853
- "Royal Blue" #1A5FAC
- "Deep Navy" #0F2645
- "Night Navy" #0A1B33

Row 2: "PMS", 5 smaller square swatches, same labelling:
- "Sidebar Navy" #0E1A33
- "Active Blue" #3175F1
- "Ink" #1D2436
- "Mint Tile" #E6F7EF (with a thin grey outline so it shows on white)
- "Amber Tile" #FFF4E0 (with a thin grey outline)

Row 3: "Neutrals", 3 small swatches:
- "Canvas" #F7F8FA (with a thin grey outline so it shows on white)
- "White" #FFFFFF (with a thin grey outline)
- "Text" #111827

Handwritten note with an arrow pointing at the Stay Gold and Royal Blue swatches: "Straight from the website" ("website" in gold).
Handwritten note with an arrow pointing at the PMS row: "Same blues, PMS side" ("PMS" in gold).

ZONE 2 — TYPOGRAPHY (top right)

Two specimen cards side by side:
- Card 1: a huge "Aa" set in Playfair Display Bold, then "Playfair Display", "Headings", and the weights "Bold · Bold Italic". A small line of sample text in Playfair Display: "Find Your Perfect Stay" with "Perfect" in gold italic (#D4A853).
- Card 2: a huge "Aa" set in Nunito Bold, then "Nunito", "Interface & body text", and the weights "Bold · SemiBold · Regular". A small line of sample text in Nunito: "Bookings, rooms and payouts on one backend."

Under the two cards, a type-scale list (a left column showing each style's name and size, a right column showing that style as rendered text):
- "Hero heading · Playfair Display Bold 36" → "Find Your Perfect Stay"
- "Page title · Nunito Bold 26" → "Welcome back! Here's what's happening today."
- "Stat value · Nunito Bold 24" → "₹14,82,600"
- "Body · Nunito Regular 14" → "Budget-friendly luxury across India"
- "Label · Nunito SemiBold 11 · Uppercase" → "CHECK-IN"

ZONE 3 — COMPONENTS (bottom right, one tidy row of real UI pieces)
- A primary button: a royal-blue gradient (#1A5FAC → #0F2645), white text "Search" with a small magnifier icon.
- A secondary button: white with a thin grey border, "View all bookings →".
- Three status pills: "Confirmed" (green on light green), "30% paid" (amber on light amber), "₹3,450 due" (red on light red).
- A stat card: "Active Hotels" / "12" / "Currently accepting bookings", with a pastel blue icon tile top-left.
- A booking-bar field: "CHECK-IN" / "25 Sep '26 Fri" with a small calendar icon.
- A sidebar item in its active state: a short Sidebar Navy (#0E1A33) strip with the item "Dashboard" in an Active Blue (#3175F1) pill, white text and a white grid icon.
Handwritten note with an arrow at the components: "Same pieces, site and PMS" ("site and PMS" in gold).

LOGO
- Place the attached Quick Hotels logo small in the top-left corner above Zone 1, in Deep Navy, with "Design System" beside it in Playfair Display Bold. Copy the logo exactly (the stacked "Quick / Hotels" wordmark with speed lines before "Quick" and a small house with a tick forming the "o" in "Hotels"); do not redesign it.

QUALITY RULES
- Every hex code, name and word exactly as written above, sharp and legible. No gibberish, no extra colours or fonts, no invented values.
- Swatch colours must match their hex codes exactly.
- Balanced, airy, professional; aligned to a clear grid.
- No watermark, no devices, no captions beyond what's specified.
```
</details>

<details><summary>Quick Hotels feature bento (T5): for <code>/work/quick-hotels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>quick-hotels/crm-card-*.webp</code> (from the owner's chat attachment, 1774×887; no file in Downloads). The finder caught inner panels, so boxes by hand: top <code>[31,49,626,487] [639,49,1182,487] [1200,49,1744,487]</code> (632×474, top row → product 01), bottom <code>[32,504,489,850] [501,504,881,850] [894,504,1301,850] [1311,504,1744,850]</code> (470×392 → product 02). The "Every city, one search" note was generated in the gutter; it was erased (rects 612,305,662,405 and 624,370,752,436) with a Node port of the erase routine before cutting.</summary>

The page has two products, so the bento is split by row: the top 3 cards go to product 01
(Guest Booking Website), the bottom 4 to product 02 (PMS), each as its own one-row `cards`.
Features are the case study's own lists (search across cities, GST-inclusive pricing, 30%
now / rest at check-in via Razorpay; bookings + live availability, payments + balances,
inventory + pricing, role-based access). Property names from the PMS; prices demo. Attach
`1-website-desktop.png`, `4-pms-dashboard-no-guest-names.png` and the logo.

```
Create a clean, modern SaaS feature image for "Quick Hotels", a guest booking website and a property management system (PMS) built on one backend, for budget-friendly stays across India. Style: a bento grid of 7 rounded feature cards, each with a pastel icon tile, a bold title, one short description line and a compact, realistic UI illustration fully filled with data. A few playful hand-drawn arrows and handwritten notes. Show the UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no headline text on the image, no people photos (small round avatars and initials inside the UI are fine; small hotel-room photo thumbnails are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached Quick Hotels screenshots: white and very light grey (#F7F8FA) surfaces, thin light borders, a rounded Nunito-style sans-serif, simple line icons.
- Accent: royal blue (#1A5FAC) for charts, active tabs and main buttons; gold (#D4A853) for highlights; green (#16A34A) for paid / confirmed / done; amber (#F59E0B) for pending; soft red (#EF4444) for dues.
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding, equal gaps between cards.
- Card header: a rounded-square pastel icon tile, then a bold near-black title (#0F172A) and one short grey line (#64748B).
- Hand-drawn notes: 5 short notes in a casual marker script, charcoal (#1F2937) with one key word in deep gold (#B8860B), each with a short curved marker arrow in royal blue. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in white space inside that card; none in the gaps between cards; never covering UI text or numbers.

LAYOUT
- Top row: 3 cards of EXACTLY EQUAL width and height (the guest website).
- Bottom row: 4 cards of EXACTLY EQUAL width and height (the PMS).
- The two rows span the same total width.

TOP ROW — GUEST BOOKING WEBSITE

Card A — icon: magnifier over a map pin. Title: "Search every city". Line: "Guests find and book stays across India."
UI: a compact search bar "WHERE TO · Delhi" · "25–26 Sep" · "2 Adults · 1 Room" with a blue "Search" button; under it 3 result rows, each with a small room photo thumbnail, a property, a city and a price: "Quick Hotel - GK2 · Delhi · ₹2,499", "Quick Hotel - Karol Bagh · Delhi · ₹2,199", "Quick Hotel - Whitefield · Bengaluru · ₹2,799"; a row of city chips "Delhi", "Bengaluru", "Noida", "Rishikesh", "Mathura".
Note inside the card, with an arrow at the results: "Every city, one search" ("one search" in gold).

Card B — icon: price tag. Title: "GST-inclusive pricing". Line: "The price a guest sees is the price they pay."
UI: a price card "Deluxe Room · 1 night" with a big "₹2,499" and a small grey line "Taxes & fees included"; under it a green chip "No surprises at checkout ✓"; and a small breakdown row "Room ₹2,118 · GST ₹381 · Total ₹2,499".
Note inside the card: "No surprise tax" ("No" in gold).

Card C — icon: credit card. Title: "Pay 30% now". Line: "Confirm with a part payment, settle the rest at check-in."
UI: a payment card "Booking #QH-8842 · ₹2,499" with a split bar: a filled blue part "30% now · ₹750" and a light part "At check-in · ₹1,749"; a line "Paid via Razorpay (plain text) ✓" with a green pill "Confirmed"; a small lock icon with "Secure checkout".
Note inside the card, with an arrow at the split bar: "Book now, pay later" ("pay later" in gold).

BOTTOM ROW — PROPERTY MANAGEMENT SYSTEM

Card D — icon: calendar. Title: "Bookings & availability". Line: "Every booking and room, live across properties."
UI: a mini availability grid for "Quick Hotel - GK2" with 4 rooms (101, 102, 204, 305) across 5 days (24–28 Sep): blue "Booked" blocks and white "Free" cells; a small chip "3 rooms free tonight".
Note inside the card: "Live, no double entry" ("Live" in gold).

Card E — icon: rupee coin. Title: "Payments & dues". Line: "Balances tracked against every booking."
UI: two rows: "Room 204 · Quick Hotel - GK2 · ₹3,450 due" with a blue "Collect" button, and "Room 112 · Quick Hotel - Karol Bagh · Paid in full" with a green pill; a strip "Departing today · 2 with dues" (amber).

Card F — icon: bed. Title: "Inventory & pricing". Line: "Rooms, rates and amenities per property."
UI: a room-type table for "Quick Hotel - Whitefield": "Standard · 8 rooms · ₹1,999", "Deluxe · 12 rooms · ₹2,799", "Suite · 3 rooms · ₹4,499", each with a small blue toggle "On sale"; a small row of amenity chips "Wi-Fi", "AC", "Breakfast".
Note inside the card, with an arrow at the rates: "Rates updated everywhere" ("everywhere" in gold).

Card G — icon: shield with a person. Title: "Users & roles". Line: "Every staff member sees only what they need."
UI: a staff list of 3 rows, each with an initials avatar, a name and a role pill: "Akhil Pratap · Owner", "Priya Nair · Hotel Manager", "Rohit Das · Front Desk"; beside it a small permission grid with toggles: "Bookings ✓", "Check-in ✓", "Finance ✕", "Reports ✓" (blue toggles on, grey off).

LOGO (copy the attached Quick Hotels logo exactly; do not redesign it)
- Once, small, inside Card A's top-right corner: the stacked "Quick / Hotels" wordmark with speed lines before "Quick" and a small house with a tick forming the "o" in "Hotels", in navy.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshots.
- No empty states; every tile, list and chart is filled.
- No official third-party logos: Razorpay appears only as plain text.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Balanced, uncluttered, equal gaps between cards; every note inside its own card.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Quick Hotels problem bento (T4): for <code>/work/quick-hotels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>quick-hotels/problem-1…6.webp</code> (from "Quick hotels sec 2.png"; the finder caught inner panels, so all six boxes by hand on one grid: columns 27–592, 606–1169, 1182–1746; rows 49–466, 479–862; rows 604×456 and 604×424)</summary>

The six problems come from the page's own problem text (two systems, double entry, availability
that never matched, GST-inclusive pricing) plus the PMS's real modules (pending dues at
departure, commission + GST + hotel payouts, multi-property). Property names are from the
PMS; figures are demo (₹2,118 + ₹381 GST = ₹2,499). No headline on the image. When it comes
back: cut into `public/work/quick-hotels/problem-1…6.webp` and add `problemCards`.

```
Create a clean, modern SaaS explainer image: "Before Quick Hotels' booking website and PMS — how a budget hotel chain used to run". The chain runs budget-friendly stays in Delhi, Bengaluru, Noida, Rishikesh and Mathura, takes bookings online and at the front desk, and pays each partner hotel its share. Style: a bento grid of 6 rounded cards on white, each showing one everyday problem as a small, realistic UI illustration, with a few playful hand-drawn notes. Honest and slightly chaotic INSIDE each card; the overall image stays neat, balanced and premium.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no headline text on the image, no devices, no people photos (small round avatars or initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding. ALL 6 CARDS EXACTLY THE SAME SIZE, with equal gaps between them.
- Each card: a small illustration panel on top (very light grey #F7F7F9, rounded), then a number "01" … "06" in royal blue (#1A5FAC), a bold near-black title (#0F172A) and one short grey line (#64748B) under it.
- UI inside the illustrations: a rounded Nunito-style sans-serif, thin borders, simple line icons, muted greys. Whatever is broken is marked with small red/pink badges (#E11D48 text on #FFE4E6); "waiting" states use amber (#B45309 text on #FEF3C7).
- Handwritten notes: short phrases in a casual marker script, charcoal (#1F2937) with one key word in deep gold (#B8860B), each with a short curved marker arrow in royal blue. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in the top-right corner of that card's illustration panel. Never put a note or an arrow in the gap between cards.

LAYOUT: 3 columns × 2 rows, all cards the same size.

Card 01 — "Bookings in two places"
Line: "Online bookings and walk-ins lived in separate systems."
Illustration: two small side-by-side lists: "Website bookings · 14" and a lined-paper "Front desk register · 9"; the same row "Room 204 · 25 Sep" appears in both, joined by a red "2×" badge; under them a red strip "Entered twice".
Note inside the card: "Which one is right?" ("right" in gold), arrow pointing at the "2×" badge.

Card 02 — "Availability never matched"
Line: "The website showed rooms the front desk had already given away."
Illustration: a small room card "Quick Hotel - GK2 · Deluxe Room" with two rows: "Website says · 3 rooms left" (green pill) and "Front desk · 0 rooms left" (grey pill), a red "≠" circle between them, and a red badge "Overbooked".
Note inside the card: "Sorry, we're full…" ("full" in gold), arrow pointing at "Overbooked".

Card 03 — "Surprise tax at checkout"
Line: "Guests saw one price, then paid more once GST was added."
Illustration: a mini price card "Deluxe Room · 1 night" with a line "₹2,118" (struck through in grey), a line "+ GST ₹381" (red), a bold "Total ₹2,499", and a small red badge "Guest left the page".
Note inside the card: "Why did it go up?" ("up" in gold), arrow pointing at "+ GST".

Card 04 — "Dues chased at the door"
Line: "Guests checked out before anyone collected the balance."
Illustration: a checkout row "Room 112 · Quick Hotel - Karol Bagh · checked out 11:05 AM" with a green pill "Checked out"; under it "Balance · ₹1,980" with an amber "?" and a red strip "Balance not collected".
Note inside the card: "Who collects this?" ("collects" in gold), arrow pointing at the red strip.

Card 05 — "Payouts worked out by hand"
Line: "Commission, GST and each hotel's share done on a spreadsheet."
Illustration: a spreadsheet file row with a green Excel-style icon "Hotel_payouts_Sept_v3.xlsx" and a red badge "3 versions"; under it a tiny grid: "Quick Hotel - Whitefield · Bookings ₹1,86,400 · Payout ?", "Quick Hotel - GK2 · Bookings ₹2,12,800 · Payout ?" (the "?" cells in amber).
Note inside the card: "Who gets what?" ("what" in gold), arrow pointing at the "?" cells.

Card 06 — "Every new hotel, more chaos"
Line: "Each new property meant another register and another login."
Illustration: a small "Head office" pill at the top, connected by tangled dashed lines to 4 property pills: "Delhi", "Bengaluru", "Rishikesh", and a highlighted red-outlined pill "+1 new hotel".
Note inside the card: "It only got worse" ("worse" in gold), arrow pointing at "+1 new hotel".

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no extra text, no invented names or numbers. Use ONLY the names given.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Neat and balanced overall: the "mess" lives inside the small illustrations, not in the layout. Every note stays inside its own card.
- No watermark, no device frames, no browser chrome, no background scenery.
```
</details>

<details><summary>Quick Hotels PMS showcase hero (T3, dashboard): prepared 2026-09-30, USED 2026-09-30 on <code>/work/quick-hotels</code> (owner's choice) → <code>quick-hotels/hero.webp</code> (1672×941, from "Quick Hotel Sec 1.png"). The website-variant hero prompt above is still unused; it can go on this page instead, and this image could move to <code>/work/ecommerce-retail-platform</code></summary>

Asked for in the Herbal Vantage hero style (dashboard in the centre). The real PMS dashboard is
mostly zeros (₹0, 0%) apart from 12 active hotels / 12 verifications, so the figures are demo
values in the style of the homepage card image (₹14,82,600, 86%, 38 check-ins); only 12 hotels
and 12 verifications are real. The screenshot's Recent Bookings table has real guest names, so
it was cropped off (`Downloadsquick-hotels-refs-pms-dashboard-no-guest-names.png`); the
floating check-in card uses demo names.

```
Create a premium SaaS hero image for a software agency case study of "Quick Hotels PMS", the property management system that runs every Quick Hotels property across India. Show the software UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px). If 16:9 isn't possible, use the closest landscape size.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no props, no hands, no people.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT — THE DASHBOARD WINDOW (centre, about 66% of the image width)
- A flat, front-facing app window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on the white background. It is just the UI panel itself: no device frame, no bezel, no stand.
- Recreate the attached Quick Hotels PMS dashboard faithfully (very light grey page #F7F8FA, white cards with thin light borders, royal blue #1A5FAC buttons, rounded Nunito / Plus Jakarta Sans-style font), fully filled:
  • Left sidebar, deep navy (#0E1A33) with white text: the white stacked "Quick / Hotels" logo at the top. Menu items in this order, each with a thin white line icon: Dashboard (ACTIVE, bright blue pill #3175F1), Hotels, Bookings, Check-in / out, Inventory, Services, Invoices, Finance, Reports, Leads, Users & roles, Settings, My payouts. At the bottom: a blue avatar "AP" with "Akhil Pratap" / "Administrator".
  • Top bar (white): a hamburger icon and "Dashboard" on the left; a bell and "AP" / "Akhil Pratap" / "Administrator" on the right.
  • Header: "Good afternoon, Akhil 👋" (small grey), "Welcome back! Here's what's happening today." (bold, navy), and on the right a date pill "30 Sept 2026" and a blue button "View all bookings →".
  • Row 1, four stat cards with pastel icon tiles: "Gross bookings this month" / "₹14,82,600" / "↑ 18% vs last month" (mint ₹ icon); "Check-ins today" / "38" / "Across all properties" (lavender); "Active Hotels" / "12" / "Currently accepting bookings" (blue); "Occupancy Rate" / "86%" / "Live across rooms" (amber, with a small blue ring gauge "86%").
  • A full-width strip: a red clock icon, "Departing today · pending dues", "Collect the balance before they leave the property.", and "All departures →"; below it one row: "Room 204 · Quick Hotel - GK2 · ₹3,450 due" with a small blue "Collect" button.
  • Row 2: a wide card "Platform Revenue Analytics" / "Commission + GST earnings overview" with a "Last 7 Days" dropdown and an "Export" button, three figures "Total Revenue ₹4,26,800", "Average Daily Revenue ₹60,971", "Expected Payouts ₹3,12,400" ("Upcoming payouts to hotels"), and a smooth blue area chart 24 → 30 Sep; beside it "Live Operations" with four tiles: "Check-ins Today 38", "Check-outs Today 29", "Pending Approvals 4", "Verifications 12".
  • Row 3 (may be slightly cut by the window's lower edge): "Quick Actions" with five outlined buttons: "+ Add Hotel", "View Bookings", "Release Payouts", "Manage Rooms", "Add Guest".
  • Do NOT show a "Recent Bookings" table or any guest list inside the dashboard.

FLOATING CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–5°, overlapping the window's edges slightly, as if popping out of the UI)
- Top-left: "Monthly Bookings", a smooth royal-blue (#1A5FAC) line chart Apr → Sep with a light blue fill, y-axis ₹0 / ₹4L / ₹8L / ₹12L / ₹16L, the peak labelled in a small blue tag "Sep · ₹14,82,600".
- Bottom-left: "Occupancy by city", 4 horizontal royal-blue bars with values: "Delhi 91%", "Noida 88%", "Bengaluru 84%", "Rishikesh 78%".
- Right: "Today's Check-ins", 4 rows, each with a round avatar with initials, a guest name, a room and property, and a status pill:
  "Rahul Verma" · "Room 204 · Quick Hotel - GK2" · green "Checked in"
  "Neha Kapoor" · "Room 112 · Quick Hotel - Karol Bagh" · green "Checked in"
  "Ananya Gupta" · "Room 305 · Quick Hotel - Whitefield" · blue "Arriving 2 PM"
  "Vikram Singh" · "Room 08 · Quick Boutique | Rishikesh Hills" · amber "30% paid"
- Bottom-right: a small chip with a blue rupee icon and "Hotel payouts released ✓".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in royal blue (#1A5FAC). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in gold (#D4A853), slightly tilted. They sit in the white space and never cover any UI text, number or chart; no arrow crosses the sidebar.
Add exactly these 5:
a) From "Monthly Bookings" → curved arrow to the "Gross bookings this month ₹14,82,600" card. Note: "Bookings tracked live" ("live" in gold).
b) From "Occupancy by city" → curved arrow to the "Occupancy Rate 86%" card. Note: "Every city, one view" ("one view" in gold).
c) From "Today's Check-ins" → curved arrow to the "Live Operations" card. Note: "Front desk in one tap" ("one tap" in gold).
d) Top centre, above the window: note "12 hotels. One dashboard." ("One" in gold) with a short arrow curving down into the dashboard.
e) From the payouts chip → short arrow to the "Expected Payouts ₹3,12,400" figure. Note under the chip: "Payouts on autopilot" ("autopilot" in gold).

LOGO (copy the attached logo exactly; do not redesign it)
- Used only inside the dashboard's sidebar, in white: the stacked "Quick / Hotels" wordmark with speed lines before "Quick" and a small house with a tick forming the "o" in "Hotels".

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states, no zero values: every card, chart and list is filled.
- Clean, balanced, generous spacing; the arrows guide the eye without clutter; nothing overlaps the dashboard's numbers.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Quick Hotels showcase hero (T3, website variant): for <code>/work/quick-hotels</code>, prepared 2026-09-30</summary>

The project is a booking website + PMS, so the main window is the real quickhotels.co
homepage (`public/work/quick-hotels-desktop.webp`) instead of a dashboard, with PMS artefacts
as the floating cards. Property names come from the Quick Hotels PMS; prices and the
30% split (a real feature: pay 30% now, rest at check-in) use demo amounts. Attach
`Downloadsquick-hotels-refs-website-desktop.png` and `3-logo-original.png`. When it comes
back: flatten to `public/work/quick-hotels/hero.webp` and set `hero`.

```
Create a premium hero image for a software agency case study of "Quick Hotels", a hotel booking website and property management system built on one backend, for budget-friendly stays across India. Show the UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px). If 16:9 isn't possible, use the closest landscape size.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no props, no hands, no people outside the website photo.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT — THE WEBSITE WINDOW (centre, about 64% of the image width)
- A flat, front-facing window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on the white background. It is just the page itself: no browser bar, no device frame.
- Recreate the attached Quick Hotels homepage screenshot faithfully:
  • Background: a softly lit hotel room photo (white bed, striped bench, big window with sheer curtains), darkened for contrast.
  • Top: a frosted-glass navigation bar with the white stacked "Quick / Hotels" logo, then "Home" (active, white pill), "Our Hotels", "About Us", "Partner with Us", "Contact", "Track Booking", a search icon, "+91 7668798029" and a blue pill button "Track Booking".
  • Centre: a small glass pill "TRUSTED BY 1000+ HAPPY GUESTS"; the headline "Find Your Perfect Stay" in a large white Playfair Display-style serif, with "Perfect" in gold italic (#D4A853); the line "Budget-friendly luxury across India — Delhi, Bengaluru, Noida, Rishikesh, Mathura & more" in white.
  • Bottom: a dark frosted booking bar: "WHERE TO" / "Delhi, Bengaluru, Rishikesh…"; "CHECK-IN" / "25 Sep '26 Fri"; "CHECK-OUT" / "26 Sep '26 Sat"; "GUESTS & ROOMS" / "2 Adults · 1 Room"; and a blue gradient button (#1A5FAC → #0F2645) with a search icon and "Search".

FLOATING CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–5°, overlapping the window's edges slightly, as if popping out of the page). Font: Nunito-style rounded sans.
- Top-left: "Booking confirmed" with a green check: "Quick Hotel - GK2, Delhi", "Deluxe Room · 25–26 Sep · 2 Adults", a total line "₹2,499 · GST included" and a small green pill "Confirmed".
- Bottom-left: "Pay 30% now": a split bar with a filled blue part "₹750 paid · Razorpay ✓" and a light part "₹1,749 at check-in".
- Right: "Live availability · PMS", 4 rows, each with a small building icon, a property, a city and a pill:
  "Quick Hotel - GK2" · "Delhi" · green "3 rooms left"
  "Quick Hotel - Karol Bagh" · "Delhi" · green "5 rooms left"
  "Quick Hotel - Whitefield" · "Bengaluru" · amber "1 room left"
  "Quick Boutique | Rishikesh Hills" · "Rishikesh" · red "Sold out"
- Bottom-right: a small chip with a blue sync icon and "Booking synced to PMS ✓".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in royal blue (#1A5FAC). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in gold (#D4A853), slightly tilted. They sit in the white space and never cover any UI text; no arrow crosses the headline or the booking bar's labels.
Add exactly these 5:
a) From "Booking confirmed" → curved arrow to the "Search" button. Note: "Search to booked in minutes" ("minutes" in gold).
b) From "Pay 30% now" → curved arrow to the booking bar. Note: "Pay 30% now, rest at check-in" ("30%" in gold).
c) From "Live availability · PMS" → curved arrow to the website window's right edge. Note: "Rooms live from the PMS" ("live" in gold).
d) Top centre, above the window: note "One website. One backend." ("One backend" in gold) with a short arrow curving down into the window.
e) From the sync chip → short arrow to the "Live availability" card. Note under the chip: "No double entry" ("No" in gold).

LOGO (copy the attached logo exactly; do not redesign it)
- Used only in the website's navigation bar, in white: the stacked "Quick / Hotels" wordmark with speed lines before "Quick" and a small house with a tick forming the "o" in "Hotels".

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given.
- No empty states: every card and list is filled.
- No official third-party logos: Razorpay appears only as plain text.
- Clean, balanced, generous spacing; the arrows guide the eye without clutter.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Herbal Vantage design system sheet (T6): for <code>/work/herbal-vantage</code>, prepared 2026-09-30, USED 2026-09-30 → <code>herbal-vantage/design-system.webp</code> (from "Herbal Sec 4.png", flattened at 250; swatches within 8/255 of their labels)</summary>

Brand row and fonts read from the store (computed styles): Forest Ink #0F2D18, Herbal Green
#1A6B2F, Leaf #1B8A4D (Add to Cart), Gold #C9A020, Cream #F7F5F0; Playfair Display + DM Sans.
Admin row sampled from the 30 Sept dashboard: heading #0E3B2E, PV/icon green #1B5E3F, sales
blue #155DFC, active amber #E8B94A, inactive red #CA5036, active pill #E6F4EC, canvas #FAF8F2.
Attach the emblem only. When it comes back: flatten at 250 (three near-white neutrals) to
`public/work/herbal-vantage/design-system.webp` and set `systemImage`.

```
Create a clean, premium DESIGN SYSTEM sheet for "Herbal Vantage", an Ayurvedic healthcare brand with an MLM admin system and an online store, in the style of a professional design-agency case study (like a Figma style-guide page). It shows the colour palette, typography and core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, DM Sans Medium): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows with short handwritten notes in a casual marker script, herbal green (#1B8A4D) and dark charcoal (#1F2937), one key word in Ayurveda gold (#B8860B). They sit in the white space and never cover text.

ZONE 1 — COLOUR (left half of the image)

Row 1: "Brand", 4 large tall swatches side by side. Each shows its colour as a solid block, then the name in bold and the hex code in a small monospace pill:
- "Forest Ink" #0F2D18
- "Herbal Green" #1A6B2F
- "Leaf" #1B8A4D
- "Ayurveda Gold" #C9A020

Row 2: "Admin", 5 smaller square swatches, same labelling:
- "Heading Green" #0E3B2E
- "PV Green" #1B5E3F
- "Sales Blue" #155DFC
- "Active Amber" #E8B94A
- "Inactive Red" #CA5036

Row 3: "Neutrals", 3 small swatches:
- "Cream" #F7F5F0 (with a thin grey outline so it shows on white)
- "Mint Tint" #E6F4EC (with a thin grey outline)
- "Canvas" #FAF8F2 (with a thin grey outline)

Handwritten note with an arrow pointing at the Brand row: "Straight from the store" ("store" in gold).
Handwritten note with an arrow pointing at the Admin row: "Same greens, admin side" ("admin" in gold).

ZONE 2 — TYPOGRAPHY (top right)

Two specimen cards side by side:
- Card 1: a huge "Aa" set in Playfair Display Bold, then "Playfair Display", "Headings", and the weights "Bold". A small line of sample text in Playfair Display: "Reveal Your Natural Glow."
- Card 2: a huge "Aa" set in DM Sans SemiBold, then "DM Sans", "Interface & body text", and the weights "SemiBold · Medium · Regular". A small line of sample text in DM Sans: "Members, PV and payouts in one place."

Under the two cards, a type-scale list (a left column showing each style's name and size, a right column showing that style as rendered text):
- "Store heading · Playfair Display Bold 32" → "Crafted From Nature"
- "Page title · DM Sans SemiBold 28" → "Dashboard"
- "Stat value · DM Sans SemiBold 24" → "45,58,200"
- "Body · DM Sans Regular 14" → "Welcome back, Super Admin"
- "Label · DM Sans Medium 11 · Uppercase" → "TOTAL PV"

ZONE 3 — COMPONENTS (bottom right, one tidy row of real UI pieces)
- A primary button: solid Leaf (#1B8A4D), white text "Add to Cart" with a small cart icon.
- A secondary button: white with a thin grey border, "Release payout" with a small ₹ icon.
- Three status pills: "Approved" (green on light green), "Pending" (amber on light amber), "Rejected" (red on light red).
- A stat card: "Total Registered Users" / "69" / "4 new today", with a round PV Green (#1B5E3F) icon on the left and a small green step-line sparkline.
- A search input: "Search members, orders or products…" with a magnifier icon.
- A sidebar item in its active state: a Mint Tint (#E6F4EC) pill with a small grid icon and "Dashboard" in Heading Green.
Handwritten note with an arrow at the components: "Same pieces across every screen" ("every" in gold).

LOGO
- Place the attached Herbal Vantage emblem small in the top-left corner above Zone 1, with "Design System" beside it in Playfair Display Bold. Copy the emblem exactly (the round green badge with "HERBAL VANTAGE", "PVT.LTD", gold stars and "Safe the Life"); do not redesign it.

QUALITY RULES
- Every hex code, name and word exactly as written above, sharp and legible. No gibberish, no extra colours or fonts, no invented values.
- Swatch colours must match their hex codes exactly.
- Balanced, airy, professional; aligned to a clear grid.
- No watermark, no devices, no captions beyond what's specified.
```
</details>

<details><summary>Herbal Vantage feature bento (T5): for <code>/work/herbal-vantage</code>, prepared 2026-09-30, USED 2026-09-30 → <code>herbal-vantage/crm-card-*.webp</code> (from "Herbal Sec 3.png"; cards A, B and E had borders too faint for the finder; boxes by hand: top <code>[28,48,609,469] [624,48,1173,470] [1187,48,1745,470]</code>, bottom <code>[28,482,445,862] [455,485,885,863] [895,484,1325,863] [1336,485,1745,863]</code>; rows 620×464 and 470×420, none scaled)</summary>

For product 01 (MLM Software) only; the Online Store product keeps its chips until it gets
its own images. Equal-width top row (as Spectrum). Cards map to the real sidebar modules; PV
45,58,200, sales ₹48,61,258 and the PV split are the real dashboard figures, the rest is demo
data with the hero's names. Attach `5-admin-dashboard-sep30.png` and the emblem. When it
comes back: cut into `public/work/herbal-vantage/crm-card-*.webp` and add `cards` to the
MLM product.

```
Create a clean, modern SaaS feature image for "Herbal Vantage MLM Software", the admin system of an Ayurvedic healthcare brand that sells through a network of members who earn PV (point value) and payouts on their own and their team's sales. Style: a bento grid of 7 rounded feature cards, each with a pastel icon tile, a bold title, one short description line and a compact, realistic UI illustration fully filled with data. A few playful hand-drawn arrows and handwritten notes. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no headline text on the image, no people photos (small round avatars and initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached Herbal Vantage dashboard: warm off-white (#F7F6F2) and white surfaces, thin light borders, deep green headings (#1A6B2F), simple line icons, Inter-style sans-serif.
- Accent: herbal green (#1B8A4D) for charts, active tabs and main buttons; blue (#2563EB) for sales figures; green (#16A34A) for paid / approved / done; amber (#F59E0B) for pending; soft red (#EF4444) for rejected.
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding, equal gaps between cards.
- Card header: a rounded-square pastel icon tile, then a bold near-black title (#0F172A) and one short grey line (#64748B).
- Hand-drawn notes: 5 short notes in a casual marker script, charcoal (#1F2937) with one key word in Ayurveda gold (#B8860B), each with a short curved marker arrow in herbal green. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in white space inside that card; none in the gaps between cards; never covering UI text or numbers.

LAYOUT
- Top row: 3 cards of EXACTLY EQUAL width and height.
- Bottom row: 4 cards of EXACTLY EQUAL width and height.
- The two rows span the same total width.

TOP ROW

Card A — icon: people network. Title: "Member network". Line: "Every member's downline, level and sponsor in one tree."
UI: a small genealogy tree: a top node "Ramesh Yadav · HV100214 · Level 3" (herbal-green ring), two child nodes "Sunita Verma · HV100187" and "Amit Kushwaha · HV100241", and under them three small grandchild nodes "PM", "RK", "+6"; a small side panel "Team size · 9 · Active 8"; a green chip "Placement auto-assigned ✓".
Note inside the card, with an arrow at the tree: "Who's under whom, at a glance" ("at a glance" in gold).

Card B — icon: ₹ coin. Title: "PV & payouts". Line: "Level-wise PV and commissions, calculated automatically."
UI: a payout breakdown "September payout · Ramesh Yadav" with rows "Own PV · 1,250", "Level 1 PV · 8,400", "Level 2 PV · 3,160", a divider, "Payout · ₹4,850" in bold, and a green button "Release payout"; under it a status strip "Paid to wallet · 30 Sep" with a green pill.
Note inside the card: "No calculator needed" ("No" in gold).

Card C — icon: shield with a check. Title: "KYC & fund requests". Line: "Approve documents and top-ups before money moves."
UI: a vertical flow of 3 small steps joined by short arrows: "KYC submitted · Pooja Mishra · HV100198" with 3 tiny blurred document chips "PAN", "Aadhaar", "Bank"; "Verified by admin ✓" (green pill); "Fund request · ₹5,000 · Approved ✓" (green pill). A small counter row "Pending KYC · 3" (amber) · "Pending funds · 2" (amber).
Note inside the card: "KYC to payout, one flow" ("one flow" in gold).

BOTTOM ROW

Card D — icon: box with a tag. Title: "Packages & E-Pins". Line: "Joining packages and single-use E-Pins."
UI: two package chips "Starter · ₹1,999 · 100 PV" and "Wellness · ₹4,999 · 250 PV"; an E-Pin row "HV-7Q2K-91 · Wellness" with a green pill "Unused"; another "HV-3M8P-44 · Starter" with a grey pill "Used by HV100241".

Card E — icon: wallet. Title: "Wallets". Line: "Every member's balance, credits and withdrawals."
UI: a wallet card "Wallet · Pooja Mishra · HV100198" with a big balance "₹3,480"; a mini ledger: "+ Level income · ₹1,940 · 30 Sep" (green), "+ Direct income · ₹1,540 · 22 Sep" (green), "– Withdrawal · ₹2,000 · 15 Sep" (grey); a green chip "Balance matches ✓".
Note inside the card: "No more disputes" ("No more" in gold).

Card F — icon: bar chart. Title: "PV & sales reports". Line: "Monthly and all-time PV and sales, live."
UI: two figure tiles "Total PV · 45,58,200" (green) and "Total Sales · ₹48,61,258" (blue); a small donut "PV Distribution" with legend "Direct 42.4%", "Level 1 39.9%", "Level 2 17.7%" (green, blue, gold).
Note inside the card, with an arrow at the donut: "Every level, counted" ("counted" in gold).

Card G — icon: shopping cart. Title: "Orders & products". Line: "Every order credits PV to the right member."
UI: an order row "Order #HV-2291 · Face Cream + Saffron · ₹1,280" with a green pill "Delivered"; an arrow to a chip "+64 PV credited to HV100214"; a small product row with a tiny product thumbnail "Herbal Vantage Face Scrub · 45 in stock".

LOGO (copy the attached Herbal Vantage emblem exactly; do not redesign it)
- Once, small, inside Card A's top-right corner: the round green badge with "HERBAL VANTAGE" around the top, "PVT.LTD" at the bottom, gold stars at the sides and "Safe the Life" in the white centre.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states; every tile, list and chart is filled.
- ID documents are blurred placeholders with no readable numbers.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Balanced, uncluttered, equal gaps between cards; every note inside its own card.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Herbal Vantage problem bento (T4): for <code>/work/herbal-vantage</code>, prepared 2026-09-30, USED 2026-09-30 → <code>herbal-vantage/problem-1…6.webp</code> (from "Herbal Sec 2.png"; the finder split cards 02, 04 and 05 (the calculator and notebook reach the faint borders), so boxes written by hand: top <code>[28,53,592,470] [605,53,1168,470] [1182,53,1745,469]</code>, bottom <code>[28,479,592,862] [605,479,1168,862] [1182,479,1745,866]</code>; rows 600×456 and 600×424)</summary>

Modelled on the Spectrum problem bento. Each problem is the job one of the MLM system's real
modules does (members, PV + payouts, KYC, fund requests + E-Pins, wallets + user queries, orders
+ products). Names and figures are demo data, the same members as the hero prompt. No headline
on the image. When it comes back: cut into `public/work/herbal-vantage/problem-1…6.webp` and
add `problemCards`.

```
Create a clean, modern SaaS explainer image: "Before Herbal Vantage MLM Software — how a direct-selling business used to run". The brand sells Ayurvedic healthcare products through a network of members who earn PV (point value) and payouts on their own and their team's sales. Style: a bento grid of 6 rounded cards on white, each showing one everyday problem as a small, realistic UI illustration, with a few playful hand-drawn notes. Honest and slightly chaotic INSIDE each card; the overall image stays neat, balanced and premium.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no headline text on the image, no devices, no people photos (small round avatars or initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding. ALL 6 CARDS EXACTLY THE SAME SIZE, with equal gaps between them.
- Each card: a small illustration panel on top (very light grey #F7F7F9, rounded), then a number "01" … "06" in herbal green (#1B8A4D), a bold near-black title (#0F172A) and one short grey line (#64748B) under it.
- UI inside the illustrations: Inter-style sans-serif, thin borders, simple line icons, muted greys. Whatever is broken is marked with small red/pink badges (#E11D48 text on #FFE4E6); "waiting" states use amber (#B45309 text on #FEF3C7).
- Handwritten notes: short phrases in a casual marker script, charcoal (#1F2937) with one key word in Ayurveda gold (#B8860B), each with a short curved marker arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in the top-right corner of that card's illustration panel. Never put a note or an arrow in the gap between cards.

LAYOUT: 3 columns × 2 rows, all cards the same size.

Card 01 — "A network on spreadsheets"
Line: "Every member's downline and level lived in Excel sheets."
Illustration: two overlapping spreadsheet file rows with a green Excel-style icon: "Members_downline_final.xlsx" and "Members_downline_final (3).xlsx" with a red badge "3 versions"; under them a tiny grid with 3 rows: "HV100214 · Ramesh Yadav · Level ?", "HV100187 · Sunita Verma · Level 2", "HV100241 · Amit Kushwaha · Sponsor ?" (the "?" cells in amber).
Note inside the card: "Who is under whom?" ("under whom" in gold), arrow pointing at the "?" cells.

Card 02 — "Payouts worked out by hand"
Line: "PV, levels and commissions calculated on a calculator every month."
Illustration: a small paper-style calculation card "September payout · Ramesh Yadav" with rows "Own PV · 1,250", "Level 1 PV · 8,400", "Level 2 PV · ?", "Payout · ₹ – – , – –" (greyed dashes), and a red badge "Recalculated 3×".
Note inside the card: "Is this right?" ("right" in gold), arrow pointing at the dashes.

Card 03 — "KYC on WhatsApp"
Line: "PAN, Aadhaar and bank photos sent in chat, checked by eye."
Illustration: a chat thread row "KYC documents" with a green "42 unread" badge; under it 3 small blurred document thumbnails labelled "PAN card", "Aadhaar", "Bank passbook", each with an amber badge "Not verified".
Note inside the card: "Verified… or not?" ("not" in gold), arrow pointing at the badges.

Card 04 — "Fund requests in a register"
Line: "Top-ups and E-Pins approved from a notebook."
Illustration: a lined-paper strip "Fund request · HV100198 · ₹5,000 · written in the register" with an amber badge "Pending?"; under it an E-Pin row "E-Pin · HV-7Q2K-91 · Used?" with a red badge "Issued twice".
Note inside the card: "Which one was paid?" ("paid" in gold), arrow pointing at "Pending?".

Card 05 — "Wallet balances disputed"
Line: "Members kept asking why their wallet didn't match."
Illustration: a small wallet card "Wallet · Pooja Mishra" with two rows "Member says · ₹3,480" and "Our sheet · ₹2,940", a red "≠" circle between them, and below it a queries row "Member queries · 17 open" with a red badge "Unanswered".
Note inside the card: "Whose number is right?" ("right" in gold), arrow pointing at the "≠".

Card 06 — "Orders never reached PV"
Line: "Product orders and member PV were counted in separate places."
Illustration: three small figure tiles in a row: "Orders · 142", "PV credited · 118", "Stock sold · ?" (greyed), with a red "≠" circle between the first two and a red badge under them: "24 orders missing PV".
Note inside the card: "PV went missing" ("missing" in gold), arrow pointing at the red badge.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no extra text, no invented names or numbers. Use ONLY the names given.
- No official third-party logos: WhatsApp appears only as plain text with a simple chat-bubble line icon; the ID documents are blurred placeholders, never real ones.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Neat and balanced overall: the "mess" lives inside the small illustrations, not in the layout. Every note stays inside its own card.
- No watermark, no device frames, no browser chrome, no background scenery.
```
</details>

<details><summary>Herbal Vantage showcase hero (T3): for <code>/work/herbal-vantage</code>, prepared 2026-09-30, USED 2026-09-30 → <code>herbal-vantage/hero.webp</code> (1672×941, from "Herbal Sec 1.png")</summary>

Modelled on the UnSkills hero, from the 30 Sept 2026 dashboard (`Downloadsherbal-vantage-refs-admin-dashboard-sep30.png`;
no customer names on it, only the admin ID). Real figures kept: 69 / 60 / 9 users, PV 45,58,200,
sales 4,86,126 (₹48,61,258), the PV split incl. Level 2. The playbook bans empty states, so the
real "0" KYC / fund-request tiles and "0 new today" became small demo values (3, 2, 4 new);
floating cards and payout names are demo data. Confirm with the owner that showing Herbal
Vantage's real PV and sales figures is fine. When it comes back: flatten to
`public/work/herbal-vantage/hero.webp` and set `hero` in `lib/showcases.ts`.

```
Create a premium SaaS hero image for a software agency case study of "Herbal Vantage MLM Software", the admin system of an Ayurvedic healthcare brand that sells through a network of members. Show the software UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px). If 16:9 isn't possible, use the closest landscape size.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no props, no hands, no people.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT — THE DASHBOARD WINDOW (centre, about 66% of the image width)
- A flat, front-facing app window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on the white background. It is just the UI panel itself: no device frame, no bezel, no stand.
- Recreate the attached Herbal Vantage dashboard faithfully (warm off-white page #F7F6F2, white cards with thin light borders, deep green accents, Inter-style font), fully filled:
  • Left sidebar (white): the round green Herbal Vantage emblem with "Herbal Vantage" / "Private Limited". Menu items in this order, each with a thin line icon (and a small chevron where it has one): Dashboard (ACTIVE, light green pill), Member Management, Package Management, E-Pin Management, Fund Requests, Reports, KYC Management, Wallet Management, Payout Management, User Queries, Order Management, Product Management, Payment Channels, Sub-Admin Management, Settings, System Status. At the bottom: a user circle with "HV100003" / "Super Admin".
  • Top bar: a bell icon and "Sign out" on the right.
  • Header: "Dashboard" (large, bold, dark green) / "Welcome back, Super Admin 👋", and a date pill "30 Sept 2026" on the right.
  • Row 1, two wide cards with a green check icon and a right arrow: "KYC approvals pending" / "3" / "3 members waiting for review", and "Fund requests pending" / "2" / "2 payments waiting for approval".
  • Row 2, three cards, each with a round icon, a small line chart and a caption: "Total Registered Users" / "69" / "4 new today" (dark green icon, light green tint, green step line); "Total Active Users" / "60" / "3 active today" (amber icon, cream tint, amber step line); "Total Inactive Users" / "9" / "2 inactive today" (pink icon, light pink tint, red line).
  • Row 3, two cards: "Current Month PV / Sales Report" and "Total PV / Sales Report (All Time)", each with two boxes: "Total PV" / "45,58,200" (green) / "₹4,55,82,000" and "Total Sales" / "4,86,126" (blue) / "₹48,61,258".
  • Row 4 (may be slightly cut by the window's lower edge): "PV / Sales Trend" (a "This Week" dropdown, legend "PV" and "Sales", a green and a blue line chart, 23 Sep → 29 Sep); "PV Distribution" / "This Month" (a green, blue and gold donut with "45,58,200" / "TOTAL PV" in the centre; legend "Direct 19,32,580 (42.4%)", "Level 1 18,20,920 (39.9%)", "Level 2 8,04,700 (17.7%)").

FLOATING CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–5°, overlapping the window's edges slightly, as if popping out of the UI)
- Top-left: "Monthly Sales", a smooth herbal-green (#1B8A4D) line chart Apr → Sep with a light green fill, y-axis ₹0 / ₹3L / ₹6L / ₹9L / ₹12L, the peak labelled in a small green tag "Aug · ₹11,40,000".
- Bottom-left: "New Members", 6 herbal-green bars Apr → Sep, with a small green chip "↑ 4 joined today".
- Right: "Recent Payouts", 4 rows, each with a round avatar with initials, a name, a member ID, an amount and a green "Paid" pill:
  "Ramesh Yadav" · "HV100214" · "₹4,850"
  "Sunita Verma" · "HV100187" · "₹3,200"
  "Amit Kushwaha" · "HV100241" · "₹2,760"
  "Pooja Mishra" · "HV100198" · "₹1,940"
- Bottom-right: a small chip with a green shield-check icon and "KYC approved · payout released ✓".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in herbal green (#1B8A4D). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in Ayurveda gold (#B8860B), slightly tilted. They sit in the white space and never cover any UI text, number or chart; no arrow crosses the sidebar.
Add exactly these 5:
a) From "Monthly Sales" → curved arrow to the "Total Sales 4,86,126" box. Note: "Sales tracked live" ("live" in gold).
b) From "New Members" → curved arrow to the "Total Registered Users 69" card. Note: "Network growing daily" ("growing" in gold).
c) From "Recent Payouts" → curved arrow to the "PV Distribution" donut. Note: "Every payout, level by level" ("level by level" in gold).
d) Top centre, above the window: note "Every member. One dashboard." ("One" in gold) with a short arrow curving down into the dashboard.
e) From the KYC chip → short arrow to the "KYC approvals pending" card. Note under the chip: "KYC to payout, in one flow" ("one flow" in gold).

LOGO (copy the attached Herbal Vantage emblem exactly; do not redesign it)
- Used only inside the dashboard's sidebar: a round green badge with "HERBAL VANTAGE" around the top, "PVT.LTD" at the bottom, gold stars at the sides and "Safe the Life" in the white centre.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states, no zero values: every card, chart and list is filled.
- Clean, balanced, generous spacing; the arrows guide the eye without clutter; nothing overlaps the dashboard's numbers.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Spectrum CRM design system sheet (T6): for <code>/work/spectrum-tour-travels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>spectrum/design-system.webp</code> (from "Spectrum sec 4.png", flattened at 250; swatches within 12/255 of their labels, Canvas and Cream kept)</summary>

**The Spectrum brand changed.** spectrumtourtravels.com was redesigned: the old yellow-to-orange
WordPress hero (and our `spectrum-tour-travels-mobile.webp` still) is gone. Read on 2026-09-30:
CTA yellow #FEBD09, deep gold #DFA300, navy #0B1F33 / #081726, heading navy #192A3D, cream
#FFFBEB, canvas #F8FAFC, slate #475569; fonts Unbounded (headings) and Manrope (body). The CRM's
module colours were sampled from its dashboard (Tailwind 800s: #1E40AF, #066251, #6B21A8, #3730A3,
#9D3412; tiles in the matching 50s; "New" pill #FFCE0A; badge #EF4343). The CRM's own font was
not confirmed, so the sheet uses the website's type. The hero, problem and feature prompts above
were written with the old orange (#EA580C / #FF7D08) accent: swap it for deep gold #DFA300
(arrows, note keywords) and #FEBD09 (charts, buttons) before generating them.
Attach the logo only. When it comes back: flatten (check the Canvas and Cream swatches survive;
use a 250 threshold) to `public/work/spectrum/design-system.webp` and set `systemImage`.

```
Create a clean, premium DESIGN SYSTEM sheet for "Spectrum CRM", the CRM of a tour & travel company, in the style of a professional design-agency case study (like a Figma style-guide page). It shows the product's colour palette, typography and core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, Manrope Medium): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows with short handwritten notes in a casual marker script, deep gold (#DFA300) and dark charcoal (#1F2937). They sit in the white space and never cover text.

ZONE 1 — COLOUR (left half of the image)

Row 1: "Brand", 4 large tall swatches side by side. Each shows its colour as a solid block, then the name in bold and the hex code in a small monospace pill:
- "Sunshine Yellow" #FEBD09
- "Deep Gold" #DFA300
- "Night Navy" #0B1F33
- "Ink" #0F172A

Row 2: "Modules", 5 smaller square swatches, same labelling:
- "Leads" #1E40AF
- "Revenue" #066251
- "Tours" #6B21A8
- "Bookings" #3730A3
- "Payments" #9D3412

Row 3: "Neutrals", 3 small swatches:
- "Canvas" #F8FAFC (with a thin grey outline so it shows on white)
- "Cream" #FFFBEB (with a thin grey outline)
- "Slate" #475569

Handwritten note with an arrow pointing at the Sunshine Yellow and Night Navy swatches: "Straight from the website" ("website" in gold).
Handwritten note with an arrow pointing at the Modules row: "One colour per module" ("module" in gold).

ZONE 2 — TYPOGRAPHY (top right)

Two specimen cards side by side:
- Card 1: a huge "Aa" set in Unbounded Bold, then "Unbounded", "Headings & numbers", and the weights "Bold · SemiBold". A small line of sample text in Unbounded: "Journeys you'll remember".
- Card 2: a huge "Aa" set in Manrope SemiBold, then "Manrope", "Interface & body text", and the weights "SemiBold · Medium · Regular". A small line of sample text in Manrope: "Leads, quotes and bookings in one place."

Under the two cards, a type-scale list (a left column showing each style's name and size, a right column showing that style as rendered text):
- "Page title · Unbounded SemiBold 28" → "Admin Dashboard"
- "Stat value · Unbounded SemiBold 24" → "₹4,13,487"
- "Card title · Manrope SemiBold 16" → "Dashboard Overview"
- "Body · Manrope Regular 14" → "Welcome back, Aviral Singh"
- "Label · Manrope Medium 11 · Uppercase" → "UPCOMING TOURS"

ZONE 3 — COMPONENTS (bottom right, one tidy row of real UI pieces)
- A primary button: solid Sunshine Yellow (#FEBD09), Ink text "Add Booking" with a small briefcase icon.
- A secondary button: white with a thin grey border, "New Quotation" with a small document icon.
- Three status pills: "New" (Ink text on #FFCE0A), "Confirmed" (green on light green), "Balance due" (red on light red).
- A stat tile: a lavender tile (#FAF5FF) with a small calendar icon on top, "Upcoming Tours" in purple (#6B21A8), a big "29" and "5 this week" in grey.
- A search input: "Search leads, trips or bookings…" with a magnifier icon.
- A sidebar item in its active state: a Cream (#FFFBEB) pill with a small grid icon and "Dashboard" in Ink.
Handwritten note with an arrow at the components: "Same pieces across every screen" ("every" in gold).

LOGO
- Place the attached Spectrum logo small in the top-left corner above Zone 1, with "Design System" beside it in Unbounded SemiBold. Copy the logo exactly (the black line-art hiker, sun and cloud, the script "Spectrum" and "Tour-Travels" underneath); do not redesign it.

QUALITY RULES
- Every hex code, name and word exactly as written above, sharp and legible. No gibberish, no extra colours or fonts, no invented values.
- Swatch colours must match their hex codes exactly.
- Balanced, airy, professional; aligned to a clear grid.
- No watermark, no devices, no captions beyond what's specified.
```
</details>

<details><summary>Spectrum CRM feature bento (T5): for <code>/work/spectrum-tour-travels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>spectrum/crm-card-*.webp</code> (from "Spectrum sec 3.png"; the finder split the top-middle card into 4 panels and merged nothing else; boxes written by hand at a 250 threshold: top <code>[34,20,597,456] [614,20,1158,456] [1178,20,1739,456]</code>, bottom <code>[34,473,469,867] [484,473,881,867] [896,473,1296,867] [1311,473,1739,867]</code>; rows 596×470 and 466×425, none scaled — the equal-width top row worked)</summary>

Modelled on the UnSkills / Smart Agro feature bentos, with one deliberate change: the
top row asks for **3 equal cards** instead of ~40/30/30. The showcase grid gives every card
in a row the same width, so a wide first card ends up scaled down (Smart Agro's leads card
came out at 0.67). Cards map to the CRM's real modules; "Pending customer payments · 47"
is the real dashboard figure, everything else is demo data with the hero's names. Attach
the blurred dashboard (`1c-dashboard-clear-names-blurred.png`) and the logo. When it
comes back: cut into `public/work/spectrum/crm-card-*.webp` and add `cards` to the product.

```
Create a clean, modern SaaS feature image for "Spectrum CRM", the complete CRM of a tour & travel company that sells domestic and international tour packages. Style: a bento grid of 7 rounded feature cards, each with a pastel icon tile, a bold title, one short description line and a compact, realistic UI illustration fully filled with data. A few playful hand-drawn arrows and handwritten notes. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no headline text on the image, no people photos (small round avatars and initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached Spectrum CRM dashboard: white surfaces, thin light-grey borders, soft pastel tiles (light blue, mint, lavender, indigo, peach), simple line icons, Inter-style sans-serif.
- Accent: Spectrum orange (#FF7D08) for charts, active tabs and main buttons. Green (#16A34A) for paid / confirmed / done, amber (#F59E0B) for pending, soft red (#EF4444) for due.
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding, equal gaps between cards.
- Card header: a rounded-square pastel icon tile, then a bold near-black title (#0F172A) and one short grey line (#64748B).
- Hand-drawn notes: 5 short notes in a casual marker script, charcoal (#1F2937) with one key word in orange (#EA580C), each with a short curved marker arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in white space inside that card; none in the gaps between cards; never covering UI text or numbers.

LAYOUT
- Top row: 3 cards of EXACTLY EQUAL width and height.
- Bottom row: 4 cards of EXACTLY EQUAL width and height.
- The two rows span the same total width.

TOP ROW

Card A — icon: map with a route. Title: "Tour package builder". Line: "A day-wise itinerary, priced as you build it."
UI: a vertical chain of 3 small day cards joined by short arrows, each with a tiny destination photo thumbnail: "Day 1 · Srinagar" / "Arrival, houseboat stay, Shikara ride"; "Day 2 · Gulmarg" / "Gondola ride, hotel check-in"; "Day 3 · Pahalgam" / "Betaab Valley, transfers". Below the chain, a summary strip "Kashmir 5N/6D · ₹42,500 per person" with an orange button "Send quotation →".
Note inside the card, with an arrow at the summary strip: "Itinerary to quote in minutes" ("minutes" in orange).

Card B — icon: phone with signal. Title: "Leads & IVR". Line: "Every call and web enquiry lands as a lead."
UI: an incoming-call row "+91 98xxx 45210 · Incoming" with an orange phone icon; an IVR menu box "1 · Domestic tours", "2 · International tours", "3 · Existing booking"; a short arrow to "Routed to Pooja · Sales"; and a green chip "Lead created: Rohan Mehta · Kashmir 5N/6D".
Note inside the card: "No missed enquiry" ("No" in orange).

Card C — icon: document with a check. Title: "Quotations & bookings". Line: "From quote to confirmed trip in one flow."
UI: a mini quotation "Quotation #SPT-Q-1182" / "Goa 3N/4D · 4 pax · Neha Gupta" with rows "Hotel · 3 nights · ₹36,000", "Transfers & sightseeing · ₹14,400", "Taxes · ₹8,000", a total "₹58,400", a green chip "Sent on WhatsApp ✓", and under it a booking strip "Booking confirmed · Advance ₹17,520 paid" with a green pill.
Note inside the card: "Quote to booking" ("booking" in orange).

BOTTOM ROW

Card D — icon: receipt. Title: "Invoices & payments". Line: "Invoices, advances and balances per booking."
UI: an invoice row "Invoice #SPT-1042 · ₹84,000 · Paid" (green pill); a booking row "Kashmir 5N/6D · Advance ₹25,500 paid · Balance ₹59,500 due 5 Oct" (amber pill "Due"); a peach tile "Pending customer payments · 47 · Need attention".
Note inside the card: "Every rupee tracked" ("tracked" in orange).

Card E — icon: globe. Title: "Website manager". Line: "Bookings, packages, offers and reviews, run from the CRM."
UI: a 2×2 grid of mini tiles: "Website bookings · 12 this week", "Showcase packages · 38 live", "Promo code · MONSOON10 · 10% off", "New review ★★★★★ · Arjun N."; a row "Blog & landing pages · 3 drafts".

Card F — icon: wallet. Title: "Vendors & accounts". Line: "Hotel and cab payables, petty cash and books."
UI: 2 vendor rows with a building and a car icon: "Hotel Pine View, Gulmarg · ₹38,000" (green "Paid") and "Valley Cabs, Srinagar · ₹12,400" (amber "Due"); a row "Petty cash in · ₹42,000"; a mini bar chart "Income vs Expenses" Apr → Sep (orange and grey bars).

Card G — icon: people. Title: "Workforce". Line: "Attendance, tasks and salaries in one place."
UI: "Today's attendance · 18/20 present" with a thin green progress bar and 4 small overlapping initials avatars; a task list with checkboxes: "✓ Call back Kerala leads · Riya", "✓ Send Bali quotation · Aman", "○ Confirm Goa hotel · Karan"; a green chip "Salaries processed ✓".
Note inside the card: "Whole team, one screen" ("one screen" in orange).

LOGO (copy the attached Spectrum logo exactly; do not redesign it)
- Once, small, inside Card A's top-right corner: the black line-art hiker with a backpack and trekking pole, a small sun and a cloud, the script word "Spectrum" and "Tour-Travels" in a typewriter font underneath.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states; every tile, list and chart is filled.
- No official third-party logos: WhatsApp appears only as plain text or a simple chat-bubble line icon.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Balanced, uncluttered, equal gaps between cards; every note inside its own card.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Spectrum CRM problem bento (T4): for <code>/work/spectrum-tour-travels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>spectrum/problem-1…6.webp</code> (from "Spectrum Sec- 2.png"; all 6 found automatically; rows 596×494 and 596×420, same width so the columns line up)</summary>

Modelled on the Smart Agro / UnSkills problem bentos. Each problem is the job one of the
CRM's real modules does (leads + IVR, tour package builder, quotations, bookings +
invoices, vendors + petty cash + accounts, attendance + tasks). Names, trips and figures
are demo data, the same names as the Spectrum hero prompt. The image asks for no headline
text, so the cut cards need no cropping. When it comes back: cut into
`public/work/spectrum/problem-1…6.webp` (one canvas for both rows) and add `problemCards`.

```
Create a clean, modern SaaS explainer image: "Before Spectrum CRM — how a travel agency used to run". The agency sells domestic and international tour packages; enquiries come in by phone, on the website, on WhatsApp and at the office. Style: a bento grid of 6 rounded cards on white, each showing one everyday problem as a small, realistic UI illustration, with a few playful hand-drawn notes. Honest and slightly chaotic INSIDE each card; the overall image stays neat, balanced and premium.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no headline text on the image, no devices, no people photos (small round avatars or initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding. ALL 6 CARDS EXACTLY THE SAME SIZE, with equal gaps between them.
- Each card: a small illustration panel on top (very light grey #F7F7F9, rounded), then a number "01" … "06" in Spectrum orange (#EA580C), a bold near-black title (#0F172A) and one short grey line (#64748B) under it.
- UI inside the illustrations: Inter-style sans-serif, thin borders, simple line icons, muted greys. Whatever is broken is marked with small red/pink badges (#E11D48 text on #FFE4E6); "waiting" states use amber (#B45309 text on #FEF3C7).
- Handwritten notes: short phrases in a casual marker script, charcoal (#1F2937) with one key word in orange (#EA580C), each with a short curved marker arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in the top-right corner of that card's illustration panel. Never put a note or an arrow in the gap between cards.

LAYOUT: 3 columns × 2 rows, all cards the same size.

Card 01 — "Enquiries everywhere"
Line: "Calls, website forms, WhatsApp and walk-ins, never in one list."
Illustration: 4 stacked source rows, each with a simple line icon (phone, globe, chat bubble, notebook) and a count badge: "Missed calls · 9", "Website enquiries · 14", "WhatsApp chats · 26 unread", "Walk-ins (notebook) · 3". A small red badge across the bottom row: "Not in one list".
Note inside the card: "Who called back?" ("back" in orange), arrow pointing at "Missed calls · 9".

Card 02 — "Itineraries built by hand"
Line: "Every day-wise plan typed again, every price worked out again."
Illustration: two overlapping document rows with a Word-style and an Excel-style icon: "Kashmir_5N6D_v4_final.docx" and "Kashmir quote (Rohan).xlsx" with a red badge "Price changed?"; under them a mini cost list "Houseboat · Srinagar · ₹6,500", "Hotel · Gulmarg · ?", "Transfers · ?" and a total line "Total · ₹ – – , – –" (greyed dashes).
Note inside the card: "Which price is right?" ("right" in orange), arrow pointing at the dashes.

Card 03 — "Quotes lost in follow-up"
Line: "Some quotes went out twice, some never got a follow-up."
Illustration: 3 quote rows, each with a destination, a traveller and a badge: "Goa 3N/4D · Neha Gupta" with a red badge "Sent 2×"; "Sikkim 6N/7D · Arjun Nair" with a red badge "5 days, no reply"; "Shimla–Manali 5N/6D · Kavya Reddy" with an amber badge "Not sent".

Card 04 — "Payments chased by memory"
Line: "Advances and balances arrive over weeks, tracked nowhere."
Illustration: a small booking card "Kashmir 5N/6D · 2 pax · ₹85,000" with two rows: "Advance · ₹25,500" (green pill "Paid") and "Balance · ₹59,500 · due 5 Oct" (grey "?"), plus a red strip "Balance not chased".
Note inside the card: "Who owes what?" ("owes" in orange), arrow pointing at the "?".

Card 05 — "Vendors and cash on paper"
Line: "Hotel, cab and petty-cash payments lived in a register."
Illustration: 2 vendor rows with a building and a car icon: "Hotel Pine View, Gulmarg · ₹38,000" (amber "Paid?") and "Valley Cabs, Srinagar · ₹12,400" (amber "Paid?"); below them a small lined-paper strip "Petty cash in · ₹42,000 · written in the register" with a red badge "Not in accounts".

Card 06 — "Staff tasks on WhatsApp"
Line: "Attendance and follow-ups handed out in group chats."
Illustration: a chat group row "Sales team" with a green "99+" badge; under it 2 task rows with an empty checkbox: "Call back Kerala leads · ?" and "Send Bali quotation · ?"; and a row "Present today · ?" with a grey question mark.
Note inside the card: "Who's on it?" ("on it" in orange), arrow pointing at the task rows.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no extra text, no invented names or numbers. Use ONLY the names given.
- No official third-party logos: WhatsApp appears only as plain text with a simple chat-bubble line icon.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Neat and balanced overall: the "mess" lives inside the small illustrations, not in the layout. Every note stays inside its own card.
- No watermark, no device frames, no browser chrome, no background scenery.
```
</details>

<details><summary>Spectrum CRM showcase hero (T3): for <code>/work/spectrum-tour-travels</code>, prepared 2026-09-30, USED 2026-09-30 → <code>spectrum/hero.webp</code> (1672×941, from "Spectrum sec - 1.png", generated with the gold accent)</summary>

Modelled on the UnSkills hero. Dashboard figures are Spectrum's real ones (31 leads +34.8%,
₹4,13,487 revenue, 29 upcoming tours, 6 bookings, 47 pending payments); the two negative
month-on-month changes (−7.5%, −71.4%) are left off rather than altered. The real Leads and
Recent Activities panels held a test lead and a real customer's name, so they were blurred
(`Downloadsspectrum-travels-refsb-dashboard-names-blurred.png`) and filled with the demo
names given. Confirm with the owner that showing Spectrum's real figures is fine. When it
comes back: flatten to `public/work/spectrum/hero.webp` and set `hero` in `lib/showcases.ts`.

```
Create a premium SaaS hero image for a software agency case study of "Spectrum CRM", a complete CRM for a tour & travel company that sells domestic and international tour packages. Show the software UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px). If 16:9 isn't possible, use the closest landscape size.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no props, no hands, no people.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT — THE DASHBOARD WINDOW (centre, about 66% of the image width)
- A flat, front-facing app window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on the white background. It is just the UI panel itself: no device frame, no bezel, no stand.
- Recreate the attached Spectrum CRM dashboard faithfully (same layout, white surfaces, thin light-grey borders, pastel stat tiles, line icons, Inter-style font), fully filled:
  • Left sidebar (white, thin right border): the black script "Spectrum Tour-Travels" logo at the top. Grey group headings with their items, each with a thin line icon:
    "Main Modules": Dashboard (ACTIVE, soft orange pill #FFF1E6 with orange #EA580C text), Lead Management, Tour Package Builder, Quotation Management, Booking Management, Invoice Generator, IVR System.
    "Website": Website Bookings, Showcase Packages, Promo Codes, Reviews, Blog, Landing Pages, Website Builder.
    "Workforce Management": Attendance Management, Task Management.
    "Financial & HR": Vendor / Supplier Management, Petty Cash, Accounts, Salary Management (may be cut off by the window's bottom edge).
  • Top bar: "Spectrum CRM" (bold) on the left; "Aviral Singh" and a logout icon on the right.
  • Header: "Admin Dashboard" (large, bold) / "Welcome back, Aviral Singh"; on the right a small icon with a red "1" badge, a bell with a red "10" badge, and an "Analytics" button with a trend-arrow icon.
  • Card "Dashboard Overview" with five pastel stat tiles, each with a small round icon on top, a coloured label, a big value and a small grey caption:
    "Total Leads" / "31" / "+34.8%" / "This month" (light blue tile, blue text)
    "Revenue" / "₹4,13,487" / "This month" (mint tile, green text)
    "Upcoming Tours" / "29" / "5 this week" / "Next 30 days" (lavender tile, purple text)
    "Total Bookings" / "6" / "This month" (light indigo tile, indigo text)
    "Pending Customer Payment" / "47" / "Need attention" / "Outstanding" (peach tile, orange text)
  • Card "Quick Actions" with six white buttons, each with a pastel round icon above its label: "Add Booking", "Add Invoice", "Add Lead", "View Reports", "Tour Packages", "New Quotation".
  • Bottom row (may be slightly cut by the window's lower edge):
    Card "Leads (4)" with a "Today" dropdown and 4 lead rows, each with a destination, a source and a status pill: "Rohan Mehta · Kashmir 5N/6D · Website" (yellow "New"), "Neha Gupta · Goa 3N/4D · IVR call" (blue "Contacted"), "Arjun Nair · Sikkim 6N/7D · Website" (purple "Quoted"), "Kavya Reddy · Shimla–Manali 5N/6D · WhatsApp" (yellow "New").
    Card "Recent Activities (Last 24h)" with "View All" and 4 entries, each with a small coloured dot and a grey time line: "New lead: Rohan Mehta · Kashmir 5N/6D from Website" / "Just now"; "Quotation sent: Goa 3N/4D · ₹58,400" / "12m ago"; "Payment received: ₹42,000 via UPI" / "31m ago"; "Booking confirmed: Sikkim 6N/7D · 2 pax" / "1h ago".

FLOATING CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–5°, overlapping the window's edges slightly, as if popping out of the UI)
- Top-left: "Monthly Revenue", a smooth orange (#FF7D08) line chart Apr → Sep with a light orange fill, y-axis ₹0 / ₹2L / ₹4L / ₹6L / ₹8L, the peak labelled in a small orange tag "Aug · ₹6,80,000".
- Bottom-left: "Leads by Source", 4 horizontal orange bars with counts: "Website 14", "IVR calls 8", "WhatsApp 6", "Walk-in 3", and a small green chip "↑ 34.8% this month".
- Right: "Upcoming Tours", 4 rows, each with a small photo thumbnail of the destination, the traveller, the trip, a date, the group size and a status pill:
  "Rohan Mehta" · "Kashmir 5N/6D" · "12 Oct · 2 pax" · green "Confirmed"
  "Neha Gupta" · "Goa 3N/4D" · "18 Oct · 4 pax" · amber "Advance paid"
  "Arjun Nair" · "Sikkim 6N/7D" · "22 Oct · 2 pax" · green "Confirmed"
  "Kavya Reddy" · "Shimla–Manali 5N/6D" · "27 Oct · 3 pax" · red "Balance due"
- Bottom-right: a small chip with a green chat-bubble icon (a plain line icon, not the official WhatsApp logo) and "Quotation sent on WhatsApp ✓".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in Spectrum orange (#EA580C). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in orange (#EA580C), slightly tilted. They sit in the white space and never cover any UI text, number or chart; no arrow crosses the sidebar or any stat tile's text.
Add exactly these 5:
a) From "Monthly Revenue" → curved arrow to the "Revenue ₹4,13,487" tile. Note: "Revenue tracked live" ("live" in orange).
b) From "Leads by Source" → curved arrow to the "Total Leads 31" tile. Note: "Leads up 34.8%" ("34.8%" in orange).
c) From "Upcoming Tours" → curved arrow to the "Upcoming Tours 29" tile. Note: "Every trip, on schedule" ("on schedule" in orange).
d) Top centre, above the window: note "Every trip. One dashboard." ("One" in orange) with a short arrow curving down into the dashboard.
e) From the WhatsApp chip → short arrow to the "New Quotation" quick action. Note under the chip: "Quotes in minutes" ("minutes" in orange).

LOGO (copy the attached Spectrum logo exactly; do not redesign it)
- Used only inside the dashboard's sidebar: a black line-art hiker with a backpack and trekking pole climbing a slope, a small sun and a cloud above, the flowing script word "Spectrum" across the middle, and "Tour-Travels" in a typewriter font underneath.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names or text from the blurred parts of the reference screenshot.
- No empty states, no zero values: every card, chart and list is filled.
- Clean, balanced, generous spacing; the arrows guide the eye without clutter; nothing overlaps the dashboard's numbers.
- No official third-party logos (WhatsApp appears only as a simple line icon).
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Smart Agro design system sheet (T6): for <code>/work/smart-agro</code>, prepared 2026-09-27, USED 2026-09-28 → <code>smart-agro/design-system.webp</code></summary>

Hexes sampled on 2026-09-27 (median of regions): logo red #D31C1C and green #317320
(kept as the logged Smart Red #D01A1B / Agro Green #307120); sidebar #00411D and active
pill #28B94D (Forest #01411D / Leaf #28B94C); Info #2B65F6 (Facebook legend), Warning
#FA960B (alert icon), Danger #F01E5B ("99+" badge), Mint Tint #E6FDF2 (stat icon tile),
Ink #0A0919. Fonts as logged: Poppins headings, Inter body. Attach the logo only. When it
comes back: flatten to `public/work/smart-agro/design-system.webp` and set `systemImage`
in `lib/showcases.ts` (it then replaces the coded palette and type).

```
Create a clean, premium DESIGN SYSTEM sheet for "Smart Agro", an agri business management system, in the style of a professional design-agency case study (like a Figma style-guide page). It shows the product's colour palette, typography and core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, Inter Medium): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows with short handwritten notes in a casual marker script, Smart Red (#D01A1B) and dark charcoal (#1F2937). They sit in the white space and never cover text.

ZONE 1 — COLOUR (left half of the image)

Row 1: "Brand", 4 large tall swatches side by side. Each shows its colour as a solid block, then the name in bold and the hex code in a small monospace pill:
- "Smart Red" #D01A1B
- "Agro Green" #307120
- "Forest" #01411D
- "Leaf" #28B94C

Row 2: "Status", 5 smaller square swatches, same labelling:
- "Success" #28B94C
- "Info" #2B65F6
- "Warning" #FA960B
- "Danger" #F01E5B
- "Mint Tint" #E6FDF2 (with a thin grey outline so it shows on white)

Row 3: "Neutrals", 3 small swatches:
- "Canvas" #F7F8F7 (with a thin grey outline so it shows on white)
- "White" #FFFFFF (with a thin grey outline)
- "Ink" #0A0919

Handwritten note with an arrow pointing at the Smart Red and Agro Green swatches: "Taken straight from the logo" ("logo" in red).
Handwritten note with an arrow pointing at the Forest and Leaf swatches: "The colours of the fields" ("fields" in red).

ZONE 2 — TYPOGRAPHY (top right)

Two specimen cards side by side:
- Card 1: a huge "Aa" set in Poppins SemiBold, then "Poppins", "Headings & numbers", and the weights "SemiBold · Bold". A small line of sample text in Poppins: "Good morning, Aviral".
- Card 2: a huge "Aa" set in Inter SemiBold, then "Inter", "Interface & body text", and the weights "SemiBold · Medium · Regular". A small line of sample text in Inter: "Track leads, orders and stock in every godown."

Under the two cards, a type-scale list (a left column showing each style's name and size, a right column showing that style as rendered text):
- "Page title · Poppins SemiBold 28" → "Good morning, Aviral"
- "Stat value · Poppins SemiBold 24" → "₹56,40,104"
- "Card title · Inter SemiBold 16" → "Leads by Source"
- "Body · Inter Regular 14" → "Here's what's happening with your business today."
- "Label · Inter Medium 11 · Uppercase" → "TOTAL REVENUE"

ZONE 3 — COMPONENTS (bottom right, one tidy row of real UI pieces from the system)
- A primary button: solid Leaf (#28B94C), white text "Add Lead" with a small user-plus icon.
- A secondary button: white with a thin grey border, "New Quotation" with a small document icon.
- Three status pills: "Delivered" (green on light green), "Pending" (amber on light amber), "Low stock" (red on light red).
- A stat card: "TOTAL ORDERS" / "2,678" / "42 today", with a pastel Mint Tint icon tile top-right and a small leaf-green sparkline.
- A search input: "Search leads, products or orders…" with a magnifier icon.
- A sidebar item in its active state: a short Forest (#01411D) sidebar strip with the item "Dashboard" in a Leaf-green pill, white text and a white icon.
Handwritten note with an arrow at the components: "Same pieces across every screen" ("every" in red).

LOGO
- Place the attached Smart Agro logo small in the top-left corner above Zone 1, with "Design System" beside it in Poppins SemiBold. Copy the logo exactly; do not redesign it.

QUALITY RULES
- Every hex code, name and word exactly as written above, sharp and legible. No gibberish, no extra colours or fonts, no invented values.
- Swatch colours must match their hex codes exactly.
- Balanced, airy, professional; aligned to a clear grid.
- No watermark, no devices, no captions beyond what's specified.
```
</details>

<details><summary>Smart Agro feature bento (T5): for <code>/work/smart-agro</code>, prepared 2026-09-27, USED 2026-09-28 → <code>smart-agro/crm-card-*.webp</code></summary>

Modelled on the UnSkills feature bento. The 10 feature chips in `lib/showcases.ts` are
folded into 7 cards: A leads + Meta Ads, B WhatsApp automation, C e-commerce & orders,
D targets + roles, E inventory & godowns, F quotations, G accounting & GST + affiliate
commissions. Real figures where the dashboard has them (2,678 orders, 42 today, 115
awaiting dispatch, 26 low stock products, 11,898 leads); the rest is demo data in the
client's context. Attach the dashboard screenshot (names blurred) and the logo. When it
comes back: cut into `public/work/smart-agro/crm-card-*.webp` with
`cut_cards.py --size 620x470,432x392` and add `cards` to the product in `lib/showcases.ts`.

```
Create a clean, modern SaaS feature image for "Smart Agro", the business management system of an agriculture company that sells fertilisers, bio-stimulants and crop-protection products through a sales team, an online store and WhatsApp. Style: a bento grid of 7 rounded feature cards, each with a pastel icon tile, a bold title, one short description line and a compact, realistic UI illustration fully filled with data. A few playful hand-drawn arrows and handwritten notes. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no headline, no people photos (small round avatars and initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached Smart Agro dashboard: white and very light grey (#F7F8F7) surfaces, thin light-grey borders, Plus Jakarta Sans / Inter-style sans-serif, simple line icons, forest green (#0F5132) for dark UI accents.
- Accent: leaf green (#22A447) for charts, active tabs and main buttons. Green (#16A34A) for paid / delivered / done, amber (#F59E0B) for pending, soft red (#EF4444) for low stock.
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding, equal gaps between cards.
- Card header: a rounded-square pastel icon tile, then a bold near-black title (#0F172A) and one short grey line (#64748B).
- Hand-drawn notes: 5 short notes in a casual marker script, charcoal (#1F2937) with one key word in Smart Agro red (#D01A1B), each with a short curved marker arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in white space inside that card; none in the gaps between cards; never covering UI text or numbers.

LAYOUT
Top row: 3 cards (widths ~40% / 30% / 30%). Bottom row: 4 equal cards. Cards in the same row are exactly the same height.

TOP ROW

Card A (widest) — icon: people. Title: "Leads & Meta Ads". Line: "Every lead lands in one list and goes to the right seller."
UI: a lead list with a header "Leads · 11,898" and a filter chip "Today". 4 rows, each with an initials avatar, a farmer's name and town, a source chip (plain text) and the seller it was assigned to:
- "Ganesh Pawar · Nashik" · chip "WhatsApp" · "→ Priya More"
- "Sunita Jadhav · Pune" · chip "Facebook ad" · "→ Rahul Deshmukh"
- "Mahesh Shinde · Jalgaon" · chip "Instagram ad" · "→ Amit Kulkarni"
- "Kavita Patil · Ahmednagar" · chip "Website form" · "→ Priya More"
Above the list, a small green toast: "New lead from Facebook ad · auto-assigned to Rahul Deshmukh".
Note inside the card, with an arrow at the toast: "Right seller, instantly" ("instantly" in red).

Card B — icon: chat bubble. Title: "WhatsApp automation". Line: "Built in, with no third-party BSP fees."
UI: a vertical flow of 4 small steps joined by short curved arrows:
- "New enquiry on WhatsApp" · "Ganesh Pawar · Chilli Special"
- "Product details sent" · "Price, dose and photos"
- "Auto follow-up" · a tiny green chat bubble "Shall we book your order for tomorrow?"
- "Order placed ✓" (green pill)
Note inside the card: "No BSP fees" ("No" in red).

Card C — icon: shopping bag. Title: "E-commerce & orders". Line: "From the online store to dispatch, one flow."
UI: a 2×2 grid of mini tiles: "Total orders 2,678" (green), "Today 42" (blue), "Awaiting dispatch 115" (amber), "Delivered today 38" (green); under it an order row "Order #2291 · Virat + Panchgavya Combo · ₹1,700" with a blue "Dispatched" pill.
Note inside the card, with an arrow at the dispatch tile: "Store to dispatch" ("dispatch" in red).

BOTTOM ROW

Card D — icon: target. Title: "Targets & team roles". Line: "Each seller sees only their leads and goals."
UI: "September targets" with 3 seller rows, each with an initials avatar, a name, a thin leaf-green progress bar and a percentage: "Priya More · ₹3,20,000 of ₹4,00,000 · 80%", "Rahul Deshmukh · ₹2,10,000 of ₹3,00,000 · 70%", "Amit Kulkarni · ₹1,35,000 of ₹2,50,000 · 54%"; a row of role chips "Admin · Manager · Seller".

Card E — icon: warehouse. Title: "Inventory & godowns". Line: "Stock and batches in every godown."
UI: a product header "Maple EM-1" and 3 godown rows with stock counts: "Nashik godown · 1,240", "Jalgaon godown · 860", "Ahmednagar godown · 312"; a batch row "Batch MPL-0924 · Exp. Mar 2027"; a small red chip "26 low stock products · Restock".
Note inside the card: "Every godown, live" ("live" in red).

Card F — icon: document. Title: "Quotations". Line: "Professional quotes in a few clicks."
UI: a mini quotation document "Quotation #QT-1182" / "Shree Krishi Kendra, Nashik" with 3 item rows: "Hunter Plus × 20 · ₹28,000", "Maple EM-1 × 10 · ₹10,000", "Flower Booster × 12 · ₹7,200"; a total line "Total · ₹45,200"; and a leaf-green button "Send on WhatsApp".

Card G — icon: ₹. Title: "Accounting & GST". Line: "Books, GST returns and affiliate payouts."
UI: two small status rows with green ticks: "GSTR-1 · September · Ready ✓", "GSTR-3B · September · Ready ✓"; a mini bar chart "Sales vs Expenses" for Apr → Sep (leaf-green and grey bars); and a row "Affiliate commissions · ₹18,450 due" with an amber "Pending" pill.
Note inside the card: "GST-ready" ("GST" in red).

LOGO (copy the attached Smart Agro logo exactly; do not redesign it)
- Once, small, inside Card A's top-right corner: the "Smart Agro" wordmark with "Smart" in red and "Agro" in green, exactly as in the attached file.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states; every tile, list and chart is filled.
- No official third-party logos: WhatsApp, Facebook and Instagram appear only as plain text chips or simple line icons.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Balanced, uncluttered, equal gaps between cards; every note inside its own card.
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Smart Agro problem bento (T4): for <code>/work/smart-agro</code>, prepared 2026-09-27, USED 2026-09-28 → <code>smart-agro/problem-1…6.webp</code></summary>

Modelled on the UnSkills problem bento. The six problems come from the showcase's own
brief/problem text (leads from WhatsApp, Facebook, Instagram and forms; sharing leads
fairly; follow-ups; paying a BSP for WhatsApp; stock in several godowns; books and GST
agreeing). Names, products and figures inside the cards are demo data in the client's
context (smartagrocare.in products, Maharashtra names). Attach nothing, or the UnSkills
problem screenshot as a style reference only. When it comes back: cut it into
`public/work/smart-agro/problem-1…6.webp` with `cut_cards.py --size 574x440` and add
`problemCards` to the Smart Agro entry in `lib/showcases.ts`.

```
Create a clean, modern SaaS explainer image: "Before Smart Agro — how an agri business used to run". The business sells fertilisers, bio-stimulants and crop-protection products to farmers through a sales team, an online store and WhatsApp. Style: a bento grid of 6 rounded cards on white, each showing one everyday problem as a small, realistic UI illustration, with a few playful hand-drawn notes. Honest and slightly chaotic INSIDE each card; the overall image stays neat, balanced and premium.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people photos (small round avatars or initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Cards: white, 24px rounded corners, thin light-grey border (#E5E7EB), very soft shadow, generous padding. ALL 6 CARDS EXACTLY THE SAME SIZE, with equal gaps between them.
- Each card: a small illustration panel on top (very light grey #F7F7F9, rounded), then a number "01" … "06" in Smart Agro red (#D01A1B), a bold near-black title (#0F172A) and one short grey line (#64748B) under it.
- UI inside the illustrations: Inter-style sans-serif, thin borders, simple line icons, muted greys. Whatever is broken is marked with small red/pink badges (#E11D48 text on #FFE4E6); "waiting" states use amber (#B45309 text on #FEF3C7).
- Handwritten notes: short phrases in a casual marker script, charcoal (#1F2937) with one key word in red (#D01A1B), each with a short curved marker arrow. EVERY NOTE STAYS INSIDE ITS OWN CARD'S BORDER, in the top-right corner of that card's illustration panel. Never put a note or an arrow in the gap between cards.

LAYOUT: 3 columns × 2 rows, all cards the same size.

Card 01 — "Leads everywhere"
Line: "Enquiries came in on WhatsApp, Facebook, Instagram and forms, never in one list."
Illustration: 4 stacked source rows, each with a simple line icon (chat bubble, thumbs-up, camera, form) and the platform name as plain text, plus a green unread badge: "WhatsApp · 312 new", "Facebook ads · 86 new", "Instagram DMs · 41 new", "Website form · 19 new". A small red badge across the bottom row: "Not in one list".
Note inside the card: "Where's the full list?" ("list" in red), arrow pointing at the red badge.

Card 02 — "Leads shared unfairly"
Line: "Some sellers were flooded while others waited for work."
Illustration: 3 seller rows, each with an initials avatar, a name and a horizontal bar: "Rahul Deshmukh · 146 leads" (long bar, red badge "Overloaded"), "Priya More · 12 leads" (short bar), "Amit Kulkarni · 3 leads" (tiny bar, amber badge "Waiting").
Note inside the card: "Not fair" ("fair" in red), arrow pointing at "Overloaded".

Card 03 — "Follow-ups slipped through"
Line: "Farmers asked about a product and nobody called back in time."
Illustration: 3 lead rows, each with a missed-call icon, a product and a farmer's name with a masked number, and a red badge: "Enquiry · Chilli Special" / "Ganesh Pawar · +91 98xxx 42117" / "5 days, no call"; "Enquiry · Maple EM-1" / "Sunita Jadhav · +91 97xxx 30564" / "3 days, no call"; "Price query · Hunter Plus" / "Mahesh Shinde · +91 99xxx 18823" / "Missed call".

Card 04 — "Paying per WhatsApp message"
Line: "Bulk WhatsApp meant a third-party provider billing every message."
Illustration: a small monthly bill card titled "WhatsApp provider · September" with rows "Messages sent · 38,400", "Rate per message · ₹0.78", a divider, and "Total · ₹29,952" in bold, plus a red badge "Every month".
Note inside the card: "Paying per message" ("per message" in red), arrow pointing at the total.

Card 05 — "Stock in separate registers"
Line: "Each godown kept its own count, so nobody knew what was really there."
Illustration: two small side-by-side godown cards with a warehouse icon: "Godown 1 · Nashik" / "Maple EM-1 · 120 in stock" (green pill), and "Godown 2 · Jalgaon" / "Maple EM-1 · ?" (grey question mark, amber pill "Not updated"). Below them a thin red strip: "Order #2291 stuck · out of stock".

Card 06 — "Books never matched"
Line: "Orders, stock and accounts disagreed every time GST was due."
Illustration: three small figure tiles in a row: "Orders · ₹9,80,000", "Books · ₹9,12,500", "GST return · ?" (greyed), joined by a red "≠" circle between the first two, and a red badge under them: "Mismatch at filing time".
Note inside the card: "Numbers never matched" ("never" in red), arrow pointing at the "≠".

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no extra text, no invented names or numbers. Use ONLY the names given.
- No official third-party logos: WhatsApp, Facebook and Instagram appear only as plain text with simple line icons.
- Card titles must stay readable when the whole image is shown at 1200 px wide.
- Neat and balanced overall: the "mess" lives inside the small illustrations, not in the layout. Every note stays inside its own card.
- No watermark, no device frames, no browser chrome, no background scenery.
```
</details>

<details><summary>Smart Agro showcase hero (T3): for <code>/work/smart-agro</code>, prepared 2026-09-27, USED 2026-09-28 → <code>smart-agro/hero.webp</code></summary>

Modelled on the UnSkills hero (dashboard + 4 floating cards + 5 hand-drawn notes). The
dashboard figures are Smart Agro's real ones (the owner already chose to show them). The
floating cards use demo data in the client's context: products from smartagrocare.in
(Virat + Panchgavya Combo, Maple EM-1, Hunter Plus, Flower Booster) and Maharashtra
names and towns. Attach the dashboard screenshot (names blurred) and the logo. When it
comes back: flatten to `public/work/smart-agro/hero.webp` and point `hero` in
`lib/showcases.ts` at it (the homepage card keeps `smart-agro-mockup.webp`).

```
Create a premium SaaS hero image for a software agency case study of "Smart Agro", a complete business management system for an agriculture company that sells fertilisers, bio-stimulants and crop-protection products through a sales team, an online store and WhatsApp. Show the software UI DIRECTLY: no laptop, no phone, no tablet, no monitor, no device of any kind, no browser chrome. Style: a clean product-launch explainer with floating UI cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px). If 16:9 isn't possible, use the closest landscape size.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no props, no hands, no people.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT — THE DASHBOARD WINDOW (centre, about 66% of the image width)
- A flat, front-facing app window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on the white background. It is just the UI panel itself: no device frame, no bezel, no stand.
- Recreate the attached Smart Agro dashboard faithfully (same layout, colours, icons, Plus Jakarta Sans / Inter-style font), fully filled:
  • Left sidebar, forest green (#0F5132) with white text: the Smart Agro logo tile + "Smart Agro" / "LAXMI AGRO CRM". "Dashboard" active (leaf-green pill #22A447). "SALES & CRM": Leads, Pending Activities (red "99+" badge), Targets, Customers. "AFFILIATE": Affiliate Applications, Affiliate Commissions. "OPERATIONS": Products, Product Reviews, Website, Blog, Inventory, Quotations, Orders. A user card at the bottom: green "A", "Aviral", "Admin".
  • Top bar: "Good morning, Aviral ☀️" / "Here's what's happening with your business today."; a bell with a red "3" badge; a user pill with a green "A", "Aviral", "Admin" and a chevron.
  • Four stat cards (pastel icon tile, uppercase label, bold value, small sparkline): "TOTAL REVENUE" ₹56,40,104 · "↑ 140% vs last 7 days"; "TOTAL ORDERS" 2,678 · "42 today"; "TOTAL LEADS" 11,898 · "↑ 362% vs last 7 days"; "TOTAL PRODUCTS" 70 · "5 new this month".
  • Alert strips:
    – amber: "You need to talk to 5,947 leads" / "No status change or note for over 24 hours. Tap to open the follow-up list."
    – amber: "Stock is zero — 2 orders are waiting. Refill the stock." / "No invoice or dispatch until refilled."
    – soft red: "4 products in negative stock — restock needed" / "Sold beyond available stock."
    – two half-width strips: amber "115 awaiting dispatch" / "Tap to manage queue"; soft red "26 low stock products" / "Tap to restock".
  • Bottom row (may be slightly cut by the window's lower edge): "Sales Overview" (Last 7 days, a smooth leaf-green area chart, 20 Sep → 26 Sep) and "Leads by Source" (a donut with "11,898" / "Total"; WhatsApp 86%, Manual 8%, Facebook 3%, Instagram 2%, Phone 1%).

FLOATING CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–5°, overlapping the window's edges slightly, as if popping out of the UI)
- Top-left: "Monthly Sales", a smooth leaf-green (#22A447) line chart Apr → Sep with a light green fill, y-axis ₹0 / ₹3L / ₹6L / ₹9L / ₹12L, the peak labelled in a small green tag "Sep · ₹11,20,000".
- Bottom-left: "Leads this week", 7 leaf-green bars Mon → Sun, with a small green chip "↑ 362% vs last 7 days".
- Right: "Recent Orders", 4 rows, each with a small green box icon, a customer name and town, a product, an amount and a status pill:
  "Sandeep Patil · Nashik" · "Virat + Panchgavya Combo" · "₹1,700" · green "Delivered"
  "Anil Jadhav · Pune" · "Maple EM-1" · "₹1,000" · blue "Dispatched"
  "Suresh Pawar · Ahmednagar" · "Hunter Plus" · "₹1,400" · blue "Dispatched"
  "Vikas Shinde · Jalgaon" · "Flower Booster" · "₹600" · green "Delivered"
- Bottom-right: a small chip with a green chat-bubble icon (a plain line icon, not the official WhatsApp logo) and "Follow-up sent on WhatsApp ✓".

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in Smart Agro red (#D01A1B). Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in red (#D01A1B), slightly tilted. They sit in the white space and never cover any UI text, number or chart.
Add exactly these 5:
a) From "Monthly Sales" → curved arrow to the "TOTAL REVENUE ₹56,40,104" card. Note: "Sales tracked live" ("live" in red).
b) From "Leads this week" → curved arrow to the "TOTAL LEADS 11,898" card. Note: "Leads up 362%" ("362%" in red).
c) From "Recent Orders" → curved arrow to the "115 awaiting dispatch" strip. Note: "Order to dispatch, one flow" ("one flow" in red).
d) Top centre, above the window: note "Every godown. One dashboard." ("One" in red) with a short arrow curving down into the dashboard.
e) From the WhatsApp chip → short arrow to the "You need to talk to 5,947 leads" strip. Note under the chip: "Follow-ups on autopilot" ("autopilot" in red).

LOGO (copy the attached Smart Agro logo exactly; do not redesign it)
- Used only inside the dashboard's sidebar tile: the "Smart Agro" wordmark with "Smart" in red and "Agro" in green, exactly as in the attached file.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states, no zero values: every card, chart and list is filled.
- Clean, balanced, generous spacing; the arrows guide the eye without clutter; nothing overlaps the dashboard's numbers.
- No official third-party logos (WhatsApp, Facebook and Instagram appear only as plain text or simple line icons).
- No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Smart Agro v2 (hub, 5 + 5 features): refresh of the homepage card, prepared 2026-09-27</summary>

The owner asked for the card to also show WhatsApp campaigns, targets, products, stock,
low stock and product reviews. Same hub layout as the version above, with 5 features a
side. Attach the Smart Agro dashboard screenshot (names blurred) or, failing that, the
current card image as the dashboard reference, plus the logo from
`https://www.smartagrocare.in/smart-agro-cr.png`. If 10 features look crowded, drop
"Product reviews" and "Low-stock alerts" to get back to the 4 + 4 that worked.

```
Create a premium, clean SaaS feature image for "Smart Agro", a complete business management system for agriculture companies. Idea: ONE real system in the centre, its features around it, each connected by a thin arrow to the exact part of the dashboard it powers. The dashboard must look like a real, fully working product. Clean and balanced, never cluttered. Show the software UI directly: no laptop, no phone, no device, no browser chrome.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no texture, no props, no hands, no people, no logo outside the dashboard.
- About 5% white margin on the left, right and top; nothing touches the edges. The dashboard window may run off the bottom edge.

TYPE & COLOUR
- Geometric sans-serif throughout (Plus Jakarta Sans / Inter style).
- Headline: bold, near-black #0F172A. Feature titles: bold, near-black #0F172A. Feature lines: regular, grey #64748B.
- Accent: leaf green #22A447. Dashboard sidebar: forest green #0F5132 with white text.
- Feature icons: simple line icons in leaf green inside identical soft-green rounded squares (#EAF7EE), all the same size.

LAYOUT: 3 COLUMNS

1) HEADLINE (top ~12%, centred, one compact line, about 5% of the image height)
"One system. Every part of your agri business." with "Every part of your agri business." in leaf green. No subheadline, no chips, no logo pill.

2) CENTRE: THE DASHBOARD (≈54% of the image width, centred)
A flat app window: 16px rounded corners, a thin light-grey border, a large, very soft shadow. Recreate the attached Smart Agro dashboard EXACTLY (same layout, spacing, colours, icons, font), fully filled:
• SIDEBAR (forest green, white text): the Smart Agro logo tile + "Smart Agro" / "LAXMI AGRO CRM"; "Dashboard" active (leaf-green pill); "SALES & CRM": Leads, Pending Activities (red "99+" badge), Targets, Customers; "AFFILIATE": Affiliate Applications, Affiliate Commissions; "OPERATIONS": Products, Product Reviews, Website, Blog, Inventory, Quotations, Orders; thin dividers between groups; a user card at the bottom (green "A", "Aviral", "Admin").
• TOP BAR: "Good morning, Aviral ☀️" / "Here's what's happening with your business today."; a bell with a red "3"; a user pill (green "A", "Aviral", "Admin", chevron).
• STAT CARDS (4, each with a pastel icon tile, an uppercase label, a bold value and a small sparkline): "TOTAL REVENUE" ₹56,40,104 · "↑ 140% vs last 7 days"; "TOTAL ORDERS" 2,678 · "42 today"; "TOTAL LEADS" 11,898 · "↑ 362% vs last 7 days"; "TOTAL PRODUCTS" 70 · "5 new this month".
• ALERT STRIPS:
  – amber: "You need to talk to 5,947 leads" / "No status change or note for over 24 hours. Tap to open the follow-up list."
  – amber: "Stock is zero — 2 orders are waiting. Refill the stock." / "No invoice or dispatch until refilled. Open Orders to see what's short and process them."
  – soft red: "4 products in negative stock — restock needed" / "Sold beyond available stock. Restocking absorbs the shortfall automatically."
  – two half-width strips: amber "115 awaiting dispatch" / "Tap to manage queue"; soft red "26 low stock products" / "Tap to restock".
• BOTTOM: "Sales Overview" (a "Last 7 days" dropdown; a smooth leaf-green area chart, y-axis 0 / 20k / 40k / 60k / 80k, x-axis 20 Sep → 26 Sep, peak on 24 Sep) and "Leads by Source" (a donut with "11,898" / "Total"; legend WhatsApp 86%, Manual 8%, Facebook 3%, Instagram 2%, Phone 1%; a footer "Top Source · WhatsApp · 86%").

3) LEFT COLUMN (≈19% of the width, right-aligned, 5 features evenly spaced down the dashboard's height; each = icon tile + bold title + one grey line, no boxes, no cards):
- "Leads, auto-distributed" / "Every lead to the right seller, instantly" (icon: people)
- "Team roles & targets" / "Sellers see only their leads and goals" (icon: target)
- "Product reviews" / "Every customer review in one place" (icon: star)
- "Quotations" / "Professional quotes in a few clicks" (icon: document)
- "E-commerce & orders" / "Online store to dispatch, one flow" (icon: shopping bag)

4) RIGHT COLUMN (same size and style, left-aligned, 5 features evenly spaced):
- "Accounting & GST" / "Books, GST returns and reports" (icon: ₹)
- "WhatsApp campaigns" / "Bulk follow-ups, no third-party BSP fees" (icon: WhatsApp-style chat bubble, drawn as a plain line icon, not the official logo)
- "Stock in every godown" / "Live stock and batches, godown by godown" (icon: warehouse)
- "Low-stock alerts" / "Restock before an order is stuck" (icon: bell with alert)
- "Social media leads" / "Facebook & Instagram ads sync straight in" (icon: megaphone)

5) CONNECTOR ARROWS: 10 thin smooth curves (1.5px, soft green #9AD9AE) with small arrowheads. Each starts beside its feature's icon and enters the dashboard window only at its edge, next to its target. They never cross each other and never cross any text:
Left side → sidebar items: Leads → "Leads"; Team roles & targets → "Targets"; Product reviews → "Product Reviews"; Quotations → "Quotations"; E-commerce & orders → "Orders".
Right side → main area: Accounting & GST → the stat card row; WhatsApp campaigns → the "5,947 leads" strip; Stock in every godown → the "4 products in negative stock" strip; Low-stock alerts → the "26 low stock products" strip; Social media leads → the "Leads by Source" donut.

LOGO (copy the attached Smart Agro logo exactly; do not redesign it)
- Used only inside the dashboard's sidebar tile: the "Smart Agro" wordmark, "Smart" in red and "Agro" in green, as in the attached file.

QUALITY RULES
- Every word and number exactly as written above, sharp and legible. No gibberish, no extra text, no invented names or numbers. Use ONLY the names given; never copy names from the reference screenshot.
- No empty states: every tile, strip and chart is filled exactly as described.
- Only: the headline, the dashboard, 10 features, 10 arrows. No handwritten notes, no decorations, no badges. Symmetrical and balanced: the two feature columns mirror each other in size and spacing.
- Feature titles and the headline must stay readable when the image is shown at 1200 px wide.
- No official third-party logos (WhatsApp, Facebook, Instagram appear only as plain text or simple line icons). No devices, no watermark, no captions, no borders.
```
</details>

<details><summary>Spectrum CRM (T7 explainer bento): for the Spectrum homepage card, pending the owner's decision</summary>

Before generating: WhatsApp & Email is listed under "Upcoming Modules" in the real CRM.
Only show it if it's live; otherwise swap that card for Booking & Quotation Management.
Attach the dashboard screenshot.

```
Create a clean, modern SaaS marketing image for "Spectrum CRM", an all-in-one CRM built for tour & travel companies. Style: a bento grid of rounded feature cards, each with a soft icon tile, a bold title, a one-line description and a compact, realistic UI illustration. Add a few playful hand-drawn arrows and short handwritten notes that link the cards, like a product-launch explainer. Someone seeing it for the first time must understand in 3 seconds: (1) this is a CRM for travel businesses, (2) what it can do.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No gradient, no texture, no devices, no people photos (small round avatars inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached Spectrum CRM dashboard screenshot: clean white UI, Inter-style sans-serif, thin light-grey borders, soft pastel stat tiles (light blue, mint, lavender, peach), line icons.
- Brand accent: Spectrum sunshine yellow (#FFC61A) for the active/highlight states, with deep ink text (#111827). Secondary accents: soft orange (#F97316), mint green (#10B981), sky blue (#3B82F6).
- Cards: white or very lightly tinted fill, 24px rounded corners, thin light-grey border, very soft shadow, generous padding.
- Each card header: a rounded-square pastel icon tile on the left, then a bold title (near-black) and one short grey subtitle line.
- Hand-drawn elements: 4–5 loose curved arrows plus short handwritten notes in a casual marker script, in the brand orange/yellow and ink. They connect cards or point at key numbers. Keep them light; never cover UI text.

LAYOUT, TOP TO BOTTOM

1) HEADLINE (top ~14%, centred)
- Small pill on the left of the headline: the Spectrum logo from the screenshot (the script "Spectrum" wordmark with the little palm/sun doodle and "Tour-Travels" underneath) + "Spectrum CRM".
- Headline, one line, bold near-black: "The All-in-One CRM for Tour & Travel Companies", with "Tour & Travel" in yellow-orange (#F59E0B).
- Under it, one row of small grey module chips: Leads · Quotations · Bookings · Invoices · Vendors · Promo Codes · Reviews · Website Builder · Reports

2) TOP ROW: 2 LARGE CARDS

Card A (left, ~56% width) — icon: dashboard grid. Title: "Everything on one dashboard". Subtitle: "Leads, bookings, revenue and payments — live."
UI illustration: a compact version of the attached dashboard.
- A slim left sidebar: the Spectrum logo, then "Dashboard" (active, yellow pill), Lead Management, Tour Package Builder, Quotation Management, Booking Management, Invoice Generator, IVR System.
- Top: "Admin Dashboard" / "Welcome back, Aviral".
- Five pastel stat tiles: "Total Leads 248 ↑18%", "Revenue ₹18.4L ↑22%", "Upcoming Tours 23 · 6 this week", "Total Bookings 64", "Pending Payments ₹3.2L · Need attention".
- A small "Recent activity" list: "Payment received ₹50,622 via UPI · 2m ago", "New lead: Rohan Mehta — Kashmir 5N/6D", "Booking confirmed: Goa 3N/4D · 4 pax".
- Handwritten note with an arrow pointing at the Revenue tile: "Your whole business, at a glance".

Card B (right, ~44% width) — icon: map/route. Title: "Tour Package Builder". Subtitle: "Build a day-wise itinerary, get the price instantly."
UI illustration: a vertical flow of 4 small step cards joined by curved arrows:
- "Day 1 · Srinagar" — Arrival, houseboat stay, Shikara ride (tiny photo thumbnail)
- "Day 2 · Gulmarg" — Gondola ride, hotel check-in
- "Day 3 · Pahalgam" — Betaab Valley, transfers
- Final card: "Kashmir 5N/6D · ₹42,500 per person" with a yellow button "Send quotation"
- A small floating chip beside the flow: "Hotels + transfers auto-added".
- Handwritten note with an arrow: "Itinerary to quote in minutes".

3) BOTTOM ROW: 4 EQUAL CARDS

Card C — icon: phone with signal. Title: "Built-in IVR system". Subtitle: "Every call routed, recorded and logged."
UI: an incoming-call card "+91 98•••• 4521 · Incoming", an IVR menu list "1 · Domestic tours  2 · International  3 · Existing booking", a small arrow to "Routed to Neha · Sales", a tiny audio waveform with "Recording 02:14", and a green chip "Lead auto-created".
Handwritten note: "No missed enquiry".

Card D — icon: chat bubble (WhatsApp-green). Title: "WhatsApp built in". Subtitle: "Quotes, reminders and payment links in chat."
UI: a short chat. Outgoing green bubble with a PDF attachment "Kashmir_5N6D_Quote.pdf · 1.2 MB"; outgoing bubble "Pay 30% advance to confirm" with a small "Pay ₹12,750" button; incoming bubble "Done! Booking confirmed 🙌"; blue double ticks.
Handwritten note: "Replies faster, books faster".

Card E — icon: rupee/wallet. Title: "Accounts & invoicing". Subtitle: "Invoices, vendors, petty cash and profit."
UI: an invoice row "Invoice #SPT-1042 · ₹84,000 · Paid" (green pill), a mini bar chart "Income vs Expenses" (6 months, yellow and grey bars), and two small lines "Vendor payable ₹1,20,000" and "Petty cash ₹8,450".

Card F — icon: people/team. Title: "Workforce management". Subtitle: "Attendance, tasks and salaries in one place."
UI: "Today's attendance 18/20 present" with a thin progress bar and 5 small overlapping avatars; a mini task list with checkboxes: "✓ Call back Kerala leads — Riya", "✓ Send Bali quotation — Aman", "○ Confirm Goa hotel — Karan"; a small chip "Salaries processed ✓".

QUALITY RULES
- Every word must be spelled exactly as written above, sharp and legible. No gibberish, no invented extra text, no random numbers beyond those given.
- All demo names, numbers and destinations are as written. Currency is ₹ with Indian number formatting.
- Card titles and the headline must stay readable when the whole image is shown at 1200 px wide. Keep UI text inside cards small but crisp.
- Balanced, uncluttered, generous spacing; equal gaps between cards.
- No watermark, no device frames, no browser chrome, no background scenery.
```
</details>

<details><summary>Quick Hotels PMS (T7 explainer bento): for the "Quick Hotels CRM" homepage card</summary>

Before generating: keep only the booking platforms actually connected in the
channel-manager card. Attach the PMS dashboard screenshot.

```
Create a clean, modern SaaS marketing image for "Quick Hotels PMS", a complete property-management system for a hotel chain. Style: a bento grid of rounded feature cards, each with a soft icon tile, a bold title, a one-line description and a compact, realistic UI illustration fully filled with data. Add a few playful hand-drawn arrows and short handwritten notes that link the cards, like a product-launch explainer. Someone seeing it for the first time must understand in 3 seconds: (1) this is software to run hotels, (2) everything it can do.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No gradient, no texture, no devices, no people photos (small round avatars and initials inside the UI are fine).
- About 4% white margin on all sides. Nothing touches the edges.

VISUAL LANGUAGE
- Match the attached Quick Hotels dashboard screenshot exactly in style: deep navy sidebar (#0B1B3F) with white text, royal-blue active states and buttons (#2563EB), white cards with thin light-grey borders, soft pastel icon tiles (mint, lavender, sky blue, peach), rounded geometric sans-serif (Nunito / Plus Jakarta Sans style), line icons.
- Secondary accents: mint green (#10B981) for paid/success, amber (#F59E0B) for pending, soft red (#EF4444) for dues.
- Feature cards: white, 24px rounded corners, thin light-grey border, very soft shadow, generous padding.
- Each card header: a rounded-square pastel icon tile on the left, then a bold title (near-black #0F172A) and one short grey subtitle line.
- Hand-drawn elements: 4–5 loose curved arrows plus short handwritten notes in a casual marker script, in royal blue and amber. They connect cards or point at key numbers. Keep them light; never cover UI text.

LAYOUT, TOP TO BOTTOM

1) HEADLINE (top ~14%, centred)
- Small pill on the left: the Quick Hotels logo (a bold rounded stacked "Quick / Hotels" wordmark with three speed lines off the "Q" and a house with a tick in place of the "o" in "Hotels", in royal blue) + "Quick Hotels PMS".
- Headline, one line, bold near-black: "Run Every Hotel from One Dashboard", with "One Dashboard" in royal blue (#2563EB).
- Under it, one row of small grey module chips: Hotels · Rooms & Inventory · Amenities · Services · Invoices · Leads · KYC Verification · Payouts · Settings

2) TOP ROW: 2 LARGE CARDS

Card A (left, ~56% width) — icon: dashboard grid. Title: "Live dashboard". Subtitle: "Bookings, occupancy and revenue across every property."
UI illustration: a compact, fully filled version of the attached dashboard.
- A slim navy sidebar: the Quick Hotels logo in white, then "Dashboard" (active, blue pill), Hotels, Bookings, Check-in / out, Inventory, Finance, Reports, Users & roles.
- Top: "Good afternoon, Akhil 👋" / "Welcome back! Here's what's happening today." and a blue button "View all bookings →".
- Four stat tiles: "Gross bookings this month ₹14,82,600 ↑18%" (mint ₹ icon), "Check-ins today 38" (lavender), "Active hotels 12" (blue), "Occupancy rate 86%" with a small blue progress ring.
- A strip "Departing today · pending dues" with two rows: "Rahul Verma · Room 204 · Quick Hotel - GK2 · ₹3,450 due · Collect" and "Neha Kapoor · Room 112 · Quick Hotel - Karol Bagh · ₹1,980 due · Collect" (amounts in soft red, small blue "Collect" buttons).
- A mini "Revenue · Last 7 days" smooth blue area chart with the total "₹4,26,800".
- Handwritten note with an arrow pointing at the occupancy ring: "All 12 hotels, one screen".

Card B (right, ~44% width) — icon: sync arrows. Title: "Channel manager sync". Subtitle: "Every booking platform, synced in real time."
UI illustration: a central rounded hub card "Quick Hotels PMS" with two-way curved arrows to 7 small white platform chips around it, each showing only the platform name as text: "quickhotels.co", "Booking.com", "MakeMyTrip", "Goibibo", "Agoda", "Expedia", "Airbnb".
- Below the hub, a live feed of 3 small rows with green dots:
  "New booking · Booking.com · Deluxe Room · Quick Hotel - Whitefield · 27–29 Sep · synced 2s ago"
  "New booking · MakeMyTrip · Twin Room · Quick Boutique | Rishikesh Hills · synced 14s ago"
  "Rates updated on 7 channels · just now"
- A green chip: "Rooms & rates auto-updated everywhere".
- Handwritten note with an arrow: "No more double bookings".

3) BOTTOM ROW: 4 EQUAL CARDS

Card C — icon: door with arrow. Title: "Check-in / check-out". Subtitle: "Front desk in one tap."
UI: a guest card "Ananya Gupta · Room 305 · 2 guests · 26–28 Sep" with a green chip "ID verified ✓" and a blue "Check in" button; underneath, three small counters in a row: "Arriving 12", "In-house 64", "Departing 29".

Card D — icon: rupee/wallet. Title: "Finance & payouts". Subtitle: "Split payments, GST and hotel payouts."
UI: a split-payment row "Booking #QH-8842 · ₹6,490 → 30% advance ₹1,947 paid ✓ · balance ₹4,543 at check-in"; a small stacked bar "Revenue ₹14.8L = Payouts to hotels ₹10.8L · Commission ₹1.9L · GST ₹2.1L"; an invoice row "INV-QH-2231 · ₹6,490 · Paid" (green pill).
Handwritten note: "Every rupee accounted for".

Card E — icon: bar chart. Title: "Reports". Subtitle: "Occupancy, ADR and RevPAR by city."
UI: a mini horizontal bar chart "Occupancy by city": "Delhi 91%", "Noida 88%", "Bengaluru 84%", "Rishikesh 78%" (royal-blue bars); two small KPI chips "ADR ₹2,450" and "RevPAR ₹2,108"; a small "Export" button.

Card F — icon: shield with person. Title: "Users & roles". Subtitle: "Give every staff member just the access they need."
UI: a staff list of 4 rows, each with an initials avatar, a name and a role pill: "Akhil Pratap · Owner", "Priya Nair · Hotel Manager", "Rohit Das · Front Desk", "Sana Ali · Accountant". Beside it, a small permission grid with toggles: Bookings ✓ · Check-in ✓ · Finance ✓/✕ · Reports ✓ (blue toggles on, grey off).
Handwritten note: "Staff see only what they should".

QUALITY RULES
- Every word must be spelled exactly as written above, sharp and legible. No gibberish, no invented extra text, no random numbers beyond those given.
- All names, hotels, cities and numbers are as written. Currency is ₹ with Indian number formatting.
- No empty states anywhere: every tile, chart and list is filled.
- Card titles and the headline must stay readable when the whole image is shown at 1200 px wide.
- Balanced, uncluttered, generous spacing; equal gaps between cards.
- No official platform logos (platform names as plain text chips only), no watermark, no device frames, no browser chrome, no background scenery.
```
</details>
