import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  MapPin,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  Linkedin,
  Briefcase,
  Handshake,
  HelpCircle,
  Newspaper,
  Heart,
  Loader2,
  CalendarClock,
} from 'lucide-react';
import { ViewState } from '../types';
import { ChipGrid, Choice, QuestionScreen, TextField } from './shared/StepFormParts';
import { supabase } from '../lib/supabase';

interface ContactPageProps {
  onViewChange: (view: ViewState) => void;
}

const EMAIL = 'support@pureflowdesigns.com';
const PHONE_DISPLAY = '+91 63936 40650';
const PHONE_RAW = '+916393640650';
const WHATSAPP_URL = 'https://wa.me/916393640650';

const REASON_CHOICES: Choice[] = [
  { value: 'project', label: 'New project or quote', sub: "We'll send you to a quick brief", icon: Briefcase },
  { value: 'partnership', label: 'Partnership or collab', sub: 'Agencies, studios, dev shops', icon: Handshake },
  { value: 'question', label: 'Just have a question', sub: 'No commitment, no spam', icon: HelpCircle },
  { value: 'press', label: 'Press, media, or interview', sub: 'Founders and writers welcome', icon: Newspaper },
  { value: 'support', label: "I'm an existing client", sub: 'Support and updates', icon: Heart },
];

interface ContactForm {
  reason: string;
  message: string;
  name: string;
  contact: string;
}

const EMPTY: ContactForm = { reason: '', message: '', name: '', contact: '' };
const TOTAL_STEPS = 3;

