# Booking backend for /customsoftware

The booking modal on pureflowstudios.in/customsoftware (source: `pureflow-intl-landing`) talks
to two Vercel functions in this repo:

| Endpoint | What it does |
|---|---|
| `GET /api/booking/availability?from=&days=` | 30-min slots in the call windows (Mon–Fri 14:00–17:00 and 20:00–23:00 IST, 4 h notice, 14 days) minus busy events on the PureFlow Google Calendar |
| `POST /api/booking/book` | re-checks the slot, creates the Google Calendar event **with a Google Meet link** and the client as guest (Google emails the invite), saves the lead in Supabase `website_bookings` (unique slot guard), emails the client and `BOOKING_NOTIFY_EMAIL` through Resend |

Code: `api/booking/_lib.ts` (helpers), `availability.ts`, `book.ts`. Landing side: `lib/pf/scheduling.ts`.

## Environment variables (Vercel → Settings → Environment Variables)

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`,
`BOOKING_TIMEZONE`, `RESEND_API_KEY`, `BOOKING_FROM`, `BOOKING_REPLY_TO`, `BOOKING_NOTIFY_EMAIL`.
Template: `.env.example`. Google project: **PureFlow Website** (`pureflow-website`) on
pureflowdesignsz@gmail.com, OAuth client "PureFlow website booking", consent app name "PureFlow
Studios", scope `calendar.events`. Resend domain: pureflowstudios.in.

Without `RESEND_API_KEY` the emails are skipped (the calendar invite from Google still goes out).
Without the Google variables the endpoints return 503 and the modal shows "We couldn't load the
calendar".

## Local testing

```bash
node --experimental-strip-types scripts/booking-local.mjs   # serves the functions on :4400
```
In `pureflow-intl-landing/.env.development.local` set `NEXT_PUBLIC_PF_API_BASE=http://localhost:4400`
(dev only; `next build` ignores that file). `?mock=noslots|taken|error|slow` on the page still
exercises the UI without the backend.

## Re-authorising Google (only if the refresh token is revoked)

Add `http://localhost:8765/callback` to the client's redirect URIs (already there), run a local
listener that exchanges the code for tokens with the client secret, and open the consent URL
for scope `https://www.googleapis.com/auth/calendar.events` with `access_type=offline&prompt=consent`.
