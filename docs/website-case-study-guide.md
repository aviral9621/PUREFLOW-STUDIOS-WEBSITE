# Website Case Study Guide

> **For Claude, read this first.** A teammate will paste a website link and say
> something like *"make the website case study for https://…"*, *"add this website
> to our work"* or *"give me the prompts for this site"*. When that happens, follow
> **Phase A** below from start to finish **without waiting to be told each step**:
> capture the site, build the page with real screenshots, write every image prompt,
> and finish with the **hand-off message** (§5). Then stop. When the teammate comes
> back with the generated images, follow **Phase B**. Commit or push only when the
> teammate asks.
>
> This guide is self-contained. For deeper background (the software case-study
> layout, the image scripts in detail, the full log of past projects) see
> `docs/project-showcase-playbook.md`.

---

## 1. What you are making

A **website case study** is the project page at `pureflowstudios.in/work/<slug>`
for a website Pureflow built, plus that project's **card** on the homepage
(Websites tab), on `/work` and on the Website services page.

The page is `components/showcase/WebsiteShowcase.tsx`. It's used automatically
for any showcase in `lib/showcases.ts` that has a `site` block. Top to bottom:

| # | Section | What it shows | Comes from |
|---|---|---|---|
| 1 | **Hero** | "WEBSITE CASE STUDY", client logo, headline, focus chips, the hero image | `headline`, `focus`, `hero` (prompt **W2**) |
| 2 | **The BRIEF.** | 2–3 sentences + a facts box (Industry, Delivered, Services, Stack) | `brief`, `facts` |
| 3 | **What it had to DO.** | 3–4 numbered goals | `site.goals` (coded) |
| 4 | **The SITEMAP.** | the site's real menu as a tree | `site.sitemap` (coded) |
| 5 | **How we BUILT IT.** | 5 steps of our website process | `site.build` (coded) |
| 6 | **Page by PAGE.** | 3–4 key pages: name, path, what it does, chips, then a full-width image | `site.pages` (prompt **W3**, one per page) |
| 7 | **Built for every SCREEN.** | 4 real phone screenshots in phone frames | `site.screens` (captures, no prompt) |
| 8 | **Under the HOOD.** | 8 features with icons | `site.builtIn` (coded) |
| 9 | **The design SYSTEM.** | colours, type, components | `systemImage` (prompt **T6**) |
| 10 | **The site TODAY.** | 4 real numbers from the live site | `impact` |
| 11 | In their WORDS. + **LET'S BUILD YOURS.** | testimonial (only if real) + call to action | `testimonial?`, `ctaLead` |

The card (homepage, /work, services) uses a 2:1 laptop + phone mockup (prompt **T1**).

**Before the images exist**, the page already works: the hero and page images are
the real desktop screenshots shown in a coded browser frame (`frame: 'browser'`),
and the card shows the real screenshots. The generated images replace them in
Phase B. Wide images open full screen on tap (`Zoomable` in `parts.tsx`), so the
small callout text is readable on phones.

**The look is always Pureflow's** (near-black page, Instrument Serif italic lead-in +
Anton gradient word, Inter body). The client's colours and fonts appear only *inside*
the images and the design-system sheet. You don't style anything per client.

---

## 2. Rules (never break these)

1. **Real material only.** Every word, number, menu item, colour and font comes from
   the live site (the captures and `site-facts`). Never invent metrics, results,
   client quotes or features. If a number isn't on the site, it doesn't go on the page.
   Label the client's own claims as theirs ("2,000+ enrolled, as the institute reports").
2. **No link to the live site by default.** Leave `site.url` and `links` out, so
   there's no "Visit" button or live link. Add them only if the teammate says the
   client is happy to be linked. The domain may appear as plain text.
3. **People's names:** never put real customers' names in prompts. Use initials
   ("AS", "AM") for reviews. Tell the image tool "never copy names from the screenshot".
4. **Claims you can't verify from the site** (e.g. "connected to their CRM", "built in
   4 weeks"): write them only if the teammate confirmed, or list them as a question in
   the hand-off message.
5. **One showcase per product.** A client's website and their software get separate
   pages (the software uses the other layout).
