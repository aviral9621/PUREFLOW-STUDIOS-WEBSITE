#!/usr/bin/env python3
"""Cut the cards out of a generated bento image into equal-size, transparent-
cornered WebP cards that sit directly on the dark site.

    python3 scripts/showcase/find_cards.py ~/Downloads/bento.png > boxes.json
    python3 scripts/showcase/cut_cards.py ~/Downloads/bento.png boxes.json \\
        public/work/<client> --names students,leads,fees,branches,courses,lab,certs \\
        --prefix crm-card- --size 600x470,410x380

Every card in a row comes out the SAME pixel size: each card is cropped just
inside its grey border, then centred on a white canvas of the row's size (a
card bigger than the canvas is scaled down to fit, never up). Corners are
rounded (transparent) so there's no white box behind the card on the page.

Options
  --names    comma list, one per card in reading order (default 1,2,3,…)
  --prefix   filename prefix (default "card-")
  --size     canvas per row, "WxH" each, comma-separated; one value = all rows.
             Default per row: widest "normal" card + 40px by tallest card + 40px
             (a card wider than 1.25× the row median counts as an outlier and
             is scaled down to fit instead of stretching the whole row).
  --erase    NAME:x0,y0,x1,y1 (repeatable) — rub out a handwritten note that
             was clipped by the card edge, in that card's own pixel coords,
             and fill in the background behind it.
  --radius   corner radius in px (default 20)
Prints the width/height of every card for lib/showcases.ts.
"""
import argparse
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

INSET = 3   # crop this far inside the border so no grey line survives


def flatten(im):
    """Near-white (≥247 on every channel) → pure white, so pads blend in."""
    a = np.array(im.convert('RGB')).astype(np.int16)
    a[a.min(axis=2) >= 247] = 255
    return Image.fromarray(a.astype(np.uint8))


def erase(im, rect):
    """Remove red marker ink and dark handwriting inside `rect`, then fill the
    hole by diffusing the surrounding colours in (fine for flat UI backgrounds)."""
    x0, y0, x1, y1 = rect
    a = np.array(im.convert('RGB')).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ink = ((r > 130) & (r - g > 55) & (r - b > 40)) | (a.max(axis=2) < 120)
    region = np.zeros(ink.shape, bool)
    region[max(0, y0):y1, max(0, x0):x1] = True
    hole = ndimage.binary_dilation(ink & region, iterations=3) & region
    known = ~hole
    for _ in range(120):
        if known.all():
            break
        acc = np.zeros_like(a)
        cnt = np.zeros(hole.shape)
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)]:
            k = np.roll(np.roll(known, dy, 0), dx, 1)
            acc += np.roll(np.roll(a, dy, 0), dx, 1) * k[..., None]
            cnt += k
        fill = ~known & (cnt > 0)
        a[fill] = acc[fill] / cnt[fill][:, None]
        known |= fill
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def rounded(card, radius):
    card = card.convert('RGBA')
    k = 4
    m = Image.new('L', (card.width * k, card.height * k), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, card.width * k - 1, card.height * k - 1), radius=radius * k, fill=255)
    card.putalpha(m.resize(card.size, Image.LANCZOS))
    return card


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('image')
    ap.add_argument('boxes', help='JSON from find_cards.py (a file, or "-" for stdin)')
    ap.add_argument('outdir')
    ap.add_argument('--names')
    ap.add_argument('--prefix', default='card-')
    ap.add_argument('--size')
    ap.add_argument('--erase', action='append', default=[])
    ap.add_argument('--radius', type=int, default=20)
    o = ap.parse_args()

    rows = json.load(sys.stdin if o.boxes == '-' else open(o.boxes))
    src = flatten(Image.open(os.path.expanduser(o.image)))
    n = sum(map(len, rows))
    names = o.names.split(',') if o.names else [str(i + 1) for i in range(n)]
    if len(names) != n:
        sys.exit(f'{n} cards found but {len(names)} names given')
    erases = {}
    for e in o.erase:
        name, r = e.split(':')
        erases.setdefault(name, []).append([int(v) for v in r.split(',')])
    sizes = [tuple(int(v) for v in s.split('x')) for s in o.size.split(',')] if o.size else None
    os.makedirs(o.outdir, exist_ok=True)

    i = 0
    for ri, row in enumerate(rows):
        crops = []
        for (x0, y0, x1, y1) in row:
            c = src.crop((x0 + INSET, y0 + INSET, x1 - INSET + 1, y1 - INSET + 1))
            for r in erases.get(names[i + len(crops)], []):
                c = erase(c, r)
            crops.append(c)
        if sizes:
            W, H = sizes[ri] if len(sizes) > 1 else sizes[0]
        else:
            med = float(np.median([c.width for c in crops]))
            W = max(c.width for c in crops if c.width <= 1.25 * med) + 40
            H = max(c.height for c in crops) + 40
        for c in crops:
            s = min(1.0, W / c.width, H / c.height)
            if s < 1:
                c = c.resize((round(c.width * s), round(c.height * s)), Image.LANCZOS)
            canvas = Image.new('RGB', (W, H), (255, 255, 255))
            canvas.paste(c, ((W - c.width) // 2, (H - c.height) // 2))
            path = os.path.join(o.outdir, f'{o.prefix}{names[i]}.webp')
            rounded(canvas, o.radius).save(path, 'WEBP', quality=90, method=6)
            print(f"{path}  width: {W}, height: {H}" + (f'  (scaled {s:.2f})' if s < 1 else ''))
            i += 1


if __name__ == '__main__':
    main()
