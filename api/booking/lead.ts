// POST /api/booking/lead — the visitor finished "Your details" and pressed
// "Choose a time". Saved straight away as an international lead, so someone who
// never picks a slot is still followed up. Returns { id, key }: the booking
// sends them back to update this same row. Never blocks the visitor: any failure
// returns 200 with id null and the booking still works.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { intlUpsert, isEmail, json, readJson } from './_lib.js';

type Payload = {
  lead?: { id?: string | null; key?: string | null };
  answers?: { type?: string; builds?: string[]; budget?: string; start?: string };
  details: { name: string; email: string; company?: string; country?: string; phone?: string; dial?: string; website?: string; problem?: string; consent: boolean; updates?: boolean };
  timeZone?: string;
  page?: string; utm?: Record<string, string>; referrer?: string;
};

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  let p: Payload;
  try { p = (await readJson(req)) as Payload; } catch { return json(res, 400, { error: 'bad_json' }); }
  const d = p?.details;
  // Consent is ticked on the details step before this is ever called; without it, nothing is stored.
  if (!d || !d.name?.trim() || !isEmail(d.email ?? '') || !d.consent) return json(res, 400, { error: 'invalid_details' });

  const r = await intlUpsert({
    id: p.lead?.id ?? null, key: p.lead?.key ?? null,
    name: d.name.trim(), email: d.email.trim().toLowerCase(),
    company: d.company?.trim(), website: d.website?.trim(), country: d.country,
    phone: [d.dial, d.phone].filter(Boolean).join(' ').trim() || undefined,
    business_type: p.answers?.type, builds: p.answers?.builds ?? [], budget: p.answers?.budget, start_timeline: p.answers?.start,
    problem: d.problem?.trim(), updates_opt_in: !!d.updates,
    client_timezone: p.timeZone,
    page: p.page, utm: p.utm, referrer: p.referrer,
    user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
  });
  if (r.ok === false) {
    if (!r.missing) console.error('[lead]', r.code, r.message);
    return json(res, 200, { id: null, key: null });
  }
  return json(res, 200, { id: r.id, key: r.key });
}
