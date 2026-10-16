// The client's "Want to reschedule the meeting? Click here." link (confirmation email)
// opens /customsoftware?reschedule=<lead id>&key=<access key>. The page then calls:
//   GET  /api/booking/reschedule?id=…&key=…   → who and when (for the pop-up)
//   POST /api/booking/reschedule {id, key, start, end, timeZone, reason}
//        1. the new slot must be one we offer and free on the calendar
//        2. move the Google Calendar event (same Meet link; Google sends the client the update)
//        3. record it on the lead (unique slot guard; the database pushes "Rescheduled" to the team)
//        4. email the client the new time (with the link again) and PureFlow the reason
import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  cors, HOST_TZ, MEETING_MIN, UUID_RE, busyRanges, buildSlots, clientCallEmail, createEvent, deleteEvent, esc, fmtIn, getEventDescription,
  googleConfigured, googleToken, intlBookingGet, intlBookingReschedule, json, moveEvent, readJson, rescheduleUrl, sendEmail,
  type CreatedEvent, type IntlBooking,
} from './_lib.js';

type Payload = { id: string; key: string; start: string; end: string; timeZone?: string; reason: string };

/** ok | past (call time has passed) | cancelled | nobooking */
const stateOf = (b: IntlBooking) =>
  !b.scheduled_at ? 'nobooking' : b.status === 'cancelled' || b.status === 'spam' ? 'cancelled' : Date.parse(b.scheduled_at) <= Date.now() ? 'past' : 'ok';
const validTz = (z?: string | null) => !!z && !!Intl.supportedValuesOf?.('timeZone')?.includes(z);
const when = (s: number, e: number, z: string) =>
  `${fmtIn(new Date(s), z, { weekday: 'long', day: 'numeric', month: 'long' })} · ${fmtIn(new Date(s), z, { hour: 'numeric', minute: '2-digit' })}–${fmtIn(new Date(e), z, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}`;
