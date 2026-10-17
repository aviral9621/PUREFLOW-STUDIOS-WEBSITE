// POST /api/booking/book — confirm a consultation.
// 1. validate  2. the slot must still be open on the calendar  3. create the Google
// Calendar event with a Meet link (Google also sends the invite to the client)
// 4. save it on the visitor's international lead (Leads app → International; unique slot
// guard; the database sends the push alerts)  5. confirmation email to the client and lead
// email to PureFlow through Resend. Returns { id, meetLink }.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { cors, metaEvent, HOST_TZ, MEETING_MIN, busyRanges, buildSlots, clientCallEmail, createEvent, deleteEvent, esc, fmtIn, googleConfigured, googleToken, insertBooking, intlUpsert, isEmail, json, readJson, rescheduleUrl, sendEmail, type IntlFields } from './_lib.js';

type Payload = {
  start: string; end: string; timeZone: string;
  answers?: { type?: string; builds?: string[]; budget?: string; start?: string };
  details: { name: string; email: string; company: string; country: string; phone: string; website?: string; problem?: string; consent: boolean; updates?: boolean; dial?: string };
  project?: string;
  /** The lead row saved at "Choose a time" (api/booking/lead), so the booking lands on the same person. */
  lead?: { id?: string | null; key?: string | null };
  /** The Meta Schedule event ID (the pixel sends the same) and Meta's cookies. */
  meta?: { eventId?: string; fbp?: string; fbc?: string };
  page?: string; utm?: Record<string, string>; referrer?: string;
};

