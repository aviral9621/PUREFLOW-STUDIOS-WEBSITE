#!/usr/bin/env python3
"""Find the cards in a generated bento image (white cards with thin grey borders
on a white background).

    python3 scripts/showcase/find_cards.py ~/Downloads/bento.png

Prints one box per card as JSON (x0, y0, x1, y1, grouped into rows, left to
right) and writes <image>.cards.png with the boxes drawn in red, so you can
check them by eye before cutting. Feed the JSON to cut_cards.py.

How: pixels darker than the card borders are "walls"; the page background is
what a flood fill from the image edges can reach; each card is a large region
the fill could NOT reach. A box that swallowed two cards (a handwritten note
bridging the gap) is split at the white gutter inside it. Always check the red
overlay; if a box is still wrong, write the boxes by hand from it.
"""
import json
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


def _gap(walls, x0, y0, x1, y1, axis):
    """Where a box that swallowed two cards should be split. Inside a card its
    border line runs along both edges; in the gap between two cards it doesn't.
    So scan the box's two edges (left/right strips for a horizontal cut,
    top/bottom strips for a vertical one) for the longest run where neither
    edge has a border, in the middle 60% of the box. Returns (start, end) of
    that gap, relative to the box, or None."""
    if axis == 0:
        edge = walls[y0:y1, x0:x0 + 4].any(axis=1) | walls[y0:y1, x1 - 3:x1 + 1].any(axis=1)
    else:
        edge = walls[y0:y0 + 4, x0:x1].any(axis=0) | walls[y1 - 3:y1 + 1, x0:x1].any(axis=0)
    n = len(edge)
    best, start = None, None
    for i in range(int(n * 0.2), int(n * 0.8) + 1):
        open_ = i < int(n * 0.8) and not edge[i]
        if open_ and start is None:
            start = i
        elif not open_ and start is not None:
            if best is None or i - start > best[1] - best[0]:
                best = (start, i)
            start = None
    return best if best and best[1] - best[0] >= 4 else None


def _snap(walls, b):
    """Tighten a box onto the card's own border lines: the outermost rows and
    columns that are mostly wall. Drops a handwritten note that sat outside the
    card but touched it."""
    x0, y0, x1, y1 = b
    sub = walls[y0:y1 + 1, x0:x1 + 1]
    rows = np.where(sub.mean(axis=1) >= 0.6)[0]
    cols = np.where(sub.mean(axis=0) >= 0.6)[0]
    if len(rows) >= 2:
        y0, y1 = y0 + int(rows[0]), y0 + int(rows[-1])
    if len(cols) >= 2:
        x0, x1 = x0 + int(cols[0]), x0 + int(cols[-1])
    return [x0, y0, x1, y1]


def find(path, thr=245, min_area=0.02):
    im = Image.open(path).convert('RGB')
    a = np.array(im).astype(int)
    walls = a.min(axis=2) < thr               # card borders are ~238–242; soft shadows are lighter
    lab, _ = ndimage.label(~walls)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    inside, _ = ndimage.label(~np.isin(lab, list(edge)))
    H, W = walls.shape
    boxes = []
    for sl in ndimage.find_objects(inside):
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if (x1 - x0) * (y1 - y0) >= min_area * W * H:
            boxes.append([int(x0), int(y0), int(x1 - 1), int(y1 - 1)])
    # Drop panels nested inside a card.
    boxes = [b for b in boxes if not any(o is not b and o[0] <= b[0] and o[1] <= b[1] and o[2] >= b[2] and o[3] >= b[3] for o in boxes)]
    # Split boxes that swallowed two cards (a note bridged the gap between them).
    for _ in range(4):
        med_w = float(np.median([b[2] - b[0] for b in boxes]))
        med_h = float(np.median([b[3] - b[1] for b in boxes]))
        out = []
        for b in boxes:
            x0, y0, x1, y1 = b
            # Cut at the middle of the gap; _snap then pulls each half onto its
            # own border (the edge strips go blank early at rounded corners).
            if y1 - y0 > 1.6 * med_h and (g := _gap(walls, x0, y0, x1, y1, 0)):
                m = y0 + (g[0] + g[1]) // 2
                out += [[x0, y0, x1, m], [x0, m + 1, x1, y1]]
            elif x1 - x0 > 1.6 * med_w and (g := _gap(walls, x0, y0, x1, y1, 1)):
                m = x0 + (g[0] + g[1]) // 2
                out += [[x0, y0, m, y1], [m + 1, y0, x1, y1]]
            else:
                out.append(b)
        if len(out) == len(boxes):
            break
        boxes = out
    boxes = [_snap(walls, b) for b in boxes]
    # Group into rows by vertical overlap, then sort each row left to right.
    boxes.sort(key=lambda b: b[1])
    rows = []
    for b in boxes:
        for r in rows:
            if min(b[3], r[0][3]) - max(b[1], r[0][1]) > 0.5 * (b[3] - b[1]):
                r.append(b)
                break
        else:
            rows.append([b])
    rows = [sorted(r, key=lambda b: b[0]) for r in rows]
    return im, rows


if __name__ == '__main__':
    path = sys.argv[1]
    im, rows = find(path)
    d = ImageDraw.Draw(im)
    for r in rows:
        widths = [b[2] - b[0] for b in r]
        for b in r:
            d.rectangle(b, outline=(255, 0, 0), width=3)
            if len(r) > 1 and (b[2] - b[0]) > 1.6 * sorted(widths)[len(widths) // 2]:
                print(f'WARNING: box {b} is much wider than its row-mates; two cards may have merged', file=sys.stderr)
    out = path.rsplit('.', 1)[0] + '.cards.png'
    im.save(out)
    print(json.dumps(rows))
    print(f'{sum(map(len, rows))} cards in {len(rows)} rows; overlay: {out}', file=sys.stderr)
