import React, { useEffect } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Calendar, Check } from 'lucide-react';
import { ViewState } from '../../types';
import type { CardRows, Showcase, ShowcaseImage, ShowcaseProduct } from '../../lib/showcases';
import { viewToPath } from '../../lib/router';
import { Footer } from '../Footer';

// ─────────────────────────────────────────────────────────────────────────────
// ShowcasePage — the editorial project page. Data: `lib/showcases.ts`.
//
//   Hero ············· logo, statement, project focus, wide visual
//   The brief ········ facts
//   The problem ······ bento of real UI crops
//   Our process ······ numbered steps
//   What we delivered  one block per product (CRM / app / website)
//   The design system  the client's palette + type
//   The impact ······· four numbers
//   In their words
//   Let's build yours (centred CTA panel)
//
// The layout follows editorial agency case studies; the look is Pureflow's
// own, the same as every other page on the site:
//   • headings = an Instrument Serif italic lead-in + one Anton word in the
//     animated brand gradient (`hero-automation-text`) with a soft pink/violet
//     glow behind it (`.sc-glow`);
//   • eyebrows = `gradient-flow-text`; numbers = Anton in the brand gradient;
//   • body = Inter on near-black with violet/pink washes.
// The client's own colours appear only as content (the design-system swatches).
// Everything visual is a still image; nothing embeds a live site.
// ─────────────────────────────────────────────────────────────────────────────

const WRAP = 'mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12';
const SECTION = 'relative border-t border-white/[0.06] py-20 sm:py-28 lg:py-32';

interface Props {
  showcase: Showcase;
  onViewChange: (view: ViewState) => void;
  /** Accepted for routing parity with the other project pages; unused. */
  onOpenProject?: (slug: string) => void;
}

