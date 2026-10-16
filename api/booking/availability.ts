// GET /api/booking/availability?from=<ISO>&days=14
// Open 30-minute slots inside the call windows, minus whatever is already on the
// PureFlow Google Calendar. Called by the /customsoftware booking flow.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { HORIZON_DAYS, buildSlots, busyRanges, googleConfigured, googleToken, json, overlaps } from './_lib';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('access-control-allow-origin', '*');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'GET') return json(res, 405, { error: 'method_not_allowed' });
  try {
    const url = new URL(req.url ?? '/', 'http://x');
    const fromRaw = url.searchParams.get('from');
    const from = fromRaw && !Number.isNaN(Date.parse(fromRaw)) ? new Date(Math.max(Date.now(), Date.parse(fromRaw))) : new Date();
    const days = Math.min(HORIZON_DAYS, Math.max(1, Number(url.searchParams.get('days') || HORIZON_DAYS)));
    const candidates = buildSlots(from, days);
    if (!candidates.length) return json(res, 200, { slots: [] });
    if (!googleConfigured()) return json(res, 200, { slots: candidates, degraded: true });
    const token = await googleToken();
    const busy = await busyRanges(token, new Date(candidates[0].start), new Date(candidates[candidates.length - 1].end));
    const slots = candidates.filter((s) => !overlaps(s, busy));
    return json(res, 200, { slots });
  } catch (e) {
    console.error('[availability]', e);
    return json(res, 503, { error: 'calendar_unavailable' });
  }
}