6. `git pull` before starting. **Commit/push only when asked.** After a push, check the
   live page (§6 B6).
7. Keep each image ≤ ~180 KB WebP. No iframes or live embeds anywhere.

---

## 3. Phase A: from a link to the prompts (do it all, then hand off)

### A0. Sync and name things
- `git pull`.
- Decide the **slug**: `<client>-website` (e.g. `unskills-education-website`). If the
  client already has a software showcase, keep its slug untouched.
- Images folder: `public/work/<slug-short>/` (e.g. `public/work/unskills-website/`).
- Ask nothing yet. Make sensible choices and list your assumptions in the hand-off.

### A1. Capture the site (automatic)
```bash
node scripts/showcase/capture_site.mjs https://www.example.com
```
This saves the homepage (desktop + phone + full page), the header **logo** and
`site-facts.json/.md` to `~/Downloads/<site>-website-stills/`, then **prints the
menu**. Pick the **3–4 key pages**: the ones that *do work* for the business, in this
order of preference:
1. the catalogue or listing (courses, products, rooms, services);
2. a form or lookup (apply, book, verify, quote, checkout);
3. a trust or growth page (franchise/partners, about with registrations, reviews);
4. contact (only if nothing better).

Then capture them (the homepage is always included):
```bash
node scripts/showcase/capture_site.mjs https://www.example.com /courses /student/verify /franchise
```
If Chromium is missing: `npx playwright-core install chromium` (once).

### A2. Read the material
- **Look at every still** with the Read tool: `<page>-desktop.png`, `<page>-mobile.png`
  and `home-desktop-full.png` (it shows every homepage section). Note the exact words
  on screen, because the prompts must repeat them.
- Read `site-facts.md`: titles, descriptions, headings, menu and footer links, numbers,
  fonts and sizes, most-used button colours.
- Animated counters sometimes read "0+" in the facts. Take numbers from the full-page
  still or open the page in the browser and scroll to them.
- **Colours:** the facts list the most-used button colours. For anything else (banner
  gradients, floating buttons, badges), sample the still:
  ```bash
  python3 -c "
  from PIL import Image; import numpy as np
  im=np.array(Image.open('<still>.png').convert('RGB')); x,y=<X>,<Y>
  print('#%02X%02X%02X'%tuple(np.median(im[y-10:y+10,x-10:x+10].reshape(-1,3),axis=0).astype(int)))"
  ```
- **Logo:** `logo.<ext>` in the stills folder is the original. Make the black card version:
  `python3 scripts/showcase/black_logo.py ~/Downloads/<site>-website-stills/logo.png public/work/<client>-logo.webp`
  (skip if the client already has one in `public/work/`). It needs a transparent background.

### A3. Turn the captures into the page's interim images
```bash
python3 scripts/showcase/stills_to_webp.py ~/Downloads/<site>-website-stills public/work/<slug-short> home courses verify franchise
```
(page names = the capture names: `/student/verify` was saved as `student-verify`.)
This writes `<page>-desktop.webp` 1600×1000 (interim page images) and
`<page>-mobile.webp` 585×1266 (the "Every SCREEN" phones, which stay for good).

### A4. Write the data (four files)

