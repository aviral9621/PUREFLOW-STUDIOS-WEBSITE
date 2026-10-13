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
//   build  — the mark's icon draws itself (`--k`): the call's dial fills to
//            45 minutes, the compass sweeps its arc, the pen, the code, the
//            rocket lifts;
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
//    and glow (see <Mark>). The centre is a single icon, drawn on a 24-unit
//    grid inside a nested <svg> placed exactly on the circle's centre, so it
//    is centred the same way at every size. Same stroke weight throughout,
//    one brand-gradient detail per mark. Lines use pathLength="1" so they
//    draw on with --k as the week builds.

/** A 24×24 icon centred on the mark (100×100), `size` units wide. */
const Glyph: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 40, children }) => (
  <svg x={50 - size / 2} y={50 - size / 2} width={size} height={size} viewBox="0 0 24 24" overflow="visible">
    {children}
  </svg>
);

/** Week 0, a 45-minute call: a phone inside a dial whose arc fills to 45 of 60 minutes. */
const CallMark = (
  <g className="jr-geo">
    <circle className="jr-dial" cx="50" cy="50" r="26" />
    <circle className="jr-arc" cx="50" cy="50" r="26" pathLength={1} />
    <Glyph size={27}>
      {/* Drawn smaller to sit inside the dial, so its stroke is heavier in
          its own grid: the same on-screen weight as the other marks. */}
      <path
        className="jr-line"
        pathLength={1}
        strokeWidth={2.2}
        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
      />
    </Glyph>
  </g>
);

/** Week 1, architecture before code: the architect's drafting compass, its
 *  legs drawn first, then the arc it sweeps (the plan) in the brand gradient. */
const ArchitectureMark = (
  <g className="jr-geo">
    <Glyph size={44}>
      <path className="jr-line" pathLength={1} d="M3 21 11.02 6.74" />
      <path className="jr-line" pathLength={1} d="M12.98 6.74 21 21" />
      <circle className="jr-line" pathLength={1} cx="12" cy="5" r="2" />
      <path className="jr-line jr-late jr-grad" pathLength={1} d="M4.865 12a10 10 0 0 0 14.271 0" />
    </Glyph>
  </g>
);

/** Week 2, design with intent: the pen tool. */
const DesignMark = (
  <g className="jr-geo">
    <Glyph>
      <path
        className="jr-line"
        pathLength={1}
        d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"
      />
      <path
        className="jr-line"
        pathLength={1}
        d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"
      />
      <path className="jr-line jr-late" pathLength={1} d="m2.3 2.3 7.286 7.286" />
      <circle className="jr-accent-dot" cx="11" cy="11" r="2" />
    </Glyph>
  </g>
);

/** Week 3, build the system: code brackets, the slash in the brand gradient. */
const BuildMark = (
  <g className="jr-geo">
    <Glyph>
      <path className="jr-line" pathLength={1} d="m18 16 4-4-4-4" />
      <path className="jr-line" pathLength={1} d="m6 8-4 4 4 4" />
      <path className="jr-line jr-late jr-grad" pathLength={1} d="m14.5 4-5 16" />
    </Glyph>
  </g>
);

/** Week 4, ready to launch: a rocket that lifts into place. */
const LaunchMark = (
  <g className="jr-geo">
    <g className="jr-lift">
      <Glyph>
        <path
          className="jr-line jr-late jr-grad"
          pathLength={1}
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
        />
        <path
          className="jr-line"
          pathLength={1}
          d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
        />
        <path className="jr-line" pathLength={1} d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path className="jr-line" pathLength={1} d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        <circle className="jr-accent-dot" cx="15.5" cy="8.5" r="1.6" />
      </Glyph>
    </g>
  </g>
);

const WEEKS: Week[] = [
  { label: 'Week 0', lead: '45-minute', accent: 'call', mark: CallMark, aria: 'Week 0: a 45-minute call' },
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
