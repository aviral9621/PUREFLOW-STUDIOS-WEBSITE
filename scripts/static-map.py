#!/usr/bin/env python3
"""Build the two still map images for the homepage "Find us on the MAP" section
(components/LocationMap.tsx) from OpenStreetMap tiles:

    public/map/office-overview.webp   India, office marked (zoom 5)
    public/map/office-closeup.webp    the office neighbourhood (zoom 15)

Why still images: the Google Maps JavaScript API pulled third-party scripts (and a
JSONP endpoint) onto every homepage visit, which the Content-Security-Policy had to
allow. These are plain images from our own domain instead.

Map data © OpenStreetMap contributors (ODbL); the section shows the credit.
Run again only if the office moves:  python3 scripts/static-map.py
(about 40 tiles, fetched politely, per https://operations.osmfoundation.org/policies/tiles/)
"""
import io, json, math, os, time, urllib.request
from PIL import Image

OFFICE = (26.8904999, 80.859048)  # constants.ts OFFICE_LOCATION
W, H = 1400, 600                  # logical px of the map box (it covers 1216×520 at most)
VIEWS = {
    # name: (center lat, center lng, zoom)
    'office-overview': (24.2, 80.2, 5),
    # office a little left of centre, clear of the address card on the right (desktop)
    'office-closeup': (OFFICE[0], OFFICE[1] + 0.006, 15),
}
UA = 'PureFlowStudios-static-map/1.0 (+https://www.pureflowstudios.in; contact@pureflowstudios.in)'
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'map')


def world_px(lat, lng, z):
    s = 256 * 2 ** z
    x = (lng + 180) / 360 * s
    r = math.radians(lat)
    y = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * s
    return x, y


def tile(z, x, y):
    req = urllib.request.Request(f'https://tile.openstreetmap.org/{z}/{x}/{y}.png', headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    time.sleep(0.15)
    return Image.open(io.BytesIO(data)).convert('RGB')


def render(lat, lng, z):
    cx, cy = world_px(lat, lng, z)
    left, top = cx - W / 2, cy - H / 2
    tx0, ty0 = int(left // 256), int(top // 256)
    tx1, ty1 = int((left + W) // 256), int((top + H) // 256)
    canvas = Image.new('RGB', ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            canvas.paste(tile(z, tx % 2 ** z, ty), ((tx - tx0) * 256, (ty - ty0) * 256))
    ox, oy = left - tx0 * 256, top - ty0 * 256
    img = canvas.crop((round(ox), round(oy), round(ox) + W, round(oy) + H))
    # where the office sits in this image, as a fraction (the marker is placed with it)
    px, py = world_px(OFFICE[0], OFFICE[1], z)
    return img, ((px - left) / W, (py - top) / H)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    marks = {}
    for name, (lat, lng, z) in VIEWS.items():
        img, (fx, fy) = render(lat, lng, z)
        img.save(os.path.join(OUT, f'{name}.webp'), 'WEBP', quality=80, method=6)
        marks[name] = {'x': round(fx * 100, 2), 'y': round(fy * 100, 2)}
        print(name, img.size, f'office at {fx:.1%} × {fy:.1%}')
    print(json.dumps(marks))
