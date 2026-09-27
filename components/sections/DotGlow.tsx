import React, { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DotGlow — the light canvas behind the homepage work cards: a faint dot grid
// with a soft pink/violet spotlight that follows the cursor (and lights the
// dots under it). On touch screens, where there is no cursor, the spotlight
// drifts slowly on its own; with reduced motion it rests in place.
//
// Performance: everything that moves is a transform on its own layer, so a
// pointer move never repaints anything. The lit dots are a viewport-sized
// dot layer inside a masked, moving window, counter-translated so the dots
// stay aligned with the faint grid underneath.
//
// It is `position: fixed` and sits with the section's tone layer (z-[15], below
// the section's content at z-[16]); `active` fades it in only while the page
// is in its light tone.
// ─────────────────────────────────────────────────────────────────────────────

const GRID = 22; // px between dots
const EASE = 0.12; // how quickly the spotlight catches up with the cursor

interface Props {
  active: boolean;
  reduceMotion: boolean;
}

export const DotGlow: React.FC<Props> = ({ active, reduceMotion }) => {
  const winRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const win = winRef.current;
    const inner = innerRef.current;
    const blob = blobRef.current;
    if (!win || !inner || !blob) return;

    const size = () => Math.min(620, Math.max(320, window.innerWidth * 0.55));
    let s = size();
    const place = (x: number, y: number) => {
      const t = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0)`;
      win.style.transform = t;
      blob.style.transform = t;
      inner.style.transform = `translate3d(${s / 2 - x}px, ${s / 2 - y}px, 0)`;
    };
    const applySize = () => {
      s = size();
      for (const el of [win, blob]) {
        el.style.width = `${s}px`;
        el.style.height = `${s}px`;
      }
    };
    applySize();

    const cur = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
    const target = { ...cur };
    place(cur.x, cur.y);
    if (!active || reduceMotion) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let raf = 0;
    let lastMove = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      // No cursor (touch), or the cursor has been still for a while: drift.
      if (!finePointer || now - lastMove > 4000) {
        const t = (now - t0) / 1000;
        target.x = window.innerWidth * (0.5 + 0.28 * Math.sin(t * 0.23));
        target.y = window.innerHeight * (0.5 + 0.22 * Math.sin(t * 0.31 + 1.2));
      }
      cur.x += (target.x - cur.x) * EASE;
      cur.y += (target.y - cur.y) * EASE;
      place(cur.x, cur.y);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === 'visible') raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', applySize);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', applySize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active, reduceMotion]);

  const dots = (color: string) => ({
    backgroundImage: `radial-gradient(circle, ${color} 1.1px, transparent 1.7px)`,
    backgroundSize: `${GRID}px ${GRID}px`,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[15] overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Faint grid across the whole canvas. */}
      <div className="absolute inset-0" style={{ ...dots('rgba(13,11,18,0.075)'), backgroundPosition: '0 0' }} />

      {/* Soft coloured bloom under the cursor. */}
      <div
        ref={blobRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{
          borderRadius: '9999px',
          background:
            'radial-gradient(circle, rgba(255,47,134,0.16) 0%, rgba(168,85,247,0.12) 38%, transparent 70%)',
        }}
      />

      {/* Lit dots: a round window that moves with the cursor, showing a
          brighter copy of the grid (counter-translated to stay aligned). */}
      <div
        ref={winRef}
        className="absolute left-0 top-0 overflow-hidden will-change-transform"
        style={{
          borderRadius: '9999px',
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 35%, transparent 70%)',
          maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 35%, transparent 70%)',
        }}
      >
        <div
          ref={innerRef}
          className="absolute left-0 top-0 h-[100vh] w-[100vw] will-change-transform"
          style={{ ...dots('rgba(192,38,211,0.55)'), backgroundPosition: '0 0' }}
        />
      </div>
    </div>
  );
};
