import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react';
import { ViewState } from '../types';
import { findPost, POSTS, type BlogPost } from '../lib/blog';

interface BlogPostPageProps {
  slug: string;
  onViewChange: (view: ViewState) => void;
  onOpenPost: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onViewChange, onOpenPost }) => {
  const reduced = useReducedMotion();
  const post = findPost(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      document.title = `${post.title} — Pureflow Studios`;
      const meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = post.excerpt;
    }
  }, [slug, post]);

  if (!post) {
    return (
      <main className="relative min-h-[100svh] overflow-hidden bg-black pt-32 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-white">Article not found.</h1>
          <p className="mt-3 text-white/55">The article you’re looking for doesn’t exist or has been moved.</p>
          <button
            onClick={() => onViewChange('blog')}
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-sm font-bold text-white"
          >
            Browse all articles
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    );
  }

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.05] rounded-full blur-[140px]" />
      </div>

      <article className="relative z-10 mx-auto max-w-3xl px-5 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <button
          onClick={() => onViewChange('blog')}
          className="group mb-8 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Good Stuff
        </button>

        {/* Meta + Title */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff3f8d]/25 bg-[#ff3f8d]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff7eb2]">
            {post.category}
          </div>
          <h1 className="font-sans text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.4rem] md:text-[2.8rem]">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/45 sm:text-[13px]">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </motion.div>

        {/* Cover image */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 sm:mt-10 sm:rounded-3xl"
        >
          <img src={post.image} alt={post.imageAlt} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Body */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-10 space-y-6 sm:mt-12"
        >
          {post.content.map((block, i) => {
            if (block.type === 'heading') {
              return (
                <h2 key={i} className="mt-6 font-sans text-[1.4rem] font-bold leading-tight tracking-[-0.015em] text-white sm:text-[1.6rem]">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p key={i} className="text-[15.5px] leading-[1.75] text-white/75 sm:text-base sm:leading-[1.8]">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'list') {
              return (
                <ul key={i} className="space-y-2.5 pl-1">
                  {block.items?.map((item, j) => (
                    <li
                      key={j}
                      className="relative pl-6 text-[15px] leading-[1.7] text-white/70 sm:text-[15.5px]"
                    >
                      <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#ff2f86] to-[#a855f7]" />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote
                  key={i}
                  className="relative border-l-2 border-[#ff3f8d] bg-white/[0.02] px-5 py-4 text-[15.5px] italic leading-[1.7] text-white/85 sm:text-[17px]"
                >
                  {block.text}
                </blockquote>
              );
            }
            if (block.type === 'code') {
              return (
                <pre
                  key={i}
                  className="overflow-x-auto rounded-xl border border-white/10 bg-[#08060d] p-4 text-[12.5px] leading-[1.6] text-white/80"
                >
                  <code>{block.text}</code>
                </pre>
              );
            }
            return null;
          })}
        </motion.div>

        {/* End CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] p-6 text-center sm:p-9"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.14) 0%, transparent 55%)',
            }}
          />
          <h3 className="relative font-sans text-[1.25rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.5rem]">
            Want this for your business?
          </h3>
          <p className="relative mt-2.5 text-[13.5px] text-white/60 sm:text-[14.5px]">
            Send us a 2-line brief. Fixed-price proposal in 48 hours.
          </p>
          <button
            onClick={() => onViewChange('contact')}
            className="relative mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-6 text-[13px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-12 sm:px-7 sm:text-[14px]"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="relative z-10 mx-auto mt-4 max-w-6xl px-5 pb-20 sm:px-6 lg:px-10">
          <h2 className="mb-6 font-sans text-[1.4rem] font-semibold tracking-[-0.015em] text-white sm:text-[1.6rem]">
            Keep reading
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-7">
            {related.map((p: BlogPost, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => onOpenPost(p.slug)}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#08060d] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3f8d]/45 sm:rounded-3xl"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md sm:top-4 sm:left-4">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-white/40">
                    <span>{p.date}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-sans text-[1.05rem] font-semibold leading-[1.25] tracking-[-0.015em] text-white sm:text-[1.15rem]">
                    {p.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
