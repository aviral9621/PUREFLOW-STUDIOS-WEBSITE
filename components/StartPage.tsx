import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Loader2, MapPin, MessageCircle, Phone, Search, Brain, Globe2, Smartphone, Megaphone, Bot, HelpCircle, Share2, X,
} from 'lucide-react';
import { ViewState } from '../types';
import { supabase } from '../lib/supabase';
import { BUSINESS_TYPES, type BusinessOption } from '../lib/start/businessTypes';
import { INDIA_PLACES } from '../lib/start/indiaPlaces';
import { GENERAL_MODULES, MODULES_BY_GROUP } from '../lib/start/modules';

/** The WhatsApp number the AI assistant answers on — where the visitor lands after the form. */
const WHATSAPP = '919278240650';
const OFFICE_PHONE = '+916393640650';

interface StartPageProps { onViewChange: (view: ViewState) => void }

const SERVICES = [
  { value: 'Custom software / CRM', label: 'Custom software or CRM', sub: 'Billing, inventory, dashboards, internal tools', icon: Brain },
  { value: 'Website', label: 'A website', sub: 'Business site, landing page, online booking', icon: Globe2 },
  { value: 'Mobile app', label: 'A mobile app', sub: 'For customers, staff or dealers', icon: Smartphone },
  { value: 'WhatsApp & AI automation', label: 'WhatsApp & AI automation', sub: 'Auto-replies, follow-ups, reminders', icon: Bot },
  { value: 'Social media', label: 'Social media', sub: 'Content, reels, brand', icon: Share2 },
  { value: 'Meta / Google ads', label: 'Meta or Google ads', sub: 'Leads from ads, managed for you', icon: Megaphone },
  { value: 'Not sure yet', label: 'Not sure yet', sub: 'Help me figure it out', icon: HelpCircle },
];
const BUDGETS = ['Under ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1 lakh', '₹1 – 3 lakh', 'Above ₹3 lakh', 'Not sure — quote me'];
const TOTAL = 8;

interface Form {
  location: string; name: string; businessType: string; businessGroup: string;
  services: string[]; usesSoftware: boolean | null; softwareName: string; hasWebsite: boolean | null; websiteUrl: string;
  modules: string[]; requirement: string; budget: string; phone: string; email: string;
}
const EMPTY: Form = {
  location: '', name: '', businessType: '', businessGroup: '', services: [], usesSoftware: null, softwareName: '',
  hasWebsite: null, websiteUrl: '', modules: [], requirement: '', budget: '', phone: '', email: '',
};

/** PF-XXXXX from letters and digits that are hard to misread. Goes into the row and the WhatsApp message. */
const makeRef = () => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return 'PF-' + Array.from(bytes, (b) => abc[b % abc.length]).join('');
};

/** Where the visitor came from: ?c= names the campaign (its name as a slug, e.g. custom-software); utm_* travel along. */
function readAttribution() {
  const q = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) { const v = q.get(k); if (v) utm[k] = v; }
  const campaign = q.get('c') || q.get('campaign') || utm.utm_campaign || null;
  return { campaign, utm, referrer: document.referrer || null, page: window.location.pathname + window.location.search };
}

/**
 * The ads landing page: eight short questions, one per screen, ending in a
 * WhatsApp hand-off to the assistant. The answers become a lead the moment
 * they are saved (a database trigger), carrying the campaign from the URL.
 */
