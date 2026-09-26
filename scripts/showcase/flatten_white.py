#!/usr/bin/env python3
"""Prepare a whole generated image (a mockup, hero or design-system sheet) for
the site: near-white background → pure white, saved as WebP.

    python3 scripts/showcase/flatten_white.py ~/Downloads/mockup.png public/work/<slug>-mockup.webp

Prints width/height for the data file. Aim for ≤ 150 KB; never upscale.
"""
import os
import sys

import numpy as np
from PIL import Image

src, out = os.path.expanduser(sys.argv[1]), sys.argv[2]
q = int(sys.argv[3]) if len(sys.argv) > 3 else 86
a = np.array(Image.open(src).convert('RGB')).astype(np.int16)
a[a.min(axis=2) >= 247] = 255
Image.fromarray(a.astype(np.uint8)).save(out, 'WEBP', quality=q, method=6)
w, h = Image.open(out).size
print(f'{out}  width: {w}, height: {h}  ({os.path.getsize(out) // 1024} KB)')
