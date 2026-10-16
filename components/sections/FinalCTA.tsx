import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar, Check } from 'lucide-react';
import { MagneticButton } from '../shared/MagneticButton';

interface FinalCTAProps {
  onOpenContact: (title: string, rect: DOMRect) => void;
  onStartProject: () => void;
  onBookCall: () => void;
}

const wordUp = {
  hidden: { y: '110%', opacity: 0 },
  visible: (delay: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const fadeSlide = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

interface WordProps {
  text: string;
  delay: number;
  className?: string;
  prefersReducedMotion: boolean | null;
}

function Word({ text, delay: _delay, className = '', prefersReducedMotion: _prefersReducedMotion }: WordProps) {
  return (
    <span className="inline-block overflow-visible leading-[1.08]">
      <span className={`inline-block ${className}`}>{text}</span>
    </span>
  );
}

const trustItems = [
  'Fixed-price proposals',
  '30-day post-launch support',
  'GST invoices included',
];

export function FinalCTA({ onOpenContact: _onOpenContact, onStartProject, onBookCall }: FinalCTAProps) {
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleStartProject() {
    onStartProject();
  }

  return (
    <section className="relative py-16 md:py-20 px-5 sm:px-6 lg:px-10 bg-black overflow-hidden grain">

      {/* Pulsing radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(217,70,239,0.15) 0%, transparent 70%)',
        }}
        animate={prefersReducedMotion ? {} : { opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">

        {/* Headline — hero style */}
        <motion.div
          className="flex flex-col items-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            Ready to automate
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="THE CHAOS?"
          >
            THE CHAOS?
          </span>
        </motion.div>

        {/* Subhead */}
        <motion.p
          custom={0.45}
          variants={fadeSlide}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-5 text-white/60 text-base max-w-md mx-auto leading-relaxed md:mt-6 md:text-lg md:max-w-xl"
        >
          Tell us about your project. We reply in 24 hours — no sales theatre.
        </motion.p>

        {/* CTA stack */}
        <motion.div
          custom={0.55}
          variants={fadeSlide}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-7 flex w-full max-w-[460px] flex-row items-stretch justify-center gap-3 sm:max-w-none sm:gap-4"
        >
          <div ref={ctaWrapRef} className="inline-flex flex-1 sm:flex-none">
            <MagneticButton
              variant="primary"
              onClick={handleStartProject}
              className="gradient-brand-deep flex h-12 w-full items-center justify-center gap-2 text-[13px] px-4 text-white [&_*]:text-white sm:h-16 sm:text-base sm:px-10 sm:w-auto"
            >
              <span className="whitespace-nowrap">Start a project</span>
              <ArrowRight className="inline-block w-3.5 h-3.5 flex-shrink-0 sm:w-4 sm:h-4" />
            </MagneticButton>
          </div>

          <button
            onClick={onBookCall}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 text-[12px] font-medium tracking-wide uppercase text-white/70 transition-all duration-300 hover:text-white hover:border-white/40 sm:h-16 sm:flex-none sm:gap-2 sm:px-8 sm:text-sm"
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Book 15-min</span>
          </button>
        </motion.div>

        {/* Trust micro-row */}
        <motion.div
          custom={0.65}
          variants={fadeSlide}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:mt-7 sm:gap-x-8"
        >
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-wide sm:text-xs sm:gap-2">
              <Check className="w-3 h-3 text-fuchsia-500/70 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
              {item}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