export const StartPage: React.FC<StartPageProps> = ({ onViewChange }) => {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ ref: string } | null>(null);
  const attribution = useRef(readAttribution());
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  // Functional, so two quick taps never overwrite each other with a stale list.
  const toggle = (k: 'services' | 'modules', item: string) => setForm((f) => ({ ...f, [k]: f[k].includes(item) ? f[k].filter((x) => x !== item) : [...f[k], item] }));

  useEffect(() => { window.scrollTo({ top: 0 }); }, [step]);

  const valid = (): boolean => {
    switch (step) {
      case 0: return form.location.trim().length > 1;
      case 1: return form.name.trim().length > 1 && form.businessType.trim().length > 1;
      case 2: return form.services.length > 0;
      case 3: return form.usesSoftware !== null;
      case 4: return form.hasWebsite !== null;
      case 5: return form.modules.length > 0 || form.requirement.trim().length > 3;
      case 6: return !!form.budget;
      case 7: return form.phone.replace(/\D/g, '').length >= 10;
      default: return false;
    }
  };
  const next = () => { if (step < TOTAL - 1) { setDir(1); setStep((s) => s + 1); } };
  const prev = () => { if (step > 0) { setDir(-1); setStep((s) => s - 1); } };
  const autoNext = () => setTimeout(next, 260);

  const submit = async () => {
    if (!valid() || submitting) return;
    setSubmitting(true); setError(null);
    const ref = makeRef();
    const a = attribution.current;
    try {
      const { error: dbError } = await supabase.from('website_ad_leads').insert({
        ref_code: ref, name: form.name.trim(), phone: form.phone.replace(/[^\d+]/g, ''), email: form.email.trim() || null,
        location: form.location.trim() || null, business_type: form.businessType.trim() || null, business_group: form.businessGroup || null,
        services: form.services, uses_software: form.usesSoftware, software_name: form.softwareName.trim() || null,
        has_website: form.hasWebsite, website_url: form.websiteUrl.trim() || null,
        modules: form.modules, requirement: form.requirement.trim() || null, budget: form.budget || null,
        campaign_key: a.campaign, utm: a.utm, referrer: a.referrer, page: a.page, user_agent: navigator.userAgent.slice(0, 300),
      });
      if (dbError) throw dbError;
      setDone({ ref });
    } catch (e) {
      console.error('[start] submit', e);
      setError('Something went wrong. Please try again, or message us on WhatsApp.');
    } finally { setSubmitting(false); }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || submitting || e.key !== 'Enter' || e.target instanceof HTMLTextAreaElement) return;
      if ((e.target as HTMLElement)?.dataset?.combobox) return;
      if (valid()) { if (step === TOTAL - 1) void submit(); else next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (done) return <DoneScreen refCode={done.ref} name={form.name} onViewChange={onViewChange} />;

  const moduleChoices = [...new Set([...(MODULES_BY_GROUP[form.businessGroup] ?? []), ...GENERAL_MODULES])].slice(0, 12);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px]" style={{ background: 'radial-gradient(closest-side, rgba(255,47,134,0.16), transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px]" style={{ background: 'radial-gradient(closest-side, rgba(164,82,255,0.18), transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-5 pb-8 pt-20 sm:px-6 sm:pt-24">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <button onClick={() => (step === 0 ? onViewChange('home') : prev())} className="group inline-flex items-center gap-1.5 text-[12px] text-white/55 transition-colors hover:text-white sm:text-[13px]">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />{step === 0 ? 'Home' : 'Back'}
          </button>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:text-[11px]">
            {String(step + 1).padStart(2, '0')} <span className="text-white/25">/ {String(TOTAL).padStart(2, '0')}</span>
          </div>
          <span className="text-[12px] text-white/45 sm:text-[13px]">Takes about a minute</span>
        </div>
        <div className="mb-9 h-[3px] w-full overflow-hidden rounded-full bg-white/10 sm:mb-12">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ff2f86] via-[#d946ef] to-[#a855f7]" initial={false} animate={{ width: `${((step + 1) / TOTAL) * 100}%` }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
        </div>

        <div className="relative flex-1">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} initial={reduced ? false : { opacity: 0, x: dir * 30 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -dir * 30 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col">
              {step === 0 && (
                <Screen eyebrow="Location" title="Where is your business?" hint="City or town — so the right person on our team calls you.">
                  <Combobox
                    value={form.location} onChange={(v) => { set('location', v); if (v) autoNext(); }}
                    options={INDIA_PLACES.map((p) => ({ value: p.value, label: p.label, hint: p.hint, keywords: p.keywords }))}
                    placeholder="Type your city — Lucknow, Indore, Delhi…" icon={MapPin} customLabel="Use"
                  />
                </Screen>
              )}

              {step === 1 && (
                <Screen eyebrow="About you" title="Your name, and what you do" hint="Pick the closest business type, or type your own.">
                  <div className="space-y-3">
                    <Field label="Your name" value={form.name} onChange={(v) => set('name', v)} autoFocus required />
                    <Combobox
                      value={form.businessType}
                      onChange={(v, opt) => { set('businessType', v); set('businessGroup', (opt as BusinessOption | undefined)?.group ?? ''); }}
                      options={BUSINESS_TYPES.map((b) => ({ value: b.value, label: b.value, hint: b.group, keywords: b.keywords, group: b.group }))}
                      placeholder="Business type — travel agency, clinic, distributor…" icon={Search} customLabel="My business is"
                    />
                  </div>
                </Screen>
              )}

              {step === 2 && (
                <Screen eyebrow="Service" title="What do you need?" hint="Tick everything that applies.">
                  <MultiGrid choices={SERVICES} value={form.services} onToggle={(v) => toggle('services', v)} />
                </Screen>
              )}

              {step === 3 && (
                <Screen eyebrow="Today" title="Are you using any software right now?" hint="Tally, Vyapar, Excel, a custom system — anything counts.">
                  <YesNo value={form.usesSoftware} onChange={(v) => { set('usesSoftware', v); if (!v) autoNext(); }} yes="Yes, we use something" no="No, nothing yet" />
                  {form.usesSoftware && <div className="mt-3"><Field label="Which software?" value={form.softwareName} onChange={(v) => set('softwareName', v)} autoFocus /></div>}
                </Screen>
              )}

              {step === 4 && (
                <Screen eyebrow="Online" title="Do you have a website?" hint="If yes, paste the link — we will take a look before we call.">
                  <YesNo value={form.hasWebsite} onChange={(v) => { set('hasWebsite', v); if (!v) autoNext(); }} yes="Yes" no="Not yet" />
                  {form.hasWebsite && <div className="mt-3"><Field label="Website link" value={form.websiteUrl} onChange={(v) => set('websiteUrl', v)} autoFocus inputMode="url" /></div>}
                </Screen>
              )}

              {step === 5 && (
                <Screen eyebrow="The system" title="What should it do for you?" hint={form.businessGroup ? `Common needs for ${form.businessGroup.toLowerCase()} — tick what fits, add anything else below.` : 'Tick what fits, add anything else below.'}>
                  <ChipCloud choices={moduleChoices} value={form.modules} onToggle={(v) => toggle('modules', v)} />
                  <textarea rows={3} value={form.requirement} onChange={(e) => set('requirement', e.target.value)} placeholder="Anything else, in your own words…" className="mt-4 w-full rounded-2xl border border-white/12 bg-black/40 p-4 text-[15px] leading-[1.6] text-white placeholder-white/30 focus:border-[#ff3f8d]/60 focus:outline-none focus:ring-2 focus:ring-[#ff3f8d]/20" />
                </Screen>
              )}

              {step === 6 && (
                <Screen eyebrow="Budget" title="Roughly what budget do you have in mind?" hint="It helps us suggest the right scope. No commitment.">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {BUDGETS.map((b) => <Pill key={b} label={b} selected={form.budget === b} onClick={() => { set('budget', b); autoNext(); }} />)}
                  </div>
                </Screen>
              )}

              {step === 7 && (
                <Screen eyebrow="Last step" title="Where should we call you?" hint="Your WhatsApp number — our team calls within 24 hours, and the AI assistant can start right away.">
                  <div className="space-y-3">
                    <Field label="WhatsApp number" value={form.phone} onChange={(v) => set('phone', v)} autoFocus required inputMode="tel" hint="10 digits, or with the country code." />
                    <Field label="Email (optional)" value={form.email} onChange={(v) => set('email', v)} inputMode="email" />
                  </div>
                  {error && <p className="mt-3 text-[13px] text-[#ff6b9d]">{error}</p>}
                  <p className="mt-4 text-[12px] text-white/40">By continuing you agree to be contacted by PureFlow Studios about your enquiry.</p>
                </Screen>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button onClick={prev} disabled={step === 0} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[13px] font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white disabled:opacity-0">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < TOTAL - 1 ? (
            <button onClick={next} disabled={!valid()} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[13.5px] font-bold text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30">
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => void submit()} disabled={!valid() || submitting} className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2f86] to-[#a855f7] px-6 text-[13.5px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(255,47,134,0.6)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" strokeWidth={3} />} Send to the team
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

/* ── pieces ─────────────────────────────────────────────────────────── */

const Screen: React.FC<{ eyebrow: string; title: string; hint?: string; children: React.ReactNode }> = ({ eyebrow, title, hint, children }) => (
  <>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff3f8d]">{eyebrow}</span>
    <h1 className="mt-2 font-sans text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[34px]">{title}</h1>
    {hint && <p className="mt-2 text-[13.5px] text-white/50 sm:text-[14px]">{hint}</p>}
    <div className="mt-7 sm:mt-9">{children}</div>
  </>
);

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; required?: boolean; autoFocus?: boolean; hint?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }> =
  ({ label, value, onChange, required, autoFocus, hint, inputMode }) => (
    <label className="relative block">
      <input type="text" inputMode={inputMode} value={value} autoFocus={autoFocus} onChange={(e) => onChange(e.target.value)} placeholder={label}
        className="peer w-full rounded-xl border border-white/12 bg-black/40 px-4 pb-2.5 pt-5 text-[15px] text-white placeholder-transparent transition-colors focus:border-[#ff3f8d]/60 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#ff3f8d]/20" />
      <span className="pointer-events-none absolute left-4 top-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">{label}{required && <span className="ml-0.5 text-[#ff3f8d]">*</span>}</span>
      {hint && <span className="mt-1.5 block text-[11px] text-white/40">{hint}</span>}
    </label>
  );

interface Opt { value: string; label: string; hint?: string; keywords?: string; group?: string }
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Type to search a long list; whatever is not on it can be used as typed. */
const Combobox: React.FC<{ value: string; onChange: (v: string, opt?: Opt) => void; options: Opt[]; placeholder: string; icon: React.ElementType; customLabel: string }> =
  ({ value, onChange, options, placeholder, icon: Icon, customLabel }) => {
    const [term, setTerm] = useState('');
    const [at, setAt] = useState(0);
    const indexed = useMemo(() => options.map((o) => ({ o, head: norm(o.label), hay: norm(`${o.label} ${o.hint ?? ''} ${o.keywords ?? ''}`) })), [options]);
    const found = useMemo(() => {
      const s = norm(term); if (!s) return [];
      const words = s.split(' ');
      return indexed.filter((x) => words.every((w) => x.hay.includes(w)))
        .map((x) => ({ o: x.o, rank: x.head === s ? 0 : x.head.startsWith(s) ? 1 : x.hay.split(' ').includes(s) ? 2 : x.head.includes(s) ? 3 : 4 }))
        .sort((a, b) => a.rank - b.rank).slice(0, 7).map((x) => x.o);
    }, [indexed, term]);
    const typed = term.trim();
    const custom = typed.length > 1 && !found.some((o) => norm(o.label) === norm(typed));
    const rows = found.length + (custom ? 1 : 0);
    useEffect(() => setAt(0), [term]);
    const choose = (v: string, o?: Opt) => { onChange(v, o); setTerm(''); };

    if (value) {
      return (
        <div className="flex items-center gap-3 rounded-2xl border border-[#ff3f8d]/60 bg-gradient-to-br from-[#ff3f8d]/15 to-[#a855f7]/10 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ff3f8d]/70 bg-black text-white"><Icon className="h-4 w-4" strokeWidth={1.9} /></div>
          <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white">{value}</p>
          <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1 text-[12px] text-white/60 hover:text-white"><X className="h-3.5 w-3.5" /> Change</button>
        </div>
      );
    }
    return (
      <div>
        <div className="relative">
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={term} onChange={(e) => setTerm(e.target.value)} placeholder={placeholder} autoFocus autoComplete="off" data-combobox="1"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setAt((i) => Math.min(rows - 1, i + 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setAt((i) => Math.max(0, i - 1)); }
              else if (e.key === 'Enter' && rows) { e.preventDefault(); if (at < found.length) choose(found[at].value, found[at]); else choose(typed); }
            }}
            className="w-full rounded-2xl border border-white/12 bg-black/40 py-4 pl-11 pr-4 text-[15px] text-white placeholder-white/30 focus:border-[#ff3f8d]/60 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#ff3f8d]/20"
          />
        </div>
        {rows > 0 && (
          <ul className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur" role="listbox">
            {found.map((o, i) => (
              <li key={o.value}>
                <button type="button" onMouseMove={() => setAt(i)} onClick={() => choose(o.value, o)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${i === at ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  <span className="min-w-0 flex-1 truncate text-[14.5px] text-white">{o.label}</span>
                  {o.hint && <span className="shrink-0 text-[12px] text-white/40">{o.hint}</span>}
                </button>
              </li>
            ))}
            {custom && (
              <li><button type="button" onMouseMove={() => setAt(found.length)} onClick={() => choose(typed)} className={`flex w-full items-center gap-2 px-4 py-3 text-left text-[14.5px] text-[#ff6b9d] ${at === found.length ? 'bg-white/10' : 'hover:bg-white/5'}`}>{customLabel} “{typed}”</button></li>
            )}
          </ul>
        )}
        {!typed && <p className="mt-2 text-[12px] text-white/35">Start typing to search{options.length > 200 ? ` ${options.length.toLocaleString()} places` : ''}.</p>}
      </div>
    );
  };

const MultiGrid: React.FC<{ choices: { value: string; label: string; sub?: string; icon?: React.ElementType }[]; value: string[]; onToggle: (v: string) => void }> = ({ choices, value, onToggle }) => (
  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
    {choices.map((c) => {
      const on = value.includes(c.value); const Icon = c.icon;
      return (
        <button key={c.value} type="button" onClick={() => onToggle(c.value)}
          className={`group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${on ? 'border-[#ff3f8d]/70 bg-gradient-to-br from-[#ff3f8d]/15 to-[#a855f7]/10 shadow-[0_0_30px_-12px_rgba(255,47,134,0.6)]' : 'border-white/12 bg-white/[0.025] hover:border-white/30 hover:bg-white/[0.05]'}`}>
          {Icon && <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-black ${on ? 'border-[#ff3f8d]/70' : 'border-white/85'} text-white`}><Icon className="h-4 w-4" strokeWidth={1.9} /></div>}
          <div className="min-w-0 flex-1"><p className="text-[14.5px] font-semibold leading-tight text-white">{c.label}</p>{c.sub && <p className="mt-0.5 text-[12.5px] text-white/50">{c.sub}</p>}</div>
          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${on ? 'border-[#ff3f8d] bg-[#ff3f8d] text-white' : 'border-white/25'}`}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</div>
        </button>
      );
    })}
  </div>
);

const Pill: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <button type="button" onClick={onClick} className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-[14.5px] font-semibold transition-all ${selected ? 'border-[#ff3f8d]/70 bg-gradient-to-br from-[#ff3f8d]/15 to-[#a855f7]/10 text-white' : 'border-white/12 bg-white/[0.025] text-white/85 hover:border-white/30 hover:bg-white/[0.05]'}`}>
    {label}<span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-[#ff3f8d] bg-[#ff3f8d]' : 'border-white/25'}`}>{selected && <Check className="h-3 w-3" strokeWidth={3} />}</span>
  </button>
);

const YesNo: React.FC<{ value: boolean | null; onChange: (v: boolean) => void; yes: string; no: string }> = ({ value, onChange, yes, no }) => (
  <div className="grid grid-cols-2 gap-2.5">
    <Pill label={yes} selected={value === true} onClick={() => onChange(true)} />
    <Pill label={no} selected={value === false} onClick={() => onChange(false)} />
  </div>
);

const ChipCloud: React.FC<{ choices: string[]; value: string[]; onToggle: (v: string) => void }> = ({ choices, value, onToggle }) => (
  <div className="flex flex-wrap gap-2">
    {choices.map((c) => {
      const on = value.includes(c);
      return (
        <button key={c} type="button" onClick={() => onToggle(c)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition-all ${on ? 'border-[#ff3f8d] bg-[#ff3f8d]/15 text-white' : 'border-white/15 bg-white/[0.03] text-white/75 hover:border-white/35 hover:text-white'}`}>
          {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}{c}
        </button>
      );
    })}
  </div>
);

const DoneScreen: React.FC<{ refCode: string; name: string; onViewChange: (v: ViewState) => void }> = ({ refCode, name, onViewChange }) => {
  const first = name.trim().split(/\s+/)[0] || '';
  const text = encodeURIComponent(`Hi PureFlow Studios, I just filled the form on your website (ref ${refCode}). Please continue here on WhatsApp.`);
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/3 mx-auto h-[500px] w-[500px]" style={{ background: 'radial-gradient(closest-side, rgba(255,47,134,0.25), transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff3f8d]/40 bg-gradient-to-br from-[#ff3f8d]/20 to-[#a855f7]/10 shadow-[0_10px_40px_-10px_rgba(255,47,134,0.55)] sm:h-20 sm:w-20">
          <Check className="h-7 w-7 text-white sm:h-9 sm:w-9" strokeWidth={2.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }} className="flex flex-col items-center">
          <span className="font-serif italic text-white/95 text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.1]">Sent{first ? `, ${first}` : ''}.</span>
          <span className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.2rem,5vw,4.5rem)]" data-text="WE'LL CALL YOU.">WE'LL CALL YOU.</span>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="mt-5 max-w-md text-[14.5px] text-white/65 sm:text-[15px]">
          Your details are with our team — expect a call within 24 hours. Want answers now? Our AI assistant is on WhatsApp and replies instantly; the team joins the same chat.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.45 }} className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <a href={`https://wa.me/${WHATSAPP}?text=${text}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[14px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.99]">
            <MessageCircle className="h-4 w-4" /> Chat with our AI on WhatsApp
          </a>
          <div className="flex gap-3">
            <a href={`tel:${OFFICE_PHONE}`} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 text-[14px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"><Phone className="h-4 w-4" /> Call us</a>
            <button onClick={() => onViewChange('home')} className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-5 text-[14px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10">Back to home</button>
          </div>
          <p className="text-[11px] text-white/35">Your reference: <span className="font-mono text-white/60">{refCode}</span></p>
        </motion.div>
      </div>
    </main>
  );
};
