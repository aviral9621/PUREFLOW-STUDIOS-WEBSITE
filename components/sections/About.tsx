import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Rocket, ShieldCheck, Sparkles, Users } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// About — "Who we are". Two columns: the message on the left, four numbered
// commitments on the right.
//
// The section is carried by typography and space, not boxes. The only colour
// is the display heading's gradient, the eyebrow, and whichever row the pointer
// is on — so the accent always means "this one", never decoration.
//
// The rows are not focusable. They perform no action, so giving them tab stops
// would add four dead stops for a keyboard user; the highlight is a pointer
// affordance and every row's content is already read in order. The CTA is the
// section's one interactive element and carries the focus ring.
//
// Styling lives in the `.wa-*` block in index.css.
// ─────────────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    Icon: Rocket,
    title: 'Weekly, shippable progress',
    body: 'Daily commits, weekly demos, and live staging from day one.',
  },
  {
    Icon: ShieldCheck,
    title: 'Full code ownership',
    body: 'Source, repos, and infra transfer to your org on final payment.',
  },
  {
    Icon: Users,
    title: 'A direct line to the founder',
    body: 'You talk to the person building it, not a project manager.',
  },
  {
    Icon: Sparkles,
    title: 'A stack built to last',
    body: 'TypeScript, Next.js, and Supabase — foundations that outlive the hype cycle.',
  },
];

/** Row highlighted before the pointer arrives, so the section is never inert. */
const INITIAL_ACTIVE = 1;

interface Props {
  onStartProject?: () => void;
}

export function About({ onStartProject }: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(INITIAL_ACTIVE);

  const rise = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
        };

  return (
    <section
      id="about"
      className="wa-section relative overflow-hidden py-[64px] md:py-[100px] lg:py-[140px]"
      aria-labelledby="about-title"
    >
      <span aria-hidden="true" className="wa-glow" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-[50px] px-6 md:px-10 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-20 xl:gap-[112px] xl:px-12">
        {/* ── Left: the message ── */}
        <motion.div className="wa-col" {...rise()}>
          <p className="wa-label">Who we are</p>

          <h2 id="about-title" className="mt-5">
            <span className="hero-automation-text wa-display" data-text="BUILT TO SHIP.">
              BUILT TO SHIP.
            </span>
          </h2>

          <p className="wa-tagline mt-4">A senior team that builds software you actually own.</p>

          <p className="wa-lede mt-6">
            Pureflow Studios is a Lucknow-based design and engineering studio. We replace WhatsApp
            chaos and spreadsheets with custom software — CRMs, dashboards, AI agents, and web apps.
          </p>

          {onStartProject && (
            <button type="button" onClick={onStartProject} className="wa-cta mt-9">
              Start a project
              <ArrowRight aria-hidden="true" className="wa-cta__arrow h-4 w-4" />
            </button>
          )}
        </motion.div>

        {/* ── Right: the commitments ── */}
        <ul className="wa-list" onMouseLeave={() => setActive(INITIAL_ACTIVE)}>
          {PILLARS.map(({ Icon, title, body }, i) => (
            <motion.li
              key={title}
              className={`wa-item ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              {...rise(reduced ? 0 : i * 0.08)}
            >
              <span aria-hidden="true" className="wa-num">
                {String(i + 1).padStart(2, '0')}
              </span>

              <Icon aria-hidden="true" className="wa-icon" strokeWidth={1.5} />

              <div className="min-w-0">
                <h3 className="wa-title">{title}</h3>
                <p className="wa-body">{body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
