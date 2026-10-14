# PureFlow Design System, for TravexaFlow

> **For the developer or AI working on travexaflow.com:** this file is the design system behind
> PureFlow Studios' landing page (pureflowstudios.in/customsoftware). Every value here is taken from
> that live page's code. Apply it to TravexaFlow's marketing site so it gets the same clean,
> professional finish: one font, a tight type scale, consistent spacing, and short, one-line copy.
> Read the whole file first. §11 lists the exact changes for TravexaFlow.

---

## 1. Principles (the feel we want)

1. **One font, used well.** Plus Jakarta Sans everywhere. Heavy, tightly tracked headings and calm body text.
2. **Less copy, heavier words.** Each heading says one thing. Checklist points, comparison rows and card lines fit on **one line**, even on a phone.
3. **One accent colour, used sparingly.** Purple marks the call to action and one phrase per heading, nothing else.
4. **Real material only.** Real screens, real numbers, real logos. No emoji, no stock photos, no invented stats.
5. **Same rhythm everywhere.** Every section has an eyebrow, a heading, at most one short line, then content. The left edge and spacing are the same across sections.
6. **Quiet motion.** Content fades up once as it scrolls in, and buttons respond on hover and press. Nothing bounces or spins.

---

## 2. Font

**Plus Jakarta Sans**, weights 400, 500, 600, 700, 800. No second font.

