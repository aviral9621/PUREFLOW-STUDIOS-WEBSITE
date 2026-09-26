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
| "Give me the prompt for <one section> of X" | Only that prompt (§6 templates), filled in with X's real details. **Don't build code instead of a prompt.** |
| "Push it" | Commit on `main` with a descriptive message, then push. Never commit or push without being asked. |

Files you will touch:

| What | Where |
|---|---|
| Homepage work cards | `components/sections/WorkStack.tsx` (`FEATURED` array only) |
| Showcase page data | `lib/showcases.ts` (one `Showcase` entry per project) |
| Showcase page layout | `components/showcase/ShowcasePage.tsx` (rarely; only for new section types) |
| Card copy (name, one-liner) | `lib/caseStudies.ts` (`card.name`, `card.blurb`) |
| Images | `public/work/<slug>-*.webp` (homepage) and `public/work/<client>/*.webp` (showcase) |
| SEO for a showcase URL | `lib/seo.ts` (automatic) + the entry in `scripts/prerender.mjs` |
| Image scripts | `scripts/showcase/*.py` (§7) |

---

## 1. The two surfaces

### A. Homepage work section (`WorkStack.tsx`, right under the hero)
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

### Homepage card: `components/sections/WorkStack.tsx`, `FEATURED` array
```ts
{
  slug: 'quick-hotels',                       // must exist in lib/caseStudies.ts
  glow: '255,47,134',                         // tint for the fallback card style
  mockup: '/work/quick-hotels-mockup.webp',   // 2:1 on white → replaces the screenshot frames
  logo: { src: '/work/quick-hotels-logo.webp', width: 333, height: 160 },
},
```
The array order is the card order. The card's one-liner is `card.blurb` in `lib/caseStudies.ts`.

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
}
```
- Every image in one card row must have the **same width/height** (§7).
- `App.tsx` renders a showcase for `/work/<slug>` automatically, ahead of the older
  `CaseStudyPage`. `lib/seo.ts` builds the title/description/canonical from it.
  **Also update** that URL's entry in `scripts/prerender.mjs` (h1/title/description).
- Old URLs that should open this showcase go in `matchSlugs` (they canonicalise to `slug`).

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
| **Quick Hotels** (website) | ✅ T1 mockup + black logo | ⏳ old `CaseStudyPage` |
| **Herbal Vantage** (website) | ⏳ screenshot fallback, name as text | ⏳ old page |
| **Quick Hotels PMS** (`ecommerce-retail-platform`, card named "Quick Hotels CRM") | ⏳ T7 prompt ready (below); rename to "Quick Hotels PMS" pending the owner's OK | ⏳ old page |
| **Spectrum Tour & Travels** | ⏳ website screenshot fallback. A Spectrum **CRM** T7 prompt is ready (below); the owner decides whether the card becomes the CRM | ⏳ old page |
| UnSkills mobile app / UnSkills website | not started. Separate showcases later | not started |

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

### Quick Hotels (website): homepage card

The mockup prompt (T1) was filled with the quickhotels.co homepage: the glass nav, "Find
Your *Perfect* Stay" with "Perfect" in gold italic, and the booking bar with WHERE TO /
CHECK-IN / CHECK-OUT / GUESTS & ROOMS plus a blue Search button. The logo is the stacked
"Quick / Hotels" wordmark (from `https://www.quickhotels.co/logo.webp`, turned black).
Files: `public/work/quick-hotels-mockup.webp`, `public/work/quick-hotels-logo.webp`.

### Prepared, not yet used

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
