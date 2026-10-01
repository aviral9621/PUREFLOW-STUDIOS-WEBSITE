import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Process — "Chat to code in 4 WEEKS." as one pinned, scroll-driven story.
//
// Five weeks play inside the same frame: a custom circular mark on the left
// with the week under it, a two-line headline on the right (white line, then
// one accent line). No paragraphs, no bullet lists; the words carry it.
//
// Scroll choreography (all transform + opacity, written as CSS custom
// properties on rAF, so scrolling never re-renders React):
//   enter  — the ring draws itself, the mark fades in, the week label appears,
//            the headline rises into place;
//   build  — the mark's own geometry assembles (`--k`): nodes connect, shapes
//            align, blocks join, the launch mark fills;
//   exit   — the headline shrinks slightly and fades as the next week's mark
//            and headline come in (skipped on the last week).
// Scrolling back up plays it in reverse. Styles: the `.jr-*` block in index.css.
//
// NOTE: no ancestor of the stage may set `overflow: hidden` — it breaks sticky.
// ─────────────────────────────────────────────────────────────────────────────

interface Week {
  label: string;
  lead: string;
  accent: string;
  mark: React.ReactNode;
  /** Plain-language version for screen readers. */
  aria: string;
}

// ── The marks: one family. Every mark shares the same outer ring, inner disc
//    and glow (see <Mark>); only the centre geometry (100×100 box) changes.
//    Lines use pathLength="1" so they can draw on with --k.

const ConversationMark = (
  <g className="jr-geo">
    {/* An open, rounded speech form with a soft tail. */}
    <path className="jr-line" pathLength={1} d="M34 41c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v6c0 6.6-5.4 12-12 12H49l-8 7v-7.5c-4-2-7-6-7-11z" />
    <circle className="jr-dot jr-d1" cx="46" cy="44" r="2.2" />
    <circle className="jr-dot jr-d2" cx="53" cy="44" r="2.2" />
    <circle className="jr-dot jr-d3" cx="60" cy="44" r="2.2" />
    {/* A small spark: the idea taking shape. */}
    <path className="jr-spark" d="M73 25l1.6 4.2L79 31l-4.4 1.6L73 37l-1.6-4.4L67 31l4.4-1.8z" />
  </g>
);

const ArchitectureMark = (
  <g className="jr-geo">
    <path className="jr-line" pathLength={1} d="M50 30 L32 52 L50 72 L68 52 Z" />
    <path className="jr-line jr-late" pathLength={1} d="M32 52 L68 52 M50 30 L50 72" />
    <circle className="jr-node" cx="50" cy="30" r="3.4" />
    <circle className="jr-node" cx="32" cy="52" r="3.4" />
    <circle className="jr-node" cx="68" cy="52" r="3.4" />
    <circle className="jr-node" cx="50" cy="72" r="3.4" />
    <circle className="jr-node jr-core" cx="50" cy="52" r="4.6" />
  </g>
);

const DesignMark = (
  <g className="jr-geo">
    {/* Alignment guides fade in as the shapes settle onto them. */}
    <path className="jr-guide" d="M24 38 H76 M24 64 H76 M38 24 V76" />
    {/* Two layered frames, starting apart, sliding into alignment. */}
    <rect className="jr-shape jr-f1" x="38" y="38" width="30" height="26" rx="4" />
    <rect className="jr-shape jr-f2" x="38" y="38" width="20" height="14" rx="3" />
    {/* The cursor point. */}
    <circle className="jr-node jr-cursor" cx="68" cy="64" r="3" />
  </g>
);

const BuildMark = (
  <g className="jr-geo">
    {/* Three component blocks that close in and connect into one system. */}
    <rect className="jr-block jr-b1" x="28" y="30" width="18" height="14" rx="3" />
    <rect className="jr-block jr-b2" x="54" y="30" width="18" height="14" rx="3" />
    <rect className="jr-block jr-b3" x="41" y="56" width="18" height="14" rx="3" />
    <path className="jr-line jr-late" pathLength={1} d="M46 37 H54 M37 44 L44 56 M63 44 L56 56" />
  </g>
);

const LaunchMark = (
  <g className="jr-geo">
    {/* Every earlier node, now on one orbit, all connected. */}
    <circle className="jr-line" pathLength={1} cx="50" cy="50" r="22" />
    <circle className="jr-node" cx="50" cy="28" r="2.8" />
    <circle className="jr-node" cx="71" cy="43" r="2.8" />
    <circle className="jr-node" cx="63" cy="68" r="2.8" />
    <circle className="jr-node" cx="37" cy="68" r="2.8" />
    <circle className="jr-node" cx="29" cy="43" r="2.8" />
    {/* The centre becomes solid. */}
    <circle className="jr-solid" cx="50" cy="50" r="9" />
  </g>
);

const WEEKS: Week[] = [
  { label: 'Week 0', lead: '45-minute', accent: 'call', mark: ConversationMark, aria: 'Week 0: a 45-minute call' },
  { label: 'Week 1', lead: 'Architecture', accent: 'before code', mark: ArchitectureMark, aria: 'Week 1: architecture before code' },
  { label: 'Week 2', lead: 'Design', accent: 'with intent', mark: DesignMark, aria: 'Week 2: design with intent' },
  { label: 'Week 3', lead: 'Build', accent: 'the system', mark: BuildMark, aria: 'Week 3: build the system' },
  { label: 'Week 4', lead: 'Ready', accent: 'to launch', mark: LaunchMark, aria: 'Week 4: ready to launch' },
];