**1) `lib/caseStudies.ts`**: a card entry (copy the UnSkills website entry as a template).
`card.name` (short), `card.showcaseLine` (what it is, ≤ ~32 chars, e.g. "Institute Website +
Student Zone"), `card.image` (the home desktop WebP), `snapshot`, `challenge`,
`whatWeBuilt`, `liveUrl: ''` (unless linking is allowed).

**2) `lib/showcases.ts`**: one `Showcase` with a `site` block. Template:
```ts
const XW = '/work/<slug-short>';
{
  slug: '<slug>',
  client: '<Client full name>',
  logo: { src: '/work/<client>-logo.webp', width: <w>, height: 160 },
  focus: ['<What it is>', '<Key job 1>', '<Key job 2>'],          // 2–3 chips
  headline: { lead: '<serif lead-in, ends mid-sentence>', word: '<2–3 WORDS.>' },
  hero: { src: `${XW}/home-desktop.webp`, width: 1600, height: 1000, alt: '…', frame: 'browser', url: '<domain>' },
  brief: '<who the client is + what the site had to do; **bold** the 2–3 key things>',
  facts: [
    { label: 'Industry', value: '…' },
    { label: 'Delivered', value: '<Website + …>' },
    { label: 'Services', value: 'UI/UX Design · Web Development · SEO' },
    { label: 'Stack', value: '<read from the site: e.g. React · Vite · Supabase · Vercel>' },
  ],
  problem: '', process: [], products: [],       // not used by the website layout
  site: {
    label: '<domain>',                          // no `url` → no "Visit" button (rule 2)
    goals: [{ title, text }, …],                 // 3–4: the jobs the site does, from its real features
    sitemap: [{ group: '<Menu item>', pages: ['<Sub page>', …] }, …],   // the real menu, ≤ 6 groups
    build: [                                    // our standard website process; adjust details to the site
      { title: 'Sitemap & content', text: 'Every <thing> mapped into one menu.' },
      { title: 'Wireframes', text: 'One template per page type: <listing, detail, form, …>.' },
      { title: 'Visual design', text: 'The <client> colours and <font> type, on <canvas>.' },
      { title: 'Build & connect', text: '<framework> on <host>, <data source>.' },
      { title: 'SEO & launch', text: 'A title, description and sitemap entry for every page.' },
    ],
    pages: [                                    // 3–4, same order as the menu
      { name: 'Home', path: '/', summary: '<what a visitor gets here>', features: ['<chip>', …],
        image: { src: `${XW}/home-desktop.webp`, width: 1600, height: 1000, alt: '…', frame: 'browser', url: '<domain>' } },
      …
    ],
    screens: [ { src: `${XW}/home-mobile.webp`, width: 585, height: 1266, alt: '… on a phone' }, … ],  // 4
    builtIn: [ { icon: 'search', title: '…', text: '…' }, … ],   // 8; icons: search form shield ticket star chat map seo login phone gauge cart
    todayNote: 'The numbers on <domain> today.',
  },
  palette: [ { name: '<Brand>', hex: '#……' }, … ],              // used until the T6 image arrives
  type: [ { family: '<Heading font>', role: 'Headings', weights: '…', google: '<Family:wght@…>' },
          { family: '<Body font>', role: 'Body & interface', weights: '…' } ],
  impact: [ { label: '<Thing>', value: '<number from the site>', caption: '<what it counts>' }, … ],  // 4, or [] to hide
  ctaLead: 'Need a website that <does what this one does>?',
}
```
Headline formula: `lead` = a short Instrument-Serif phrase, `word` = the Anton
gradient punchline, 2–3 words, ≤ ~20 characters so it fits a phone (e.g. *"The online
home of a"* **102-CENTRE NETWORK.**).

**3) `lib/workCards.ts`**: add to `FEATURED` (array order = card order in the tab):
```ts
{ slug: '<slug>', kinds: ['website'], glow: '<r,g,b of the brand colour>',
  shots: { desktop: '/work/<slug-short>/home-desktop.webp', mobile: '/work/<slug-short>/home-mobile.webp' },
  logo: { src: '/work/<client>-logo.webp', width: <w>, height: 160 } },
```
**4) `lib/services.ts`**: add the slug to `'service-website'` → `work`.

SEO is automatic: the prerender builds the page's title, description, canonical and
sitemap entry from this data.

### A5. Check it
```bash
npx tsc --noEmit -p .
npx vite build --outDir /tmp/pf-check     # must pass
```
Start the dev server (`npm run dev`, or the `pureflow-dev` preview), then:
```bash
node scripts/showcase/shoot_widths.mjs http://localhost:3000/work/<slug>
```
Look at the slices in `~/Downloads/<slug>-check/`: every section present, no broken
images, overflow 0 at every width, headline fits on the 390 slice, sitemap readable.
Also open the homepage Websites tab and check the new card.

### A6. Write the prompts
Fill the templates in §4 for: **T1** (card), **W2** (hero), **W3** × each key page,
**T6** (design system). How to fill them well:
- Open each still at full size and **copy every visible string** in reading order:
  top strip, menu (and which item is active), headline, sub-lines, buttons, cards,
  floating buttons. The image tool only gets text right when you spell it out.
