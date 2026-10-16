// Local runner for the booking functions (api/booking/*.ts) so they can be tested without
// Vercel:  node --experimental-strip-types scripts/booking-local.mjs [envfile]
// Loads KEY=value lines from the env file (default ~/Downloads/pureflow-vercel.env or ./.env)
// and serves the handlers on http://localhost:4400/api/booking/...
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
const envFile = process.argv[2] || (fs.existsSync(os.homedir() + '/Downloads/pureflow-vercel.env') ? os.homedir() + '/Downloads/pureflow-vercel.env' : '.env');
for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
const availability = (await import('../api/booking/availability.ts')).default;
const book = (await import('../api/booking/book.ts')).default;
http.createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  if (p === '/api/booking/availability') return availability(req, res);
  if (p === '/api/booking/book') return book(req, res);
  res.statusCode = 404; res.end('not found');
}).listen(4400, () => console.log('booking functions on http://localhost:4400 (env: ' + envFile + ')'));
