import React from 'react';
import { ExternalLink, MousePointerClick, Loader2, Wifi } from 'lucide-react';
import type { DeviceShowcase } from '../../lib/caseStudies';
import { useFitScale } from '../../hooks/useFitScale';
import { CREDENTIALLESS, canFrameLiveSite, useDeviceEmbedState } from '../../hooks/useDeviceEmbedState';
import { Mockup } from './Mockup';

// ─────────────────────────────────────────────────────────────────────────────
// LiveDeviceEmbed — renders a real, interactive embed of a site inside a laptop
// or phone frame. The iframe renders at a fixed logical width (desktop/mobile
// breakpoint) and is scaled to fit the frame. It auto-loads when scrolled into
// view, shows a branded poster until ready, and is pointer-events-guarded so it
// never hijacks page scroll until the visitor clicks to interact.
// ─────────────────────────────────────────────────────────────────────────────

interface LiveDeviceEmbedProps {
  device: 'laptop' | 'phone' | 'browser';
  showcase: DeviceShowcase;
  /** "Open live site ↗" target (full URL). */
  liveUrl: string;
  /** Caption beneath the frame, e.g. "Desktop" / "Mobile". */
  label: string;
  /** Site name shown on the poster, e.g. "Quick Hotels". */
  siteName: string;
  /** Optional host shown in the browser-frame address bar (overrides liveUrl). */
  urlHost?: string;
  /**
   * When false the laptop renders poster-only (no iframe) — used on small
   * screens to save bandwidth. Defaults to true.
   */
  eager?: boolean;
  /**
   * Static preview mode: the real site still loads (live), but it is fully
   * non-interactive — no clicks, no hover, no internal scroll, no "click to
   * interact" guard. Only the first section is visible. Used for the hero.
   */
  nonInteractive?: boolean;
}

const LOGICAL = {
  laptop: { w: 1440, h: 900 },
  phone: { w: 390, h: 845 },
  browser: { w: 1440, h: 900 },
} as const;

