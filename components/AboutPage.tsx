import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

        {/* ── Story: founder image + narrative ── */}
        <div className="mt-16 grid grid-cols-1 items-start gap-8 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
          {/* Image */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[420px] lg:sticky lg:top-28"
          >
            {/* gradient halo */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2.2rem] opacity-70"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(255,47,134,0.35) 0%, rgba(164,82,255,0.18) 45%, transparent 75%)',
                filter: 'blur(28px)',
              }}
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-black shadow-[0_30px_80px_-30px_rgba(255,47,134,0.45)]">
              <img
                src="/founder pureflow.jpeg"
                alt="Aviral Singh, founder of Pureflow Studios"
                className="block aspect-[4/5] w-full object-cover"
                loading="eager"
              />
              {/* bottom gradient + name plate */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pb-4 pt-12 px-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff7eb2]">
                  Founder · CEO
                </p>
                <p className="mt-1 font-sans text-[1.3rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.5rem]">
                  Aviral Singh
                </p>
                <p className="text-[12px] text-white/60">Pureflow Studios · Est. 2022 · Lucknow, India</p>
              </div>
            </div>
          </motion.div>

          {/* Narrative */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="space-y-7"
          >
            <div>
              <p className="gradient-flow-text text-[10px] font-bold uppercase tracking-[0.22em]">
                The story
              </p>
              <h2 className="mt-3 font-sans text-[1.75rem] font-bold leading-[1.1] tracking-[-0.015em] text-white sm:text-[2.1rem] md:text-[2.4rem]">
                One client. One referral. Repeat.
              </h2>
            </div>

            <p className="text-[15.5px] leading-[1.75] text-white/75 sm:text-base sm:leading-[1.8]">
              Pureflow Studios didn’t start with a pitch deck. It started with one client, one
              product, one week of relentless work. They liked it. They referred us. From two
              clients we became five. Then a team.
            </p>

            <div className="rounded-2xl border border-[#ff3f8d]/25 bg-[#ff3f8d]/[0.06] p-5">
              <p className="flex items-start gap-3 text-[14px] leading-relaxed text-white/80 sm:text-[15px]">
                <Heart className="mt-1 h-4 w-4 flex-shrink-0 text-[#ff7eb2]" strokeWidth={2} />
                <span>
                  Three years ago we hired <strong className="text-white">Tayyaba</strong> — our
                  first tech teammate. She’s still here today, leading engineering. Most agencies
                  churn. We don’t.
                </span>
              </p>
            </div>

            <p className="text-[15.5px] leading-[1.75] text-white/75 sm:text-base sm:leading-[1.8]">
              Since then we’ve grown to ten people. Designers, engineers, AI tinkerers. Every hire
              shipped a real product in their first two weeks. No bench. No theatre.
            </p>

            <p className="text-[15.5px] leading-[1.75] text-white/75 sm:text-base sm:leading-[1.8]">
              The thing that got us here is the same thing we ship today: quality, on time, built
              like we own it. That’s why most of our clients come from another client.
            </p>

            {/* Pull-quote */}
            <blockquote className="relative border-l-2 border-[#ff3f8d] bg-white/[0.02] px-5 py-4 font-sans text-[16px] italic leading-[1.6] text-white sm:text-[18px]">
              We’re young. We move fast. And we don’t fake polish.
            </blockquote>
          </motion.div>
        </div>

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
