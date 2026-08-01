import { useEffect, useRef, useState, MouseEvent } from 'react';
// `m` instead of `motion`: `motion` pulls framer-motion's entire DOM feature set
// (drag, layout projection, gestures) into the initial chunk. The hero only does
// simple enter/transform animations, so it uses the lightweight `m` component and
// the `domAnimation` feature bundle provided by the <LazyMotion> in App.tsx.
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ViewState } from '../../types';

interface HeroProps {
  onViewChange: (view: ViewState) => void;
  onOpenContact: (title: string, rect: DOMRect) => void;
  onStartProject: () => void;
  onBookCall: () => void;
}

const wordUp = {
  hidden: { y: '105%', opacity: 0 },
  visible: (delay: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export function Hero({ onViewChange: _onViewChange, onOpenContact: _onOpenContact, onStartProject, onBookCall }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 70, damping: 30 };
  const headlineX = useSpring(useTransform(rawX, [-1, 1], [-4, 4]), springConfig);
  const headlineY = useSpring(useTransform(rawY, [-1, 1], [-3, 3]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Skip the heavy background video on small screens, data-saver, or slow
    // connections — the gradient/particle overlays already carry the hero.
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slowConnection = !!conn && (conn.saveData === true || /(^|-)(2g|slow-2g)$/.test(conn.effectiveType || ''));
    const smallScreen = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    if (slowConnection || smallScreen) return;

    const load = () => setLoadVideo(true);
    const idleCallback = window.requestIdleCallback?.(load, { timeout: 1800 });
    const timeout = window.setTimeout(load, 2200);

    return () => {
      if (idleCallback) window.cancelIdleCallback?.(idleCallback);
      window.clearTimeout(timeout);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-black px-5 pb-6 pt-20 sm:pt-24 md:pb-8"
      aria-label="Hero"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 70%, rgba(151,31,255,0.24) 0%, rgba(199,32,255,0.11) 26%, transparent 58%), radial-gradient(ellipse at 28% 56%, rgba(236,72,153,0.14) 0%, transparent 36%)',
          }}
        />
      </div>

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50 saturate-[1.2] contrast-125"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        {loadVideo && <source src="/videos/hero-bg.webm" type="video/webm" />}
      </video>

      <div className="hero-energy-field absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="hero-particle-field absolute inset-0 opacity-80" aria-hidden="true" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.14) 38%, rgba(0,0,0,0.68) 76%, #000 100%)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute bottom-[-260px] left-1/2 h-[540px] w-[740px] -translate-x-1/2 pointer-events-none md:h-[640px] md:w-[1100px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(199,32,255,0.28) 0%, rgba(122,0,255,0.22) 35%, transparent 72%)',
          filter: 'blur(110px)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[42vh] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(130,0,255,0.08) 32%, rgba(255,47,134,0.18) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 grain pointer-events-none" aria-hidden="true" />

      <div
        className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/75 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-center text-center">
        <m.h1
          className="hero-title-stack relative flex w-full flex-col items-center text-center"
          style={prefersReducedMotion ? {} : { x: headlineX, y: headlineY }}
        >
          <span className="hero-headline-mask absolute left-1/2 top-1/2 -z-10 h-[82%] w-[118%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

          <span className="hero-title-line hero-title-line-where relative z-10 flex justify-center">
            <span className="inline-block pr-6 leading-none">
              <m.span
                className="relative inline-block font-serif italic text-[3.4rem] font-normal tracking-normal text-white/95 sm:text-[clamp(2.8rem,5.8vw,5.8rem)]"
                custom={0.4}
                variants={wordUp}
                initial={prefersReducedMotion ? false : 'hidden'}
                animate="visible"
              >
                Where
                <span
                  className="hero-sparkle absolute -right-8 top-3"
                  aria-hidden="true"
                />
              </m.span>
            </span>
          </span>

          <span className="hero-title-line hero-title-line-business relative z-10 inline-block leading-none">
            <m.span
              className="hero-business-meets inline-block whitespace-nowrap text-[2.2rem] font-black leading-none text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)] sm:text-[clamp(2.2rem,5.5vw,5.4rem)]"
              custom={0.55}
              variants={wordUp}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              business meets
            </m.span>
          </span>

          <span className="hero-title-line hero-title-line-automation relative z-10 inline-block w-full leading-none">
            <m.span
              className="hero-automation-text inline-block text-[3rem] leading-none sm:text-[clamp(3rem,8.4vw,8.4rem)]"
              data-text="AUTOMATION"
              custom={0.8}
              variants={wordUp}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              AUTOMATION
            </m.span>
          </span>
        </m.h1>

        <m.p
          custom={1}
          variants={wordUp}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="mt-4 max-w-[720px] text-sm font-medium leading-snug text-white/72 md:mt-5 md:text-base md:leading-snug"
        >
          We build custom software, CRMs, AI agents, and websites that turn manual chaos into
          measurable systems - for businesses ready to stop firefighting and start scaling.
        </m.p>

        <m.div
          custom={1.1}
          variants={wordUp}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="mt-5 flex w-full max-w-[440px] flex-row items-stretch justify-center gap-3 sm:max-w-none sm:flex-wrap sm:gap-4 md:mt-6"
        >
          <button
            ref={startBtnRef}
            onClick={onStartProject}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,47,134,0.28)] transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(255,47,134,0.5)] sm:h-auto sm:min-w-[205px] sm:flex-none sm:px-7 sm:py-3.5"
          >
            Start a project
            <ArrowUpRight className="h-5 w-5 flex-shrink-0" />
          </button>

          <button
            onClick={onBookCall}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:h-auto sm:min-w-[195px] sm:flex-none sm:px-7 sm:py-3.5"
          >
            Book a 15-min call
          </button>
        </m.div>

        <m.div
          custom={1.3}
          variants={wordUp}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="mt-5 flex w-full flex-col items-center gap-4 md:mt-6"
        >
          <div className="flex w-full max-w-[640px] flex-wrap items-center justify-center gap-x-5 gap-y-2 opacity-75 sm:max-w-none sm:gap-x-8">
            <span className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-white/85 sm:text-[14px]">Herbal Vantage</span>
            <span className="font-serif text-[14px] italic tracking-tight text-white/85 sm:text-[16px]">Quick Hotels</span>
            <span className="font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[14px]">Spectrum Tour</span>
            <span className="font-serif text-[14px] tracking-wide text-white/80 sm:text-[16px]">UnSkills</span>
            <span className="font-display text-[13px] font-black uppercase tracking-[0.16em] text-white/80 sm:text-[14px]">Laxmi Agro</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <span className="text-center text-sm leading-snug text-white/65">
              Trusted by 100+ founders across India
            </span>

            <div className="hidden h-5 w-px bg-white/20 sm:block" />

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-4 w-4 text-[#ff2f86]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-white/65">4.8 on Google</span>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