- Give **every hex** (brand, banner gradient, buttons, badges, floating buttons).
- For the phone in T1 pick the cleanest mobile page (often the catalogue); for W2 pick
  the page that shows the site's signature feature (a form, a lookup, a booking).
- W3 callouts: pick the **3 real parts** of that page a visitor uses most (search,
  filters, one card, a form field, a step list, a review score), magnified.
- Handwritten notes: short (≤ 6 words), each about what the part *does for the business*.
- Never put real people's names in; use initials.

### A7. Hand off (end of Phase A)
Send the teammate the message in §5: where the stills are, then each prompt in its own
code block with its **Attach:** line, the follow-up fix lines, your assumptions and
questions, and the local link. Then stop and wait.

---

## 4. Prompt templates

Fill every `{{…}}`. Keep the structure; it's what makes the results consistent.

### T1: Homepage card (laptop + phone mockup, 2:1)
Attach: `home-desktop.png`, the chosen `<page>-mobile.png`, the logo.
```
Create a clean, premium, photorealistic product mockup for a web-design agency portfolio, showing ONE website ("{{CLIENT}}", {{a/an what it is}}) on a laptop and a smartphone.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No gradient, no vignette, no texture, no table, no props, no hands, no text outside the screens.

COMPOSITION
- A modern space-grey laptop (MacBook Pro style, thin black bezel) seen straight on, very slightly from above (about 5°), centred slightly left, screen about 62% of the image width.
- A modern smartphone (iPhone 15 Pro style, black frame, Dynamic Island) standing in front of the laptop's lower-right corner, overlapping its edge by about 10%, about 70% of the laptop screen's height.
- Both devices rest on one invisible floor line near the bottom (about 6% margin). About 8% white margin on the left, right and top. Only a very soft, short, neutral contact shadow. No reflections, no colour glow.
- Soft, even studio light. Crisp, Apple product-shot quality.

LAPTOP SCREEN — replicate the attached desktop screenshot ({{file}}) exactly, flat and undistorted:
- {{top strip: colour hex + every item}}
- {{header: logo; every menu item, which is active and how; header buttons}}
- {{hero: every headline, sub-line, card, button and badge, in reading order, with colours}}
- {{floating buttons, if any, with hexes}}

PHONE SCREEN — replicate the attached mobile screenshot ({{file}}) exactly:
- {{every visible block top to bottom, exact words}}

LOGO (copy the attached {{CLIENT}} logo exactly; do not redesign it)
- {{one-line description of the logo}}

QUALITY RULES
- All on-screen text sharp and spelled exactly as written above; no gibberish, no invented words, no extra UI.
- Colour palette: {{brand hexes, canvas, ink}}; {{heading font}}-style headings and {{body font}}-style body text, as in the screenshots.
- Minimal, clean, professional. No watermark, captions, badges or device logos.
```