/** The shared circular construction around every week's geometry. */
const Mark: React.FC<{ children: React.ReactNode; last?: boolean }> = ({ children, last }) => (
  <div className={`jr-mark ${last ? 'jr-mark--last' : ''}`}>
    <span className="jr-glow" aria-hidden="true" />
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle className="jr-track" cx="50" cy="50" r="48.5" />
      <circle className="jr-ring" cx="50" cy="50" r="48.5" pathLength={1} />
      <circle className="jr-disc" cx="50" cy="50" r="33" />
      {children}
    </svg>
  </div>
);

// ── Choreography ─────────────────────────────────────────────────────────────
// A week's local time `u` runs 0 → 1 across its slot; [start, duration] in u.
const PHASE = {
  mark: [-0.22, 0.3] as const,
  ring: [-0.2, 0.42] as const,
  label: [-0.08, 0.24] as const,
  head: [-0.14, 0.34] as const,
  build: [0.0, 0.5] as const,
  exit: [0.76, 0.24] as const,
};
/** Viewport-heights of scroll per week while pinned (5 weeks ≈ 450–500vh). */
const perWeek = () => (window.innerWidth < 768 ? 0.85 : 0.95);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
// cubic-bezier(0.22, 1, 0.36, 1)–like: a long, soft settle.
const ease = (t: number) => 1 - Math.pow(1 - t, 4);
const seg = (u: number, ph: readonly [number, number]) => ease(clamp01((u - ph[0]) / ph[1]));

const Headline: React.FC<{ w: Week }> = ({ w }) => (
  <h3 className="jr-head" aria-label={w.aria}>
    <span className="jr-lead">{w.lead}</span>
    <span className="jr-accent">{w.accent}</span>
  </h3>
);

export function Process() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!pin || !stage) return;

    const panels: HTMLElement[] = [].slice.call(pin.querySelectorAll('.jr-panel'));
    const ticks: HTMLElement[] = [].slice.call(pin.querySelectorAll('.jr-progress i'));
    const N = panels.length;
    let scrollable = 1;
    let raf = 0;

    const layout = () => {
      // px off the stage's own height (100svh), not vh, so the mobile URL bar
      // can't change the pin length mid-scroll.
      const stageH = stage.offsetHeight;
      pin.style.height = `${Math.round(N * perWeek() * stageH + stageH * 0.35)}px`;
      scrollable = Math.max(1, pin.offsetHeight - stageH);
    };

    const update = () => {
      raf = 0;
      const top = pin.getBoundingClientRect().top;
      // A little lead-in, so Week 0 builds as the stage arrives, not after.
      const g = Math.min(N - 0.001, (-top / scrollable) * N + 0.18);
      for (let k = 0; k < N; k++) {
        const u = g - k;
        const out = k === N - 1 ? 0 : seg(u, PHASE.exit);
        const s = panels[k].style;
        s.setProperty('--mk', (seg(u, PHASE.mark) * (1 - out)).toFixed(3));
        s.setProperty('--ring', seg(u, PHASE.ring).toFixed(3));
        s.setProperty('--lb', (seg(u, PHASE.label) * (1 - out)).toFixed(3));
        s.setProperty('--hd', seg(u, PHASE.head).toFixed(3));
        s.setProperty('--k', seg(u, PHASE.build).toFixed(3));
        s.setProperty('--ex', out.toFixed(3));
        panels[k].toggleAttribute('data-live', u > -0.25 && u < 1);
        ticks[k]?.style.setProperty('--f', clamp01(u).toFixed(3));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      layout();
      onScroll();
    };

    layout();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      pin.style.height = '';
    };
  }, [reduced]);

  return (
    // No `overflow-hidden` here: it would silently break the sticky stage.
    <section id="process" className="relative bg-[#050505]">
      {/* Shared stroke gradient for every ring and accent line. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id="jrGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e11ae6" />
            <stop offset="1" stopColor="#9b5cf6" />
          </linearGradient>
          <radialGradient id="jrDisc" cx="50%" cy="38%" r="70%">
            <stop offset="0" stopColor="#9b5cf6" stopOpacity="0.28" />
            <stop offset="1" stopColor="#9b5cf6" stopOpacity="0.04" />
          </radialGradient>
        </defs>
      </svg>

      {/* ── Section header ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-4 pt-12 text-center sm:px-6 md:pt-14 lg:px-10"
        initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
          Chat to code in
        </span>
        <span
          className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
          data-text="4 WEEKS."
        >
          4 WEEKS.
        </span>
      </motion.div>

      {reduced ? (
        // Reduced motion: the same five frames, simply stacked.
        <div className="relative z-10 mx-auto flex max-w-[1080px] flex-col gap-20 px-5 pb-20 pt-16 sm:px-8">
          {WEEKS.map((w, i) => (
            <div key={w.label} className="jr-frame jr-static" style={{ ['--k' as string]: 1, ['--ring' as string]: 1 }}>
              <div className="jr-side">
                <Mark last={i === WEEKS.length - 1}>{w.mark}</Mark>
                <p className="jr-label">{w.label}</p>
              </div>
              <Headline w={w} />
            </div>
          ))}
        </div>
      ) : (
        <div ref={pinRef} className="relative z-10">
          <div ref={stageRef} className="jr-stage">
            {WEEKS.map((w, i) => (
              <div className="jr-panel" key={w.label}>
                <div className="jr-frame">
                  <div className="jr-side">
                    <Mark last={i === WEEKS.length - 1}>{w.mark}</Mark>
                    <p className="jr-label">{w.label}</p>
                  </div>
                  <Headline w={w} />
                </div>
              </div>
            ))}
            <div className="jr-progress" aria-hidden="true">
              {WEEKS.map((w) => (
                <i key={w.label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