export const LiveDeviceEmbed: React.FC<LiveDeviceEmbedProps> = ({
  device,
  showcase,
  liveUrl,
  label,
  siteName,
  eager = true,
  nonInteractive = false,
  urlHost,
}) => {
  const logical = LOGICAL[device];
  // `interactive` here means "load the live iframe at all" (eager + live).
  // `nonInteractive` separately disables all pointer interaction on it.
  const interactive = showcase.type === 'live' && eager && canFrameLiveSite();

  const fit = useFitScale(logical.w);
  const { containerRef, shouldLoad, loaded, interacting, stalled, onLoad, startInteract, endInteract } =
    useDeviceEmbedState({ enabled: interactive });

  const host =
    urlHost ||
    (() => {
      try {
        return new URL(liveUrl).host;
      } catch {
        return liveUrl.replace(/^https?:\/\//, '');
      }
    })();

  // The scaled iframe (or static fallback) that lives inside a device "screen".
  const screen = (
    <div
      ref={fit.ref}
      className="screen absolute inset-0 overflow-hidden bg-[#0a0a0f]"
      style={{ borderRadius: device === 'phone' ? '1.6rem' : '2px' }}
    >
      {/* Live iframe — only mounted with a src once in view */}
      {showcase.type === 'live' && interactive && (
        <iframe
          title={`${siteName} live website — ${label.toLowerCase()}`}
          {...CREDENTIALLESS}
          src={shouldLoad ? showcase.src : undefined}
          onLoad={onLoad}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="absolute left-0 top-0 border-0 bg-white"
          style={{
            // In static mode, widen slightly so the site's own vertical
            // scrollbar is cropped out of the screen for a clean preview.
            width: `${nonInteractive ? logical.w + 18 : logical.w}px`,
            height: `${logical.h}px`,
            transform: `scale(${fit.scale})`,
            transformOrigin: 'top left',
            pointerEvents: nonInteractive ? 'none' : interacting ? 'auto' : 'none',
            opacity: fit.scale > 0 ? 1 : 0,
          }}
          scrolling={nonInteractive ? 'no' : 'auto'}
        />
      )}

      {/* Static image (type: 'image') — contain so nothing is cropped; white
          letterbox bands blend with light dashboard screenshots. */}
      {showcase.type === 'image' && (
        <img
          src={showcase.src}
          alt={`${siteName} — ${label}`}
          className="absolute inset-0 h-full w-full bg-white object-contain"
          loading="lazy"
        />
      )}

      {/* Designed mockup (type: 'mockup') */}
      {showcase.type === 'mockup' && showcase.mockup && <Mockup kind={showcase.mockup} />}

      {/* Video fallback (type: 'video') */}
      {showcase.type === 'video' && (
        <video
          src={showcase.src}
          poster={showcase.poster}
          muted
          loop
          autoPlay
          playsInline
          className="h-full w-full object-cover object-top"
        />
      )}

      {/* Poster — covers the frame until the live embed has loaded */}
      {(!interactive || !loaded) && showcase.type === 'live' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,70,239,0.18),transparent_55%),radial-gradient(ellipse_at_50%_100%,rgba(164,82,255,0.16),transparent_55%),linear-gradient(160deg,#0c0a14,#06060a)] text-center">
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <span className="relative inline-flex items-center gap-1.5 rounded-full border border-[#d946ef]/30 bg-[#d946ef]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f0abfc]">
            <Wifi className="h-3 w-3" /> Live preview
          </span>
          <span className="relative font-display text-2xl leading-none text-white/90">{siteName}</span>
          <span className="relative font-mono text-[11px] text-white/40">{host}</span>
          {interactive && shouldLoad && (
            <span className="relative mt-1 inline-flex items-center gap-1.5 text-[11px] text-white/55">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading live site…
            </span>
          )}
          {!interactive && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              View on desktop <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {/* Scroll-trap guard — click to enable interaction inside the embed */}
      {!nonInteractive && interactive && loaded && !interacting && (
        <button
          type="button"
          onClick={startInteract}
          className="group/guard absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-black/35 via-transparent to-transparent pb-4 transition-colors hover:from-black/20"
          aria-label={`Interact with the live ${siteName} site`}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm transition-transform group-hover/guard:-translate-y-0.5">
            <MousePointerClick className="h-3.5 w-3.5" /> Click to interact
          </span>
        </button>
      )}

      {/* Static preview: subtle cinematic vignette, blocks all interaction */}
      {nonInteractive && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
          style={{
            boxShadow: 'inset 0 0 90px 8px rgba(0,0,0,0.32)',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)',
          }}
        />
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center">
      {/* Device frame */}
      <div
        ref={containerRef}
        className="w-full"
        onPointerLeave={interacting ? endInteract : undefined}
      >
        {device === 'laptop' ? (
          <div className="mx-auto w-full max-w-[640px]">
            {/* Lid */}
            <div className="relative rounded-[14px] border border-white/12 bg-[#0b0b10] p-[10px] shadow-[0_30px_80px_-30px_rgba(164,82,255,0.45)]">
              <div className="absolute left-1/2 top-[5px] h-1 w-1 -translate-x-1/2 rounded-full bg-white/25" />
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-black/60"
                style={{ clipPath: 'inset(0 round 4px)' }}
              >
                {screen}
              </div>
            </div>
            {/* Base / hinge */}
            <div className="relative mx-auto h-[14px] w-[112%] -translate-x-[5.4%] rounded-b-[12px] rounded-t-[3px] border border-t-0 border-white/10 bg-gradient-to-b from-[#17171d] to-[#0b0b0f]">
              <div className="absolute left-1/2 top-0 h-[5px] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-black/70" />
            </div>
          </div>
        ) : device === 'phone' ? (
          <div className="mx-auto w-full max-w-[270px]">
            <div className="relative rounded-[2.1rem] border border-white/14 bg-[#0b0b10] p-[8px] shadow-[0_30px_70px_-28px_rgba(164,82,255,0.5)]">
              {/* Notch */}
              <div className="absolute left-1/2 top-[12px] z-20 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
              <div
                className="relative aspect-[390/845] w-full overflow-hidden rounded-[1.6rem] border border-black/60"
                style={{ clipPath: 'inset(0 round 1.6rem)' }}
              >
                {screen}
              </div>
            </div>
          </div>
        ) : (
          /* Browser window — for the hero (real site, desktop layout) */
          <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b12] shadow-[0_40px_100px_-40px_rgba(164,82,255,0.5)]">
            <div className="flex h-9 items-center gap-2 border-b border-white/[0.08] bg-black/50 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4f8cff] shadow-[0_0_6px_rgba(79,140,255,0.6)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b06bff] shadow-[0_0_6px_rgba(176,107,255,0.6)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
              <div className="mx-auto flex h-5 w-1/2 max-w-xs items-center justify-center rounded-md bg-white/[0.06] px-3">
                <span className="truncate font-mono text-[10px] text-white/45">{host}</span>
              </div>
            </div>
            <div
              className="relative aspect-[16/10] w-full overflow-hidden"
              style={{ clipPath: 'inset(0 round 0 0 1rem 1rem)' }}
            >
              {screen}
            </div>
          </div>
        )}
      </div>

      {/* Caption + always-present live link (hidden in static hero mode) */}
      {!nonInteractive && (
        <div className="mt-4 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{label}</span>
          {liveUrl && (
            <>
              <span className="h-3 w-px bg-white/15" />
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-white/65 transition-colors hover:text-white"
              >
                Open live site <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
        </div>
      )}

      {/* Soft fallback hint if a live frame stalls (e.g. framing blocked) */}
      {!nonInteractive && interactive && stalled && !loaded && (
        <p className="mt-2 max-w-[260px] text-center text-[11px] leading-snug text-white/40">
          Preview is taking a moment — you can always open the live site above.
        </p>
      )}
    </div>
  );
};