const short = (s: number, z: string) => fmtIn(new Date(s), z, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (cors(req, res, 'GET, POST')) return;

  if (req.method === 'GET') {
    const url = new URL(req.url ?? '/', 'http://x');
    const id = url.searchParams.get('id') ?? '', key = url.searchParams.get('key') ?? '';
    let b: IntlBooking | null;
    try { b = await intlBookingGet(id, key); } catch (e) { console.error('[reschedule] get', e); return json(res, 503, { error: 'unavailable' }); }
    if (!b) return json(res, 404, { error: 'not_found' });
    const iso = (t: string | null) => (t ? new Date(t).toISOString() : null);
    return json(res, 200, {
      name: b.name, company: b.company, email: b.email, start: iso(b.scheduled_at), end: iso(b.scheduled_end),
      timeZone: validTz(b.client_timezone) ? b.client_timezone : null, meetLink: b.meet_link, state: stateOf(b),
    });
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  let p: Payload;
  try { p = (await readJson(req)) as Payload; } catch { return json(res, 400, { error: 'bad_json' }); }
  const reason = String(p?.reason ?? '').trim().slice(0, 500);
  const start = Date.parse(p?.start ?? ''), end = Date.parse(p?.end ?? '');
  if (!UUID_RE.test(p?.id ?? '') || !UUID_RE.test(p?.key ?? '')) return json(res, 404, { error: 'not_found' });
  if (reason.length < 3) return json(res, 400, { error: 'reason_required' });
  if (Number.isNaN(start) || Number.isNaN(end) || end - start !== MEETING_MIN * 60_000) return json(res, 400, { error: 'invalid_slot' });
  const startIso = new Date(start).toISOString(), endIso = new Date(end).toISOString();
  if (!buildSlots(new Date(), 14).some((s) => s.start === startIso)) return json(res, 409, { error: 'slot_taken' });

  let b: IntlBooking | null;
  try { b = await intlBookingGet(p.id, p.key); } catch (e) { console.error('[reschedule] get', e); return json(res, 503, { error: 'unavailable' }); }
  if (!b) return json(res, 404, { error: 'not_found' });
  const st = stateOf(b);
  if (st !== 'ok') return json(res, 410, { error: st });
  const prevStart = Date.parse(b.scheduled_at!), prevEnd = b.scheduled_end ? Date.parse(b.scheduled_end) : prevStart + MEETING_MIN * 60_000;
  if (prevStart === start) return json(res, 400, { error: 'same_slot' });

  const tz = validTz(p.timeZone) ? p.timeZone! : validTz(b.client_timezone) ? b.client_timezone! : HOST_TZ;
  const first = b.name.split(' ')[0];
  const who = b.company ? `${b.name} (${b.company})` : b.name;
  const note = `Rescheduled by the client on ${short(Date.now(), HOST_TZ)} IST (was ${short(prevStart, HOST_TZ)} IST).\nReason: ${reason}`;

  // ── calendar ──
  let ev: CreatedEvent | null = null;
  let created = false;
  let token = '';
  let oldDescription: string | null = null;
  if (googleConfigured()) {
    try { token = await googleToken(); } catch (e) { console.error('[reschedule] token', e); return json(res, 503, { error: 'calendar_unavailable' }); }
    try {
      const busy = await busyRanges(token, new Date(start - 1), new Date(end + 1));
      if (busy.some((x) => x.start < end && x.end > start)) return json(res, 409, { error: 'slot_taken' });
    } catch (e) { console.error('[reschedule] busy', e); return json(res, 503, { error: 'calendar_unavailable' }); }
    try {
      if (b.calendar_event_id) {
        oldDescription = await getEventDescription(token, b.calendar_event_id);
        if (oldDescription !== null) ev = await moveEvent(token, b.calendar_event_id, { start: startIso, end: endIso, description: `${oldDescription}\n\n${note}`.trim(), notify: true });
      }
      if (!ev) {
        // The original event is gone (deleted by hand): book a fresh one.
        ev = await createEvent(token, {
          start: startIso, end: endIso, summary: `PureFlow consultation — ${who}`,
          description: `Free 30-minute consultation booked on pureflowstudios.in/customsoftware.\n\n${note}\n\nClient email: ${b.email}`,
          attendeeEmail: b.email, attendeeName: b.name,
        });
        created = true;
      }
    } catch (e) { console.error('[reschedule] calendar', e); return json(res, 503, { error: 'calendar_unavailable' }); }
  }

  // ── database ──
  const saved = await intlBookingReschedule({
    id: p.id, key: p.key, scheduled_at: startIso, scheduled_end: endIso, reason,
    meet_link: ev?.meetLink || undefined, calendar_event_id: ev?.id, client_timezone: tz,
  });
  if (saved.ok === false) {
    // Put the calendar back the way it was.
    if (ev && token) {
      try {
        if (created) await deleteEvent(token, ev.id);
        else await moveEvent(token, ev.id, { start: new Date(prevStart).toISOString(), end: new Date(prevEnd).toISOString(), description: oldDescription ?? undefined, notify: true });
      } catch (e) { console.error('[reschedule] revert', e); }
    }
    if (saved.conflict) return json(res, 409, { error: 'slot_taken' });
    console.error('[reschedule] save', saved.code, saved.message);
    return json(res, 500, { error: 'reschedule_failed' });
  }

  // ── emails ──
  const meetLink = ev?.meetLink || b.meet_link || '';
  const whenNew = when(start, end, tz), whenOld = when(prevStart, prevEnd, tz);
  try {
    const mail = clientCallEmail({
      first, heading: `Your call has moved, ${first}.`,
      intro: googleConfigured() ? 'Your consultation with PureFlow Studios is now at the new time below. Your calendar invite has been updated.' : 'Thanks for letting us know. We have your new time and will confirm it shortly.',
      when: whenNew, previous: whenOld, meetLink, reschedule: rescheduleUrl(p.id, p.key),
    });
    await sendEmail({ to: b.email, subject: `Rescheduled: PureFlow consultation, ${fmtIn(new Date(start), tz, { weekday: 'short', day: 'numeric', month: 'short' })}`, ...mail });
  } catch (e) { console.error('[reschedule] client email', e); }
  try {
    const app = `https://leads.pureflowstudios.in/international?id=${p.id}`;
    const nowIst = when(start, end, HOST_TZ), wasIst = when(prevStart, prevEnd, HOST_TZ);
    await sendEmail({
      to: process.env.BOOKING_NOTIFY_EMAIL || 'contact@pureflowstudios.in', replyTo: b.email,
      subject: `Rescheduled: ${who} · ${short(start, HOST_TZ)} IST`,
      text: `${who} moved their consultation.\n\nNew time (IST): ${nowIst}\nWas (IST): ${wasIst}\nClient time: ${whenNew}\nReason: ${reason}\n${meetLink ? `Meet: ${meetLink}\n` : ''}${ev?.htmlLink ? `Calendar: ${ev.htmlLink}\n` : googleConfigured() ? '' : 'Calendar not connected: move the event by hand.\n'}\nOpen in Leads: ${app}`,
      html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1F1235"><h2 style="margin:0 0 14px">Consultation rescheduled</h2><p style="margin:0 0 6px"><strong>${esc(nowIst)}</strong></p><p style="margin:0 0 16px;color:#6B6480"><span style="text-decoration:line-through">${esc(wasIst)}</span><br>Client time: ${esc(whenNew)}</p><table style="border-collapse:collapse;font-size:15px"><tr><td style="padding:6px 14px 6px 0;color:#6B6480">Client</td><td style="padding:6px 0"><strong>${esc(who)}</strong> · <a href="mailto:${esc(b.email)}" style="color:#7E22CE">${esc(b.email)}</a></td></tr><tr><td style="padding:6px 14px 6px 0;color:#6B6480;vertical-align:top">Reason</td><td style="padding:6px 0">${esc(reason)}</td></tr></table><p style="margin:18px 0 0">${meetLink ? `<a href="${esc(meetLink)}" style="color:#7E22CE">Google Meet</a> · ` : ''}${ev?.htmlLink ? `<a href="${esc(ev.htmlLink)}" style="color:#7E22CE">Open in Calendar</a> · ` : ''}<a href="${esc(app)}" style="color:#7E22CE">Open in Leads</a></p>${googleConfigured() ? '' : '<p style="margin:14px 0 0;color:#B91C1C">Calendar not connected: move the event by hand.</p>'}</div>`,
    });
  } catch (e) { console.error('[reschedule] notify email', e); }

  return json(res, 200, { start: startIso, end: endIso, meetLink });
}