const LABEL: Record<string, string> = {
  travel: 'Travel & tours', realestate: 'Real estate', edu: 'Education / training', health: 'Healthcare / clinics', retail: 'Retail / distribution', services: 'Professional services', other: 'Other',
  crm: 'CRM / lead management', booking: 'Booking system', erp: 'Operations / ERP', portal: 'Customer portal or app', auto: 'WhatsApp & email automation', web: 'Website + system', unsure: 'Not sure yet',
  under: 'Under $1,000', b1: '$1,000–3,000', b2: '$3,000–10,000', b3: '$10,000+',
  now: 'Right away', month: 'Within 1 month', quarter: '1–3 months', exploring: 'Just exploring',
};
const lab = (k?: string) => (k ? LABEL[k] ?? k : '—');

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (cors(req, res, 'POST')) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  let p: Payload;
  try { p = (await readJson(req)) as Payload; } catch { return json(res, 400, { error: 'bad_json' }); }
  const d = p?.details;
  const start = Date.parse(p?.start ?? ''), end = Date.parse(p?.end ?? '');
  if (!d || !d.name?.trim() || !isEmail(d.email ?? '') || !d.company?.trim() || !d.consent) return json(res, 400, { error: 'invalid_details' });
  if (Number.isNaN(start) || Number.isNaN(end) || end - start !== MEETING_MIN * 60_000) return json(res, 400, { error: 'invalid_slot' });
  // the slot must be one we offer (window + notice rules)
  const startIso = new Date(start).toISOString();
  if (!buildSlots(new Date(), 14).some((s) => s.start === startIso)) return json(res, 409, { error: 'slot_taken' });

  const name = d.name.trim(), email = d.email.trim().toLowerCase(), company = d.company.trim();
  const phone = [d.dial, d.phone].filter(Boolean).join(' ').trim();
  const tz = p.timeZone && Intl.supportedValuesOf?.('timeZone')?.includes(p.timeZone) ? p.timeZone : HOST_TZ;
  const when = (z: string) => `${fmtIn(new Date(start), z, { weekday: 'long', day: 'numeric', month: 'long' })} · ${fmtIn(new Date(start), z, { hour: 'numeric', minute: '2-digit' })}–${fmtIn(new Date(end), z, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}`;
  const summaryLines = [
    `Business: ${lab(p.answers?.type)}`, `Wants: ${(p.answers?.builds ?? []).map(lab).join(', ') || '—'}`, `Budget: ${lab(p.answers?.budget)}`, `Start: ${lab(p.answers?.start)}`,
    `Company: ${company}${d.website ? ` · ${d.website}` : ''}`, `Country: ${d.country ?? '—'}`, `Phone: ${phone || '—'}`, d.problem ? `Problem: ${d.problem}` : '', p.project ? `Came from: ${p.project}` : '',
  ].filter(Boolean);

  const intlBase: IntlFields = {
    id: p.lead?.id ?? null, key: p.lead?.key ?? null,
    name, email, company, website: d.website?.trim(), country: d.country, phone: phone || undefined,
    business_type: p.answers?.type, builds: p.answers?.builds ?? [], budget: p.answers?.budget, start_timeline: p.answers?.start,
    problem: d.problem?.trim(), updates_opt_in: !!d.updates, client_timezone: tz,
    page: p.page, utm: p.utm, referrer: p.referrer, user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
    scheduled_at: new Date(start).toISOString(), scheduled_end: new Date(end).toISOString(),
  };

  // Degraded mode (Google variables not configured yet): save the lead, email if possible, no calendar event.
  if (!googleConfigured()) {
    const i0 = await intlUpsert(intlBase);
    if (i0.ok === false && i0.conflict) return json(res, 409, { error: 'slot_taken' });
    if (i0.ok === false && i0.missing) {
      const ins0 = await insertBooking({ meeting_type: 'discovery_30', scheduled_at: new Date(start).toISOString(), duration_min: MEETING_MIN, timezone: tz, name, email, whatsapp: phone || null, notes: summaryLines.join('\n') + '\n(calendar not connected yet: confirm manually)', ics_uid: null });
      if (ins0.ok === false && ins0.code === '23505') return json(res, 409, { error: 'slot_taken' });
    }
    try { await sendEmail({ to: process.env.BOOKING_NOTIFY_EMAIL || 'contact@pureflowstudios.in', replyTo: email, subject: `New consultation (confirm manually): ${name} (${company}) · ${when(HOST_TZ)}`, text: `Calendar not connected yet — please send this client a Meet link.\n\nWhen (IST): ${when(HOST_TZ)}\nName: ${name}\nEmail: ${email}\n${summaryLines.join('\n')}`, html: `<p><strong>Calendar not connected yet — send this client a Meet link.</strong></p><p>${esc(when(HOST_TZ))}<br>${esc(name)} · <a href="mailto:${esc(email)}">${esc(email)}</a></p><pre style="font:14px system-ui">${esc(summaryLines.join('\n'))}</pre>` }); } catch (e) { console.error('[book] notify (degraded)', e); }
    await metaEvent('Schedule', req, p.meta, { email, name, phone: d.phone, dial: d.dial, country: d.country, externalId: i0.ok ? i0.id : undefined }, p.page, { content_name: 'Free consultation' });
    return json(res, 200, { id: 'pending', meetLink: '' });
  }

  let token: string;
  try { token = await googleToken(); } catch (e) { console.error('[book] token', e); return json(res, 503, { error: 'calendar_unavailable' }); }
  try {
    const busy = await busyRanges(token, new Date(start - 1), new Date(end + 1));
    if (busy.some((b) => b.start < end && b.end > start)) return json(res, 409, { error: 'slot_taken' });
  } catch (e) { console.error('[book] busy', e); return json(res, 503, { error: 'calendar_unavailable' }); }

  // 3. calendar event + Meet link
  let ev: { id: string; meetLink: string; htmlLink: string };
  try {
    ev = await createEvent(token, {
      start: new Date(start).toISOString(), end: new Date(end).toISOString(),
      summary: `PureFlow consultation — ${name} (${company})`,
      description: `Free 30-minute consultation booked on pureflowstudios.in/customsoftware.\n\n${summaryLines.join('\n')}\n\nClient email: ${email}`,
      attendeeEmail: email, attendeeName: name,
    });
  } catch (e) { console.error('[book] create', e); return json(res, 503, { error: 'calendar_unavailable' }); }

  // 4. the visitor's international lead gets the slot, the Meet link and the event
  //    (unique scheduled_at = second guard against double booking; the database pushes the alert)
  const saved = await intlUpsert({ ...intlBase, meet_link: ev.meetLink || undefined, calendar_event_id: ev.id });
  if (saved.ok === false) {
    if (saved.conflict) { await deleteEvent(token, ev.id); return json(res, 409, { error: 'slot_taken' }); }
    if (saved.missing) {
      // International table not created yet: keep the booking in website_bookings so nothing is lost.
      const ins = await insertBooking({ meeting_type: 'discovery_30', scheduled_at: new Date(start).toISOString(), duration_min: MEETING_MIN, timezone: tz, name, email, whatsapp: phone || null, notes: summaryLines.join('\n'), ics_uid: ev.id });
      if (ins.ok === false) {
        if (ins.code === '23505') { await deleteEvent(token, ev.id); return json(res, 409, { error: 'slot_taken' }); }
        console.error('[book] supabase', ins.message);
      }
    } else {
      console.error('[book] international', saved.code, saved.message); // not fatal: the calendar event exists
    }
  }

  // 5. emails (skipped silently if RESEND_API_KEY is not set yet)
  const whenClient = when(tz), whenHost = when(HOST_TZ);
  const meet = ev.meetLink || '(the Google Meet link is in your calendar invite)';
  // The client's private reschedule link (only when the booking is on their international lead row).
  const moveLink = saved.ok ? rescheduleUrl(saved.id, saved.key) : undefined;
  try {
    const mail = clientCallEmail({ first: name.split(' ')[0], heading: `You're booked, ${name.split(' ')[0]}.`, intro: 'Your free 30-minute consultation with PureFlow Studios is confirmed.', when: whenClient, meetLink: ev.meetLink, reschedule: moveLink });
    await sendEmail({
      to: email,
      subject: `You're booked: PureFlow consultation, ${fmtIn(new Date(start), tz, { weekday: 'short', day: 'numeric', month: 'short' })}`,
      ...mail,
    });
  } catch (e) { console.error('[book] client email', e); }
  try {
    await sendEmail({
      to: process.env.BOOKING_NOTIFY_EMAIL || 'contact@pureflowstudios.in', replyTo: email,
      subject: `New consultation: ${name} (${company}) · ${fmtIn(new Date(start), HOST_TZ, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} IST`,
      text: `New booking from pureflowstudios.in/customsoftware\n\nWhen (IST): ${whenHost}\nClient time: ${whenClient}\nMeet: ${meet}\nCalendar: ${ev.htmlLink}\n\nName: ${name}\nEmail: ${email}\n${summaryLines.join('\n')}\nUpdates opt-in: ${d.updates ? 'yes' : 'no'}`,
      html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1F1235"><h2 style="margin:0 0 14px">New consultation booked</h2><p style="margin:0 0 16px"><strong>${esc(whenHost)}</strong><br><span style="color:#6B6480">Client time: ${esc(whenClient)}</span></p><p style="margin:0 0 16px">${ev.meetLink ? `<a href="${esc(ev.meetLink)}" style="color:#7E22CE">Google Meet</a> · ` : ''}<a href="${esc(ev.htmlLink)}" style="color:#7E22CE">Open in Calendar</a></p><table style="border-collapse:collapse;font-size:15px"><tr><td style="padding:6px 14px 6px 0;color:#6B6480">Name</td><td style="padding:6px 0"><strong>${esc(name)}</strong></td></tr><tr><td style="padding:6px 14px 6px 0;color:#6B6480">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#7E22CE">${esc(email)}</a></td></tr>${summaryLines.map((l) => { const i = l.indexOf(':'); return `<tr><td style="padding:6px 14px 6px 0;color:#6B6480;vertical-align:top">${esc(l.slice(0, i))}</td><td style="padding:6px 0">${esc(l.slice(i + 2))}</td></tr>`; }).join('')}<tr><td style="padding:6px 14px 6px 0;color:#6B6480">Updates</td><td style="padding:6px 0">${d.updates ? 'yes' : 'no'}</td></tr></table></div>`,
    });
  } catch (e) { console.error('[book] notify email', e); }

  // Meta Conversions API "Schedule" (deduplicated with the pixel's Schedule by event ID).
  await metaEvent('Schedule', req, p.meta, { email, name, phone: d.phone, dial: d.dial, country: d.country, externalId: saved.ok ? saved.id : undefined }, p.page, { content_name: 'Free consultation' });
  return json(res, 200, { id: ev.id, meetLink: ev.meetLink });
}