export const ContactPage: React.FC<ContactPageProps> = ({ onViewChange }) => {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const isStepValid = (): boolean => {
    switch (step) {
      case 0: return !!form.reason;
      case 1: return form.message.trim().length >= 4;
      case 2: return form.name.trim().length >= 1 && form.contact.trim().length >= 4;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    // If reason is "project", route to start-project flow instead — captures intent without duplicate work.
    if (form.reason === 'project') {
      onViewChange('start-project');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { error: dbError } = await supabase.from('website_contact_submissions').insert({
        reason: form.reason,
        message: form.message,
        name: form.name,
        contact: form.contact,
        kind: 'contact',
      });
      if (dbError) throw dbError;
      setDone(true);
    } catch (err) {
      console.error('[Contact] submit error', err);
      setError('Something glitched. Try again or ping us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: PHONE_DISPLAY, href: WHATSAPP_URL, external: true },
    { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, external: false },
    { icon: Phone, label: 'Call', value: PHONE_DISPLAY, href: `tel:${PHONE_RAW}`, external: false },
    { icon: Instagram, label: 'Instagram', value: '@pureflowstudios', href: 'https://instagram.com/pureflowstudios', external: true },
    { icon: Linkedin, label: 'LinkedIn', value: 'Pureflow Studios', href: 'https://www.linkedin.com/company/pureflow-studios', external: true },
    { icon: MapPin, label: 'Visit', value: 'Lucknow, Uttar Pradesh', href: 'https://maps.google.com/?q=Lucknow,Uttar+Pradesh', external: true },
  ];

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-brand/[0.07] rounded-full blur-[140px]" />
        <div
          className="absolute bottom-[-15%] left-[-10%] h-[500px] w-[500px]"
          style={{ background: 'radial-gradient(closest-side, rgba(255,32,160,0.18), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px]"
          style={{ background: 'radial-gradient(closest-side, rgba(164,82,255,0.18), transparent 70%)', filter: 'blur(50px)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-20 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        {/* Hero */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            Let's start
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="A CONVERSATION."
          >
            A CONVERSATION.
          </span>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
            Tell us what's up. We respond within 24 hours — no sales theatre.
          </p>
        </motion.div>

        {/* Channels grid — quick contact */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {channels.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#08060d] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3f8d]/45 sm:p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/85 bg-black text-white sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.9} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">{c.label}</p>
                <p className="mt-1 break-all text-[13px] font-semibold text-white sm:text-[14px]">{c.value}</p>
              </motion.a>
            );
          })}
        </div>

        {/* Book-a-call promo strip */}
        <motion.button
          type="button"
          onClick={() => onViewChange('book-call')}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-[#ff3f8d]/30 bg-gradient-to-br from-[#ff3f8d]/10 to-[#a855f7]/[0.06] p-4 text-left transition-all duration-300 hover:border-[#ff3f8d]/55 sm:p-5"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#ff3f8d]/40 bg-black text-white">
            <CalendarClock className="h-5 w-5" strokeWidth={1.9} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[14.5px] font-semibold text-white sm:text-[15.5px]">Prefer to talk? Book a call.</p>
            <p className="text-[12.5px] text-white/55 sm:text-[13px]">Pick a slot — 15 or 30 minutes, free.</p>
          </div>
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-white/55" />
        </motion.button>

        {/* ── Multi-step form ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-[#08060d]/85 backdrop-blur sm:mt-16"
        >
          {done ? (
            <DoneInline onViewChange={onViewChange} />
          ) : (
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Step header */}
              <div className="mb-6 flex items-center justify-between">
                <p className="gradient-flow-text text-[10px] font-bold uppercase tracking-[0.22em]">
                  Send a message
                </p>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:text-[11px]">
                  {String(step + 1).padStart(2, '0')} <span className="text-white/25">/ {String(TOTAL_STEPS).padStart(2, '0')}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-7 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] transition-[width] duration-500"
                  style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={reduced ? false : { opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -direction * 24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === 0 && (
                    <QuestionScreen
                      eyebrow="Reason"
                      title="What brings you here?"
                      hint="One pick. Routes your message to the right person."
                    >
                      <ChipGrid
                        choices={REASON_CHOICES}
                        value={form.reason}
                        onChange={(v) => { setForm({ ...form, reason: v }); setTimeout(goNext, 220); }}
                      />
                    </QuestionScreen>
                  )}

                  {step === 1 && (
                    <QuestionScreen
                      eyebrow="Message"
                      title="What do you want to say?"
                      hint="One line is fine. Skip the small talk."
                    >
                      <textarea
                        autoFocus
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us what's on your mind…"
                        className="w-full rounded-2xl border border-white/12 bg-black/40 p-4 text-[15px] leading-[1.6] text-white placeholder-white/30 transition-all duration-200 focus:border-[#ff3f8d]/60 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#ff3f8d]/20 sm:p-5 sm:text-[16px]"
                      />
                      <p className="mt-2 text-right text-[11px] text-white/40">{form.message.length} chars</p>
                    </QuestionScreen>
                  )}

                  {step === 2 && (
                    <QuestionScreen
                      eyebrow="Contact"
                      title="Where can we reach you?"
                      hint="WhatsApp or email — your call."
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
                          label="Email or WhatsApp"
                          required
                          value={form.contact}
                          onChange={(v) => setForm({ ...form, contact: v })}
                        />
                      </div>
                      {error && <p className="mt-3 text-[12.5px] text-rose-400">{error}</p>}
                    </QuestionScreen>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Step nav */}
              <div className="mt-7 flex items-center justify-between gap-3 sm:mt-8">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={step === 0}
                  className="text-[12.5px] font-semibold text-white/55 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-white/55 sm:text-[13px]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={step === TOTAL_STEPS - 1 ? handleSubmit : goNext}
                  disabled={!isStepValid() || submitting}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-[13.5px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:h-12 sm:px-8 sm:text-[14px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : step === TOTAL_STEPS - 1 ? (
                    <>
                      Send message
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
          )}
        </motion.div>
      </div>
    </main>
  );
};

// ─── Inline done state ───────────────────────────────────────────────────────

const DoneInline: React.FC<{ onViewChange: (v: ViewState) => void }> = ({ onViewChange }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#ff3f8d]/40 bg-[#ff3f8d]/10">
      <Check className="h-7 w-7 text-[#ff3f8d]" strokeWidth={2.5} />
    </div>
    <h3 className="font-sans text-xl font-semibold text-white sm:text-2xl">Message sent.</h3>
    <p className="mt-2 max-w-sm text-[14px] text-white/60">
      We'll reply within 24 hours — usually faster.
    </p>
    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-[13px] font-bold text-white transition-all hover:scale-[1.02]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp now
      </a>
      <button
        onClick={() => onViewChange('home')}
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-5 text-[13px] font-semibold text-white transition-all hover:bg-white/10"
      >
        Back to home
      </button>
    </div>
  </div>
);
