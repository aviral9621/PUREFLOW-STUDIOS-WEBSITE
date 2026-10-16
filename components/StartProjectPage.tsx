import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Brain,
  Globe2,
  Smartphone,
  Bot,
  HelpCircle,
  Lightbulb,
  FileText,
  Pencil,
  Wrench,
  Rocket,
  Flame,
  Clock,
  Calendar,
  Sprout,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { ViewState } from '../types';
import { supabase } from '../lib/supabase';

interface StartProjectPageProps {
  onViewChange: (view: ViewState) => void;
  /** Optional service tier to pre-select in step 1. When set, the flow opens
   *  on step 2 ("Your stage") with the chip already locked in. */
  prefillService?: string | null;
  /** Called once the prefill has been consumed so the parent can clear it. */
  onPrefillConsumed?: () => void;
}

// ─── Step config ─────────────────────────────────────────────────────────────

interface Choice {
  value: string;
  label: string;
  sub?: string;
  icon?: React.ElementType;
}

const SERVICE_CHOICES: Choice[] = [
  { value: 'software', label: 'Custom software / CRM', sub: 'Dashboards, internal tools, ERP.', icon: Brain },
  { value: 'website', label: 'A website that converts', sub: 'Marketing site, landing, booking.', icon: Globe2 },
  { value: 'mobile', label: 'A mobile app', sub: 'iOS + Android, PWA-first.', icon: Smartphone },
  { value: 'ai', label: 'AI agents & automation', sub: 'Workflows, chat, voice.', icon: Bot },
  { value: 'not-sure', label: 'Not sure yet', sub: 'Help me figure it out.', icon: HelpCircle },
];

const STAGE_CHOICES: Choice[] = [
  { value: 'idea', label: 'Just an idea on a napkin', icon: Lightbulb },
  { value: 'notes', label: "I've written it down somewhere", icon: FileText },
  { value: 'figma', label: 'Got a Figma or wireframe', icon: Pencil },
  { value: 'rebuild', label: 'Running on duct tape — need a rebuild', icon: Wrench },
  { value: 'live', label: 'Live product, just need to ship more', icon: Rocket },
];

const URGENCY_CHOICES: Choice[] = [
  { value: 'yesterday', label: 'Yesterday — we’re losing money on this', icon: Flame },
  { value: 'soon', label: 'Next 4–6 weeks ideally', icon: Clock },
  { value: 'quarter', label: 'Next quarter, planning ahead', icon: Calendar },
  { value: 'exploring', label: 'Exploring, no rush', icon: Sprout },
];

const BUDGET_CHOICES: Choice[] = [
  { value: 'under-1l', label: 'Under ₹1L', sub: 'Scrappy MVP' },
  { value: '1-5l', label: '₹1L – ₹5L', sub: 'Proper build' },
  { value: '5-15l', label: '₹5L – ₹15L', sub: 'Fully custom + AI' },
  { value: '15l+', label: '₹15L+', sub: "Let's build something serious" },
  { value: 'not-sure', label: 'Honestly no idea', sub: 'Tell me what’s realistic' },
];

// ─── Form state ──────────────────────────────────────────────────────────────

interface FormState {
  service: string;
  stage: string;
  pain: string;
  urgency: string;
  budget: string;
  name: string;
  contact: string;
  company: string;
  extras: string;
}

const EMPTY_FORM: FormState = {
  service: '',
  stage: '',
  pain: '',
  urgency: '',
  budget: '',
  name: '',
  contact: '',
  company: '',
  extras: '',
};

const TOTAL_STEPS = 6;

const STEP_TITLES = [
  'What we wire up',
  'Your stage',
  'The pain',
  'The clock',
  'The budget',
  'Your details',
];

// ─── Page component ──────────────────────────────────────────────────────────

