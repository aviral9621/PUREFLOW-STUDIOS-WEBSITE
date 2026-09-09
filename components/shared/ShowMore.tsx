import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ShowMore — the footer under a homepage card grid: a quiet count line plus the
// link through to the full listing.
//
// It belongs to the homepage sections only. The listings themselves render the
// whole set, so "Show all" lands on everything in one click rather than handing
// the visitor the same button a second time.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  shown: number;
  total: number;
  label: string;
  /** Plural noun for the count line — "projects", "articles". */
  noun?: string;
  onClick: () => void;
}

export const ShowMore: React.FC<Props> = ({
  shown,
  total,
  label,
  noun = 'projects',
  onClick,
}) => (
  <div className="mt-10 flex flex-col items-center gap-3 md:mt-12">
    <p className="text-[13px] text-white/40">
      Showing {shown} of {total} {noun}
    </p>

    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.02] px-8 py-4 text-[14.5px] font-medium text-white/75 transition-colors duration-300 hover:border-[#d946ef]/45 hover:bg-[#d946ef]/[0.06] hover:text-white"
    >
      {label}
      <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  </div>
);
