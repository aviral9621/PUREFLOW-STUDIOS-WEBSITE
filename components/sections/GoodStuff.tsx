import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BLOG_CATEGORIES, POSTS, type BlogCategory } from '../../lib/blog';
import { BlogCard } from './BlogCard';
import { ViewState } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// GoodStuff — the homepage blog section: heading, category filters, three
// compact cards and the way through to the full listing.
//
// The card itself lives in `./BlogCard` so this section and /blog render the
// identical grid.
// ─────────────────────────────────────────────────────────────────────────────

/** How many cards the grid shows at once, per the section's three-up layout. */
const CARD_COUNT = 3;

type Filter = 'All' | BlogCategory;

interface GoodStuffProps {
  onViewChange: (view: ViewState) => void;
  onOpenPost: (slug: string) => void;
}

export function GoodStuff({ onViewChange, onOpenPost }: GoodStuffProps) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');

  // Only offer a pill that leads somewhere — a filter matching zero posts is a
  // dead end, so the taxonomy is intersected with what is actually published.
  const filters = useMemo<Filter[]>(
    () => ['All', ...BLOG_CATEGORIES.filter((c) => POSTS.some((p) => p.category === c))],
    []
  );

  const visible = useMemo(
    () =>
      (filter === 'All' ? POSTS : POSTS.filter((p) => p.category === filter)).slice(
        0,
        CARD_COUNT
      ),
    [filter]
  );

  return (
    <section
      id="good-stuff"
      className="relative overflow-hidden bg-[#040A1C] py-20 md:py-28"
      aria-label="Our blog — featured articles"
    >
      {/* Background depth — kept low-opacity so the cards stay the brightest thing */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-[#885CF6]/[0.10] blur-[150px]" />
        <div className="absolute -bottom-40 right-[-10%] h-[420px] w-[620px] rounded-full bg-[#EC4899]/[0.07] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* ── Header ── */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#885CF6]/30 bg-[#885CF6]/[0.08] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A8FF] sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9B4DFF]" />
            Our Blog
          </span>

          <span className="mt-6 font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] italic leading-[1.1] text-[#F5F7FF]/90">
            Some
          </span>

          <h2 className="gs-heading mt-1 text-[clamp(2.5rem,5.6vw,4.5rem)] leading-none">
            Good <span className="gs-heading__accent">Stuff.</span>
          </h2>

          <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-[#94A3B8] sm:text-base">
            Practical writing on AI, automation, websites and software — what actually
            moves the needle for growing businesses, and what only sounds like it does.
          </p>
        </motion.div>

        {/* ── Category filters ── */}
        <motion.div
          className="gs-filters mt-10 flex gap-2.5 overflow-x-auto pb-1 sm:mt-12 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`flex-shrink-0 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${
                  active
                    ? 'gs-pill-active text-white'
                    : 'border border-[#1E3A5F] bg-white/[0.02] text-[#94A3B8] hover:border-[#885CF6]/45 hover:text-[#F5F7FF]'
                }`}
              >
                {f}
              </button>
            );
          })}
        </motion.div>

        {/* ── Cards ── */}
        <div className="blog-grid mt-8 sm:mt-10">
          {visible.map((post, i) => (
            <BlogCard
              // Keyed on the filter too, so a change re-runs the reveal rather
              // than swapping text under a card that never moves.
              key={`${filter}-${post.slug}`}
              post={post}
              index={i}
              reduced={reduced}
              onOpen={onOpenPost}
            />
          ))}
        </div>

        {/* ── View all ── */}
        <motion.div
          className="mt-14 flex items-center justify-center gap-4 sm:gap-6"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="gs-rule hidden h-px w-16 sm:block sm:w-24" aria-hidden="true" />

          <button
            type="button"
            onClick={() => onViewChange('blog')}
            className="gs-cta group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[14px] font-semibold text-[#F5F7FF]"
          >
            View All Articles
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <span
            className="gs-rule gs-rule--flip hidden h-px w-16 sm:block sm:w-24"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
