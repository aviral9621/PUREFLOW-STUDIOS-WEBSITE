// Shared helpers for the /customsoftware booking functions (api/booking/*.ts).
// Runs on Vercel (Node). Secrets come from environment variables only:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_CALENDAR_ID
//   RESEND_API_KEY, BOOKING_FROM, BOOKING_REPLY_TO, BOOKING_NOTIFY_EMAIL
//   BOOKING_TIMEZONE (default Asia/Kolkata), SUPABASE_URL, SUPABASE_ANON_KEY
// Files starting with "_" in api/ are helpers, not endpoints.

export const HOST_TZ = process.env.BOOKING_TIMEZONE || 'Asia/Kolkata';
export const MEETING_MIN = 30;
export const MIN_NOTICE_H = 4;
export const HORIZON_DAYS = 14;
/** Call windows in host-local time, Monday to Friday. */
export const WINDOWS: [string, string][] = [['14:00', '17:00'], ['20:00', '23:00']];

export type Slot = { start: string; end: string; window: number };

// ── time helpers (no date libraries: Intl does the zone work) ────────────────
const partsOf = (d: Date, tz: string) => {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short' });
  const o: Record<string, string> = {};
  for (const p of f.formatToParts(d)) o[p.type] = p.value;
  return o;
};
/** Zone offset (ms) of `tz` at instant `d`. */
const offsetAt = (d: Date, tz: string) => {
  const p = partsOf(d, tz);
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(d.getTime() / 1000) * 1000;
};
/** The instant for wall-clock `yyyy-mm-dd hh:mm` in `tz`. */
export const zonedToUtc = (ymd: string, hhmm: string, tz: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  const [h, mi] = hhmm.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi, 0);
  const off = offsetAt(new Date(guess), tz);
  const t = guess - off;
  // second pass handles DST edges
  return new Date(t - (offsetAt(new Date(t), tz) - off));
};
export const ymdIn = (d: Date, tz: string) => { const p = partsOf(d, tz); return `${p.year}-${p.month}-${p.day}`; };
export const weekdayIn = (d: Date, tz: string) => partsOf(d, tz).weekday; // Mon … Sun
export const fmtIn = (d: Date, tz: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(d);

/** All candidate slots from `from` for `days` days (host weekdays), UTC ISO strings. */
export function buildSlots(from = new Date(), days = HORIZON_DAYS): Slot[] {
  const out: Slot[] = [];
  const earliest = from.getTime() + MIN_NOTICE_H * 3600_000;
  for (let d = 0; d <= days; d++) {
    const day = new Date(from.getTime() + d * 864e5);
    const wd = weekdayIn(day, HOST_TZ);
    if (wd === 'Sat' || wd === 'Sun') continue;
    const ymd = ymdIn(day, HOST_TZ);
    WINDOWS.forEach(([a, b], w) => {
      const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
      for (let m = toMin(a); m + MEETING_MIN <= toMin(b); m += MEETING_MIN) {
        const hhmm = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
        const start = zonedToUtc(ymd, hhmm, HOST_TZ);
        if (start.getTime() < earliest) continue;
        out.push({ start: start.toISOString(), end: new Date(start.getTime() + MEETING_MIN * 60_000).toISOString(), window: w });
      }
    });
  }
  return out;
}

// ── Google Calendar ──────────────────────────────────────────────────────────
const need = (k: string) => { const v = process.env[k]; if (!v) throw new Error(`missing env ${k}`); return v; };
/** True once the Google variables are configured in Vercel. Until then the functions run in
 *  a degraded mode: fixed call windows, leads saved in Supabase, no calendar event. */
export const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CALENDAR_ID);

export async function googleToken(): Promise<string> {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: need('GOOGLE_CLIENT_ID'), client_secret: need('GOOGLE_CLIENT_SECRET'), refresh_token: need('GOOGLE_REFRESH_TOKEN'), grant_type: 'refresh_token' }),
  });
  const j = (await r.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!j.access_token) throw new Error(`google token: ${j.error} ${j.error_description ?? ''}`);
  return j.access_token;
}
const calId = () => encodeURIComponent(need('GOOGLE_CALENDAR_ID'));

