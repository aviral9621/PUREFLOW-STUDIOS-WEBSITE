#!/usr/bin/env python3
"""Turn a client logo into the solid-black version used on the site's white cards.

    python3 scripts/showcase/black_logo.py logo-original.png public/work/<slug>-logo.webp

Every coloured, grey or gold part becomes black; near-neutral whites inside the
logo (knock-outs, e.g. the white "Un" in the UnSkills circle) stay white; the
transparent background stays transparent. Output is 160px tall, trimmed.
Prints width/height for lib/showcases.ts / WorkStack.tsx.

The logo MUST have a transparent background. A JPG/PNG on a white or coloured
box comes out as a black rectangle: get a transparent PNG/SVG first.
"""
import sys

import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
h = int(sys.argv[3]) if len(sys.argv) > 3 else 160
lg = Image.open(src).convert('RGBA')
if lg.getextrema()[3][0] == 255:
    sys.exit('This logo has no transparent background; get a transparent PNG/SVG first.')
lg = lg.crop(lg.getbbox())
lg = lg.resize((round(lg.width * h / lg.height), h), Image.LANCZOS)
a = np.array(lg).astype(np.float32)
white = np.clip((a[..., :3].min(axis=2) - 185) / 40, 0, 1)   # smooth ramp keeps edges clean
v = (white * 255)[..., None].repeat(3, axis=2)
Image.fromarray(np.dstack([v, a[..., 3]]).astype(np.uint8)).save(out, 'WEBP', quality=92, method=6)
print(f'{out}  width: {lg.width}, height: {lg.height}')