### W2: Case-study hero (flat screens + callouts, 16:9)
Attach: `home-desktop.png`, the signature `<page>-mobile.png`, the logo.
```
Create a premium hero image for a web-design agency case study of the "{{CLIENT}}" website: {{one line, what visitors do there}}. Show the website DIRECTLY as flat screens: no laptop, no tablet, no monitor, no device bodies. Style: a clean website-launch explainer with floating UI callout cards and playful hand-drawn arrows and handwritten notes.

FORMAT
- 16:9 landscape (2400 × 1350 px).
- Background: flat pure white (#FFFFFF), seamless, edge to edge. No border, no frame, no gradient, no texture, no desk, no people outside the screens.
- About 5% white margin on all sides. Nothing touches the edges.

MAIN ELEMENT 1 — THE DESKTOP PAGE (centre-left, about 62% of the image width)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow, floating on white. On top, a minimal light-grey bar with three small grey dots on the left and a rounded address pill reading "{{domain}}". No other browser chrome.
- Inside, recreate the attached homepage screenshot (home-desktop.png) faithfully and fully filled:
  • {{same detail as T1's laptop screen}}

MAIN ELEMENT 2 — THE PHONE PAGE (right, overlapping the browser window's lower-right corner, about 22% of the image width)
- A flat phone-shaped screen: 36px rounded corners, a thin black outline, a soft shadow. No phone body, no buttons, no notch.
- Inside, recreate the attached mobile screenshot ({{file}}): {{every block, exact words}}.

FLOATING CALLOUT CARDS (white, 20px rounded corners, thin light-grey border, soft shadow, tilted 3–4°, slightly overlapping the window's edges, as if lifted out of the site)
- Top-left: "{{title}}": {{the real UI piece, exact words/numbers}}.
- Bottom-left: "{{title}}": {{…}}.
- Top-right (above the phone): "{{title}}": {{…, e.g. rating + review count + initials avatars}}.
- Bottom-right chip: {{e.g. call/WhatsApp icons + "… on every page"}}.

HAND-DRAWN ARROWS + HANDWRITTEN NOTES
Style: loose, slightly wobbly curved marker arrows with simple open arrowheads, about 3px thick, in {{accent name + hex}}. Notes are short phrases in a casual handwritten marker script, dark charcoal (#1F2937), with one key word in {{accent}}, slightly tilted. They sit in the white space and never cover any UI text.
Add exactly these 5:
a) From "{{card}}" → curved arrow to {{spot on the page}}. Note: "{{≤6 words}}"
b) From "{{card}}" → curved arrow to {{spot on the phone}}. Note: "{{…}}"
c) From "{{card}}" → curved arrow to the browser window. Note: "{{…}}"
d) Top centre, above the browser window: note "{{who the site is for}}" with a short arrow curving down into the page.
e) From the "{{chip}}" chip → short arrow to {{spot}}. Note: "{{…}}"

LOGO (copy the attached {{CLIENT}} logo exactly; do not redesign it)
- {{description}}

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text. Use only the initials given; never copy names from the screenshots.
- Palette: {{all hexes}}.
- No devices, no watermark, no borders around the image.
```

### W3: Page spotlight (one per key page, 2:1)
Attach: that page's `-desktop.png`, the logo.
```
Create a clean website case-study image that spotlights ONE page of the "{{CLIENT}}" website: the {{PAGE}} page. Style: a flat browser window of the real page on the left and three zoom-in callout cards on the right, joined to the page by thin connector lines, with two playful handwritten notes. Show the website directly: no laptop, no phone, no device of any kind.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no people outside the page. About 5% white margin; nothing touches the edges.

LEFT — THE PAGE (about 62% of the width, vertically centred)
- A flat, front-facing browser window with 18px rounded corners, a thin light-grey border and a large, very soft shadow. On top, a minimal light-grey bar with three small grey dots and a rounded address pill reading "{{domain/path}}". No other browser chrome.
- Inside, recreate the attached screenshot ({{file}}) faithfully, flat and undistorted:
  • {{top strip + header, with "{{PAGE}}" active}}
  • {{every block on the page top to bottom, exact words, numbers and colours}}

RIGHT — THREE CALLOUT CARDS (one column, about 30% of the width, evenly spaced)
- White cards, 20px rounded corners, thin light-grey border (#E5E7EB), very soft shadow. Each has a small bold near-black label on top and, under it, the real part of the page magnified about 1.6×, crisp and fully legible.
- A thin smooth connector line (1.5px, {{accent hex}} at 60%) runs from each card's left edge to a small {{accent}} dot on the exact spot it magnifies in the page. Lines never cross each other or any text.
- Card 1, label "{{what it is for}}": {{the real piece, exact words}}. Connector to {{spot}}.
- Card 2, label "{{…}}": {{…}}. Connector to {{spot}}.
- Card 3, label "{{…}}": {{…}}. Connector to {{spot}}.

HANDWRITTEN NOTES
- Two short notes in a casual handwritten marker script, dark charcoal (#1F2937) with one key word in {{accent hex}}, each with a short loose curved arrow. They sit in white space and never cover UI text:
  a) beside card {{n}}: "{{≤6 words}}"
  b) {{where}}: "{{≤6 words}}"{{, arrow to …}}

QUALITY RULES
- Every word and number exactly as written above; no gibberish, no invented text, no extra UI. Never copy people's names from the screenshot.
- Palette: {{hexes}}; bold {{heading font}}-style headings and {{body font}}-style body text, as in the screenshot.
- No devices, no watermark, no border around the image.
```