export type Busy = { start: number; end: number };
/** Busy ranges (ms) on the host calendar between two instants. Cancelled and all-day "free" events are ignored. */
export async function busyRanges(token: string, timeMin: Date, timeMax: Date): Promise<Busy[]> {
  const out: Busy[] = [];
  let pageToken = '';
  do {
    const q = new URLSearchParams({ timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), singleEvents: 'true', orderBy: 'startTime', maxResults: '250', showDeleted: 'false' });
    if (pageToken) q.set('pageToken', pageToken);
    const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calId()}/events?${q}`, { headers: { authorization: `Bearer ${token}` } });
    const j = (await r.json()) as { items?: Array<{ status?: string; transparency?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string } }>; nextPageToken?: string; error?: unknown };
    if (j.error) throw new Error(`google events: ${JSON.stringify(j.error).slice(0, 200)}`);
    for (const e of j.items ?? []) {
      if (e.status === 'cancelled' || e.transparency === 'transparent') continue;
      if (!e.start?.dateTime || !e.end?.dateTime) continue; // all-day events don't block calls
      out.push({ start: Date.parse(e.start.dateTime), end: Date.parse(e.end.dateTime) });
    }
    pageToken = j.nextPageToken ?? '';
  } while (pageToken);
  return out;
}
export const overlaps = (s: Slot, busy: Busy[]) => { const a = Date.parse(s.start), b = Date.parse(s.end); return busy.some((x) => x.start < b && x.end > a); };

export type CreatedEvent = { id: string; meetLink: string; htmlLink: string };
export async function createEvent(token: string, p: { start: string; end: string; summary: string; description: string; attendeeEmail: string; attendeeName: string }): Promise<CreatedEvent> {
  const body = {
    summary: p.summary,
    description: p.description,
    start: { dateTime: p.start, timeZone: HOST_TZ },
    end: { dateTime: p.end, timeZone: HOST_TZ },
    attendees: [{ email: p.attendeeEmail, displayName: p.attendeeName }],
    conferenceData: { createRequest: { requestId: `pf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 60 }, { method: 'popup', minutes: 10 }] },
    guestsCanModify: false,
  };
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calId()}/events?conferenceDataVersion=1&sendUpdates=all`, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = (await r.json()) as { id?: string; hangoutLink?: string; htmlLink?: string; conferenceData?: { entryPoints?: Array<{ uri?: string; entryPointType?: string }> }; error?: unknown };
  if (!j.id) throw new Error(`google insert: ${JSON.stringify(j.error).slice(0, 200)}`);
  const meet = j.hangoutLink || j.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri || '';
  return { id: j.id, meetLink: meet, htmlLink: j.htmlLink ?? '' };
}
export async function deleteEvent(token: string, id: string) {
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calId()}/events/${encodeURIComponent(id)}?sendUpdates=none`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } });
}

// ── Resend ───────────────────────────────────────────────────────────────────
export async function sendEmail(m: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true as const };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: process.env.BOOKING_FROM || 'PureFlow Studios <bookings@pureflowstudios.in>', to: [m.to], reply_to: m.replyTo || process.env.BOOKING_REPLY_TO || undefined, subject: m.subject, html: m.html, text: m.text }),
  });
  const j = (await r.json()) as { id?: string; message?: string; name?: string };
  if (!r.ok) throw new Error(`resend: ${j.name ?? r.status} ${j.message ?? ''}`);
  return { id: j.id };
}

// ── Supabase (REST, publishable key; same table the main site's Book-a-call page uses) ──
const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://jnytayxxwaydlmeuvtqr.supabase.co';
// Publishable anon key (same fallback as lib/supabase.ts; RLS decides what it may do).
const SB_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueXRheXh4d2F5ZGxtZXV2dHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODQzNjMsImV4cCI6MjA3ODM2MDM2M30.o0ZDUriNTnz9fFkmXaM1_DMnvWydPKu-4j0b8zVfQME';
export async function insertBooking(row: Record<string, unknown>): Promise<{ ok: true } | { ok: false; code?: string; message: string }> {
  if (!SB_KEY) return { ok: false, message: 'no supabase key' };
  const r = await fetch(`${SB_URL}/rest/v1/website_bookings`, { method: 'POST', headers: { apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json', prefer: 'return=minimal' }, body: JSON.stringify(row) });
  if (r.status === 201 || r.status === 200 || r.status === 204) return { ok: true };
  const j = (await r.json().catch(() => ({}))) as { code?: string; message?: string };
  return { ok: false, code: j.code, message: j.message ?? `status ${r.status}` };
}

// ── small utils ──────────────────────────────────────────────────────────────
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
export function json(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}
export function readJson(req: { on: (ev: string, cb: (c?: Buffer) => void) => void; body?: unknown }): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) return Promise.resolve(typeof req.body === 'string' ? JSON.parse(req.body) : req.body);
  return new Promise((resolve, reject) => { const chunks: Buffer[] = []; req.on('data', (c) => c && chunks.push(c)); req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch (e) { reject(e); } }); req.on('error', () => reject(new Error('body'))); });
}
