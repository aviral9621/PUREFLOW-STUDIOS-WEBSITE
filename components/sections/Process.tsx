import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ─── Step data ────────────────────────────────────────────────────────────────

interface StepData {
  label: string;
  title: string;
  description: string;
  deliverables: string[];
  /** Icon paths, drawn on with stroke-dashoffset — each needs pathLength="1". */
  icon: React.ReactNode;
}

const STEPS: StepData[] = [
  {
    label: 'Week 0',
    title: 'We talk. You decide.',
    description: 'A 45-min call. Scope locked. Fixed price. Zero sales theatre.',
    deliverables: ['Scope document in 48 hours', 'Fixed-price proposal', 'Recommended stack'],
    icon: (
      <>
        <path
          pathLength="1"
          d="M20.5 11.4a8.1 8.1 0 0 1-8.7 8.1 8.7 8.7 0 0 1-3.4-.8L3.5 20.5l1.8-4.9a8.1 8.1 0 0 1-.8-3.5 8.1 8.1 0 0 1 8.1-8.1 8.1 8.1 0 0 1 7.9 7.4z"
        />
        <path pathLength="1" d="M9 11.9l2.2 2.2 4.3-4.5" />
      </>
    ),
  },
  {
    label: 'Week 1',
    title: 'Architecture before code.',
    description: 'Clickable Figma + full spec before a single line of code.',
    deliverables: ['Figma prototype (mobile + desktop)', 'Database schema with RLS', '6-phase roadmap'],
    icon: (
      <>
        <path pathLength="1" d="M12 2.6 2.4 7.3 12 12l9.6-4.7L12 2.6z" />
        <path pathLength="1" d="M2.4 16.7 12 21.4l9.6-4.7" />
        <path pathLength="1" d="M2.4 12 12 16.7 21.6 12" />
      </>
    ),
  },
  {
    label: 'Weeks 2–4',
    title: 'Daily progress, weekly demos.',
    description: 'Live staging from day one. Friday demos. No black boxes.',
    deliverables: ['Daily commits to GitHub', 'Recorded Friday demos', 'Staging URL from day 1'],
    icon: <path pathLength="1" d="M2.5 12h3.8l2.4 7 5.2-14.5 2.4 7.5h5.2" />,
  },
  {
    label: 'Week 4+',
    title: "We don't ghost. We hand over.",
    description: 'Production deploy, repo handover, 30-day fix-it-free support.',
    deliverables: ['Deploy on your Vercel/Supabase', '30-day post-launch support', 'Loom training for your team'],
    icon: (
      <>
        <path
          pathLength="1"
          d="M20.8 15.9V8.1a1.9 1.9 0 0 0-1-1.7l-6.9-3.9a1.9 1.9 0 0 0-1.8 0L4.2 6.4a1.9 1.9 0 0 0-1 1.7v7.8a1.9 1.9 0 0 0 1 1.7l6.9 3.9a1.9 1.9 0 0 0 1.8 0l6.9-3.9a1.9 1.9 0 0 0 1-1.7z"
        />
        <path pathLength="1" d="M3.5 7.1 12 12l8.5-4.9" />
        <path pathLength="1" d="M12 21.8V12" />
      </>
    ),
  },
];

// ─── Scroll choreography ──────────────────────────────────────────────────────
//
// A step's local time `u` runs 0 → 1 across its own slot of the pinned scroll.
// u < 0 means it hasn't started; u > 1 means the next step owns the stage.
// Each phase is [startAt, duration] in u units.

const PHASE = {
  appear: [-0.15, 0.33] as const, // marker materialises, centred and large
  ring: [-0.12, 0.34] as const, // progress ring draws around it
  draw: [0.02, 0.36] as const, // icon strokes draw themselves on
  label: [0.1, 0.26] as const, // week label
  settle: [0.16, 0.3] as const, // marker shrinks and slides into its slot
  title: [0.34, 0.26] as const,
  sub: [0.42, 0.26] as const,
  chip0: [0.48, 0.24] as const, // each later chip is offset by CHIP_GAP
  exit: [0.84, 0.22] as const, // panel fades out (skipped on the last step)
};
const CHIP_GAP = 0.07;

/** Scale of the marker while centred; 1 is its settled size. */
const BIG_SCALE = 2.05;
/** Fraction of a viewport of scroll each step consumes while pinned. */
const stepFactor = () => (window.innerWidth <= 860 ? 0.9 : 1.1);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const seg = (u: number, ph: readonly [number, number]) => easeOut(clamp01((u - ph[0]) / ph[1]));

// ─── Static fallback (reduced motion) ─────────────────────────────────────────

