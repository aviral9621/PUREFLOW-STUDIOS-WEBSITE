import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Globe2,
  MessageCircle,
  Rocket,
  Smartphone,
  Sparkles,
  Bot,
  Heart,
} from 'lucide-react';
import { ViewState } from '../types';

interface AboutPageProps {
  onViewChange: (view: ViewState) => void;
  onStartProject: () => void;
}

const STATS: { value: string; label: string }[] = [
  { value: '100+', label: 'Software shipped' },
  { value: '150+', label: 'Websites live' },
  { value: '30+',  label: 'Mobile apps' },
  { value: '10',   label: 'People & growing' },
];

const LEADERSHIP: { name: string; initials: string; role: string; photo?: string; photoPosition?: string; bio: string }[] = [
  {
    name: 'Aviral Singh',
    initials: 'AS',
    role: 'Founder & CEO',
    photo: '/founder pureflow.jpeg',
    bio: 'Aviral founded PureFlow Studios and leads the company’s vision, strategy, and technical architecture. He works closely with clients in India, the US, the UK, and Australia to design custom CRMs, web and mobile apps, automation systems, and SaaS products that solve real business problems.',
  },
  {
    name: 'Mayank Chakrawarti',
    initials: 'MC',
    role: 'Chief Operating Officer (COO)',
    photo: '/mayank.webp',
    photoPosition: '68% 50%',
    bio: 'Mayank runs PureFlow’s day-to-day operations and leads the sales team. He makes sure projects, people, and processes move smoothly, so every client gets a reliable experience from the first conversation to final delivery.',
  },
  {
    name: 'Tayyaba',
    initials: 'T',
    role: 'Chief Delivery Officer (CDO)',
    photo: '/tayyaba.webp',
    bio: 'Part of PureFlow since day one, Tayyaba leads project delivery and client relationships. She builds websites, works directly with clients to understand their needs, and makes sure every project is delivered to the standard PureFlow is known for.',
  },
];