export const ShowcasePage: React.FC<Props> = ({ showcase: s, onViewChange }) => {
  const reduced = !!useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [s.slug]);

  // Type specimens need their faces; the site only ships its own fonts.
  useEffect(() => {
    s.type.forEach(({ google }) => {
      if (!google) return;
      const href = `https://fonts.googleapis.com/css2?family=${google}&display=swap`;
      if (document.head.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [s.type]);

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <Hero s={s} reduced={reduced} onBack={() => onViewChange('work')} />
      <Brief s={s} reduced={reduced} />
      <Problem s={s} reduced={reduced} />
      <Process s={s} reduced={reduced} />
      <Products s={s} reduced={reduced} />
      <DesignSystem s={s} reduced={reduced} />
      <Impact s={s} reduced={reduced} />
      {s.testimonial && <Words s={s} reduced={reduced} />}
      <Closing
        reduced={reduced}
        onStart={() => onViewChange('start-project')}
        onCall={() => onViewChange('book-call')}
      />
      <Footer onViewChange={onViewChange} />
    </main>
  );
};

// ── Shared pieces ───────────────────────────────────────────────────────────

/** Fades content up once as it enters the viewport. */
const Reveal: React.FC<{
  reduced: boolean;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}> = ({ reduced, className, delay = 0, children }) => (
  <m.div
    className={className}
    initial={reduced ? false : { opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </m.div>
);

/** A gradient display word with the brand glow behind it. */
const Display: React.FC<{ text: string; className: string }> = ({ text, className }) => (
  <span className="sc-glow">
    <span className={`hero-automation-text sc-display ${className}`} data-text={text}>
      {text}
    </span>
  </span>
);

/** The site's heading: serif italic lead-in over one gradient display word. */
const Heading: React.FC<{
  lead: string;
  word: string;
  size?: 'lg' | 'md';
  as?: 'h2' | 'h3';
  className?: string;
}> = ({ lead, word, size = 'lg', as: Tag = 'h2', className = '' }) => (
  <Tag className={`flex flex-col items-start ${className}`}>
    <span
      className={`font-serif italic leading-[1.1] tracking-normal text-white/95 ${
        size === 'lg' ? 'text-[clamp(1.6rem,3.2vw,2.75rem)]' : 'text-[clamp(1.45rem,2.6vw,2.2rem)]'
      }`}
    >
      {lead}
    </span>
    <Display
      text={word}
      className={`mt-1 ${size === 'lg' ? 'text-[clamp(3.1rem,7.4vw,6.25rem)]' : 'text-[clamp(2.6rem,5.4vw,4.5rem)]'}`}
    />
  </Tag>
);

const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p
    className={`gradient-flow-text text-[11px] font-bold uppercase tracking-[0.24em] ${className}`}
  >
    {children}
  </p>
);

/** Paragraph with `**emphasis**`. */
const Rich: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <p className={className}>
    {text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') ? (
        <strong key={i} className="font-semibold text-white">
          {p.slice(2, -2)}
        </strong>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    )}
  </p>
);

/** Brand-gradient dot used on chips. */
const Dot = () => (
  <span
    aria-hidden="true"
    className="h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-r from-[#ff2f86] to-[#a855f7]"
  />
);

/**
 * A still. 'tile' images (crops of light UI) sit centred on a light canvas
 * with breathing room; everything else fills its rounded box edge to edge.
 */
const Still: React.FC<{ image: ShowcaseImage; className?: string; eager?: boolean }> = ({
  image,
  className = '',
  eager,
}) => {
  const img = (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="block h-auto w-full"
    />
  );
  return image.frame === 'tile' ? (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#F7F7F9] p-3 sm:rounded-[22px] sm:p-5 ${className}`}
    >
      {img}
    </div>
  ) : (
    <div className={`overflow-hidden rounded-2xl bg-white sm:rounded-[22px] ${className}`}>
      {img}
    </div>
  );
};

/**
 * Cut-out cards (transparent rounded corners) straight on the dark page. Every
 * card in a row is the same size (the images are padded to a common canvas
 * when they're cut), so equal columns line them up exactly. Tablets pair them
 * up; phones stack them.
 */
const CardGrid: React.FC<{ rows: CardRows; reduced: boolean; className?: string }> = ({
  rows,
  reduced,
  className = '',
}) => (
  <div className={`grid gap-3 sm:gap-4 ${className}`}>
    {rows.map((row, r) => (
      <div
        key={r}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
        style={{ ['--n' as string]: row.length }}
      >
        {row.map((img, i) => (
          <Reveal key={img.src} reduced={reduced} delay={i * 0.06}>
            <img
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
            />
          </Reveal>
        ))}
      </div>
    ))}
  </div>
);

/** A violet/pink wash behind a section, the same atmosphere as the rest of the site. */
const Wash: React.FC<{ at?: string }> = ({ at = '50% 0%' }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
    style={{
      background: `radial-gradient(60% 45% at ${at}, rgba(124,58,237,0.14), rgba(255,47,134,0.05) 45%, transparent 70%)`,
    }}
  />
);

// ── Sections ────────────────────────────────────────────────────────────────

const Hero: React.FC<{ s: Showcase; reduced: boolean; onBack: () => void }> = ({
  s,
  reduced,
  onBack,
}) => {
  const visual = s.hero ?? s.products[0]?.gallery[0];
  return (
    <section className="relative overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
        style={{
          background:
            'radial-gradient(120% 70% at 50% -12%, rgba(164,82,255,0.26) 0%, rgba(255,47,134,0.1) 42%, transparent 72%)',
        }}
      />

      <div className={`relative ${WRAP}`}>
        <a
          href={viewToPath('work')}
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All work
        </a>

        <Reveal reduced={reduced} className="mt-10 sm:mt-14">
          <Eyebrow>Case study</Eyebrow>
          <img
            src={s.logo.src}
            alt={s.client}
            width={s.logo.width}
            height={s.logo.height}
            className="mt-6 h-11 w-auto invert sm:h-14"
          />
          <h1 className="mt-8 flex flex-col items-start">
            <span className="font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] italic leading-[1.1] tracking-normal text-white/95">
              {s.headline.lead}
            </span>
            <Display text={s.headline.word} className="mt-1 text-[clamp(2.75rem,7.4vw,6.5rem)]" />
          </h1>

          <div className="mt-9 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
              Project focus
            </span>
            {s.focus.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white/85"
              >
                <Dot />
                {f}
              </span>
            ))}
          </div>
        </Reveal>

        {visual && (
          <Reveal reduced={reduced} delay={0.1} className="mt-12 sm:mt-16">
            <Still
              image={visual}
              eager
              className="shadow-[0_40px_120px_-40px_rgba(217,70,239,0.45)]"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
};

const Brief: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <div className={`${WRAP} grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20`}>
      <Reveal reduced={reduced}>
        <Heading lead="The" word="BRIEF." size="md" />
        <Rich
          text={s.brief}
          className="mt-8 max-w-[640px] text-[16px] leading-[1.75] text-white/65 sm:text-[18px]"
        />
      </Reveal>
      <Reveal reduced={reduced} delay={0.1}>
        <dl className="grid gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:rounded-[22px] sm:p-8">
          {s.facts.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
                {f.label}
              </dt>
              <dd className="mt-2 text-[15px] leading-[1.55] text-white/85 sm:text-[16px]">
                {f.value}
              </dd>
            </div>
          ))}
          {s.links?.map((l) => (
            <div key={l.href}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
                Live
              </dt>
              <dd className="mt-2">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-white underline decoration-[#d946ef]/50 underline-offset-4 transition-colors hover:decoration-[#d946ef] sm:text-[16px]"
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </section>
);

const Problem: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => {
  // Bento: alternate wide/narrow so the tiles interlock row by row.
  const spans = ['sm:col-span-4', 'sm:col-span-2', 'sm:col-span-2', 'sm:col-span-4'];
  return (
    <section className={SECTION}>
      <Wash at="15% 0%" />
      <div className={`relative ${WRAP}`}>
        <Reveal reduced={reduced} className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Heading lead="The" word="PROBLEM." />
          <Rich
            text={s.problem}
            className="max-w-[560px] text-[16px] leading-[1.75] text-white/65 sm:text-[17px]"
          />
        </Reveal>
        {s.problemCards && s.problemCards.length > 0 ? (
          <CardGrid rows={s.problemCards} reduced={reduced} className="mt-12 sm:mt-16" />
        ) : (
          s.problemGallery &&
          s.problemGallery.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-6 sm:gap-4">
              {s.problemGallery.map((img, i) => (
                <Reveal
                  key={img.src}
                  reduced={reduced}
                  delay={(i % 2) * 0.08}
                  className={`${spans[i % spans.length]} flex`}
                >
                  <Still image={img} className="w-full" />
                </Reveal>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
};

const Process: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <div className={`${WRAP} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
      <Reveal reduced={reduced} className="lg:sticky lg:top-32 lg:self-start">
        <Heading lead="Our" word="PROCESS." />
        <p className="mt-6 max-w-[420px] text-[16px] leading-[1.7] text-white/55">
          From the first workshop to the day every branch went live.
        </p>
      </Reveal>
      <ol>
        {s.process.map((step, i) => (
          <Reveal key={step} reduced={reduced} delay={i * 0.04}>
            <li className="flex items-center gap-5 border-b border-white/[0.08] py-5 sm:gap-7 sm:py-6">
              <span className="sc-num w-12 flex-none text-[30px] leading-none sm:w-14 sm:text-[38px]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[17px] font-medium text-white/85 sm:text-[19px]">{step}</span>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

const Products: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <Wash at="85% 0%" />
    <div className={`relative ${WRAP}`}>
      <Reveal reduced={reduced}>
        <Eyebrow>
          {s.products.length > 1 ? `${s.products.length} products · One backend` : 'The software'}
        </Eyebrow>
        <Heading lead="What we" word="DELIVERED." className="mt-5" />
      </Reveal>
      {s.products.map((p, i) => (
        // Without its own hero image the hero borrows the first product's
        // lead image; don't show it twice.
        <Product key={p.kind} p={p} index={i} reduced={reduced} skipLead={!s.hero && i === 0} />
      ))}
    </div>
  </section>
);

const Product: React.FC<{
  p: ShowcaseProduct;
  index: number;
  reduced: boolean;
  skipLead?: boolean;
}> = ({ p, index, reduced, skipLead }) => {
  const [first, ...rest] = skipLead ? [undefined, ...p.gallery.slice(1)] : p.gallery;
  // Very wide crops (strips) take the full row; the rest pair up.
  const wide = (img: ShowcaseImage) => img.width / img.height > 3.2;
  return (
    <article className="mt-16 border-t border-white/[0.08] pt-10 sm:mt-24 sm:pt-14">
      <Reveal
        reduced={reduced}
        className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14"
      >
        <div className="flex items-end gap-4 sm:gap-5">
          <span className="sc-num text-[44px] leading-[0.9] sm:text-[60px]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-anton text-[clamp(2rem,3.9vw,3.1rem)] uppercase leading-[0.95] tracking-[0.01em] text-white">
            {p.name}
          </h3>
        </div>
        <div>
          <p className="max-w-[560px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">
            {p.summary}
          </p>
          {p.features.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-white/80"
                >
                  <Dot />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      {p.cards && p.cards.length > 0 && (
        <CardGrid rows={p.cards} reduced={reduced} className="mt-10 sm:mt-14" />
      )}

      {first && (
        <Reveal reduced={reduced} className="mt-10 sm:mt-14">
          {p.phone ? (
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.34fr)] gap-3 sm:gap-4">
              <Still image={first} />
              <div className="overflow-hidden rounded-2xl bg-white sm:rounded-[22px]">
                <img
                  src={p.phone.src}
                  alt={p.phone.alt}
                  width={p.phone.width}
                  height={p.phone.height}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          ) : (
            <Still image={first} />
          )}
        </Reveal>
      )}

      {rest.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${first ? 'mt-3 sm:mt-4' : 'mt-10 sm:mt-14'}`}
        >
          {rest.map((img) => (
            <Reveal
              key={img.src}
              reduced={reduced}
              className={`flex ${wide(img) ? 'sm:col-span-2' : ''}`}
            >
              <Still image={img} className="w-full" />
            </Reveal>
          ))}
        </div>
      )}
    </article>
  );
};

const DesignSystem: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <div className={WRAP}>
      <Reveal reduced={reduced} className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <Heading lead="The design" word="SYSTEM." />
        <p className="max-w-[520px] text-[16px] leading-[1.7] text-white/65 sm:text-[17px]">
          One visual language across every product, built on the client’s own brand colours and
          type.
        </p>
      </Reveal>

      {s.systemImage ? (
        <Reveal reduced={reduced} className="mt-12 sm:mt-16">
          <Still image={s.systemImage} />
        </Reveal>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {s.palette.map((c, i) => {
              const dark = luminance(c.hex) < 0.5;
              return (
                <Reveal key={c.hex} reduced={reduced} delay={i * 0.05}>
                  <div
                    className={`flex aspect-[5/4] flex-col justify-between rounded-2xl p-4 sm:aspect-[4/5] sm:rounded-[22px] sm:p-5 ${
                      dark ? 'text-white' : 'text-[#0d0b12]'
                    } ${luminance(c.hex) < 0.08 ? 'ring-1 ring-white/10' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="text-[14px] font-semibold sm:text-[15px]">{c.name}</span>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] ${
                        dark ? 'bg-white/15' : 'bg-black/[0.07]'
                      }`}
                    >
                      {c.hex.toUpperCase()}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
            {s.type.map((t, i) => (
              <Reveal key={t.family} reduced={reduced} delay={i * 0.08}>
                <div className="flex items-center gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:gap-8 sm:rounded-[22px] sm:p-8">
                  <span
                    className="flex-none text-[60px] leading-none text-white sm:text-[84px]"
                    style={{ fontFamily: `'${t.family}', sans-serif`, fontWeight: 600 }}
                  >
                    Aa
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[22px] text-white sm:text-[26px]"
                      style={{ fontFamily: `'${t.family}', sans-serif`, fontWeight: 600 }}
                    >
                      {t.family}
                    </p>
                    <Eyebrow className="mt-2">{t.role}</Eyebrow>
                    <p className="mt-2 text-[14px] text-white/50">{t.weights}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
);

const Impact: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <Wash />
    <div className={`relative ${WRAP}`}>
      <Reveal reduced={reduced}>
        <Heading lead="The" word="IMPACT." />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
        {s.impact.map((mt, i) => (
          <Reveal key={mt.label} reduced={reduced} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:rounded-[22px] sm:p-7">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
                {mt.label}
              </p>
              <p className="sc-num mt-4 text-[clamp(2.6rem,5.4vw,4.5rem)] leading-none">
                {mt.value}
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-white/60">{mt.caption}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Words: React.FC<{ s: Showcase; reduced: boolean }> = ({ s, reduced }) => (
  <section className={SECTION}>
    <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16`}>
      <Reveal reduced={reduced}>
        <Heading lead="In their" word="WORDS." />
      </Reveal>
      <Reveal reduced={reduced} delay={0.1}>
        <blockquote className="relative">
          <p className="font-serif text-[clamp(1.4rem,2.4vw,2rem)] italic leading-[1.4] text-white/90">
            {s.testimonial!.quote}
          </p>
          <footer className="mt-8 flex items-center gap-3">
            <span
              className="h-px w-8 bg-gradient-to-r from-[#ff2f86] to-[#a855f7]"
              aria-hidden="true"
            />
            <span>
              <span className="block text-[15px] font-semibold text-white">
                {s.testimonial!.name}
              </span>
              <span className="block text-[14px] text-white/50">{s.testimonial!.role}</span>
            </span>
          </footer>
        </blockquote>
      </Reveal>
    </div>
  </section>
);

const PROMISES = ['Fixed-price proposals', 'Reply within 24 hours', '30-day post-launch support'];

/** Closing call to action: centred, framed in a gradient-edged panel with the brand glow. */
const Closing: React.FC<{
  reduced: boolean;
  onStart: () => void;
  onCall: () => void;
}> = ({ reduced, onStart, onCall }) => (
  <section className="relative py-20 sm:py-28 lg:py-32">
    <div className={WRAP}>
      <Reveal reduced={reduced}>
        {/* 1px gradient edge: the outer div is the border, the inner one the panel. */}
        <div className="rounded-[28px] bg-gradient-to-br from-[#ff2f86]/60 via-white/[0.08] to-[#a855f7]/60 p-px sm:rounded-[36px]">
          <div className="relative overflow-hidden rounded-[27px] bg-[#08070b] px-6 py-16 text-center sm:rounded-[35px] sm:px-12 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(55% 60% at 50% 0%, rgba(217,70,239,0.22), transparent 70%), radial-gradient(40% 50% at 50% 110%, rgba(255,47,134,0.14), transparent 70%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              }}
            />

            <div className="relative flex flex-col items-center">
              <Eyebrow>Your turn</Eyebrow>
              <h2 className="mt-5 flex flex-col items-center">
                <span className="font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] italic leading-[1.1] tracking-normal text-white/95">
                  Running an institute on spreadsheets?
                </span>
                <span className="sc-glow mt-1">
                  <span
                    className="hero-automation-text text-[clamp(2.9rem,7vw,6rem)] leading-[0.95]"
                    data-text="LET’S BUILD YOURS."
                  >
                    LET’S BUILD YOURS.
                  </span>
                </span>
              </h2>
              <p className="mt-6 max-w-[480px] text-[16px] leading-[1.7] text-white/60 sm:text-[17px]">
                Tell us how your team works today. We’ll show you what it could look like.
              </p>

              <div className="mt-9 flex w-full max-w-[440px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
                <button
                  onClick={onStart}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-8 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,47,134,0.28)] transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(255,47,134,0.5)]"
                >
                  Start a project
                  <ArrowUpRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onCall}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/10 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Calendar className="h-4 w-4" />
                  Book a 15-min call
                </button>
              </div>

              <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {PROMISES.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[13px] text-white/55">
                    <Check className="h-4 w-4 text-[#d946ef]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/** Relative luminance, 0 (black) to 1 (white). */
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