```html
<!-- Plain HTML -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

```ts
// Next.js
import { Plus_Jakarta_Sans } from 'next/font/google';
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-jakarta', display: 'swap' });
// <html className={jakarta.variable}> … font-family: var(--font-jakarta), system-ui, sans-serif;
```

```css
body { font-family: var(--font-jakarta), system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
```

**Weight use**

| Weight | Use |
|---|---|
| 800 | H1, H2, H3, big numbers (stats, prices), brand wordmark |
| 700 | Buttons, card titles, eyebrow labels, table headers, active states |
| 600 | Nav links, secondary buttons, checklist items, chips |
| 500 | Sub-headlines, body that needs presence, labels |
| 400 | Long body copy, captions, FAQ answers |

**Letter-spacing is what makes it look premium.** Headings are always tracked tight:

| Text | Letter-spacing |
|---|---|
| H1 | `-0.04em` |
| H2 / section headings | `-0.035em` |
| H3 / card titles | `-0.025em` to `-0.03em` |
| Big numbers | `-0.03em` to `-0.04em` |
| Body | `normal` |
| Eyebrow (uppercase) | `+0.12em` |

---

## 3. Type scale

Sizes are fluid: `clamp(phone, fluid, desktop)`. The middle value uses `cqi` (container width) on our site. Use `vw` if you don't use container queries.

| Role | Size | Weight | Line height | Colour | Notes |
|---|---|---|---|---|---|
| **H1 (hero)** | `clamp(40px, 5.3vw, 78px)`, **34px** on phone | 800 | **1.02** | `#1F1235` | Two lines: a plain statement, then a coloured phrase |
| **H2 (section)** | `clamp(32px, 3.6vw, 52px)`, **27px** on phone | 800 | **1.06** (1.12 on phone) | `#1F1235` | One coloured phrase at most |
| **H3 (sub-block)** | `clamp(22px, 2vw, 28px)` | 800 | 1.15 | `#1F1235` | e.g. "What was broken, and how we fixed it." |
| **Hero sub-line** | `clamp(17px, 1.45vw, 21px)` | 500 | 1.55 | `#5E5478` | Max width 680px |
| **Section sub-line** | 17px (15.5px on phone) | 400 | 1.6 | `#6B6480` | Max width 560px, one sentence |
| **Body** | 15–16px | 400/500 | 1.5–1.6 | `#6B6480` / `#5E5478` | |
| **Checklist / points** | 16px (14.5px on phone) | 600 | 1.4 | `#1F1235` | One line each |
| **Eyebrow** | 12px, uppercase | 700 | 1 | `#7E22CE` | Tracking `0.12em` |
| **Button** | 17px large, 15px nav (15.5px on phone) | 700 | 1 | `#fff` | |
| **Caption / micro-copy** | 13–14px | 500 | 1.4 | `#6B6480` | e.g. "30-min Google Meet · No obligation" |
| **Big number** | 28–42px | 800 | 1 | `#1F1235` | Tracking `-0.04em` |

**Never** use a line-height above 1.15 on a heading, or headings without negative letter-spacing.

---

## 4. Colour

Paste as CSS variables. If TravexaFlow keeps its own brand colour, replace only `--brand`, `--brand-hover`, `--brand-press`, `--brand-2` and `--brand-soft`. Everything else stays.

```css
:root {
  /* brand */
  --brand:        #7E22CE;  /* primary buttons, coloured heading phrase, active states */
  --brand-hover:  #6B1BB0;
  --brand-press:  #5B1A96;
  --brand-2:      #8B5CF6;  /* gradient end, focus ring, highlights */
  --brand-3:      #A78BFA;  /* gradient tail, hover borders */
  --brand-soft:   #EDE9FE;  /* icon tiles, chips, soft fills */
  --brand-tint:   #FAF5FF;  /* hover backgrounds, highlighted table column */

  /* neutrals */
  --ink:          #1F1235;  /* headings, strong text */
  --ink-2:        #4A4260;  /* secondary strong text */
  --body:         #6B6480;  /* body copy */
  --body-2:       #5E5478;  /* hero sub-line, card descriptions */
  --line:         #E9E3F7;  /* borders, dividers */
  --line-2:       #ECE6F7;  /* hairlines, nav bottom border */
  --page:         #FAF8FC;  /* page background (not pure white) */
  --surface:      #FFFFFF;  /* cards */

  /* dark sections */
  --dark-1:       #0B0714;
  --dark-2:       #1E0B3A;  /* section bg: linear-gradient(180deg, var(--dark-1), var(--dark-2)) */
  --on-dark:      #FFFFFF;
  --on-dark-body: #B9AECF;
  --on-dark-accent: #C4B5FD;

  /* status */
  --success: #16A34A;  --error: #DC2626;  --star: #F5B014;  --whatsapp: #25D366;
}
```

**Rules**
- Headline gradient (one phrase only): `linear-gradient(90deg, #7E22CE 10%, #8B5CF6 60%, #A78BFA 100%)` with `background-clip: text`. Inside page sections a **solid `#7E22CE`** phrase is cleaner. Use the gradient only in the hero.
- Primary buttons are **solid** `--brand`. No gradient buttons.
- Alternate light (`--page` / white) and dark (`--dark-1 → --dark-2`) sections for rhythm. One or two dark sections per page is enough.
- Money is shown in the market's currency, consistently. Never mix ₹ and $ on one page.

---

## 5. Layout and spacing

| Thing | Value |
|---|---|
| Content width | **1200px** (sections), 1100px (centred hero/heading blocks), 1240px (nav bar) |
| Side gutter | `clamp(20px, 2.5vw, 32px)`: 20px on phone, 32px on desktop |
| Section padding (top and bottom) | `clamp(64px, 7.5vw, 112px)` |
| Hero padding | `clamp(48px, 7vw, 104px)` top, `clamp(56px, 6vw, 88px)` bottom |
| Readable text width | 560px (section sub-line), 680px (hero sub-line), 760px (centred headings) |
| Grid gaps | 10–14px (dense cards, phone), 18–20px (card grids), 48px (sidebar + content) |

**Inside a section (vertical rhythm)**

```
eyebrow (12px uppercase)
   ↓ 12–14px
H2
   ↓ 14–16px
one-line sub (optional)
   ↓ 40–52px
content (cards, table, image)
   ↓ 40px
CTA button (+ 14px micro-copy under it)
```

**Spacing steps used:** 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 22 · 24 · 26 · 32 · 40 · 44 · 52 px. Don't invent new ones.

**Breakpoints:** phone below **760px**, tablet up to **1020–1100px**, desktop above. Check every page at **1440, 1024, 820, 390 and 360** wide, with no sideways scroll at any width.

---

## 6. Shape, borders, shadows

| Element | Radius |
|---|---|
| Pills, chips, big CTAs | `999px` |
| Buttons in the nav, inputs, small buttons | `10–12px` |
| Icon tiles | `10–12px` (38–40px square) |
| Cards | `18–20px` |
| Large panels, tables, image frames | `22–28px` |

- **Borders:** `1px solid #E9E3F7` on every card and table. Use hairline dividers inside, `1px solid #F0EBFA`.
- **Card shadow (soft, purple-tinted, never grey):** `0 30px 60px -48px rgba(46,16,101,0.5)`.
- **Floating/raised card:** `0 22px 40px -20px rgba(46,16,101,0.55)`.
- **Primary button glow:** `inset 0 1px 0 rgba(255,255,255,0.25), 0 16px 32px -14px rgba(126,34,206,0.8)`.
- **Nav bar:** `background: rgba(250,248,252,0.78); backdrop-filter: blur(14px)`, with a `0 1px 0 #ECE6F7` line once scrolled.

---

## 7. Components

### Navigation bar
- Sticky, **76px** tall, logo plus wordmark (19px / 800 / `-0.025em`) on the left. Up to two text links, an outline "Contact" button and one solid primary button on the right.
- Phone: logo, a short primary button ("Book a call", 14px) and a 44×44 menu button. No other links.

### Buttons
| Type | Style | Height | Text |
|---|---|---|---|
| **Primary (large)** | solid `--brand`, white text, pill, glow shadow | 56px (48px phone), padding 0 30px | 17px / 700 |
| **Primary (nav)** | solid `--brand`, radius 10px | 44px, padding 0 18px | 15px / 700 |
| **Secondary** | white bg, `1px solid #DDD3F0`, ink text, pill | same as primary | 17px / 700 |
| **Link** | ink text, underline on hover, optional → arrow | 44px tap area | 16px / 600 |

States (all `transition: 0.15s`):
- Primary hover `#6B1BB0` with a 1px lift; press `#5B1A96` at `scale(0.98)`; disabled `#CDBCEB`.
- Secondary hover: bg `#FAF5FF`, border `#A78BFA`.
- **Focus ring:** `box-shadow: 0 0 0 3px #fff, 0 0 0 6px #8B5CF6` (keyboard only, via `:focus-visible`).
- One CTA wording everywhere (e.g. "Start free trial"). Under the main CTA, a 14px micro-copy line ("7-day trial · No card needed").

### Eyebrow pill (above the H1)
White pill, `1px solid #E9E3F7`, padding `7px 14px 7px 10px`, 13px/600 grey text with a **bold ink** first part, an 8px purple dot with a soft ring, and a `·` separator. Example: **● 500+ travel agencies · From ₹X/month**

### Section header
Centred or left-aligned: eyebrow (12px uppercase purple), H2 with **one** coloured phrase, an optional one-line sub (17px grey).

### Cards
White, radius 18–20px, `1px solid #E9E3F7`, padding 16–22px. Card title 16–17px / 800 / `-0.02em`, then one line of 14px `#5E5478`. Icon tile: 38–40px, radius 11–12px, bg `#EDE9FE`, icon in `#7E22CE`, 18–20px, stroke 2 (Lucide-style line icons).

### Stat tiles
White card. Number 24–34px / 800 / `-0.04em`, then a 13.5px / 500 grey label under it. Use 2–3 per row, never more than 4.

### Checklist ("what it does")
One point per line. Filled purple 22px circle with a white tick, 12px gap, then 16px / 600 ink text. A single column. On phone 14.5px, still one line each.

### Comparison table (before vs after)
Two columns, **side by side on every screen size**. Left "Before", grey text with a small red ✕ in a pale red circle. Right "With [Product]", ink text at 600, with a filled purple ✓ on a `#FAF5FF` tint. Each cell is **2–4 words**, e.g. "Leads scattered" → "One lead list". On phone, reduce to 13px with smaller padding. Never stack the columns.

### Agency comparison (us vs them)
Desktop: a 3-column table (topic · them · us). Phone: **one small card per row**: topic with its icon, the "them" line with ✕, then the "us" line with ✓ in a tinted box. Give each line a **short phone version** that fits on one line.

### Feature/module grid
Desktop 3–4 columns. Phone **2 columns**, compact: 34px icon tile, 15px title, 12.5px one-line description, a short link ("See it ↓"). End the grid with one solid purple tile: "+14 more modules".

### FAQ
Accordion, one open at a time. Questions 18px / 700 (16px phone), at least 56–64px tall. The icon is a 28px circle (lilac, or purple when open) with a + that rotates 45°. Opening animates `grid-template-rows` over 0.22s.

### Sticky phone CTA bar
Phone only, after the hero: a floating white bar at the bottom with a one-line label on the left ("Free consultation · Google Meet") and the primary button on the right.

### Forms
Inputs 48px tall, radius 12px, `1px solid #E9E3F7`. Focus: border `#7E22CE` plus `0 0 0 4px rgba(126,34,206,0.14)`. Labels sit above, 13px / 600. Errors show under the field in `#DC2626`.

### Product screenshots
Real screens only, in a clean browser frame with traffic-light dots, radius 22px and a soft shadow. Showcase images can have floating white cards and handwritten notes with thin arrows. Blur real customer names. Text inside images is at least 12px when shown at full width.

---

## 8. Writing rules (the "one line" system)

This matters as much as the visuals.

1. **Headlines: statement + coloured payoff.** Line 1 plain, line 2 coloured. Both short.
   - "Custom software, / built your way."
   - "Real businesses. / Real results."
   - "Not another agency. / A better way to build."
   - "Questions, / answered."
2. **Length limits.**
   - H1: 2 lines on desktop, 3 at most on phone.
   - H2: about 3–7 words.
   - Points, rows and card lines: **one line at 360px wide**, roughly 20–32 characters.
3. **No paragraph under a section heading** unless it adds something new. If you need one, keep it to a single sentence.
4. **Short words, concrete nouns.** "One lead list", not "Centralised lead management capabilities".
5. **Give each long line a phone version.** Write a shorter variant and show it below 760px ("See how it works" → "See it").
6. **Numbers are real and specific.** "11,898 leads", not "thousands of leads". If it isn't verified, leave it out.
7. **No emoji in UI copy.** Use line icons instead. Use no ALL-CAPS sentences, except the 12px eyebrow labels.
8. **Sentence case** for headings and buttons ("Start free trial", not "Start Free Trial").
9. **One coloured phrase per heading**, never two.
10. **The same CTA wording everywhere** on the page.

---

## 9. Motion

- **Reveal on scroll:** elements fade up 16px over 500ms with `cubic-bezier(0.2, 0.7, 0.2, 1)`, once, when 20% is visible. Reveal each block (heading, image, card group) separately, not whole long sections.
- **Buttons:** 150ms colour, shadow and transform changes.
- **Accordions:** 220ms.
- **Carousels/strips:** move with transforms. Thumb drag follows 1:1 and then eases to the nearest card, and auto-drift pauses on touch or hover.
- **`prefers-reduced-motion`:** no reveals, no drift, no transitions.
- Nothing on the page should loop forever in a distracting way. A slow logo marquee is the maximum.

```css
.js [data-reveal] { opacity: 0; transform: translateY(16px); }
.js [data-reveal].in { opacity: 1; transform: none;
  transition: opacity .5s cubic-bezier(.2,.7,.2,1), transform .5s cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion: reduce) { .js [data-reveal] { opacity: 1; transform: none; } }
```

---

## 10. Phone rules (below 760px)

| Element | Desktop | Phone |
|---|---|---|
| H1 | up to 78px | **34px** |
| H2 | up to 52px | **27px**, line-height 1.12 |
| Section sub | 17px | 15.5px |
| Big buttons | 56px tall, 17px | **48px**, 15.5px, padding 0 22px |
| Nav button | 15px | 14px, padding 0 15px |
| FAQ question | 18px | 16px, 56px tall |
| Side gutter | 32px | 20px |
| Card grids | 3–4 columns | 2 columns (features), 1 column (big cards) |
| Comparison | side by side | still side by side, 13px |

Also:
- Hide anything decorative that crowds the hero on phone, such as chip marquees or long trust lines.
- Tap targets are at least 44×44px.
- Test at 390 and 360. Nothing should wrap to an orphan word or scroll sideways.

---

## 11. Applying this to TravexaFlow (what to change)

Measured on travexaflow.com (current homepage):

| Now | Change to |
|---|---|
| System font (`-apple-system / ui-sans-serif`) | **Plus Jakarta Sans** 400–800 (§2) |
| H2s 48px with **no** letter-spacing, line-height 1.25 | `-0.035em`, line-height **1.06**, size `clamp(32px, 3.6vw, 52px)` |
| H1 48px, `-1.2px` | `clamp(40px, 5.3vw, 78px)`, `-0.04em`, line-height 1.02 |
| Long headings (10+ words) | 3–7 word statement + coloured payoff (§8). See the rewrites below. |
| Emoji everywhere (🏆 ✅ 🏢 📊 💰) | Line icons in 38–40px lilac tiles, and filled purple ✓ circles for checklists |
| Muted grey-purple gradient buttons (`#7C6FAE → #5B4F8A`) | Solid `--brand` with the hover, press and focus states in §7 |
| Mixed Title Case ("Start 7 Days Free Trial") | Sentence case, same wording on every CTA: "Start free trial" |
| Section padding 112–144px, mixed | `clamp(64px, 7.5vw, 112px)` on every section |
| Stats as emoji chips | Stat tiles (§7). Show only figures you can stand behind. |

**Heading rewrites (examples, keep the facts as they are):**

| Current | Suggested |
|---|---|
| "TravexaFlow Travel Agency CRM Software" | "The CRM for travel agencies." / *"Leads to bookings, in one place."* |
| "Still Managing Your Travel Agency with Excel, WhatsApp & Paper?" | "Excel, WhatsApp and paper?" / *"There's a better way."* |
| "Start Using the Best Travel Agency Software in 3 Steps" | "Up and running" / *"in 3 steps."* |
| "Powerful Travel CRM Features Built for Tour Operators" | "Every module" / *"a tour operator needs."* |
| Hero sub-line (31 words) | "Capture leads from WhatsApp and ads, build packages, and track every booking and profit." |
| "✅ 7 Days Free Trial ✅ Instant Setup ✅ WhatsApp Support 24/7" | One 14px line under the CTA: "7-day free trial · Instant setup · WhatsApp support" |

(*Italic* = the coloured phrase.)

**Pain-point list rewrite (one line each):**
- Leads lost across WhatsApp and calls
- Quotes typed by hand in Word
- No idea which tours make money
- Vendor payments on paper
- Staff working in silos

**Order of work:** font and type scale → colours and buttons → spacing → copy rewrite → icons (remove emoji) → phone pass (§10) → check at 1440 / 1024 / 820 / 390 / 360.

---

## 12. Quality checklist (before shipping)

- [ ] One font (Plus Jakarta Sans), every heading tracked negative, heading line-height ≤ 1.15
- [ ] One coloured phrase per heading, and solid brand buttons with hover, press and focus states
- [ ] Every checklist point, comparison row and card line fits on one line at 360px
- [ ] No emoji, no stock photos, no invented numbers, one currency throughout
- [ ] Same CTA wording everywhere, plus a sticky CTA bar on phone
- [ ] Section padding and gutters match §5, and everything shares one left edge
- [ ] No sideways scroll at 1440 / 1024 / 820 / 390 / 360
- [ ] Keyboard focus visible, text contrast WCAG AA, tap targets ≥ 44px
- [ ] Reduced motion respected
