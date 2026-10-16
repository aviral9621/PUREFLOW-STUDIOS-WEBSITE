import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Users,
  Globe,
  Receipt,
  Zap,
  MessageSquare,
  BarChart,
  TrendingUp,
} from 'lucide-react';
import { ViewState } from '../types';

interface AutomationPageProps {
  onViewChange: (view: ViewState) => void;
}

const STEPS = [
  { icon: MessageSquare, label: 'Lead Inflow', desc: 'WhatsApp, web forms, Meta ads — all captured into one inbox.' },
  { icon: Bot, label: 'AI Calling Agent', desc: 'Auto-qualifies leads with a real phone conversation in 30 seconds.' },
  { icon: Globe, label: 'Website Sales', desc: 'Smart landing pages convert traffic 24/7, even while you sleep.' },
  { icon: Users, label: 'Deal Closing', desc: 'CRM pipeline logic routes hot leads to the right rep instantly.' },
  { icon: Zap, label: 'Workflow Automation', desc: 'Zero manual data entry — every action triggers the next one.' },
  { icon: BarChart, label: 'Retargeting Ads', desc: 'Lost leads pulled back via automatic Meta retargeting.' },
  { icon: Receipt, label: 'Auto Invoicing', desc: 'GST invoices generated, sent, and tracked without lifting a finger.' },
  { icon: TrendingUp, label: 'Revenue', desc: 'Money in the bank — fully tracked, fully attributed.', highlight: true },
];

export const AutomationPage: React.FC<AutomationPageProps> = ({ onViewChange }) => {
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-brand/[0.06] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
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
            AI Agents · 2026
          </div>
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1]">
            The fully
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="AUTOMATED BUSINESS."
          >
            AUTOMATED BUSINESS.
          </span>
          <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-white/60 sm:text-base">
            From the first WhatsApp message to the final invoice — every step handled by AI agents
            and automation. You focus on growth. The system handles the grind.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={() => onViewChange('contact')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-14 sm:px-9 sm:text-[15px]"
            >
              Map my automation
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/916393640650"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 text-[14px] font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40 sm:h-14 sm:px-9 sm:text-[15px]"
            >
              Talk on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 sm:mt-20">
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-center font-sans text-[1.7rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:mb-10 sm:text-[2rem]"
          >
            The full loop.
          </motion.h2>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isHighlight = step.highlight;
              return (
                <motion.div
                  key={step.label}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 sm:p-5 ${
                    isHighlight
                      ? 'border-[#ff3f8d]/50 bg-gradient-to-br from-[#1a0a12] to-[#08060d] hover:border-[#ff3f8d]/80'
                      : 'border-white/10 bg-[#08060d] hover:border-[#ff3f8d]/45'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-black text-white sm:h-10 sm:w-10 ${
                        isHighlight ? 'border-[#ff3f8d]/70' : 'border-white/85'
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.9} />
                    </div>
                    <span className="text-[10px] font-bold text-white/35 sm:text-[11px]">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-sans text-[14.5px] font-semibold tracking-[-0.01em] text-white sm:text-[15.5px]">
                    {step.label}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55 sm:text-[13px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-[#08060d] p-7 text-center sm:mt-20 sm:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,32,160,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.14) 0%, transparent 55%)',
            }}
          />
          <h3 className="relative font-sans text-[1.4rem] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[1.7rem]">
            Ready to put this loop on autopilot?
          </h3>
          <p className="relative mt-3 text-[14px] text-white/60 sm:text-[15px]">
            We map your current workflow and tell you exactly where AI can take over — in 48 hours, free.
          </p>
          <button
            onClick={() => onViewChange('contact')}
            className="relative mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e3146f] via-[#bf1cc9] to-[#8b3ae6] px-7 text-[14px] font-bold text-white shadow-[0_10px_40px_-12px_rgba(255,47,134,0.55)] transition-all hover:scale-[1.02] sm:h-14 sm:px-9 sm:text-[15px]"
          >
            Get my automation map
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