### T6: Design system (2:1)
Attach: the logo.
```
Create a clean, premium DESIGN SYSTEM sheet for the "{{CLIENT}}" website, in the style of a professional design-agency case study (like a Figma style-guide page). It shows the colour palette, typography and the website's core UI components, neatly organised on white, with a few hand-drawn arrows and handwritten notes.

FORMAT
- Exactly 2:1 landscape (2400 × 1200 px). If 2:1 isn't possible, use 16:9.
- Background: flat pure white (#FFFFFF), seamless. No border, no frame, no gradient, no devices, no people.
- About 5% white margin on all sides. Nothing touches the edges.

GENERAL STYLE
- Organised into 3 zones with generous spacing and thin light-grey (#E5E7EB) divider lines.
- Every zone has a small uppercase grey label (letter-spaced, {{body font}} SemiBold): "COLOUR", "TYPOGRAPHY", "COMPONENTS".
- Swatches and cards: 20px rounded corners, very soft shadow.
- Hand-drawn elements: 3 loose curved marker arrows in {{accent hex}} with short handwritten notes in a casual marker script, dark charcoal (#1F2937) with one key word in {{accent}}. They sit in white space and never cover text.

ZONE 1 — COLOUR (left half)
- Row 1, "Brand": 4 large tall swatches, each a solid block with the name in bold and the hex in a small monospace pill: {{"Name #HEX" × 4}}.
- Row 2, "Actions": {{2–3 swatches: call/WhatsApp/CTA/badge colours with hexes}}.
- Row 3, "Neutrals": {{Ink, Canvas, White with hexes; light ones with a thin grey outline}}.
- {{optional: a gradient bar for page banners, with both hexes}}
- Note with an arrow at the brand swatches: "{{e.g. Red & gold, straight from the logo}}".

ZONE 2 — TYPOGRAPHY (top right)
- Two specimen cards: a huge "Aa" in {{heading font + weight}} with "{{font}}", "{{role}}", "{{weights}}" and a sample line "{{real heading from the site}}"; a huge "Aa" in {{body font}} with "{{font}}", "{{role}}", "{{weights}}" and a sample line "{{real sentence from the site}}".
- A type scale list (thin dividers; role in grey, specs in small monospace, sample in that style): {{"Page title · Font Weight Size" → "real text"}} × 4–5 (sizes from site-facts).

ZONE 3 — COMPONENTS (bottom right, one tidy row of real website pieces)
- {{primary button, secondary button, header CTA, a filter pill with count, a real card (product/course/room) with its exact text, the search input, floating buttons}}
- Note: "Same pieces on every page".

LOGO: the attached {{CLIENT}} logo, small, top-left, with "Design System" beside it in {{heading font}} Bold. Copy the logo exactly; do not redesign it ({{description}}).

QUALITY RULES
- Every hex code, name and word exactly as written; each swatch exactly its hex colour; no extra colours or fonts. Aligned to a clear grid. No watermark.
```

### Follow-up fixes (send as an edit to the same image, not a new one)
- Garbled text: *"Keep the layout. Fix the text so it reads exactly: …"*
- Wrong names: *"Replace every person's name with the initials given in the prompt."*
- A device crept in (W2/W3/T6): *"Remove the device completely; show only the flat screens on white."*
- Notes covering UI: *"Move the handwritten notes into white space; don't cover any text."*
- Logo redrawn: *"Use the attached logo exactly, unchanged."*
- Format: *"Same image, 2:1 (or 16:9), on a flat pure white background, no border."*

---

## 5. The hand-off message (end of Phase A)

Send this, filled in, as your reply. Keep the prompts **complete** (no "same as above").

````markdown
The **<Client>** website case study is set up and running locally with real screenshots:
http://localhost:3000/work/<slug> (card: homepage → Websites tab).

**Screenshots and logo:** `~/Downloads/<site>-website-stills/` — attach the files named
with each prompt. Make each image in ChatGPT (or any image tool) and save it to Downloads.

