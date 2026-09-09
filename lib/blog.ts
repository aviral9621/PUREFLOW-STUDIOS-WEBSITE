// ─────────────────────────────────────────────────────────────────────────────
// BLOG — All posts shown in /good-stuff (the blog index) and rendered by slug
// on individual /good-stuff/[slug] views.
//
// To wire this to a CMS (Notion, Sanity, Contentful, Supabase) later, swap
// `POSTS` for a fetch returning the same shape.
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogBlock {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code';
  text?: string;
  items?: string[];
}

/**
 * The blog taxonomy. These are the filter pills on the homepage section, in the
 * order they render, so keep the list short and the labels human. Typing
 * `BlogPost['category']` against it means a stray label fails the build instead
 * of quietly producing a filter that matches nothing.
 */
export const BLOG_CATEGORIES = [
  'AI & Automation',
  'Web Development',
  'Software',
  'Tech Trends',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  imageAlt: string;
  content: BlogBlock[];
}

export const POSTS: BlogPost[] = [
  {
    slug: 'ai-automation-for-small-businesses-2026',
    category: 'AI & Automation',
    title: 'How AI Automation Can Help Small Businesses Grow in 2026',
    excerpt:
      'Not the "fire your team" version. The version where four hours of copy-paste a day quietly disappears and nobody notices except your margins.',
    readTime: '6 min read',
    date: 'May 10, 2026',
    author: 'Aviral Singh',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Abstract neural network of glowing purple and blue nodes',
    content: [
      {
        type: 'paragraph',
        text:
          "Most small-business owners we talk to have already tried AI. They opened ChatGPT, asked it to write a caption, got something usable, and moved on. That is not automation. That is a party trick, and it is why so many teams conclude AI 'did not really change anything' for them.",
      },
      {
        type: 'paragraph',
        text:
          'The businesses actually getting value in 2026 did something less exciting: they found the three tasks a human repeats every single day, and removed the human from the middle of them. No strategy deck. No transformation programme. Just three specific jobs.',
      },
      { type: 'heading', text: 'Start with the copy-paste tax' },
      {
        type: 'paragraph',
        text:
          'Every growing business pays a copy-paste tax. Someone reads a WhatsApp enquiry and retypes it into a spreadsheet. Someone reads that spreadsheet and retypes it into an invoice. Someone checks the invoice and retypes the number into a report. None of that is work. It is data moving between systems that never learned to talk.',
      },
      {
        type: 'paragraph',
        text: 'The highest-return automations we build almost always look like this:',
      },
      {
        type: 'list',
        items: [
          'A WhatsApp enquiry becomes a CRM lead with the name, city and requirement already filled in.',
          'A confirmed order becomes a GST invoice, emailed and filed, without anyone opening Excel.',
          'A missed follow-up sends a nudge to the salesperson before the customer goes cold.',
          'A week of sales becomes a two-line summary in the owner’s inbox every Monday morning.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'None of those need a large language model to be clever. They need it to be reliable — to read messy human text and put the right value in the right field, every time. That is the part that finally works well enough to trust.',
      },
      { type: 'heading', text: 'Where AI earns its keep — and where it does not' },
      {
        type: 'paragraph',
        text:
          'Use AI for the fuzzy edges: reading unstructured messages, classifying enquiries, drafting a first reply, summarising a long thread. Use ordinary code for everything that must be exact: pricing, tax, payouts, inventory counts. We have seen founders push GST calculations through a model and then spend a month reconciling the damage.',
      },
      {
        type: 'quote',
        text:
          'A good rule: if a wrong answer would cost you money or trust, it belongs in code, not in a prompt. AI reads the world. Code runs the business.',
      },
      { type: 'heading', text: 'What this costs, honestly' },
      {
        type: 'paragraph',
        text:
          'A focused automation build — one that removes a genuine daily task rather than adding a dashboard nobody opens — is usually a two-to-four week project, and the running cost lands in the low hundreds of rupees a day rather than the thousands people fear. The expensive version is the one where you route every customer message through a frontier model for no reason. Batch what you can, cache what repeats, and use the small model until the small model actually fails.',
      },
      { type: 'heading', text: 'A sane first ninety days' },
      {
        type: 'list',
        items: [
          'Weeks 1–2: sit with the team and time the repetitive tasks. Pick the one with the highest hours-per-week, not the one that sounds most futuristic.',
          'Weeks 3–6: automate exactly that one thing, end to end, and let a human review every output for the first fortnight.',
          'Weeks 7–12: once the team stops correcting it, drop the review step, measure the hours returned, and only then pick the second task.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'That is the whole method. It is unglamorous and it compounds. The businesses that do this for a year are not "AI companies" — they are just the ones whose staff spend their days on customers instead of on spreadsheets.',
      },
    ],
  },
  {
    slug: 'high-performance-website-for-growing-business-2026',
    category: 'Web Development',
    title: 'Why Every Growing Business Needs a High-Performance Website in 2026',
    excerpt:
      'Your site is not a brochure any more. It is the first employee every customer meets — and a slow one costs you real money.',
    readTime: '5 min read',
    date: 'March 20, 2026',
    author: 'Aviral Singh',
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Website interface on desktop screens lit in blue and purple',
    content: [
      {
        type: 'paragraph',
        text:
          'There is a particular kind of website that still gets sold to small businesses: eight pages, a stock photo of a handshake, a contact form nobody checks, and a load time that would embarrass a 2014 blog. It looks fine on the developer’s laptop. On a customer’s phone, on 4G, in a market, it is a closed tab.',
      },
      { type: 'heading', text: 'Speed is not a technical detail. It is revenue.' },
      {
        type: 'paragraph',
        text:
          'The numbers are boring and consistent: most people abandon a page that takes more than three seconds, and mobile users are harsher than desktop users. If your site takes five seconds to become usable, you are not losing a fraction of traffic — you are losing the majority of the people who were interested enough to click.',
      },
      {
        type: 'paragraph',
        text:
          'What actually makes a site slow is rarely mysterious. In almost every audit we run it is the same short list:',
      },
      {
        type: 'list',
        items: [
          'Hero images exported at 4000px wide and shrunk with CSS.',
          'A page builder shipping 900KB of JavaScript to render text.',
          'Five marketing scripts loading before any content appears.',
          'Fonts that block rendering while the browser waits on a third-party server.',
        ],
      },
      {
        type: 'paragraph',
        text:
          'Every one of those is fixable in days, not months. None of them require a redesign.',
      },
      { type: 'heading', text: 'Mobile-first is not a layout choice' },
      {
        type: 'paragraph',
        text:
          'For most Indian businesses, three out of four visitors arrive on a phone, often on a mid-range Android on a patchy connection. Designing on a 27-inch monitor and then "checking mobile" at the end produces a site that technically fits the screen and still feels wrong — tap targets too small, forms too long, the important button below three scrolls of hero text.',
      },
      {
        type: 'quote',
        text:
          'If the one thing you want a visitor to do is not visible without scrolling on a phone, you do not have a conversion problem. You have a layout problem.',
      },
      { type: 'heading', text: 'What a high-performance site actually looks like' },
      {
        type: 'list',
        items: [
          'Meaningful content painted in under two seconds on a mid-range phone.',
          'One obvious next action per page — call, WhatsApp, enquire, book.',
          'Images sized and served for the device asking for them.',
          'Structured, crawlable pages so search engines can read what you offer.',
          'A form that submits somewhere a human genuinely watches.',
        ],
      },
      { type: 'heading', text: 'Where to start if your site is already slow' },
      {
        type: 'paragraph',
        text:
          'Run it through PageSpeed Insights on mobile and read only the field data, not the lab score. Then fix in this order: image weight, blocking scripts, font loading, everything else. That sequence covers most of the gap for most sites, and you can measure the improvement the same afternoon.',
      },
      {
        type: 'paragraph',
        text:
          'A fast site will not fix a weak offer. But a slow site will quietly bury a strong one, and you will never see the customers it cost you — they simply never arrive.',
      },
    ],
  },
  {
    slug: 'custom-software-vs-ready-made-software',
    category: 'Software',
    title: 'Custom Software vs Ready-Made Software: Which Is Better for Your Business?',
    excerpt:
      'The honest answer is that off-the-shelf wins more often than agencies admit — until one specific thing changes.',
    readTime: '5 min read',
    date: 'February 15, 2026',
    author: 'Aviral Singh',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Software dashboard with analytics charts on a laptop screen',
    content: [
      {
        type: 'paragraph',
        text:
          'We build custom software for a living, so you would expect this article to end with "build custom software". It does not. Most businesses that ask us for a custom system should buy something off the shelf, and we tell them so — usually in the first call.',
      },
      { type: 'heading', text: 'Ready-made is the right default' },
      {
        type: 'paragraph',
        text:
          'A ready-made product has absorbed thousands of hours of other people’s edge cases. It is live tomorrow, costs a predictable subscription, gets security patches without you asking, and someone else is on call when it breaks at 11pm. If your process looks broadly like everyone else’s process, you are paying a small monthly fee to skip an entire engineering department.',
      },
      {
        type: 'paragraph',
        text: 'Buy, not build, when:',
      },
      {
        type: 'list',
        items: [
          'The workflow is standard — accounting, payroll, email, storage, basic CRM.',
          'You need it working this month, not this quarter.',
          'Nobody on the team can own a system long-term after launch.',
          'Your process is not itself a competitive advantage.',
        ],
      },
      { type: 'heading', text: 'The point where buying starts to hurt' },
      {
        type: 'paragraph',
        text:
          'There is a recognisable moment when off-the-shelf turns expensive, and it is almost never the licence fee. It is when the tool cannot describe your business, so your team invents workarounds: a spreadsheet beside the CRM, a WhatsApp group that holds the real status, a naming convention everyone has to remember, a person whose actual job is moving data between two systems.',
      },
      {
        type: 'quote',
        text:
          'Count the workarounds, not the licence cost. Three spreadsheets propping up a tool you already pay for is the real bill.',
      },
      {
        type: 'paragraph',
        text:
          'Build custom when the process is the business. A binary MLM commission structure, a multi-branch institute with its own fee logic, hotel pricing where tax is always included — no product on the market models those, and bending a generic tool to fake it costs more every year than building the real thing once.',
      },
      { type: 'heading', text: 'What custom actually costs' },
      {
        type: 'paragraph',
        text:
          'Be clear-eyed: custom means a real build timeline, a real budget, and — the part people forget — ongoing ownership. Software is not a painting you hang on a wall. It needs hosting, updates, someone to call, and small changes as the business shifts. Budget for year two before you commit to year one.',
      },
      { type: 'heading', text: 'The middle path most people miss' },
      {
        type: 'paragraph',
        text:
          'You rarely have to choose one. The pattern that works best: buy the commodity layers — accounting, email, payments, storage — and build only the thin slice that is genuinely yours, wired into the rest through APIs. You get a system that fits your business exactly where it matters, without paying to rebuild things that were already solved.',
      },
      {
        type: 'paragraph',
        text:
          'So the honest test is one question: if you removed this process, would your business still be your business? If yes, buy it. If no, that is the piece worth building.',
      },
    ],
  },
  {
    slug: 'google-gemini-omni-for-small-business',
    category: 'Tech Trends',
    title: "Google's Gemini Omni: what it actually means for small businesses",
    excerpt:
      'Gemini Omni isn’t another chatbot. It’s a multimodal model that can read your CRM, watch your dashboard, and act — here’s how to use it without setting your data on fire.',
    readTime: '6 min read',
    date: 'May 12, 2026',
    author: 'Aviral Singh',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'AI neural network visualisation in purple and blue gradients',
    content: [
      {
        type: 'paragraph',
        text:
          "Google announced Gemini Omni a few weeks ago and the timeline went predictable: half the internet called it 'the ChatGPT killer' and the other half called it 'just another model'. Both takes are wrong, and both are missing what actually matters for the businesses we build software for.",
      },
      {
        type: 'paragraph',
        text:
          "Omni is interesting because of one specific shift: it can natively process screenshots, voice, video, and structured data in the same context window — without you having to glue four different APIs together. For a small business running on WhatsApp, a CRM, and Google Sheets, that's a big deal.",
      },
      { type: 'heading', text: 'What Omni actually does' },
      {
        type: 'paragraph',
        text:
          "Think of it as a model that can sit on top of your existing tools and read everything as if it were a smart intern. You can feed it:",
      },
      {
        type: 'list',
        items: [
          'A screenshot of your dashboard, and it can summarise what changed since yesterday.',
          'A voice note from a customer, and it can extract the complaint + suggested next step.',
          'A spreadsheet, and it can tell you which row is the anomaly worth investigating.',
          'A video of a UI walkthrough, and it can write the test cases.',
        ],
      },
      { type: 'heading', text: "Where it falls flat" },
      {
        type: 'paragraph',
        text:
          "The hype glosses over a few real costs. Omni is expensive to run at scale, hallucinates confidently on long-tail data, and — most importantly for Indian small businesses — pricing isn't where Gemini 1.5 was. If you're piping every customer message through it, your bill will surprise you.",
      },
      {
        type: 'quote',
        text:
          "The mistake we keep watching founders make: they treat AI like a magic 'replace your team' button. It isn't. It's a tool that 10x's the team you already have.",
      },
      { type: 'heading', text: "What to actually do with it (this quarter)" },
      {
        type: 'paragraph',
        text:
          "Don't rebuild your stack. Instead, pick the single most painful manual workflow and pipe Omni into just that. We've seen the highest ROI from these three:",
      },
      {
        type: 'list',
        items: [
          'Lead triage — paste in every WhatsApp message; it tags by intent and urgency.',
          'Invoice extraction — drop a vendor PDF; it returns structured line items into your CRM.',
          'Daily dashboard digest — it watches your numbers and writes you a one-paragraph briefing every morning.',
        ],
      },
      {
        type: 'paragraph',
        text:
          "These are all wins you can ship in under two weeks. They don't require rebuilding anything. And they pay for themselves before the next billing cycle.",
      },
      { type: 'heading', text: "The bigger pattern" },
      {
        type: 'paragraph',
        text:
          "Every wave of AI tooling — GPT-3, GPT-4, Claude 3, Gemini 1.5, Omni — keeps repeating the same story. The teams that win aren't the ones with the fanciest model. They're the ones who picked one boring workflow and automated it ruthlessly. Omni doesn't change that. It just makes the boring stuff slightly easier to automate.",
      },
      {
        type: 'paragraph',
        text:
          "If you want to see what an AI-augmented workflow looks like for your specific business, we'll map it out for free. Drop us a brief — we'll respond within 24 hours.",
      },
    ],
  },
];

export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug);