const SERVICES: { icon: React.ElementType; title: string; sub: string }[] = [
  { icon: Brain,      title: 'Custom software & CRMs',     sub: 'Built for your business, not a template.' },
  { icon: Globe2,     title: 'Websites that convert',      sub: 'Loads fast. Reads clean. Sells more.' },
  { icon: Smartphone, title: 'Mobile apps',                sub: 'iOS + Android, one budget, zero drama.' },
  { icon: Bot,        title: 'AI agents & automations',    sub: 'Replace the manual loop with the smart one.' },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onViewChange, onStartProject }) => {
  const reduced = useReducedMotion();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.06] rounded-full blur-[140px]" />
        <div
          className="absolute bottom-[-15%] left-[-10%] h-[520px] w-[520px]"
          style={{ background: 'radial-gradient(closest-side, rgba(255,32,160,0.18), transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] h-[520px] w-[520px]"
          style={{ background: 'radial-gradient(closest-side, rgba(164,82,255,0.18), transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-20 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        {/* ── Hero ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <p className="gradient-flow-text mb-4 text-[10px] font-bold uppercase tracking-[0.22em]">
            About us
          </p>
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            A small studio,
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="BUILT TO SHIP."
          >
            BUILT TO SHIP.
          </span>
          <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-white/65 sm:text-base">
            Pureflow Studios is a Gen-Z software studio out of Lucknow. We build custom software,
            CRMs, AI agents, and websites for founders who want to stop firefighting and start
            scaling. Ten of us. A hundred-plus products. Built on referrals.
          </p>
        </motion.div>

        {/* ── Stats band ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:mt-16"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-center sm:p-5"
            >
              <p className="font-display text-[1.85rem] font-bold leading-none tracking-tight text-white sm:text-[2.3rem]">
                <span className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-transparent">
                  {s.value}
                </span>
              </p>
              <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:text-[11.5px]">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Leadership ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20"
        >
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-white/95 text-[2rem] sm:text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1]">
              The people
            </span>
            <span
              className="hero-automation-text mt-1 inline-block leading-none text-[3.25rem] sm:text-[clamp(2.25rem,5vw,4.5rem)]"
              data-text="RUNNING IT."
            >
              RUNNING IT.
            </span>
          </div>
          <TeamDeck reduced={!!reduced} />
        </motion.div>

        {/* ── What we ship ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20"
        >
          <div className="flex flex-col items-center text-center">
            <span className="font-serif italic text-white/95 text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1]">
              What we
            </span>
            <span
              className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.25rem,5vw,4.5rem)]"
              data-text="ACTUALLY SHIP."
            >
              ACTUALLY SHIP.
            </span>
          </div>
          <div className="mt-9 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#08060d] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3f8d]/45 sm:p-6"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/85 bg-black text-white sm:h-11 sm:w-11">
                    <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={1.9} />
                  </div>
                  <h3 className="font-sans text-[14.5px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[15.5px]">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55 sm:text-[13px]">
                    {s.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Team philosophy / Gen-Z line ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-3 sm:gap-5"
        >
          <PhilosophyCard
            icon={Rocket}
            title="Built for speed."
            body="Daily commits, weekly demos, live staging from day one. No black boxes."
          />
          <PhilosophyCard
            icon={Heart}
            title="Built on referrals."
            body="Most of our clients came from another client. That keeps us honest."
          />
          <PhilosophyCard
            icon={Sparkles}
            title="Built for Gen Z."
            body="Younger team. Less buzz. More direct. And actually mobile-first."
          />
        </motion.div>

        {/* ── Final CTA card ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] p-7 text-center sm:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.14) 0%, transparent 55%)',
            }}
          />
          <h3 className="relative font-sans text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.85rem]">
            Stuck on the tech? We’ve got you.
          </h3>
          <p className="relative mt-3 text-[14px] text-white/60 sm:text-[15.5px]">
            Drop a brief or message us — we reply within 24 hours, every time.
          </p>
          <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={onStartProject}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-14 sm:w-auto sm:px-9 sm:text-[15px]"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/916393640650"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.08] sm:h-14 sm:w-auto sm:px-9 sm:text-[15px]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
          </div>
          <p className="relative mt-5 text-[11px] uppercase tracking-[0.16em] text-white/35">
            hi@pureflowdesigns.com · +91 63936 40650
          </p>
        </motion.div>
      </div>
    </main>
  );
};

function PhilosophyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#08060d] p-5 sm:p-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/85 bg-black text-white">
        <Icon className="h-5 w-5" strokeWidth={1.9} />
      </div>
      <h3 className="font-sans text-[15px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[16px]">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-white/55 sm:text-[13.5px]">{body}</p>
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Leadership cards.
//   lg and up: three equal cards in one row; hover flips a card to its bio.
//   below lg:  Aviral full width on top, Mayank and Tayyaba half width beneath
//              him, left and right. Tapping Mayank or Tayyaba lines all three
//              up in one row with the tapped person's bio underneath; tapping
//              outside the section (or the same card again) puts them back.
function TeamDeck({ reduced }: { reduced: boolean }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [lined, setLined] = useState(false);
  const [active, setActive] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);

  // Tap anywhere outside the section to send the cards back.
  useEffect(() => {
    if (!lined) return;
    const onDown = (e: PointerEvent) => {
      if (!deckRef.current?.contains(e.target as Node)) setLined(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [lined]);

  if (isDesktop) {
    return (
      <div className="mt-9 grid grid-cols-3 gap-6">
        {LEADERSHIP.map((p, i) => (
          <motion.div
            key={p.name}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
          >
            <LeaderCard person={p} />
          </motion.div>
        ))}
      </div>
    );
  }

  const layoutTransition = reduced ? { duration: 0 } : { duration: 0.6, ease: EASE };
  const person = LEADERSHIP[active];

  return (
    <div ref={deckRef} className="mx-auto mt-9 max-w-[420px]">
      <div className={`grid gap-3 ${lined ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {LEADERSHIP.map((p, i) => {
          const isAviral = i === 0;
          // Lined up, Aviral takes the middle: Mayank · Aviral · Tayyaba.
          const order = lined ? (isAviral ? 2 : i === 1 ? 1 : 3) : i + 1;
          const onActivate = lined
            ? () => (i === active ? setLined(false) : setActive(i))
            : isAviral
              ? undefined // full-width card: tap flips it, as before
              : () => {
                  setActive(i);
                  setLined(true);
                };

          return (
            <motion.div
              key={p.name}
              layout
              transition={layoutTransition}
              className={!lined && isAviral ? 'col-span-2' : ''}
              style={{ order }}
            >
              <LeaderCard
                person={p}
                size={lined ? 'mini' : isAviral ? 'full' : 'half'}
                canFlip={!lined && isAviral}
                selected={lined && i === active}
                onActivate={onActivate}
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {lined && (
          <motion.div
            key={person.name}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative mt-4 overflow-hidden rounded-2xl border border-[#ff3f8d]/35 bg-[#08060d] p-5"
            aria-live="polite"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: BACK_GLOW }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase leading-snug tracking-[0.2em] text-[#ff7eb2]">
                {person.role}
              </p>
              <p className="mt-1 font-sans text-[1.25rem] font-semibold leading-tight tracking-[-0.015em] text-white">
                {person.name}
              </p>
              <div className="mt-3 h-px w-12 bg-gradient-to-r from-[#ff2f86] to-[#a855f7]" />
              <p className="mt-3 text-[13.5px] leading-[1.7] text-white/70">{person.bio}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BACK_GLOW =
  'radial-gradient(ellipse at 0% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(164,82,255,0.16) 0%, transparent 55%)';

type CardSize = 'full' | 'half' | 'mini';

// Name-plate and corner styles per card size.
const CARD_SIZE: Record<CardSize, { radius: string; plate: string; role: string | null; name: string }> = {
  full: {
    radius: 'rounded-[1.6rem]',
    plate: 'px-5 pb-4 pt-14',
    role: 'text-[10px] tracking-[0.2em]',
    name: 'mt-1 text-[1.3rem] sm:text-[1.45rem]',
  },
  half: {
    radius: 'rounded-[1.1rem]',
    plate: 'px-3 pb-3 pt-10',
    role: 'text-[7.5px] tracking-[0.12em]',
    name: 'mt-0.5 text-[14px]',
  },
  mini: {
    radius: 'rounded-[0.9rem]',
    plate: 'px-2 pb-2 pt-8',
    role: null,
    name: 'text-[11.5px]',
  },
};

// Flip card: photo on the front, bio on the back. A mouse flips it on hover;
// tap (or Enter/Space) toggles it everywhere else. When onActivate is given,
// a tap calls it instead of flipping. The rotating layer ignores the pointer
// so hover is tracked on the flat outer box: otherwise the card's projected
// edge swings in and out from under a cursor near its border.
function LeaderCard({
  person: p,
  size = 'full',
  canFlip = true,
  selected = false,
  onActivate,
}: {
  person: (typeof LEADERSHIP)[number];
  size?: CardSize;
  canFlip?: boolean;
  selected?: boolean;
  onActivate?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const s = CARD_SIZE[size];
  const toggle = () => {
    if (onActivate) onActivate();
    else setFlipped((f) => !f);
  };
  const showBack = canFlip && (flipped || hovered);
  // The smallest cards show just the first name so it fits on one line.
  const name = size === 'mini' ? p.name.split(' ')[0] : p.name;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={onActivate ? selected : showBack}
      aria-label={`${p.name}, ${p.role}. ${onActivate ? 'Show bio' : showBack ? 'Show photo' : 'Read bio'}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return;
        setHovered(false);
        setFlipped(false);
      }}
      className={`relative aspect-[4/5] w-full cursor-pointer outline-none perspective-[1600px] focus-visible:ring-2 focus-visible:ring-[#ff3f8d]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black ${s.radius}`}
    >
      <div
        className={`pointer-events-none relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-3d motion-reduce:duration-0 ${
          showBack ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front: photo + name plate */}
        <div
          className={`absolute inset-0 overflow-hidden border bg-black transition-colors backface-hidden ${s.radius} ${
            selected ? 'border-[#ff3f8d]/80' : 'border-white/10'
          }`}
        >
          {p.photo ? (
            <img
              src={p.photo}
              alt={`${p.name}, ${p.role} of Pureflow Studios`}
              className="absolute inset-0 h-full w-full object-cover"
              style={p.photoPosition ? { objectPosition: p.photoPosition } : undefined}
              loading="eager"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(closest-side at 50% 42%, rgba(255,47,134,0.38) 0%, rgba(164,82,255,0.2) 50%, transparent 80%), #07050b',
              }}
              aria-hidden="true"
            >
              <span className="font-display text-[5.5rem] font-bold leading-none tracking-tight text-white/90">
                {p.initials}
              </span>
            </div>
          )}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent ${s.plate}`}
          >
            {s.role && (
              <p className={`font-semibold uppercase leading-snug text-[#ff7eb2] ${s.role}`}>{p.role}</p>
            )}
            <h3 className={`font-sans font-semibold leading-tight tracking-[-0.015em] text-white ${s.name}`}>
              {name}
            </h3>
          </div>
        </div>

        {/* Back: bio */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[1.6rem] border border-[#ff3f8d]/35 bg-[#08060d] p-6 rotate-y-180 sm:p-7 backface-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ background: BACK_GLOW }} aria-hidden="true" />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase leading-snug tracking-[0.2em] text-[#ff7eb2]">
              {p.role}
            </p>
            <p className="mt-1 font-sans text-[1.3rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.45rem]">
              {p.name}
            </p>
            <div className="mt-4 h-px w-12 bg-gradient-to-r from-[#ff2f86] to-[#a855f7]" />
          </div>
          <p className="relative mt-4 text-[13.5px] leading-[1.7] text-white/70 sm:text-[14px]">{p.bio}</p>
        </div>
      </div>
    </div>
  );
}
