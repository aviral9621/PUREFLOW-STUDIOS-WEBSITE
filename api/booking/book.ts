// POST /api/booking/book — confirm a consultation.
// 1. validate  2. the slot must still be open on the calendar  3. create the Google
// Calendar event with a Meet link (Google also sends the invite to the client)
// 4. save the lead in Supabase (unique slot guard)  5. confirmation email to the client
// and lead email to PureFlow through Resend. Returns { id, meetLink }.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { HOST_TZ, MEETING_MIN, busyRanges, buildSlots, createEvent, deleteEvent, esc, fmtIn, googleConfigured, googleToken, insertBooking, isEmail, json, readJson, sendEmail } from './_lib.js';

type Payload = {
  start: string; end: string; timeZone: string;
  answers?: { type?: string; builds?: string[]; budget?: string; start?: string };
  details: { name: string; email: string; company: string; country: string; phone: string; website?: string; problem?: string; consent: boolean; updates?: boolean; dial?: string };
  project?: string;
};

const LABEL: Record<string, string> = {
  travel: 'Travel & tours', realestate: 'Real estate', edu: 'Education / training', health: 'Healthcare / clinics', retail: 'Retail / distribution', services: 'Professional services', other: 'Other',
  crm: 'CRM / lead management', booking: 'Booking system', erp: 'Operations / ERP', portal: 'Customer portal or app', auto: 'WhatsApp & email automation', web: 'Website + system', unsure: 'Not sure yet',
  under: 'Under $1,000', b1: '$1,000–3,000', b2: '$3,000–10,000', b3: '$10,000+',
  now: 'Right away', month: 'Within 1 month', quarter: '1–3 months', exploring: 'Just exploring',
};
const lab = (k?: string) => (k ? LABEL[k] ?? k : '—');

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
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

  // Degraded mode (Google variables not configured yet): save the lead, email if possible, no calendar event.
  if (!googleConfigured()) {
    const ins0 = await insertBooking({ meeting_type: 'discovery_30', scheduled_at: new Date(start).toISOString(), duration_min: MEETING_MIN, timezone: tz, name, email, whatsapp: phone || null, notes: summaryLines.join('\n') + '\n(calendar not connected yet: confirm manually)', ics_uid: null });
    if (ins0.ok === false && ins0.code === '23505') return json(res, 409, { error: 'slot_taken' });
    try { await sendEmail({ to: process.env.BOOKING_NOTIFY_EMAIL || 'contact@pureflowstudios.in', replyTo: email, subject: `New consultation (confirm manually): ${name} (${company}) · ${when(HOST_TZ)}`, text: `Calendar not connected yet — please send this client a Meet link.\n\nWhen (IST): ${when(HOST_TZ)}\nName: ${name}\nEmail: ${email}\n${summaryLines.join('\n')}`, html: `<p><strong>Calendar not connected yet — send this client a Meet link.</strong></p><p>${esc(when(HOST_TZ))}<br>${esc(name)} · <a href="mailto:${esc(email)}">${esc(email)}</a></p><pre style="font:14px system-ui">${esc(summaryLines.join('\n'))}</pre>` }); } catch (e) { console.error('[book] notify (degraded)', e); }
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

  // 4. lead row (unique scheduled_at = second guard against double booking)
  const row = { meeting_type: 'discovery_30', scheduled_at: new Date(start).toISOString(), duration_min: MEETING_MIN, timezone: tz, name, email, whatsapp: phone || null, notes: summaryLines.join('\n'), ics_uid: ev.id };
  const ins = await insertBooking(row);
  if (ins.ok === false) {
    if (ins.code === '23505') { await deleteEvent(token, ev.id); return json(res, 409, { error: 'slot_taken' }); }
    console.error('[book] supabase', ins.message); // not fatal: the calendar event exists
  }

  // 5. emails (skipped silently if RESEND_API_KEY is not set yet)
  const whenClient = when(tz), whenHost = when(HOST_TZ);
  const meet = ev.meetLink || '(the Google Meet link is in your calendar invite)';
  try {
    await sendEmail({
      to: email,
      subject: `You're booked: PureFlow consultation, ${fmtIn(new Date(start), tz, { weekday: 'short', day: 'numeric', month: 'short' })}`,
      text: `Hi ${name},\n\nYour free 30-minute consultation with PureFlow Studios is confirmed.\n\nWhen: ${whenClient}\nGoogle Meet: ${meet}\n\nA calendar invite has also been sent to this address. Reply to this email if you need to move the call.\n\nAviral Singh\nPureFlow Studios · pureflowstudios.in`,
      html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;color:#1F1235"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7E22CE;font-weight:700;margin:0 0 10px">PureFlow Studios</p><h1 style="font-size:24px;margin:0 0 12px">You're booked, ${esc(name.split(' ')[0])}.</h1><p style="font-size:16px;line-height:1.6;margin:0 0 20px">Your free 30-minute consultation is confirmed.</p><table style="border-collapse:collapse;width:100%;font-size:15px"><tr><td style="padding:10px 0;border-top:1px solid #ECE6F7;color:#6B6480;width:90px">When</td><td style="padding:10px 0;border-top:1px solid #ECE6F7;font-weight:700">${esc(whenClient)}</td></tr><tr><td style="padding:10px 0;border-top:1px solid #ECE6F7;color:#6B6480">Where</td><td style="padding:10px 0;border-top:1px solid #ECE6F7">Google Meet</td></tr></table>${ev.meetLink ? `<p style="margin:24px 0"><a href="${esc(ev.meetLink)}" style="display:inline-block;background:#7E22CE;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Join the Google Meet</a></p>` : ''}<p style="font-size:14px;line-height:1.6;color:#6B6480;margin:0 0 8px">A calendar invite has also been sent to this address. Reply to this email if you need to move the call.</p><p style="font-size:14px;line-height:1.6;margin:20px 0 0">Aviral Singh<br>PureFlow Studios · <a href="https://www.pureflowstudios.in" style="color:#7E22CE">pureflowstudios.in</a></p></div>`,
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

  return json(res, 200, { id: ev.id, meetLink: ev.meetLink });
}
