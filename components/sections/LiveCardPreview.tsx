import React from 'react';
import { Wifi } from 'lucide-react';
import { useFitScale } from '../../hooks/useFitScale';
import { useDeviceEmbedState } from '../../hooks/useDeviceEmbedState';

// ─────────────────────────────────────────────────────────────────────────────
// LiveCardPreview — a non-interactive, lazy-loaded live preview of a real site
// that fills a Work-listing card's 16:10 thumbnail area exactly (no crop). The
// site renders at a 1440px desktop logical width, scaled to fit; pointer events
// are off so the card click still opens the case study and nothing scrolls
// inside the preview. Shows a branded poster until the site has loaded.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  url: string;
  siteName: string;
  /**
   * Logical viewport width the site renders at before being scaled to fit.
   * 1440 (default) gets the desktop breakpoint; pass 390 inside a phone frame
   * so the embedded site renders its real mobile layout.
   */
  logicalWidth?: number;
}

export const LiveCardPreview: React.FC<Props> = ({ url, siteName, logicalWidth = 1440 }) => {
  const LOGICAL_W = logicalWidth;
  const fit = useFitScale(LOGICAL_W);
  const isCompact = LOGICAL_W < 700;
  const { containerRef, shouldLoad, loaded, onLoad } = useDeviceEmbedState({ enabled: true });

  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return url.replace(/^https?:\/\//, '');
    }
  })();

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#0a0a0f]">
      {/* measured screen */}
      <div ref={fit.ref} className="absolute inset-0 overflow-hidden">
        <iframe
          title={`${siteName} homepage preview`}
          src={shouldLoad ? url : undefined}
          onLoad={onLoad}
          loading="lazy"
          scrolling="no"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="absolute left-0 top-0 border-0 bg-white"
          style={{
            // slightly over-wide so the site's own scrollbar is cropped (desktop
            // only — padding a mobile viewport would shift its breakpoint)
            width: `${isCompact ? LOGICAL_W : LOGICAL_W + 18}px`,
            // render exactly as tall as the frame needs, so nothing is letterboxed
            height: fit.logicalHeight > 0 ? `${fit.logicalHeight}px` : '900px',
            transform: `scale(${fit.scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
            opacity: fit.scale > 0 ? 1 : 0,
          }}
        />
      </div>

      {/* Poster — covers the card until the live site has loaded */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,70,239,0.16),transparent_55%),linear-gradient(160deg,#0c0a14,#06060a)] px-2 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d946ef]/30 bg-[#d946ef]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#f0abfc]">
            <Wifi className="h-3 w-3" /> {isCompact ? 'Live' : 'Live preview'}
          </span>
          <span
            className={`font-display leading-none text-white/85 ${isCompact ? 'text-sm' : 'text-lg'}`}
          >
            {siteName}
          </span>
          {!isCompact && <span className="font-mono text-[10px] text-white/40">{host}</span>}
        </div>
      )}

      {/* Clean dark overlay (pointer-events pass through to the card) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          boxShadow: 'inset 0 0 60px 6px rgba(0,0,0,0.3)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.22) 100%)',
        }}
      />
    </div>
  );
};
