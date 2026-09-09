import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ShowMore — the "you are seeing part of the set" footer under a card grid: a
// quiet count line plus one action. Shared by the work and blog listings.
//
// Two places use it and they mean different things by the action, so the icon
// follows the intent:
//   • a homepage section → "navigate", leaves for the full listing (arrow)
//   • a full listing    → "expand", reveals the rest of the grid in place (plus)
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  shown: number;
  total: number;
  label: string;
  intent?: 'navigate' | 'expand';
  /** Plural noun for the count line — "projects", "articles". */
  noun?: string;
  onClick: () => void;
  reduced?: boolean | null;
}

export const ShowMore: React.FC<Props> = ({
  shown,
  total,
  label,
  intent = 'navigate',
  noun = 'projects',
  onClick,
  reduced,
}) => (
  <motion.div
    className="mt-10 flex flex-col items-center gap-3 md:mt-12"
    initial={reduced ? false : { opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    <p className="text-[13px] text-white/40">
      Showing {shown} of {total} {noun}
    </p>

    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.02] px-8 py-4 text-[14.5px] font-medium text-white/75 transition-colors duration-300 hover:border-[#d946ef]/45 hover:bg-[#d946ef]/[0.06] hover:text-white"
    >
      {label}
      {intent === 'expand' ? (
        <Plus className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-90" />
      ) : (
        <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </button>
  </motion.div>
);