**1. Homepage card (2:1).** Attach: `home-desktop.png`, `<page>-mobile.png`, `logo.png`
```
<T1 filled>
```
**2. Case-study hero (16:9).** Attach: `home-desktop.png`, `<page>-mobile.png`, `logo.png`
```
<W2 filled>
```
**3–6. Page by PAGE (2:1 each).** <Page A> — Attach: `<page>-desktop.png`, `logo.png`
```
<W3 filled>
```
… one block per page …
**7. Design system (2:1).** Attach: `logo.png`
```
<T6 filled>
```
**If text comes out wrong:** send an edit to the same image: "Keep the layout. Fix the text so it reads exactly: …"

**Assumptions / please confirm:** <slug, key pages chosen, any claim you couldn't verify,
whether the live site may be linked (default: not linked)>

When the images are ready, say "images are in Downloads" and I'll put them in.
````

---

## 6. Phase B: the images come back

### B1. Find and check them
```bash
ls -lt ~/Downloads | head -12
```
The newest files are the generated images (names vary). **Read each one** to see which
slot it is (card = laptop+phone; hero = 16:9 with callouts; page spotlights = one page
+ 3 callouts on the right; design system = swatches). Compare the text in each with its
prompt and note anything garbled. Tiny glitches can stay; tell the teammate with a fix line.

### B2. Process them
```bash
python3 scripts/showcase/flatten_white.py "~/Downloads/<card>.png"    public/work/<slug-short>-mockup.webp
python3 scripts/showcase/flatten_white.py "~/Downloads/<hero>.png"    public/work/<slug-short>/hero.webp
python3 scripts/showcase/flatten_white.py "~/Downloads/<page A>.png"  public/work/<slug-short>/page-<a>.webp
…
python3 scripts/showcase/flatten_white.py "~/Downloads/<design>.png"  public/work/<slug-short>/design-system.webp
```
Each prints its width × height. Copy those into the data.

### B3. Wire them
- `lib/showcases.ts`: `hero` → `hero.webp` with its size, **remove `frame` and `url`**;
  each `pages[].image` → `page-<a>.webp` with its size, **remove `frame` and `url`**;
  add `systemImage: { src: …/design-system.webp, width, height, alt }`.
- `lib/workCards.ts`: add `mockup: '/work/<slug-short>-mockup.webp'` to the entry.
- Keep `screens` (the real phones) as they are.

### B4. Check
`npx tsc --noEmit -p .`, then `node scripts/showcase/shoot_widths.mjs http://localhost:3000/work/<slug>`.
Look at every slice (1440, 1024, 820, 390), the zoom check, and the homepage card.
Send the teammate the 1440 and 390 slices.

### B5. Log it
Add a row to the status table and a short entry in `docs/project-showcase-playbook.md` §11
(files used, decisions, prompts). Don't commit unless asked.

### B6. When asked to push
`git pull`, `npx tsc --noEmit -p .`, commit with a clear message, `git push origin main`.
Vercel deploys in about a minute. Then check the live page:
```bash
curl -s https://www.pureflowstudios.in/work/<slug> | grep -o '<title>[^<]*'
node scripts/showcase/shoot_widths.mjs https://www.pureflowstudios.in/work/<slug> --out /tmp/<slug>-live
```

---

## 7. Worked example: UnSkills Computer Education (unskillseducation.org)

The first website case study, done 2026-10-01. Live at
`https://www.pureflowstudios.in/work/unskills-education-website`. Use it as the model.

**What was captured** (`~/Downloads/unskills-website-stills/`): home, courses,
student-verify (saved as `verify`), franchise, about, contact, register × desktop/mobile,
the full homepage, the logo.

**Facts used** (all from the live site): 9 categories / 158 courses (the /courses page's
own counts), 102 active centres (franchise list), 4.8 from 124 Google reviews, 2,000+
students (homepage counter, labelled "as the institute reports"). Stack read from the
site: React · Vite · Supabase · Vercel (Student Login goes to crm.unskillseducation.org).

**Brand sampled:** Red #B91C1C (buttons, top strip), Maroon #7F1D1D → Ink #0A0A0A (page
banners), Gold #FACC15 (breadcrumbs, "Courses"), logo Crimson #AC2038, Call Blue
#155DFC, WhatsApp Green #25D366, TOP badge #92730A on #FDF6DC, Canvas #F8FAFC. Fonts:
Outfit Bold (page title 48, section 36, card 15), Inter (body 16).

