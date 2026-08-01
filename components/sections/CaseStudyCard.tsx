import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { type Project } from '../../hooks/useProjects';
import { ProjectImageCarousel } from './ProjectImageCarousel';
import { LiveCardPreview } from './LiveCardPreview';
import { Mockup } from '../casestudy/Mockup';

// ─── Browser chrome mockup ──────────────────────────────────────────────────

interface MockupProps {
  url: string;
  from: string;
  to: string;
}

function BrowserMockup({ url, from, to }: MockupProps) {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Chrome bar */}
      <div className="flex-shrink-0 h-8 bg-black/70 backdrop-blur-sm flex items-center gap-1.5 px-3 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <div className="flex-1 mx-2 h-4 rounded bg-white/5 flex items-center px-2">
          <span className="text-white/20 text-[9px] font-mono truncate">{url}</span>
        </div>
      </div>

      {/* Gradient + dot grid */}
      <div className={`flex-1 relative bg-gradient-to-br ${from} ${to}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {/* UI skeleton */}
        <div className="absolute inset-0 flex">
          <div className="w-[18%] bg-black/25 border-r border-white/5 p-3 space-y-2">
            <div className="h-3 w-full rounded bg-white/8" />
            <div className="h-3 w-3/4 rounded bg-white/5" />
            <div className="h-3 w-2/3 rounded bg-white/4" />
            <div className="h-3 w-full rounded bg-white/5 mt-4" />
            <div className="h-3 w-3/4 rounded bg-white/4" />
          </div>
          <div className="flex-1 p-4 space-y-3">
            <div className="h-5 w-2/3 rounded-md bg-white/10" />
            <div className="h-3 w-1/3 rounded bg-white/6" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-16 rounded-xl bg-white/8" />
              <div className="h-16 rounded-xl bg-white/5" />
              <div className="h-10 rounded-xl bg-white/5 col-span-2" />
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 rounded-full bg-white/8" />
              <div className="h-6 w-16 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CaseStudyCard ────────────────────────────────────────────────────────────
//
// Lives in its own module (rather than inside `sections/Work.tsx`) so the
// homepage Work section can stay lightweight: this card pulls in the image
// carousel, the live-site iframe preview and the designed mockups, none of
// which the homepage needs while the showcase is being rebuilt.
//
// NOTE: case study data lives in `lib/projects.ts`. To wire up a CRM (Supabase,
// Notion, Sanity, etc.), fetch into the same `Project` shape and pass through.

interface CaseStudyCardProps {
  project: Project;
  reduced: boolean | null;
  index: number;
  onOpen: (slug: string) => void;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  project,
  reduced,
  index,
  onOpen,
}) => {
  return (
    <motion.article
      onClick={() => onOpen(project.slug)}
      className="case-card group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-[#08060d] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d946ef]/55 hover:shadow-[0_22px_70px_-18px_rgba(217,70,239,0.5)] sm:rounded-2xl"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.06 }}
    >
      {/* Animated gradient halo on hover */}
      <div className="case-card__halo pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

      {/* TOP — Image carousel (if images) else gradient mockup */}
      <div className="relative z-10 aspect-[16/10] w-full overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          {project.images.length > 0 ? (
            <ProjectImageCarousel images={project.images} intervalMs={4500} />
          ) : project.cardMockup ? (
            <Mockup kind={project.cardMockup} />
          ) : project.previewUrl ? (
            <LiveCardPreview url={project.previewUrl} siteName={project.client.split('·')[0].trim()} />
          ) : (
            <BrowserMockup url={project.url} from={project.from} to={project.to} />
          )}
        </div>
      </div>

      {/* BOTTOM — Lean text content */}
      <div className="relative z-10 flex flex-1 flex-col p-4 sm:p-5">
        <p className="gradient-flow-text text-[9px] font-extrabold uppercase tracking-[0.16em] sm:text-[10px] sm:tracking-[0.2em]">
          {project.client}
        </p>

        <h3 className="mt-2 font-sans text-[1.05rem] font-semibold leading-[1.25] tracking-[-0.01em] text-white sm:text-[1.12rem] md:text-[1.18rem]">
          {project.title}
        </h3>

        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55 sm:text-[13px]">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60"
            >
              {t}
            </span>
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 self-start text-[11px] font-medium text-white/55 transition-colors duration-200 group-hover:text-white sm:text-xs">
          View case study
          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5" />
        </span>
      </div>
    </motion.article>
  );
};
