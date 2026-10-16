# Resend setup for the booking emails (beginner guide)

Goal: when someone books a call on pureflowstudios.in/customsoftware, Resend sends
(1) the client a confirmation with the Google Meet link and (2) you the lead details.

## 1. Which domain to connect

Connect **pureflowstudios.in** (the root domain). That lets emails come from addresses like
`contact@pureflowstudios.in` or `bookings@pureflowstudios.in`. Do not use a Gmail address as the
sender: Resend can only send from a domain you verify.

Tip: Resend lets you verify a subdomain instead (for example `send.pureflowstudios.in`). The
root domain is simpler and lets the "from" address match your real inbox, so use the root.

## 2. Create the account and add the domain

1. Go to https://resend.com and sign up (or log in) with aviral@pureflowstudios.in.
2. Left menu → **Domains** → **Add Domain**.
3. Type `pureflowstudios.in`, pick the region closest to your clients (`Mumbai (ap-south-1)` for
   India; `us-east-1` is fine for the US/UK/AU too) and click **Add**.
4. Resend now shows 3 DNS records to add. Keep this page open.

## 3. Add the DNS records (where your domain is managed)

Open the DNS panel of the place you bought pureflowstudios.in (GoDaddy, Namecheap, Hostinger,
Cloudflare, …) and add the records exactly as Resend shows them. They are usually:

| Type | Name / host (as shown) | Value | Purpose |
|---|---|---|---|
| TXT | `resend._domainkey` | long `p=MIG…` string | DKIM (signs the mail) |
| MX | `send` | `feedback-smtp.<region>.amazonses.com`, priority 10 | bounce handling |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | SPF |

Notes:
- If the panel asks for the full host, use `resend._domainkey.pureflowstudios.in` and
  `send.pureflowstudios.in`. Most panels want only the part before the domain.
- Do not delete existing records (your website A/CNAME and Google Workspace MX stay).
- Add a DMARC record too if you do not have one: TXT at `_dmarc` with value
  `v=DMARC1; p=none; rua=mailto:aviral@pureflowstudios.in`. Not required by Resend, but it
  improves inbox placement.

## 4. Verify

Back in Resend → Domains → **Verify DNS Records**. It can take from a few minutes to a few hours.
Each record turns green when found. All three green = ready to send.

## 5. Create the API key

1. Left menu → **API Keys** → **Create API Key**.
2. Name: `pureflow-website`. Permission: **Sending access**. Domain: `pureflowstudios.in`.
3. Copy the key once (it is only shown once). Store it in Vercel, never in the code:
   Vercel → PureFlow project → Settings → Environment Variables → `RESEND_API_KEY` →
   Production + Preview → Save → redeploy.

## 6. Free plan limits (check resend.com/pricing)

- 3,000 emails per month, maximum 100 per day.
- 1 verified domain, 1 team member.
- When a limit is hit, sending pauses until the next day/month (nothing is billed).
- Pro ($20/month) removes the daily cap and gives 50,000 per month.

Each booking uses 2 emails (client + you), so the free plan covers roughly 50 bookings a day.

## 7. What the website needs after that (the code side)

A small server function in the main site (Vercel) that the booking form calls on confirm:
create the Google Calendar event with a Meet link, send the two emails through Resend,
save the lead in Supabase. Sender address to use: `bookings@pureflowstudios.in` with
reply-to `contact@pureflowstudios.in`.
