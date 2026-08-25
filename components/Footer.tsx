import React from 'react';
import { motion } from 'framer-motion';
import {
  Instagram,
  Linkedin,
  Github,
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Coffee,
  CalendarClock,
} from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onViewChange?: (view: ViewState) => void;
}

const PHONE_DISPLAY = '+91 63936 40650';
const PHONE_RAW = '+916393640650';
const WHATSAPP_URL = 'https://wa.me/916393640650';
const EMAIL = 'support@pureflowdesigns.com';

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  const handleNav = (view: ViewState) => {
    if (onViewChange) {
      onViewChange(view);
      window.scrollTo(0, 0);
    }
  };

  const services = [
    { label: 'Custom Software', action: () => handleNav('service-software') },
    { label: 'CRMs & Dashboards', action: () => handleNav('get-software-built') },
    { label: 'AI Agents', action: () => handleNav('automation-video') },
    { label: 'Websites', action: () => handleNav('service-website') },
    { label: 'Mobile Apps', action: () => handleNav('service-mobile') },
    { label: 'Brand & Content', action: () => handleNav('service-social') },
  ];

  const studio = [
    { label: 'Work', action: () => handleNav('home') },
    { label: 'Process', action: () => handleNav('home') },
    { label: 'Contact', action: () => handleNav('contact') },
  ];

  const socials = [
    { icon: Instagram, href: 'https://instagram.com/pureflowstudios', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/pureflow-studios', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/pureflow-studios', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/pureflowstudios', label: 'X / Twitter' },
  ];

  const legal: { label: string; view: ViewState }[] = [
    { label: 'Privacy', view: 'privacy' },
    { label: 'Terms', view: 'terms' },
    { label: 'Cookies', view: 'cookies' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[var(--color-bg-elevated)] border-t border-white/5">

      {/* ── Torch / 3D glow from bottom-left + bottom-right ─────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute bottom-[-12%] left-[-10%] h-[640px] w-[640px]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,32,160,0.34) 0%, rgba(255,32,160,0.18) 25%, rgba(255,32,160,0.06) 55%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-[-12%] right-[-10%] h-[640px] w-[640px]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(164,82,255,0.34) 0%, rgba(164,82,255,0.18) 25%, rgba(164,82,255,0.06) 55%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[80%]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.05) 0%, transparent 55%)',
          }}
        />
      </div>

      {/* ── Full-width gradient wordmark — lit from below ───────────────── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 pt-20 pb-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="w-full text-center"
        >
          <p className="footer-wordmark font-display leading-[0.85] tracking-[-0.02em] uppercase whitespace-nowrap select-none">
            PURE<span className="gradient-flow-text">FLOW</span> STUDIOS
          </p>
        </motion.div>
      </div>

      {/* ── Cards grid ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-12 pb-12 md:pt-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

          {/* ── Card 1 — Socials / Brand intro ── */}
          <div className="footer-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 sm:p-6">
            <div className="footer-card__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Follow along
            </p>
            <p className="mt-2 font-display text-[15px] leading-snug text-white/85 sm:text-base">
              Behind-the-scenes, shipping moments, and the occasional rant.
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social group/social flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff3f8d]/60 hover:bg-[#0f0a18] hover:text-white"
                >
                  <Icon className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110" strokeWidth={1.7} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Card 2 — Services ── */}
          <div className="footer-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 sm:p-6">
            <div className="footer-card__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Services
            </p>
            <ul className="mt-4 space-y-2.5">
              {services.map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="group/link flex w-full items-center justify-between text-left text-[13.5px] text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/link:opacity-60 group-hover/link:translate-x-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card 3 — Studio ── */}
          <div className="footer-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 sm:p-6">
            <div className="footer-card__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Studio
            </p>
            <ul className="mt-4 space-y-2.5">
              {studio.map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="group/link flex w-full items-center justify-between text-left text-[13.5px] text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/link:opacity-60 group-hover/link:translate-x-0" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleNav('book-call' as ViewState)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ff3f8d]/40 bg-[#ff3f8d]/10 px-3.5 py-2 text-[12px] font-semibold text-white transition-all duration-300 hover:border-[#ff3f8d]/70 hover:bg-[#ff3f8d]/15"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              Schedule a call
            </button>
          </div>

          {/* ── Card 4 — Contact ── */}
          <div className="footer-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 sm:p-6">
            <div className="footer-card__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Contact
            </p>

            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group/c flex items-start gap-2.5 text-[12.5px] text-white/75 transition-colors duration-200 hover:text-white"
                >
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40 transition-colors group-hover/c:border-[#ff3f8d]/60 group-hover/c:bg-[#ff3f8d]/10">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span className="break-all leading-snug pt-1">{EMAIL}</span>
                </a>
              </li>

              <li>
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="group/c flex items-center gap-2.5 text-[13px] text-white/75 transition-colors duration-200 hover:text-white"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40 transition-colors group-hover/c:border-[#ff3f8d]/60 group-hover/c:bg-[#ff3f8d]/10">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  {PHONE_DISPLAY}
                </a>
              </li>

              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/c flex items-center gap-2.5 text-[13px] text-white/75 transition-colors duration-200 hover:text-white"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40 transition-colors group-hover/c:border-[#25D366]/60 group-hover/c:bg-[#25D366]/10">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </span>
                  WhatsApp
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-[13px] text-white/65">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                Lucknow, Uttar Pradesh
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6 border-t border-white/8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-white/45 text-center sm:text-left">
            © 2026 Pureflow Studios. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-5 sm:justify-end sm:gap-6">
            {legal.map(({ label, view }) => (
              <button
                key={label}
                onClick={() => handleNav(view)}
                className="text-[11.5px] text-white/50 hover:text-white transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chai signature ──────────────────────────────────────────────── */}
      <div className="relative z-10 pb-7 px-5">
        <p className="mx-auto flex max-w-md items-center justify-center gap-2 text-center text-[12.5px] font-semibold tracking-tight text-white/85 sm:text-[13px]">
          <Coffee className="w-4 h-4 flex-shrink-0 text-[#ff3f8d]" strokeWidth={2} aria-hidden="true" />
          <span>Designed &amp; built in Lucknow with too much chai.</span>
        </p>
      </div>

    </footer>
  );
};