**Page content:** headline *"The online home of a"* **102-CENTRE NETWORK.**; focus
Institute Website · Online Admissions · Certificate Verification; goals: make 158
courses easy to find / turn a visit into an admission / prove every certificate is
real / grow the franchise network; key pages: Home, Courses, Verification, Franchise.
See the full entry in `lib/showcases.ts` (`slug: 'unskills-education-website'`).

**Decisions:** the owner asked for **no link to the live site** (no "Visit" button, no
Live fact, `liveUrl: ''`). This is now the default (rule 2).

**Images → files:**
| Generated image | File |
|---|---|
| UnSkills Education Course Mockup | `public/work/unskills-website-mockup.webp` (card) |
| UnSkills Education Website Showcase | `public/work/unskills-website/hero.webp` 1672×941 |
| Homepage / Courses / Student Verification / Franchise showcases | `public/work/unskills-website/page-{home,courses,verify,franchise}.webp` 1774×887 |
| UnSkills Design System Board | `public/work/unskills-website/design-system.webp` 1774×887 |

**Lesson:** one tiny glitch got through (the hero's top-strip email read
"askillseducation@gmail.com"). Always zoom into the small strips when checking (B1).

### The prompts used (copy their level of detail)

<details><summary>1. Homepage card (T1). Attach home-desktop.png, courses-mobile.png, logo</summary>

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

<details><summary>2. Case-study hero (W2). Attach home-desktop.png, verify-mobile.png, logo</summary>

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

<details><summary>3. Page spotlight (W3): Home. Attach home-desktop.png, logo</summary>

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

<details><summary>4. Page spotlight (W3): Courses. Attach courses-desktop.png, logo</summary>

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

<details><summary>5. Page spotlight (W3): Verification. Attach verify-desktop.png, logo</summary>

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

<details><summary>6. Page spotlight (W3): Franchise. Attach franchise-desktop.png, logo</summary>

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

<details><summary>7. Design system (T6). Attach the logo</summary>

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

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| `capture_site.mjs` can't start Chromium | `npx playwright-core install chromium` once (or install Google Chrome). |
| A carousel is caught mid-slide | Re-run with `--wait 7000`, or capture again; keep a frame where the slide is fully in place. |
| A cookie/notice popup covers the page | The script closes "×/close/dismiss" popups but never clicks "accept". If one stays, open the page in the browser, close it, and screenshot by hand at 1440×900. |
| Counters read "0+" in site-facts | Read the number off `home-desktop-full.png` or scroll to it in the browser. |
| A page needs a login | Don't capture it. Use only public pages. |
| Image tool garbles small text | Send an edit with the exact words (fix lines, §4). Tiny strips can stay if unreadable at page size. |
| Image came back not 2:1 / with a border | Edit: "Same image, 2:1, flat pure white background, no border." |
| Headline wraps badly on a phone | Shorten `headline.word` (≤ ~20 characters). |
| The page shows the software layout | The showcase has no `site` block. |
| The card shows screenshots, not the mockup | Add `mockup` to its `FEATURED` entry in `lib/workCards.ts`. |

---

## 9. Checklist

**Phase A**
- [ ] `git pull`; slug chosen
- [ ] Site captured (home + 3–4 key pages); every still looked at; facts read
- [ ] Colours sampled; fonts read; logo saved (black card version made if new)
- [ ] Interim WebPs made (`stills_to_webp.py`)
- [ ] `caseStudies.ts`, `showcases.ts` (`site`), `workCards.ts`, `services.ts` updated; no live link unless allowed
- [ ] Only real numbers; unverifiable claims listed as questions
- [ ] tsc + build pass; `shoot_widths.mjs` clean at 4 widths; card shows in the Websites tab
- [ ] T1, W2, W3 × pages, T6 prompts written in full; hand-off message sent

**Phase B**
- [ ] Every image identified and its text checked
- [ ] Flattened to the right file names; sizes copied into the data; `frame`/`url` removed; `systemImage` + `mockup` set
- [ ] tsc passes; `shoot_widths.mjs` clean; zoom works on 390; screenshots sent
- [ ] Playbook §11 logged; committed/pushed only when asked; live page checked after a push
