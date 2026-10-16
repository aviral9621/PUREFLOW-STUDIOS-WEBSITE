import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MessageCircle,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { ViewState } from '../types';
import {
  ChipGrid,
  Choice,
  QuestionScreen,
  StepAmbient,
  StepShell,
  TextField,
} from './shared/StepFormParts';
import { supabase } from '../lib/supabase';

// ─── Config ──────────────────────────────────────────────────────────────────

interface BookCallPageProps {
  onViewChange: (view: ViewState) => void;
}

const TOTAL_STEPS = 4;

const MEETING_TYPES: Choice[] = [
  { value: 'intro_15', label: '15-min intro chat', sub: 'Quick fit-check. Zero pressure.', icon: Sparkles },
  { value: 'discovery_30', label: '30-min discovery call', sub: 'Real project? Let’s scope it.', icon: Target },
];

// Mon-Sat 11:00 - 19:00, 30-min slots (IST). Adjust freely.
const BUSINESS_DAYS = [1, 2, 3, 4, 5, 6]; // Mon=1 ... Sat=6 (Sun=0 excluded)
const SLOT_START_HOUR = 11;
const SLOT_END_HOUR = 19;
const SLOT_INTERVAL_MIN = 30;
const BOOKING_HORIZON_DAYS = 21;

// Booked slots + blocked dates come from Supabase RPCs in the page component
// (get_booked_slots / get_blocked_dates). The helpers below accept them as
// parameters so the same logic works whether the lookup tables are empty or
// hydrated from the server.

const SLOTS_PER_DAY = ((SLOT_END_HOUR - SLOT_START_HOUR) * 60) / SLOT_INTERVAL_MIN;

// ─── Utilities ───────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0');

const formatDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

const isBusinessDay = (d: Date) => BUSINESS_DAYS.includes(d.getDay());

const isWithinHorizon = (d: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = addDays(today, BOOKING_HORIZON_DAYS);
  return d >= today && d <= end;
};

const generateSlotsForDay = (
  date: Date,
  bookedSlots: Set<string>
): { iso: string; label: string; booked: boolean }[] => {
  const slots: { iso: string; label: string; booked: boolean }[] = [];
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL_MIN) {
      const slot = new Date(date);
      slot.setHours(h, m, 0, 0);
      const iso = slot.toISOString();
      const label = slot.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      slots.push({ iso, label, booked: bookedSlots.has(iso) });
    }
  }
  return slots;
};

// A day is "fully booked" only when every slot in it is taken.
const countBookedSlotsForDay = (date: Date, bookedSlots: Set<string>) => {
  let booked = 0;
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL_MIN) {
      const slot = new Date(date);
      slot.setHours(h, m, 0, 0);
      if (bookedSlots.has(slot.toISOString())) booked++;
    }
  }
  return booked;
};

const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Asia/Kolkata';
  }
};

// ─── ICS file generation (no server needed) ──────────────────────────────────

