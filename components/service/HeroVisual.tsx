import React from 'react';
import { useReducedMotion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// HeroVisual — the abstract mark beside the service headline.
//
// Deliberately not a product screenshot. A dashboard mockup in a hero makes a
// promise about one specific screen; this says "considered engineering" without
// claiming anything, and it stays legible at every width.
//
// Built from CSS and one SVG, so it costs nothing to load and carries no raster
// artefacts on a dark background. The marker rides the orbit as an SVG motion
// path rather than a CSS rotation, which is the only way it tracks a squashed,
// rotated ellipse exactly instead of approximately.
// ─────────────────────────────────────────────────────────────────────────────

/** The orbit, as a path so it can be both stroked and travelled along. */
const ORBIT = 'M 14,100 a 86,34 0 1,0 172,0 a 86,34 0 1,0 -172,0';

export const HeroVisual: React.FC<{ label?: string }> = ({ label = 'Ideas into impact' }) => {
  const reduced = useReducedMotion();

  return (
    <div className="svc-visual relative aspect-square w-full max-w-[380px] lg:max-w-[460px]" aria-hidden="true">
      {/* Grid texture, masked so it dissolves before the edges */}
      <div className="svc-visual__grid absolute inset-0 rounded-full" />

      {/* The sphere: lit at the top-left, falling away into the background */}
      <div className="svc-visual__sphere absolute inset-[12%] rounded-full" />

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="svcOrbit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#A855F7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
          <filter id="svcMarkerGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rotated once, so the ring and the marker share a coordinate space */}
        <g transform="rotate(-28 100 100)">
          <path id="svcOrbitPath" d={ORBIT} fill="none" stroke="url(#svcOrbit)" strokeWidth="0.9" />

          <circle r="2.4" fill="#F9A8D4" filter="url(#svcMarkerGlow)" cx={reduced ? 186 : undefined} cy={reduced ? 100 : undefined}>
            {!reduced && (
              <animateMotion dur="16s" repeatCount="indefinite" path={ORBIT} />
            )}
          </circle>
        </g>
      </svg>

      {/* The only text in the composition */}
      <span className="svc-visual__label">
        <span className="svc-visual__dot" />
        {label}
      </span>
    </div>
  );
};
