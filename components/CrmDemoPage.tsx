import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Layout,
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { ViewState } from '../types';

interface CrmDemoPageProps {
  onViewChange: (view: ViewState) => void;
}

const FEATURES = [
  { icon: Layout, title: 'Dashboard', desc: 'Live overview of leads, revenue, and team activity.' },
  { icon: Users, title: 'Leads', desc: 'Track every lead from entry to close — no spreadsheet.' },
  { icon: CheckSquare, title: 'Tasks', desc: 'Assign, reassign, and track tasks across teams.' },
  { icon: FileText, title: 'Invoices', desc: 'GST-compliant invoices in two clicks.' },
  { icon: CreditCard, title: 'Expenses', desc: 'Petty cash and operational costs, all in one place.' },
  { icon: BarChart3, title: 'Reports', desc: 'Slice performance by team, channel, or period.' },
];

export const CrmDemoPage: React.FC<CrmDemoPageProps> = ({ onViewChange }) => {
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.06] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-20 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        {/* Back */}
        <button
          onClick={() => onViewChange('home')}
          className="group mb-8 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        {/* Hero */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff3f8d]/25 bg-[#ff3f8d]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff7eb2]">
            Live Preview
          </div>
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1]">
            The CRM
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="IN ACTION."
          >
            IN ACTION.
          </span>
          <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/60 sm:text-base">
            Explore real screens, modules, and workflows from the systems we ship to clients.
          </p>
        </motion.div>

        {/* Video card */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="group relative mt-10 aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0a080f] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:mt-14 sm:rounded-3xl"
        >
          {/* mock chrome */}
          <div className="absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-15">
            <div className="absolute inset-x-6 top-6 h-6 rounded-md bg-white/5 sm:inset-x-8" />
            <div className="absolute left-6 top-16 bottom-6 w-[22%] rounded-lg bg-white/4 sm:left-8" />
            <div className="absolute right-6 left-[28%] top-16 bottom-6 rounded-lg bg-white/5 sm:right-8" />
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff2f86] to-[#a855f7] shadow-[0_0_30px_rgba(255,47,134,0.45)] sm:h-20 sm:w-20">
                <Play className="ml-1 h-6 w-6 fill-white text-white sm:h-8 sm:w-8" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
            <div>
              <div className="text-[15px] font-bold text-white sm:text-lg">Watch the walkthrough</div>
              <div className="text-[11px] text-white/55 sm:text-xs">2 min 45 sec · 4K quality</div>
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#08060d] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3f8d]/45 sm:p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/85 bg-black text-white sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.9} />
                </div>
                <h3 className="font-sans text-[14px] font-semibold tracking-[-0.01em] text-white sm:text-[15px]">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55 sm:text-[13px]">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] p-7 text-center sm:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.14) 0%, transparent 55%)',
            }}
          />
          <h3 className="relative font-sans text-[1.4rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.7rem]">
            Ready to modernise your operations?
          </h3>
          <p className="relative mt-3 text-[14px] text-white/60 sm:text-[15px]">
            Book a 15-minute call and we'll map out what your custom CRM would look like.
          </p>
          <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://wa.me/916393640650"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-14 sm:w-auto sm:px-9 sm:text-[15px]"
            >
              Book demo
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => onViewChange('contact')}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-7 text-[14px] font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40 sm:h-14 sm:w-auto sm:px-9 sm:text-[15px]"
            >
              Send a brief
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};