const buildIcs = (opts: {
  uid: string;
  title: string;
  description: string;
  startUtc: Date;
  durationMin: number;
  location: string;
}) => {
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end = new Date(opts.startUtc.getTime() + opts.durationMin * 60_000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pureflow Studios//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(opts.startUtc)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${opts.title}`,
    `DESCRIPTION:${opts.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${opts.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

const downloadIcs = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const googleCalLink = (title: string, description: string, startUtc: Date, durationMin: number) => {
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end = new Date(startUtc.getTime() + durationMin * 60_000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    dates: `${fmt(startUtc)}/${fmt(end)}`,
    location: 'Google Meet — link in calendar invite',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// ─── State ───────────────────────────────────────────────────────────────────

interface BookingForm {
  meetingType: string;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: string; // ISO string
  name: string;
  email: string;
  whatsapp: string;
  notes: string;
}

const EMPTY: BookingForm = {
  meetingType: '',
  selectedDate: '',
  selectedSlot: '',
  name: '',
  email: '',
  whatsapp: '',
  notes: '',
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const BookCallPage: React.FC<BookCallPageProps> = ({ onViewChange }) => {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<BookingForm>(EMPTY);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const timezone = useMemo(detectTimezone, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hydrate booked slots + blocked dates from Supabase for the booking horizon.
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const horizonEnd = addDays(today, BOOKING_HORIZON_DAYS + 1);

    (async () => {
      try {
        const [{ data: slots }, { data: blocked }] = await Promise.all([
          supabase.rpc('get_booked_slots', {
            from_ts: today.toISOString(),
            to_ts: horizonEnd.toISOString(),
          }),
          supabase.rpc('get_blocked_dates', {
            from_d: formatDateKey(today),
            to_d: formatDateKey(horizonEnd),
          }),
        ]);

        if (slots) {
          setBookedSlots(
            new Set((slots as { scheduled_at: string }[]).map((r) => new Date(r.scheduled_at).toISOString()))
          );
        }
        if (blocked) {
          setBlockedDates(new Set((blocked as { blocked_date: string }[]).map((r) => r.blocked_date)));
        }
      } catch (err) {
        // Non-fatal: page still works, just without live availability.
        console.warn('[BookCall] availability fetch failed', err);
      }
    })();
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    // Scroll the form back to the top so the new step's content is visible.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const meetingTypeData = MEETING_TYPES.find((t) => t.value === form.meetingType);
  const durationMin = form.meetingType === 'discovery_30' ? 30 : 15;
  const selectedSlotDate = form.selectedSlot ? new Date(form.selectedSlot) : null;

  const isStepValid = (): boolean => {
    switch (step) {
      case 0: return !!form.meetingType;
      case 1: return !!form.selectedDate;
      case 2: return !!form.selectedSlot;
      case 3: return form.name.trim().length >= 1 && /^\S+@\S+\.\S+$/.test(form.email);
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const slotDate = new Date(form.selectedSlot);
      const ics_uid = `${slotDate.getTime()}-${form.name.replace(/\s+/g, '-').toLowerCase() || 'guest'}@pureflowstudios`;

      const { error: dbError } = await supabase.from('website_bookings').insert({
        meeting_type: form.meetingType,
        scheduled_at: slotDate.toISOString(),
        duration_min: durationMin,
        timezone,
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp || null,
        notes: form.notes || null,
        ics_uid,
      });

      if (dbError) {
        // UNIQUE constraint on scheduled_at: slot was just taken by someone else.
        if (dbError.code === '23505') {
          setBookedSlots((prev) => new Set(prev).add(slotDate.toISOString()));
          setError('That slot was just taken. Pick another — it’s been marked unavailable.');
          // Bounce them back to the slot picker so they can choose again.
          setForm({ ...form, selectedSlot: '' });
          setStep(2);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        throw dbError;
      }
      setDone(true);
    } catch (err) {
      console.error('[BookCall] submit error', err);
      setError('Something glitched. Try again or ping us on WhatsApp.');
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

  if (done && selectedSlotDate) {
    return (
      <BookedScreen
        slot={selectedSlotDate}
        durationMin={durationMin}
        meetingLabel={meetingTypeData?.label ?? 'Call'}
        name={form.name}
        notes={form.notes}
        timezone={timezone}
        onViewChange={onViewChange}
      />
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <StepAmbient />

      <StepShell
        step={step}
        total={TOTAL_STEPS}
        onBack={() => (step === 0 ? onViewChange('home') : goPrev())}
        onClose={() => onViewChange('home')}
        footer={
          <>
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
                  Booking…
                </>
              ) : step === TOTAL_STEPS - 1 ? (
                <>
                  Confirm booking
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </>
        }
      >
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
                eyebrow="Meeting type"
                title="How long do you need?"
                hint="Both are free. Cameras optional."
              >
                <ChipGrid
                  choices={MEETING_TYPES}
                  value={form.meetingType}
                  onChange={(v) => { setForm({ ...form, meetingType: v }); setTimeout(goNext, 220); }}
                />
              </QuestionScreen>
            )}

            {step === 1 && (
              <QuestionScreen
                eyebrow="Date"
                title="Pick a day."
                hint={`Times shown in ${timezone.replace('_', ' ')}.`}
              >
                <CalendarPicker
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  selectedKey={form.selectedDate}
                  bookedSlots={bookedSlots}
                  blockedDates={blockedDates}
                  onSelect={(d) => {
                    setForm({ ...form, selectedDate: formatDateKey(d), selectedSlot: '' });
                    setTimeout(goNext, 220);
                  }}
                />
              </QuestionScreen>
            )}

            {step === 2 && form.selectedDate && (
              <QuestionScreen
                eyebrow="Time"
                title="Pick a slot."
                hint={(() => {
                  const d = new Date(form.selectedDate);
                  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
                })()}
              >
                <SlotPicker
                  date={new Date(form.selectedDate)}
                  selectedSlot={form.selectedSlot}
                  bookedSlots={bookedSlots}
                  onSelect={(iso) => {
                    setForm({ ...form, selectedSlot: iso });
                    setTimeout(goNext, 220);
                  }}
                />
              </QuestionScreen>
            )}

            {step === 3 && (
              <QuestionScreen
                eyebrow="Your details"
                title="Last step."
                hint="We'll send the calendar invite to your email."
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
                    label="Email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    hint="For the calendar invite"
                  />
                  <TextField
                    label="WhatsApp (optional)"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(v) => setForm({ ...form, whatsapp: v })}
                    hint="For a reminder an hour before"
                  />
                  <TextField
                    label="Anything we should know? (optional)"
                    multiline
                    value={form.notes}
                    onChange={(v) => setForm({ ...form, notes: v })}
                  />
                </div>

                {/* Confirmation summary card */}
                {selectedSlotDate && meetingTypeData && (
                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#ff3f8d]/25 bg-[#ff3f8d]/[0.06] p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#ff3f8d]/50 bg-black text-[#ff7eb2]">
                      <CalendarIcon className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0 flex-1 text-[13px] sm:text-[13.5px]">
                      <p className="font-semibold text-white">{meetingTypeData.label}</p>
                      <p className="text-white/65">
                        {selectedSlotDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })} ·{' '}
                        {selectedSlotDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  </div>
                )}

                {error && <p className="mt-3 text-[12.5px] text-rose-400">{error}</p>}
              </QuestionScreen>
            )}
          </motion.div>
        </AnimatePresence>
      </StepShell>
    </div>
  );
};

// ─── Calendar picker ─────────────────────────────────────────────────────────

const CalendarPicker: React.FC<{
  month: Date;
  onMonthChange: (d: Date) => void;
  selectedKey: string;
  bookedSlots: Set<string>;
  blockedDates: Set<string>;
  onSelect: (d: Date) => void;
}> = ({ month, onMonthChange, selectedKey, bookedSlots, blockedDates, onSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = startOfMonth(month);
  const totalDays = daysInMonth(month);
  const startDay = firstDay.getDay(); // 0..6
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));

  const monthLabel = month.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const minMonth = startOfMonth(today);
  const maxDate = addDays(today, BOOKING_HORIZON_DAYS);
  const maxMonth = startOfMonth(maxDate);

  return (
    <div className="rounded-xl border border-white/12 bg-white/[0.025] p-3 sm:rounded-2xl sm:p-3.5">
      {/* Month nav — compact */}
      <div className="mb-2.5 flex items-center justify-between sm:mb-3">
        <button
          type="button"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          disabled={month.getTime() <= minMonth.getTime()}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/40 text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <p className="font-sans text-[14px] font-semibold text-white">{monthLabel}</p>
        <button
          type="button"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          disabled={month.getTime() >= maxMonth.getTime()}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/40 text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="mb-1.5 grid grid-cols-7 gap-[3px] text-center text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/35 sm:gap-1 sm:text-[10px]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`}>{d}</div>
        ))}
      </div>

      {/* Day cells — compact, fixed aspect, no scroll */}
      <div className="grid grid-cols-7 gap-[3px] sm:gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const inHorizon = isWithinHorizon(d);
          const isBiz = isBusinessDay(d);
          const isPast = d < today;
          const isBlocked = blockedDates.has(formatDateKey(d));
          const bookedCount = enabled(d, today) ? countBookedSlotsForDay(d, bookedSlots) : 0;
          const fullyBooked = bookedCount >= SLOTS_PER_DAY;
          const partiallyBooked = bookedCount > 0 && !fullyBooked;
          const enabledDay = inHorizon && isBiz && !isPast && !fullyBooked && !isBlocked;
          const selected = formatDateKey(d) === selectedKey;
          const isToday = isSameDay(d, today);

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => enabledDay && onSelect(d)}
              disabled={!enabledDay}
              aria-label={`${d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}${
                isBlocked ? ' — blocked' : fullyBooked ? ' — fully booked' : !enabledDay ? ' — unavailable' : ''
              }`}
              className={`relative aspect-square overflow-hidden rounded-md text-[12px] font-semibold transition-all sm:text-[13px] ${
                selected
                  ? 'bg-gradient-to-br from-[#ff2f86] to-[#a855f7] text-white shadow-[0_0_18px_-4px_rgba(255,47,134,0.6)]'
                  : isBlocked
                    ? 'cursor-not-allowed bg-amber-500/10 text-amber-300/55 line-through'
                    : fullyBooked
                      ? 'cursor-not-allowed bg-rose-500/10 text-rose-400/60 line-through'
                      : enabledDay
                        ? 'bg-white/[0.04] text-white hover:bg-white/[0.10] hover:scale-[1.04]'
                        : 'cursor-not-allowed text-white/15'
              }`}
            >
              {d.getDate()}
              {/* Today dot (only when not selected and not fully booked) */}
              {isToday && !selected && !fullyBooked && !isBlocked && (
                <span className="absolute bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#ff3f8d]" />
              )}
              {/* Partially booked indicator */}
              {partiallyBooked && !selected && !isBlocked && (
                <span className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-amber-400/80" />
              )}
              {/* Fully booked X overlay */}
              {fullyBooked && !isBlocked && (
                <X className="absolute inset-0 m-auto h-3 w-3 text-rose-400/60" strokeWidth={2.5} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-t border-white/8 pt-3 text-[10.5px] text-white/55 sm:gap-x-4 sm:text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-white/[0.12]" />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative h-2.5 w-2.5 rounded-sm bg-white/[0.06]">
            <span className="absolute top-[-1px] right-[-1px] h-1 w-1 rounded-full bg-amber-400" />
          </span>
          Partially booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative h-2.5 w-2.5 rounded-sm bg-rose-500/15">
            <X className="absolute inset-0 m-auto h-2 w-2 text-rose-400" strokeWidth={3} />
          </span>
          Fully booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/15" />
          Blocked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-[#ff2f86] to-[#a855f7]" />
          Selected
        </span>
      </div>
    </div>
  );
};

// Helper used inside CalendarPicker to compute booked counts only for enabled cells.
function enabled(d: Date, today: Date) {
  return isWithinHorizon(d) && isBusinessDay(d) && d >= today;
}

// ─── Slot picker ─────────────────────────────────────────────────────────────

const SlotPicker: React.FC<{
  date: Date;
  selectedSlot: string;
  bookedSlots: Set<string>;
  onSelect: (iso: string) => void;
}> = ({ date, selectedSlot, bookedSlots, onSelect }) => {
  const slots = useMemo(() => generateSlotsForDay(date, bookedSlots), [date, bookedSlots]);
  const availableCount = slots.filter((s) => !s.booked).length;

  if (availableCount === 0) {
    return (
      <div className="rounded-2xl border border-white/12 bg-white/[0.025] p-6 text-center">
        <Clock className="mx-auto mb-3 h-6 w-6 text-white/40" strokeWidth={1.5} />
        <p className="text-[14px] text-white/60">No free slots on this day.</p>
        <p className="mt-1 text-[12px] text-white/40">Try another day or ping us on WhatsApp.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
        {slots.map((s) => {
          const selected = selectedSlot === s.iso;
          const isBooked = s.booked;
          return (
            <button
              key={s.iso}
              type="button"
              onClick={() => !isBooked && onSelect(s.iso)}
              disabled={isBooked}
              aria-label={isBooked ? `${s.label} — booked` : s.label}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl border text-[13px] font-semibold transition-all sm:h-12 sm:text-[14px] ${
                selected
                  ? 'border-[#ff3f8d]/70 bg-gradient-to-br from-[#ff3f8d]/20 to-[#a855f7]/15 text-white shadow-[0_0_20px_-8px_rgba(255,47,134,0.6)]'
                  : isBooked
                    ? 'cursor-not-allowed border-white/8 bg-rose-500/[0.05] text-rose-300/45 line-through'
                    : 'border-white/12 bg-white/[0.025] text-white hover:border-white/30 hover:bg-white/[0.05]'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Slot legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-white/8 pt-3 text-[10.5px] text-white/55 sm:text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm border border-white/15 bg-white/[0.04]" />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm border border-white/8 bg-rose-500/10" />
          Booked
        </span>
      </div>
    </>
  );
};

// ─── Booked screen ───────────────────────────────────────────────────────────

const BookedScreen: React.FC<{
  slot: Date;
  durationMin: number;
  meetingLabel: string;
  name: string;
  notes: string;
  timezone: string;
  onViewChange: (v: ViewState) => void;
}> = ({ slot, durationMin, meetingLabel, name, notes, timezone, onViewChange }) => {
  const dateLabel = slot.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const timeLabel = slot.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  const uid = `${slot.getTime()}-${(name || 'guest').replace(/\s+/g, '-').toLowerCase()}@pureflowstudios`;
  const title = `${meetingLabel} — Pureflow Studios`;
  const description = `Booked via pureflowstudios.com\n\nGuest: ${name}${notes ? `\nNotes: ${notes}` : ''}`;

  return (
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
            You're
          </span>
          <span className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.2rem,5vw,4.5rem)]" data-text="BOOKED IN.">
            BOOKED IN.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-7 w-full max-w-sm rounded-2xl border border-white/12 bg-white/[0.04] p-5"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{meetingLabel}</p>
          <p className="mt-2 font-sans text-[18px] font-semibold text-white sm:text-[20px]">{dateLabel}</p>
          <p className="mt-1 text-[15px] text-white/70">{timeLabel} · {timezone.replace('_', ' ')}</p>
          <p className="mt-3 text-[12px] text-white/40">
            Calendar invite + Google Meet link will hit your inbox shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-6 grid w-full max-w-sm grid-cols-2 gap-2"
        >
          <a
            href={googleCalLink(title, description, slot, durationMin)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[12.5px] font-semibold text-white transition-all hover:bg-white/[0.10] hover:border-white/30"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Google
          </a>
          <button
            type="button"
            onClick={() => {
              const ics = buildIcs({ uid, title, description, startUtc: slot, durationMin, location: 'Google Meet' });
              downloadIcs(`pureflow-${slot.getTime()}.ics`, ics);
            }}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[12.5px] font-semibold text-white transition-all hover:bg-white/[0.10] hover:border-white/30"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            .ics file
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="mt-4 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:gap-3"
        >
          <a
            href="https://wa.me/916393640650"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[14px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.99]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp now
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
};
