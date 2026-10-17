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
/**
 * Call hours in India time, on the listed India weekdays. `americas` windows are only
 * shown to visitors in American time zones (the landing filters by the visitor's zone);
 * everyone else sees 11:00–20:00. Same table as the landing's lib/pf/scheduling.ts.
 */
export type CallWindow = { from: string; to: string; days: string[]; americas?: boolean };
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const WINDOWS: CallWindow[] = [
  { from: '11:00', to: '20:00', days: WEEKDAYS },
  // US & Canada mornings: New York 10:30 AM–12:30 PM in summer, 9:30–11:30 AM in winter
  { from: '20:00', to: '22:00', days: WEEKDAYS, americas: true },
  // US West evenings, the day before: Los Angeles 9:30–10:30 PM / 8:30–9:30 PM.
  // Tue–Fri here is Mon–Thu there (Monday 10 AM here would be their Sunday night).
  { from: '10:00', to: '11:00', days: ['Tue', 'Wed', 'Thu', 'Fri'], americas: true },
];

export type Slot = { start: string; end: string; window: number; americas?: boolean };

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
    const ymd = ymdIn(day, HOST_TZ);
    WINDOWS.forEach(({ from: a, to: b, days: on, americas }, w) => {
      if (!on.includes(wd)) return;
      const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
      for (let m = toMin(a); m + MEETING_MIN <= toMin(b); m += MEETING_MIN) {
        const hhmm = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
        const start = zonedToUtc(ymd, hhmm, HOST_TZ);
        if (start.getTime() < earliest) continue;
        out.push({ start: start.toISOString(), end: new Date(start.getTime() + MEETING_MIN * 60_000).toISOString(), window: w, ...(americas ? { americas } : {}) });
      }
    });
  }
  return out.sort((x, y) => x.start.localeCompare(y.start));
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
/** Move an event (same Meet link). Google sends the client the updated invite when `notify`.
 *  Returns null when the event no longer exists (deleted from the calendar by hand). */
