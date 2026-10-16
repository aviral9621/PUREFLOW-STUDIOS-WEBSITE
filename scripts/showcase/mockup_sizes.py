#!/usr/bin/env python3
"""Smaller copies of every homepage card mockup, for the cards' srcset.

For each `mockup: '/work/<name>.webp'` in lib/workCards.ts it writes
public/work/<name>-640.webp and public/work/<name>-1080.webp next to the original
(phones download ~35 KB instead of ~125 KB). Run it after adding or replacing a
mockup; `npm run build` warns about any mockup without its copies.

    python3 scripts/showcase/mockup_sizes.py
"""
import os, re, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
WIDTHS = (640, 1080)


def mockups():
    src = open(os.path.join(ROOT, 'lib', 'workCards.ts'), encoding='utf-8').read()
    return sorted(set(re.findall(r"mockup:\s*'(/work/[^']+\.webp)'", src)))


def main():
    for path in mockups():
        full = os.path.join(ROOT, 'public', path.lstrip('/'))
        if not os.path.exists(full):
            print(f'missing {path}', file=sys.stderr)
            continue
        img = Image.open(full)
        img.load()
        for w in WIDTHS:
            out = full[:-5] + f'-{w}.webp'
            h = round(img.height * w / img.width)
            img.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
            print(f'{os.path.relpath(out, ROOT)}  {w}x{h}  {os.path.getsize(out) // 1024} KB')


if __name__ == '__main__':
    main()
