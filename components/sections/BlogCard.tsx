import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Clock, Code2, Cpu, LayoutGrid, TrendingUp } from 'lucide-react';
import type { BlogCategory, BlogPost } from '../../lib/blog';

// ─────────────────────────────────────────────────────────────────────────────
// BlogCard — the compact article card, shared by the homepage "Good Stuff"
// section and the /blog index so both grids stay identical.
//
// Deliberately compact: image, category, title, metadata, arrow. No excerpt —
// the card's only job is to get the reader to the article, and a summary in the
// grid competes with the headline sitting right above it.
// ─────────────────────────────────────────────────────────────────────────────

/** Per-category accent + glyph. Keeps the badges scannable without a legend. */
export const CATEGORY_STYLE: Record<
  BlogCategory,
  { accent: string; tint: string; Icon: typeof Cpu }
> = {
  'AI & Automation': { accent: '#9B4DFF', tint: '#C9A8FF', Icon: Cpu },
  'Web Development': { accent: '#3B82F6', tint: '#93BBFD', Icon: Code2 },
  Software: { accent: '#EC4899', tint: '#F9A8D4', Icon: LayoutGrid },
  'Tech Trends': { accent: '#885CF6', tint: '#BFA6FB', Icon: TrendingUp },
};

interface Props {
  post: BlogPost;
  index?: number;
  reduced?: boolean | null;
  onOpen: (slug: string) => void;
}

export const BlogCard: React.FC<Props> = ({ post, index = 0, reduced, onOpen }) => {
  const { accent, tint, Icon } = CATEGORY_STYLE[post.category];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(post.slug)}
      aria-label={`${post.title} — read article`}
      className="gs-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1E3A5F] bg-[#081126] text-left"
      initial={reduced ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: reduced ? 0 : (index % 3) * 0.08,
      }}
    >
      {/* Feature image */}
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081126] via-[#081126]/25 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em]"
          style={{
            borderColor: `${accent}59`,
            backgroundColor: `${accent}1A`,
            color: tint,
          }}
        >
          <Icon className="h-3 w-3" style={{ color: accent }} />
          {post.category}
        </span>

        <h3 className="mt-3.5 text-[1.08rem] font-bold leading-[1.3] tracking-[-0.015em] text-[#F5F7FF] sm:text-[1.12rem]">
          {post.title}
        </h3>

        {/* Metadata + arrow, pinned to the bottom so cards stay level */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#64748B]/60" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="gs-card__arrow flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: `${accent}66`, color: tint }}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
};
