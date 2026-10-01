import React, { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ViewState } from '../../types';
import type { Showcase, ShowcaseImage, ShowcaseProduct } from '../../lib/showcases';
import { Footer } from '../Footer';
import {
  SECTION,
  WRAP,
  Brief,
  CardGrid,
  Closing,
  DesignSystem,
  Dot,
  Eyebrow,
  Heading,
  Hero,
  Impact,
  Reveal,
  Rich,
  Still,
  Wash,
  Words,
  useSpecimenFonts,
} from './parts';
import { WebsiteShowcase } from './WebsiteShowcase';

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

interface Props {
  showcase: Showcase;
  onViewChange: (view: ViewState) => void;
  /** Accepted for routing parity with the other project pages; unused. */
  onOpenProject?: (slug: string) => void;
}

export const ShowcasePage: React.FC<Props> = (props) =>
  // Website projects tell a different story (goals, sitemap, page by page,
  // every screen) — see WebsiteShowcase.tsx.
  props.showcase.site ? <WebsiteShowcase {...props} /> : <ProductShowcase {...props} />;

const ProductShowcase: React.FC<Props> = ({ showcase: s, onViewChange }) => {
  const reduced = !!useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [s.slug]);
  useSpecimenFonts(s.type);

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <Hero s={s} reduced={reduced} onBack={() => onViewChange('work')} />
      <Brief s={s} reduced={reduced} />
      <Problem s={s} reduced={reduced} />
      <Process s={s} reduced={reduced} />
      <Products s={s} reduced={reduced} />
      <DesignSystem s={s} reduced={reduced} />
      {s.impact.length > 0 && <Impact s={s} reduced={reduced} />}
      {s.testimonial && <Words s={s} reduced={reduced} />}
      <Closing
        lead={s.ctaLead ?? 'Running your business on spreadsheets?'}
        reduced={reduced}
        onStart={() => onViewChange('start-project')}
        onCall={() => onViewChange('book-call')}
      />
      <Footer onViewChange={onViewChange} />
    </main>
  );
};

// ── Sections (software / product pages) ─────────────────────────────────────

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
          {s.processNote ?? 'From the first workshop to launch day.'}
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

