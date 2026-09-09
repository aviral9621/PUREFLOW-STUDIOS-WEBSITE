import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ViewState } from '../types';
import { POSTS } from '../lib/blog';
import { BlogCard } from './sections/BlogCard';
import { ShowMore } from './shared/ShowMore';

/** How many articles the listing opens with, before "Show all". */
const INITIAL_COUNT = 3;

interface BlogIndexPageProps {
  onViewChange: (view: ViewState) => void;
  onOpenPost: (slug: string) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onViewChange, onOpenPost }) => {
  const reduced = useReducedMotion();

  // Open with one tidy row; the rest is revealed in place rather than on a
  // second page, so the reader never loses their scroll position.
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? POSTS : POSTS.slice(0, INITIAL_COUNT);
  const hasMore = POSTS.length > visible.length;

  // Appending cards while removing the button below them is enough of a subtree
  // change that Chrome's scroll anchoring nudges the page. Pin the offset so the
  // grid grows under a still page.
  const showAll = () => {
    const y = window.scrollY;
    setExpanded(true);
    requestAnimationFrame(() => window.scrollTo(0, y));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#040A1C] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-[620px] w-[1100px] max-w-full -translate-x-1/2 rounded-full bg-[#885CF6]/[0.10] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-24 pb-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        <button
          onClick={() => onViewChange('home')}
          className="group mb-8 flex items-center gap-2 text-sm text-[#94A3B8] transition-colors hover:text-white sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        {/* Hero */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] italic leading-[1.1] text-[#F5F7FF]/90">
            Some
          </span>

          <h1 className="gs-heading mt-1 text-[clamp(2.5rem,5.6vw,4.5rem)] leading-none">
            Good <span className="gs-heading__accent">Stuff.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-[#94A3B8] sm:text-base">
            Field notes on AI, automation, and the boring software that quietly runs
            growing businesses.
          </p>
        </motion.div>

        {/* Posts grid */}
        <div className="blog-grid mt-12">
          {visible.map((post, i) => (
            <BlogCard
              key={post.slug}
              post={post}
              index={i}
              reduced={reduced}
              onOpen={onOpenPost}
            />
          ))}
        </div>

        {hasMore && (
          <ShowMore
            shown={visible.length}
            total={POSTS.length}
            label={`Show all ${POSTS.length} articles`}
            noun="articles"
            intent="expand"
            reduced={reduced}
            onClick={showAll}
          />
        )}
      </div>
    </main>
  );
};
