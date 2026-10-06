#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// shoot_widths.mjs — verification screenshots of one of OUR pages (usually the
// local dev server) at the four widths the playbook checks: 1440, 1024, 820,
// 390. Scrolls slowly so lazy images load, waits for every image, uses reduced
// motion so nothing is caught mid-fade, and reports horizontal overflow.
//
// Writes <out>/<width>-<n>.jpg (the page cut into 2400px-tall slices) and
// <out>/zoom-*.png (a tap-to-zoom check on the phone width, if the page has one).
//
// Usage:
//   node scripts/showcase/shoot_widths.mjs http://localhost:3000/work/<slug> [--out dir]
//   (default out: ~/Downloads/<slug>-check)
// ─────────────────────────────────────────────────────────────────────────────
import { mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium, devices } from 'playwright-core';

const args = process.argv.slice(2);
const oi = args.indexOf('--out');
const outArg = oi === -1 ? null : args.splice(oi, 2)[1];
const url = args[0];
if (!url) {
  console.error('Usage: node scripts/showcase/shoot_widths.mjs http://localhost:3000/work/<slug> [--out dir]');
  process.exit(1);
}
const slug = new URL(url).pathname.split('/').filter(Boolean).pop() || 'home';
const OUT = outArg ?? join(homedir(), 'Downloads', `${slug}-check`);
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
for (const [w, h] of [
  [1440, 900],
  [1024, 768],
  [820, 1180],
  [390, 844],
]) {
  const ctx = await browser.newContext(
    w === 390
      ? { ...devices['iPhone 13'], viewport: { width: w, height: h }, deviceScaleFactor: 1 }
      : { viewport: { width: w, height: h }, deviceScaleFactor: 1 }
  );
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
  const { height, overflow, broken } = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  }));
  const slices = Math.ceil(height / 2400);
  for (let i = 0; i < slices; i++) {
    await page.screenshot({
      path: join(OUT, `${w}-${i + 1}.jpg`),
      fullPage: true,
      quality: 80,
      clip: { x: 0, y: i * 2400, width: w, height: Math.min(2400, height - i * 2400) },
    });
  }
  console.log(`${w}px: ${slices} slices, height ${height}, horizontal overflow ${overflow}px${broken.length ? `, BROKEN IMAGES: ${broken.join(', ')}` : ''}`);

  if (w === 390) {
    const zoom = page.locator('button[aria-label^="Enlarge"]').first();
    if (await zoom.count()) {
      await zoom.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(OUT, 'zoom-1-before.png') });
      await zoom.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(OUT, 'zoom-2-open.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      console.log(`tap-to-zoom: ${(await page.locator('[role=dialog]').count()) === 0 ? 'opens and closes ✓' : 'did not close ✗'}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\nSaved to ${OUT}`);
