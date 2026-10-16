// Local runner for the booking functions (api/booking/*.ts) so they can be tested without
// Vercel:  node scripts/booking-local.mjs [envfile]   (bundles the TS with esbuild first)
// Loads KEY=value lines from the env file (default ~/Downloads/pureflow-vercel.env or ./.env)
// and serves the handlers on http://localhost:4400/api/booking/...
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
const envFile = process.argv[2] || (fs.existsSync(os.homedir() + '/Downloads/pureflow-vercel.env') ? os.homedir() + '/Downloads/pureflow-vercel.env' : '.env');
for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
import { build } from 'esbuild';
import path from 'node:path';
const out = path.join(os.tmpdir(), 'pf-booking-fns');
await build({ entryPoints: ['api/booking/availability.ts', 'api/booking/book.ts', 'api/booking/lead.ts', 'api/booking/reschedule.ts'], bundle: true, platform: 'node', format: 'esm', outdir: out, logLevel: 'error', target: 'node20' });
const availability = (await import(path.join(out, 'availability.js') + '?t=' + Date.now())).default;
const book = (await import(path.join(out, 'book.js') + '?t=' + Date.now())).default;
const lead = (await import(path.join(out, 'lead.js') + '?t=' + Date.now())).default;
const reschedule = (await import(path.join(out, 'reschedule.js') + '?t=' + Date.now())).default;
http.createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  if (p === '/api/booking/availability') return availability(req, res);
  if (p === '/api/booking/book') return book(req, res);
  if (p === '/api/booking/lead') return lead(req, res);
  if (p === '/api/booking/reschedule') return reschedule(req, res);
  res.statusCode = 404; res.end('not found');
}).listen(4400, () => console.log('booking functions on http://localhost:4400 (env: ' + envFile + ')'));