export async function moveEvent(token: string, id: string, p: { start: string; end: string; description?: string; notify: boolean }): Promise<CreatedEvent | null> {
  const body: Record<string, unknown> = { start: { dateTime: p.start, timeZone: HOST_TZ }, end: { dateTime: p.end, timeZone: HOST_TZ } };
  if (p.description !== undefined) body.description = p.description;
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calId()}/events/${encodeURIComponent(id)}?conferenceDataVersion=1&sendUpdates=${p.notify ? 'all' : 'none'}`, { method: 'PATCH', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (r.status === 404 || r.status === 410) return null;
  const j = (await r.json()) as { id?: string; status?: string; hangoutLink?: string; htmlLink?: string; conferenceData?: { entryPoints?: Array<{ uri?: string; entryPointType?: string }> }; error?: unknown };
  if (!j.id) throw new Error(`google patch: ${JSON.stringify(j.error).slice(0, 200)}`);
  if (j.status === 'cancelled') return null;
  const meet = j.hangoutLink || j.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri || '';
  return { id: j.id, meetLink: meet, htmlLink: j.htmlLink ?? '' };
}
export async function getEventDescription(token: string, id: string): Promise<string | null> {
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calId()}/events/${encodeURIComponent(id)}?fields=description,status`, { headers: { authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const j = (await r.json()) as { description?: string; status?: string };
  return j.status === 'cancelled' ? null : j.description ?? '';
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

// ── International leads (Leads app → International). Written only through the
// intl_lead_upsert() database function: it validates, rate-limits and returns an
// access key so a booking can update the visitor's own lead row.
export type IntlFields = {
  id?: string | null; key?: string | null;
  name: string; email: string; company?: string; website?: string; country?: string; phone?: string;
  business_type?: string; builds?: string[]; budget?: string; start_timeline?: string; problem?: string; updates_opt_in?: boolean;
  scheduled_at?: string; scheduled_end?: string; client_timezone?: string; meet_link?: string; calendar_event_id?: string;
  page?: string; utm?: Record<string, string>; referrer?: string; user_agent?: string;
};
export type IntlResult =
  | { ok: true; id: string; key: string; status: string }
  | { ok: false; missing?: true; conflict?: true; code?: string; message: string };
export async function intlUpsert(fields: IntlFields): Promise<IntlResult> {
  if (!SB_KEY) return { ok: false, message: 'no supabase key' };
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/intl_lead_upsert`, {
      method: 'POST',
      headers: { apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ p: fields }),
    });
    const j = (await r.json().catch(() => ({}))) as { id?: string; key?: string; status?: string; code?: string; message?: string };
    if (r.ok && j.id && j.key) return { ok: true, id: j.id, key: j.key, status: j.status ?? '' };
    // PGRST202: the function does not exist yet (database migration not applied)
    if (r.status === 404 || j.code === 'PGRST202' || j.code === '42883') return { ok: false, missing: true, code: j.code, message: j.message ?? 'missing' };
    if (j.code === '23505') return { ok: false, conflict: true, code: j.code, message: j.message ?? 'slot taken' };
    return { ok: false, code: j.code, message: j.message ?? `status ${r.status}` };
  } catch (e) { return { ok: false, message: String(e) }; }
}

// ── reschedule (the private link in the confirmation email) ─────────────────
const SITE_URL = (process.env.BOOKING_SITE_URL || 'https://www.pureflowstudios.in').replace(/\/$/, '');
/** The client's own link: opens /customsoftware with the reschedule pop-up for this booking. */
export const rescheduleUrl = (id: string, key: string) => `${SITE_URL}/customsoftware?reschedule=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type IntlBooking = {
  id: string; name: string; email: string; company: string | null; status: string;
  scheduled_at: string | null; scheduled_end: string | null; client_timezone: string | null;
  meet_link: string | null; calendar_event_id: string | null; reschedule_count: number;
};
async function rpc(fn: string, body: unknown): Promise<{ ok: boolean; status: number; data: unknown; code?: string; message?: string }> {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = (await r.json().catch(() => null)) as { code?: string; message?: string } | null;
  return { ok: r.ok, status: r.status, data, code: r.ok ? undefined : data?.code, message: r.ok ? undefined : data?.message };
}
/** The booking behind a reschedule link, or null if the id/key pair matches nothing. */
export async function intlBookingGet(id: string, key: string): Promise<IntlBooking | null> {
  if (!UUID_RE.test(id) || !UUID_RE.test(key)) return null;
  const r = await rpc('intl_booking_get', { p_id: id, p_key: key });
  if (!r.ok) throw new Error(`intl_booking_get: ${r.code ?? r.status} ${r.message ?? ''}`);
  return (r.data as IntlBooking | null) ?? null;
}
export async function intlBookingReschedule(p: { id: string; key: string; scheduled_at: string; scheduled_end: string; reason: string; meet_link?: string; calendar_event_id?: string; client_timezone?: string }): Promise<{ ok: true } | { ok: false; conflict?: true; code?: string; message: string }> {
  const r = await rpc('intl_booking_reschedule', { p });
  if (r.ok) return { ok: true };
  if (r.code === '23505') return { ok: false, conflict: true, code: r.code, message: r.message ?? 'slot taken' };
  return { ok: false, code: r.code, message: r.message ?? `status ${r.status}` };
}

/** The client's email (booked or moved): when, Meet button, and the reschedule line at the end. */
export function clientCallEmail(p: { first: string; heading: string; intro: string; when: string; previous?: string; meetLink: string; reschedule?: string }) {
  const rows = [
    p.previous ? ['Was', `<span style="color:#6B6480;text-decoration:line-through">${esc(p.previous)}</span>`] : null,
    [p.previous ? 'Now' : 'When', `<strong>${esc(p.when)}</strong>`],
    ['Where', 'Google Meet'],
  ].filter(Boolean) as string[][];
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;color:#1F1235"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7E22CE;font-weight:700;margin:0 0 10px">PureFlow Studios</p><h1 style="font-size:24px;margin:0 0 12px">${esc(p.heading)}</h1><p style="font-size:16px;line-height:1.6;margin:0 0 20px">${esc(p.intro)}</p><table style="border-collapse:collapse;width:100%;font-size:15px">${rows.map(([k, v]) => `<tr><td style="padding:10px 0;border-top:1px solid #ECE6F7;color:#6B6480;width:90px">${k}</td><td style="padding:10px 0;border-top:1px solid #ECE6F7">${v}</td></tr>`).join('')}</table>${p.meetLink ? `<p style="margin:24px 0"><a href="${esc(p.meetLink)}" style="display:inline-block;background:#7E22CE;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Join the Google Meet</a></p>` : ''}<p style="font-size:14px;line-height:1.6;color:#6B6480;margin:0 0 8px">Your calendar invite has the same details. Questions before the call? Just reply to this email.</p><p style="font-size:14px;line-height:1.6;margin:20px 0 0">Aviral Singh<br>PureFlow Studios · <a href="https://www.pureflowstudios.in" style="color:#7E22CE">pureflowstudios.in</a></p>${p.reschedule ? `<p style="font-size:13px;line-height:1.6;color:#6B6480;margin:24px 0 0;padding-top:14px;border-top:1px solid #ECE6F7">Want to reschedule the meeting? <a href="${esc(p.reschedule)}" style="color:#7E22CE;font-weight:700">Click here</a>.</p>` : ''}</div>`;
  const text = `Hi ${p.first},\n\n${p.intro}\n\n${p.previous ? `Was: ${p.previous}\nNow: ` : 'When: '}${p.when}\nGoogle Meet: ${p.meetLink || '(the Google Meet link is in your calendar invite)'}\n\nYour calendar invite has the same details. Questions before the call? Just reply to this email.\n\nAviral Singh\nPureFlow Studios · pureflowstudios.in${p.reschedule ? `\n\nWant to reschedule the meeting? ${p.reschedule}` : ''}`;
  return { html, text };
}

// ── CORS: only our own pages call these (plus local dev) ──────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://www.pureflowstudios.in', 'https://pureflowstudios.in',
  'http://localhost:3000', 'http://localhost:3100', 'http://localhost:4173',
]);
/** Sets the CORS headers for this request. Returns true when it answered a preflight. */
export function cors(req: { method?: string; headers: Record<string, string | string[] | undefined> }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: () => void }, methods: string) {
  const origin = String(req.headers.origin ?? '');
  res.setHeader('vary', 'Origin');
  if (ALLOWED_ORIGINS.has(origin)) res.setHeader('access-control-allow-origin', origin);
  res.setHeader('access-control-allow-methods', `${methods}, OPTIONS`);
  res.setHeader('access-control-allow-headers', 'Content-Type');
  res.setHeader('access-control-max-age', '86400');
  if (req.method !== 'OPTIONS') return false;
  res.statusCode = 204;
  res.end();
  return true;
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
