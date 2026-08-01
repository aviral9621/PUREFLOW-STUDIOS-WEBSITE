import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import { ViewState } from '../types';
import { useAllProjects, useProjectBySlug } from '../hooks/useProjects';
import { ProjectImageCarousel } from './sections/ProjectImageCarousel';
import { CaseStudyCard } from './sections/CaseStudyCard';

interface Props {
  slug: string;
  onViewChange: (view: ViewState) => void;
  onOpenProject: (slug: string) => void;
}

export const WorkPostPage: React.FC<Props> = ({ slug, onViewChange, onOpenProject }) => {
  const reduced = useReducedMotion();
  const { project, loading } = useProjectBySlug(slug);
  const { projects: all } = useAllProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) {
      document.title = `${project.title} — Pureflow Studios`;
      const meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = project.description;
    }
  }, [slug, project]);

  if (loading && !project) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black pt-32 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center text-sm text-white/55">Loading…</div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black pt-32 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-white">Case study not found.</h1>
          <p className="mt-3 text-white/55">
            It may have been unpublished. Browse the rest of our work below.
          </p>
          <button
            onClick={() => onViewChange('work')}
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-sm font-bold text-white"
          >
            See all case studies
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    );
  }

  const related = all.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.05] rounded-full blur-[140px]" />
      </div>

      {/* Full-width hero band (escapes the article max-width) */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 pt-20 sm:px-5 sm:pt-24 lg:px-8 lg:pt-28">
        <button
          onClick={() => onViewChange('work')}
          className="group mb-6 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all work
        </button>

        {/* Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl px-2 sm:px-0"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff3f8d]/25 bg-[#ff3f8d]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff7eb2]">
            {project.year} · {project.category}
          </div>
          <h1 className="font-sans text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.4rem] md:text-[2.8rem]">
            {project.title}
          </h1>
          <p className="mt-3 text-[13px] uppercase tracking-[0.16em] text-white/45 sm:text-[14px]">
            {project.client}
          </p>
          <p className="mt-5 text-[15.5px] leading-[1.65] text-white/70 sm:text-[16.5px]">
            {project.description}
          </p>
        </motion.div>

        {/* Hero — carousel (16:10 letterbox so screenshots never crop) */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative mt-7 w-full overflow-hidden rounded-2xl border border-white/10 bg-black sm:mt-9 sm:rounded-3xl"
          style={{ aspectRatio: '16 / 10' }}
        >
          {project.images.length > 0 ? (
            <ProjectImageCarousel images={project.images} intervalMs={4500} fit="contain" />
          ) : (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${project.from} ${project.to}`}
            >
              <span className="font-display text-3xl font-bold text-white/30">
                {project.title}
              </span>
            </div>
          )}
        </motion.div>

        {/* Tech chips */}
        {project.tech.length > 0 && (
          <div className="mx-auto mt-7 flex max-w-3xl flex-wrap gap-1.5 px-2 sm:px-0">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body blocks — image blocks span max-w-5xl; text blocks span max-w-3xl */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-12 sm:px-5 lg:px-8">
        {project.body_blocks.length > 0 && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-10 sm:mt-14"
          >
            {project.body_blocks.map((block, i) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2
                      key={i}
                      className="mx-auto mb-3 mt-10 max-w-3xl px-2 font-sans text-[1.45rem] font-bold leading-tight tracking-[-0.015em] text-white first:mt-0 sm:text-[1.75rem] sm:px-0"
                    >
                      {block.text}
                    </h2>
                  );
                case 'paragraph':
                  return (
                    <p
                      key={i}
                      className="mx-auto mb-5 max-w-3xl px-2 text-[15.5px] leading-[1.75] text-white/75 sm:px-0 sm:text-base sm:leading-[1.8]"
                    >
                      {block.text}
                    </p>
                  );
                case 'list':
                  return (
                    <ul key={i} className="mx-auto mb-5 max-w-3xl space-y-2.5 px-2 sm:px-0">
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
                case 'quote':
                  return (
                    <blockquote
                      key={i}
                      className="mx-auto my-7 max-w-3xl border-l-2 border-[#ff3f8d] bg-white/[0.02] px-5 py-4 text-[15.5px] italic leading-[1.7] text-white/85 sm:text-[17px]"
                    >
                      {block.text}
                    </blockquote>
                  );
                case 'code':
                  return (
                    <pre
                      key={i}
                      className="mx-auto mb-5 max-w-3xl overflow-x-auto rounded-xl border border-white/10 bg-[#08060d] p-4 text-[12.5px] leading-[1.6] text-white/80"
                    >
                      <code>{block.text}</code>
                    </pre>
                  );
                case 'divider':
                  return (
                    <div key={i} className="mx-auto my-10 max-w-3xl px-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    </div>
                  );
                case 'image':
                  if (!block.image_url) return null;
                  return (
                    <figure key={i} className="mx-auto my-7 max-w-5xl px-2 sm:px-0">
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-black sm:rounded-2xl">
                        <img
                          src={block.image_url}
                          alt={block.alt_text ?? block.caption ?? ''}
                          loading="lazy"
                          className="block w-full h-auto"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="mt-2 text-center text-[12px] italic text-white/45 sm:text-[12.5px]">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                case 'image-grid':
                  if (!block.images || block.images.length === 0) return null;
                  const cols = block.cols ?? 2;
                  const gridCls = cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
                  return (
                    <div key={i} className={`mx-auto my-7 grid max-w-5xl grid-cols-1 gap-3 px-2 ${gridCls} sm:gap-4 sm:px-0`}>
                      {block.images.map((img, j) => (
                        <figure key={j} className="m-0">
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                            <img
                              src={img.url}
                              alt={img.alt ?? img.caption ?? ''}
                              loading="lazy"
                              className="block w-full h-auto"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="mt-1.5 px-1 text-[12px] text-white/55">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  );
                case 'image-slider':
                  if (!block.images || block.images.length === 0) return null;
                  return (
                    <div
                      key={i}
                      className="mx-auto my-7 w-full max-w-5xl px-2 sm:my-9 sm:px-0"
                    >
                      <div
                        className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black sm:rounded-2xl"
                        style={{ aspectRatio: '16 / 10' }}
                      >
                        <ProjectImageCarousel
                          images={block.images}
                          intervalMs={5000}
                          fit="contain"
                          showCaptions
                        />
                      </div>
                      <p className="mt-2 text-center text-[11px] uppercase tracking-[0.16em] text-white/35">
                        {block.images.length} screens · swipe or use the arrows
                      </p>
                    </div>
                  );
                case 'stats':
                  if (!block.stats || block.stats.length === 0) return null;
                  return (
                    <div
                      key={i}
                      className="mx-auto my-7 grid max-w-5xl grid-cols-2 gap-2 px-2 sm:grid-cols-4 sm:gap-3 sm:px-0"
                    >
                      {block.stats.map((s, j) => (
                        <div
                          key={j}
                          className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center sm:p-4"
                        >
                          <p className="font-sans text-[1.4rem] font-bold leading-none tracking-tight text-white sm:text-[1.7rem]">
                            {s.value}
                          </p>
                          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:text-[11px]">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </motion.div>
        )}

        {/* Live site + Start a project CTA card */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] p-6 text-center sm:p-9"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.14) 0%, transparent 55%)',
            }}
          />
          <h3 className="relative font-sans text-[1.25rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.5rem]">
            Want something like this for your business?
          </h3>
          <p className="relative mt-2.5 text-[13.5px] text-white/60 sm:text-[14.5px]">
            Send us a 2-line brief. Fixed-price proposal in 48 hours.
          </p>
          <div className="relative mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={() => onViewChange('start-project')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-6 text-[13px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-12 sm:px-7 sm:text-[14px]"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </button>
            {project.url && (
              <a
                href={`https://${project.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.08] sm:h-12 sm:px-7 sm:text-[14px]"
              >
                Visit live site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="relative z-10 mx-auto mt-4 max-w-6xl px-5 pb-20 sm:px-6 lg:px-10">
          <h2 className="mb-6 font-sans text-[1.4rem] font-semibold tracking-[-0.015em] text-white sm:text-[1.6rem]">
            More case studies
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-7">
            {related.map((p, i) => (
              <CaseStudyCard
                key={p.id}
                project={p}
                reduced={reduced}
                index={i}
                onOpen={onOpenProject}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
