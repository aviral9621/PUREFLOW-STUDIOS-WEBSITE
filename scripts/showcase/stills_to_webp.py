#!/usr/bin/env python3
"""stills_to_webp.py — step A4 of docs/website-case-study-guide.md.

Turns the captures from capture_site.mjs into the WebP files the website page
uses before (and, for phones, after) the generated images exist:

  <page>-desktop.png → <out>/<page>-desktop.webp   1600×1000  (interim page image, browser frame)
  <page>-mobile.png  → <out>/<page>-mobile.webp     585×1266  ("Every SCREEN" phones)

Usage:
  python3 scripts/showcase/stills_to_webp.py ~/Downloads/<site>-website-stills public/work/<slug> home courses contact
  (no page names = every *-desktop.png / *-mobile.png in the folder, except the -full ones)
"""
import os
import sys

from PIL import Image

if len(sys.argv) < 3:
    sys.exit(__doc__)
src, out, *names = sys.argv[1:]
src = os.path.expanduser(src)
os.makedirs(out, exist_ok=True)
if not names:
    names = sorted({f.rsplit('-', 1)[0] for f in os.listdir(src) if f.endswith(('-desktop.png', '-mobile.png'))})

for n in names:
    for tag, size in (('desktop', (1600, 1000)), ('mobile', (585, 1266))):
        f = os.path.join(src, f'{n}-{tag}.png')
        if not os.path.exists(f):
            print(f'  skip {n}-{tag} (no capture)')
            continue
        im = Image.open(f).convert('RGB').resize(size, Image.LANCZOS)
        dst = os.path.join(out, f'{n}-{tag}.webp')
        im.save(dst, 'WEBP', quality=80, method=6)
        print(f'{dst}  {size[0]}×{size[1]}  ({os.path.getsize(dst) // 1024} KB)')
