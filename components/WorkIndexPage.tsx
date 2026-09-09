import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
import { useAllProjects } from '../hooks/useProjects';
import { toPortfolioItems } from '../lib/portfolio';
import { ProjectShowcaseCard } from './sections/ProjectShowcaseCard';

interface Props {
  onViewChange: (view: ViewState) => void;
  onOpenProject: (slug: string) => void;
}

export const WorkIndexPage: React.FC<Props> = ({ onViewChange, onOpenProject }) => {
  const { projects, loading } = useAllProjects();
  const items = useMemo(() => toPortfolioItems(projects), [projects]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.06] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pt-[88px] pb-20 sm:px-6 sm:pt-24 lg:px-10 lg:pt-24">
        <button
          onClick={() => onViewChange('home')}
          className="group mb-5 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        {/* Hero */}
        <div className="mb-8 flex flex-col items-center text-center md:mb-10">
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            Everything we've
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="SHIPPED."
          >
            SHIPPED.
          </span>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/55 sm:text-base">
            Every case study. Click any card to see the full story.
          </p>
        </div>

        {loading && projects.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          </div>
        ) : projects.length === 0 ? (
          <p className="py-20 text-center text-sm text-white/50">No case studies yet.</p>
        ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
              {items.map((item) => (
                <ProjectShowcaseCard key={item.id} item={item} onOpen={onOpenProject} />
              ))}
            </div>
        )}
      </div>
    </main>
  );
};