function StaticSteps() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
      {STEPS.map((step) => (
        <div key={step.label} className="border-t border-white/[0.07] py-9 md:py-11">
          <p className="gradient-flow-text text-[11px] font-extrabold uppercase tracking-[0.28em]">
            {step.label}
          </p>
          <h3 className="mt-3 font-sans text-[1.5rem] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[1.75rem]">
            {step.title}
          </h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60 sm:text-base">
            {step.description}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {step.deliverables.map((d) => (
              <li key={d} className="flex items-center gap-2 text-[13px] text-white/60">
                <span className="h-[5px] w-[5px] flex-none rotate-45 bg-gradient-to-br from-[#ff2f86] to-[#a855f7]" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function Process() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!pin || !stage) return;

    // Explicitly typed: under this tsconfig `Array.from` on a NodeList widens
    // to unknown[].
    const panels: HTMLElement[] = [].slice.call(pin.querySelectorAll('.pf-panel'));
    const ticks: HTMLElement[] = [].slice.call(pin.querySelectorAll('.pf-stepper i'));
    const N = panels.length;
    if (!N) return;

    let scrollable = 1;
    let raf = 0;

    /** Measure how far each marker must travel to reach the centre of the stage.
     *  Both rects are read at the same instant, so the delta is independent of
     *  where the stage currently sits in the viewport. */
    const layout = () => {
      // Sized in px off the stage's own height rather than in vh: the stage is
      // 100svh, and mixing svh with vh drifts on mobile when the URL bar moves.
      const stageH = stage.offsetHeight;
      pin.style.height = `${Math.round(N * stepFactor() * stageH)}px`;
      // A sticky element travels for (container height − its own height).
      scrollable = Math.max(1, pin.offsetHeight - stageH);

      const s = stage.getBoundingClientRect();
      const cx = s.left + s.width / 2;
      const cy = s.top + s.height / 2;

      panels.forEach((p) => {
        const marker = p.querySelector('.pf-marker');
        if (!marker) return;
        const m = marker.getBoundingClientRect();
        p.style.setProperty('--tx', `${(cx - (m.left + m.width / 2)).toFixed(1)}px`);
        p.style.setProperty('--ty', `${(cy - (m.top + m.height / 2)).toFixed(1)}px`);
      });
    };

    /** One global progress value drives everything, so scrolling back up simply
     *  plays the sequence in reverse. */
    const update = () => {
      raf = 0;
      const top = pin.getBoundingClientRect().top;
      const g = Math.min(N, (-top / scrollable) * N);

      for (let k = 0; k < N; k++) {
        const p = panels[k];
        const st = p.style;
        const u = g - k;

        const out = k === N - 1 ? 0 : seg(u, PHASE.exit);
        const fade = 1 - out;
        const settle = seg(u, PHASE.settle);

        st.setProperty('--io', (seg(u, PHASE.appear) * fade).toFixed(3));
        st.setProperty('--sc', (1 + (1 - settle) * (BIG_SCALE - 1)).toFixed(3));
        st.setProperty('--st', settle.toFixed(3));
        st.setProperty('--ring', seg(u, PHASE.ring).toFixed(3));
        st.setProperty('--draw', seg(u, PHASE.draw).toFixed(3));
        st.setProperty('--lb', (seg(u, PHASE.label) * fade).toFixed(3));
        st.setProperty('--ti', (seg(u, PHASE.title) * fade).toFixed(3));
        st.setProperty('--su', (seg(u, PHASE.sub) * fade).toFixed(3));
        st.setProperty('--ex', out.toFixed(3));

        const chips = p.querySelectorAll<HTMLElement>('.pf-chip');
        for (let c = 0; c < chips.length; c++) {
          const ph: readonly [number, number] = [PHASE.chip0[0] + c * CHIP_GAP, PHASE.chip0[1]];
          chips[c].style.setProperty('--c', (seg(u, ph) * fade).toFixed(3));
        }

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
    // Late webfont / image loads change the measured geometry.
    if (document.fonts?.ready) document.fonts.ready.then(onResize).catch(() => {});
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
    <section id="process" className="relative bg-black">
      {/* Ambient wash — a gradient rather than a large blurred box, which would
          cost a full-screen multi-pass blur on every frame of the pin. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 30%, rgba(168,85,247,0.07), transparent 70%)',
        }}
      />

      {/* Shared gradient for every ring and icon stroke on this page. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id="pfProcessGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff2f86" />
            <stop offset="0.55" stopColor="#d946ef" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Section header (unchanged) ── */}
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
        <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/55 sm:text-base">
          Small team. Direct line to the founder. No agency theatre.
        </p>
      </motion.div>

      {reduced ? (
        <div className="relative z-10 pb-14 pt-10">
          <StaticSteps />
        </div>
      ) : (
        <div ref={pinRef} className="pf-pin relative z-10">
          <div ref={stageRef} className="pf-stage">
            <div className="pf-eyebrow">How the four weeks run</div>

            {STEPS.map((step) => (
              <div className="pf-panel" key={step.label}>
                <div className="pf-inner">
                  <div className="pf-marker">
                    <div className="pf-move">
                      <div className="pf-disc">
                        <span className="pf-halo" />
                        <svg className="pf-ring" viewBox="0 0 100 100" aria-hidden="true">
                          <circle className="pf-ring-track" cx="50" cy="50" r="49" />
                          <circle className="pf-ring-prog" cx="50" cy="50" r="49" pathLength={1} />
                        </svg>
                        <svg className="pf-ico" viewBox="0 0 24 24" aria-hidden="true">
                          {step.icon}
                        </svg>
                      </div>
                      <div className="pf-label">{step.label}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="pf-title font-sans">{step.title}</h3>
                    <p className="pf-sub">{step.description}</p>
                    <ul className="pf-chips">
                      {step.deliverables.map((d) => (
                        <li className="pf-chip" key={d}>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <div className="pf-stepper" aria-hidden="true">
              {STEPS.map((s) => (
                <i key={s.label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