export const StartProjectPage: React.FC<StartProjectPageProps> = ({
  onViewChange,
  prefillService = null,
  onPrefillConsumed,
}) => {
  const reduced = useReducedMotion();
  // If we arrive from a service page with a pre-selected tier, jump straight to
  // step 2 ("Your stage") with the service chip already locked in. Otherwise
  // the flow starts on step 0 as usual.
  const initialServiceMatch = prefillService
    ? SERVICE_CHOICES.find((c) => c.value === prefillService)?.value ?? ''
    : '';
  const [step, setStep] = useState(initialServiceMatch ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, service: initialServiceMatch });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Consume the prefill exactly once so the parent can clear its state.
  useEffect(() => {
    if (initialServiceMatch && onPrefillConsumed) onPrefillConsumed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Step ${step + 1} of ${TOTAL_STEPS}: ${STEP_TITLES[step]}`;
    }
  }, [step]);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isStepValid = (): boolean => {
    switch (step) {
      case 0: return !!form.service;
      case 1: return !!form.stage;
      case 2: return form.pain.trim().length >= 4;
      case 3: return !!form.urgency;
      case 4: return !!form.budget;
      case 5: return form.name.trim().length >= 1 && form.contact.trim().length >= 4;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const priority =
        (form.urgency === 'yesterday' ? 4 : form.urgency === 'soon' ? 3 : form.urgency === 'quarter' ? 2 : 1) +
        (form.budget === '15l+' ? 4 : form.budget === '5-15l' ? 3 : form.budget === '1-5l' ? 2 : 1);

      const { error: dbError } = await supabase.from('website_project_leads').insert({
        service: form.service,
        stage: form.stage,
        pain: form.pain,
        urgency: form.urgency,
        budget: form.budget,
        name: form.name,
        contact: form.contact,
        company: form.company || null,
        extras: form.extras || null,
        priority,
      });
      if (dbError) throw dbError;

      setDone(true);
    } catch (err) {
      console.error('[StartProject] submit error', err);
      setError('Something glitched. Try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  // Enter to continue / submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || submitting) return;
      if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
        if (isStepValid()) {
          if (step === TOTAL_STEPS - 1) handleSubmit();
          else goNext();
        }
      }
      if (e.key === 'Escape') onViewChange('home');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, form, done, submitting]);

  if (done) {
    return <DoneScreen onViewChange={onViewChange} />;
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.06] rounded-full blur-[140px]" />
        <div
          className="absolute bottom-[-15%] left-[-10%] h-[460px] w-[460px]"
          style={{ background: 'radial-gradient(closest-side, rgba(255,32,160,0.18), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px]"
          style={{ background: 'radial-gradient(closest-side, rgba(164,82,255,0.18), transparent 70%)', filter: 'blur(50px)' }}
        />
      </div>

      {/* Screen-reader announcer */}
      <div ref={liveRegionRef} className="sr-only" role="status" aria-live="polite" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-5 pb-6 pt-20 sm:px-6 sm:pt-24">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <button
            onClick={() => (step === 0 ? onViewChange('home') : goPrev())}
            className="group inline-flex items-center gap-1.5 text-[12px] text-white/55 transition-colors hover:text-white sm:text-[13px]"
            aria-label={step === 0 ? 'Back to home' : 'Previous step'}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            {step === 0 ? 'Home' : 'Back'}
          </button>

          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:text-[11px]">
            {String(step + 1).padStart(2, '0')} <span className="text-white/25">/ {String(TOTAL_STEPS).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => onViewChange('home')}
            className="text-[12px] text-white/45 transition-colors hover:text-white sm:text-[13px]"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-9 h-[3px] w-full overflow-hidden rounded-full bg-white/10 sm:mb-12">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7]"
            initial={false}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Step body */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={reduced ? false : { opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -direction * 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {step === 0 && (
                <QuestionScreen
                  eyebrow="Service"
                  title="What we wire up?"
                  hint="Pick one. You can change your mind later."
                >
                  <ChipGrid choices={SERVICE_CHOICES} value={form.service} onChange={(v) => { setForm({ ...form, service: v }); setTimeout(goNext, 220); }} />
                </QuestionScreen>
              )}

              {step === 1 && (
                <QuestionScreen
                  eyebrow="Stage"
                  title="Where are you in the story?"
                  hint="No judgment — napkins welcome."
                >
                  <ChipGrid choices={STAGE_CHOICES} value={form.stage} onChange={(v) => { setForm({ ...form, stage: v }); setTimeout(goNext, 220); }} />
                </QuestionScreen>
              )}

              {step === 2 && (
                <QuestionScreen
                  eyebrow="The pain"
                  title="What's actually broken right now?"
                  hint="One line is fine. Drama is welcome."
                >
                  <textarea
                    autoFocus
                    rows={5}
                    value={form.pain}
                    onChange={(e) => setForm({ ...form, pain: e.target.value })}
                    placeholder="e.g. We're tracking 200+ leads in WhatsApp groups and losing the hot ones. We need a CRM that actually works on mobile."
                    className="w-full rounded-2xl border border-white/12 bg-black/40 p-4 text-[15px] leading-[1.6] text-white placeholder-white/30 transition-all duration-200 focus:border-[#ff3f8d]/60 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#ff3f8d]/20 sm:p-5 sm:text-[16px]"
                  />
                  <p className="mt-2 text-right text-[11px] text-white/40">{form.pain.length} chars</p>
                </QuestionScreen>
              )}

              {step === 3 && (
                <QuestionScreen
                  eyebrow="Urgency"
                  title="How serious is this?"
                  hint="Honest answers help us prioritise."
                >
                  <ChipGrid choices={URGENCY_CHOICES} value={form.urgency} onChange={(v) => { setForm({ ...form, urgency: v }); setTimeout(goNext, 220); }} />
                </QuestionScreen>
              )}

              {step === 4 && (
                <QuestionScreen
                  eyebrow="Budget"
                  title="Ballpark budget?"
                  hint="So we don't waste each other's time."
                >
                  <ChipGrid choices={BUDGET_CHOICES} value={form.budget} onChange={(v) => { setForm({ ...form, budget: v }); setTimeout(goNext, 220); }} />
                </QuestionScreen>
              )}

              {step === 5 && (
                <QuestionScreen
                  eyebrow="Last bit"
                  title="Where do we slide into your DMs?"
                  hint="Promise — no spam, ever."
                >
                  <div className="space-y-3.5">
                    <TextField
                      label="Your name"
                      required
                      autoFocus
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                    />
                    <TextField
                      label="WhatsApp or email"
                      required
                      value={form.contact}
                      onChange={(v) => setForm({ ...form, contact: v })}
                      hint="Your call — whichever you actually check"
                    />
                    <TextField
                      label="Company or project name"
                      value={form.company}
                      onChange={(v) => setForm({ ...form, company: v })}
                    />
                    <TextField
                      label="Anything else? (optional)"
                      multiline
                      value={form.extras}
                      onChange={(v) => setForm({ ...form, extras: v })}
                    />
                  </div>
                  {error && (
                    <p className="mt-3 text-[12.5px] text-rose-400">{error}</p>
                  )}
                </QuestionScreen>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer — Next / Submit */}
        <div className="sticky bottom-0 mt-8 flex flex-col gap-2.5 bg-gradient-to-t from-black via-black/95 to-transparent pb-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="hidden text-[11.5px] text-white/40 sm:block">
            Press <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white/70">Enter</kbd> to continue
          </p>

          <button
            type="button"
            onClick={step === TOTAL_STEPS - 1 ? handleSubmit : goNext}
            disabled={!isStepValid() || submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:h-12 sm:w-auto sm:px-8 sm:text-[14.5px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : step === TOTAL_STEPS - 1 ? (
              <>
                Send brief
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Subcomponents ───────────────────────────────────────────────────────────

const QuestionScreen: React.FC<{
  eyebrow: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, hint, children }) => (
  <>
    <p className="gradient-flow-text text-[10px] font-bold uppercase tracking-[0.22em]">{eyebrow}</p>
    <h1 className="mt-3 font-sans text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-white sm:text-[2.1rem] md:text-[2.4rem]">
      {title}
    </h1>
    {hint && <p className="mt-2 text-[13.5px] text-white/50 sm:text-[14px]">{hint}</p>}
    <div className="mt-7 sm:mt-9">{children}</div>
  </>
);

const ChipGrid: React.FC<{
  choices: Choice[];
  value: string;
  onChange: (v: string) => void;
}> = ({ choices, value, onChange }) => (
  <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
    {choices.map((c) => {
      const selected = value === c.value;
      const Icon = c.icon;
      return (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={`group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 sm:gap-4 sm:p-5 ${
            selected
              ? 'border-[#ff3f8d]/70 bg-gradient-to-br from-[#ff3f8d]/15 to-[#a855f7]/10 shadow-[0_0_30px_-12px_rgba(255,47,134,0.6)]'
              : 'border-white/12 bg-white/[0.025] hover:border-white/30 hover:bg-white/[0.05]'
          }`}
        >
          {Icon && (
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border bg-black transition-colors sm:h-11 sm:w-11 ${
              selected ? 'border-[#ff3f8d]/70 text-white' : 'border-white/85 text-white'
            }`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.9} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[14.5px] font-semibold leading-tight tracking-[-0.005em] text-white sm:text-[15.5px]">{c.label}</p>
            {c.sub && <p className="mt-0.5 text-[12.5px] text-white/50 sm:text-[13px]">{c.sub}</p>}
          </div>
          <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
            selected ? 'border-[#ff3f8d] bg-[#ff3f8d] text-white' : 'border-white/25'
          }`}>
            {selected && <Check className="h-3 w-3" strokeWidth={3} />}
          </div>
        </button>
      );
    })}
  </div>
);

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  multiline?: boolean;
  hint?: string;
  autoFocus?: boolean;
}> = ({ label, value, onChange, required, multiline, hint, autoFocus }) => {
  const baseClass =
    'peer w-full rounded-xl border border-white/12 bg-black/40 px-4 pb-2.5 pt-5 text-[14.5px] text-white placeholder-transparent transition-colors duration-200 focus:border-[#ff3f8d]/60 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#ff3f8d]/20 sm:text-[15px]';

  return (
    <label className="relative block">
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          required={required}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={baseClass}
        />
      )}
      <span className="pointer-events-none absolute left-4 top-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {label}
        {required && <span className="ml-0.5 text-[#ff3f8d]">*</span>}
      </span>
      {hint && <span className="mt-1.5 block text-[11px] text-white/40">{hint}</span>}
    </label>
  );
};

// ─── Done screen ─────────────────────────────────────────────────────────────

const DoneScreen: React.FC<{ onViewChange: (v: ViewState) => void }> = ({ onViewChange }) => (
  <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-1/3 mx-auto h-[500px] w-[500px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,47,134,0.25), transparent 70%)', filter: 'blur(60px)' }}
      />
    </div>

    <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff3f8d]/40 bg-gradient-to-br from-[#ff3f8d]/20 to-[#a855f7]/10 shadow-[0_10px_40px_-10px_rgba(255,47,134,0.55)] sm:h-20 sm:w-20"
      >
        <Check className="h-7 w-7 text-white sm:h-9 sm:w-9" strokeWidth={2.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="flex flex-col items-center"
      >
        <span className="font-serif italic text-white/95 text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.1]">
          Brief received.
        </span>
        <span className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.2rem,5vw,4.5rem)]" data-text="LET'S BUILD.">
          LET'S BUILD.
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="mt-5 max-w-md text-[14.5px] text-white/65 sm:text-[15px]"
      >
        We'll reply within 24 hours — usually faster.
        Want to skip the wait? Ping us on WhatsApp now.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
        className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:gap-3"
      >
        <a
          href="https://wa.me/916393640650"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[14px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.99]"
        >
          <MessageCircle className="h-4 w-4" />
          Ping on WhatsApp
        </a>
        <button
          onClick={() => onViewChange('home')}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 text-[14px] font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40"
        >
          Back to home
        </button>
      </motion.div>
    </div>
  </div>
);
