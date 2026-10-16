
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Navigation, Search, X } from 'lucide-react';
import { OFFICE_LOCATION } from '../constants';

// "Find us on the MAP": two still maps from our own domain (public/map, built from
// OpenStreetMap by scripts/static-map.py): India with Lucknow marked, then, after
// "See Our Office", a zoom into the office neighbourhood with the address card.
// It used to load the Google Maps JavaScript API, which put third-party scripts and
// a JSONP endpoint on every homepage visit; directions still open in Google Maps.

const IMG_W = 1400;
const IMG_H = 600;
/** Where the office sits in each image, in % (printed by scripts/static-map.py). */
const PIN = { overview: { x: 51.07, y: 38.69 }, closeup: { x: 40.01, y: 50 } };
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_LOCATION.lat},${OFFICE_LOCATION.lng}`;
const ZOOM_MS = 1100;

type View = 'overview' | 'zooming' | 'office';

/** The pulsing brand pin with a small label under it. */
const Pin: React.FC<{ x: number; y: number; label: string; big?: boolean }> = ({ x, y, label, big }) => (
  <span className="pf-map-pin" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
    <span className={`pf-map-pin-dot ${big ? 'is-big' : ''}`} />
    <span className="pf-map-pin-label">{label}</span>
  </span>
);

export const LocationMap: React.FC = () => {
  const [view, setView] = useState<View>('overview');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const seeOffice = () => {
    if (view !== 'overview') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setView('office');
    setView('zooming');
    timer.current = window.setTimeout(() => setView('office'), ZOOM_MS);
  };
  const back = () => {
    window.clearTimeout(timer.current);
    setView('overview');
  };
  const atOffice = view !== 'overview';

  return (
    // FULL WIDTH WRAPPER for Continuous Gradient Flow
    <div className="w-full">
      <section id="pf-map-section" className="py-14 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-8 relative">
        <style>{`
          #pf-map-section .map-wrapper {
              width: 100%;
              height: 520px;
              position: relative;
              overflow: hidden;
              border-radius: 32px;
              border: 1px solid rgba(255,255,255,0.1);
              box-shadow: 0 0 60px -15px rgba(164,82,255,0.3);
              container-type: size;
          }
          /* Each map covers the box like object-fit: cover, so the pin's % position holds at any size. */
          #pf-map-section .pf-map-stage {
              position: absolute;
              left: 50%;
              top: 50%;
              width: max(100cqw, calc(100cqh * ${IMG_W} / ${IMG_H}));
              aspect-ratio: ${IMG_W} / ${IMG_H};
              transform: translate(-50%, -50%);
              transition: transform ${ZOOM_MS}ms cubic-bezier(0.65, 0, 0.35, 1), opacity ${ZOOM_MS * 0.6}ms ease;
          }
          #pf-map-section .pf-map-stage img { width: 100%; height: 100%; display: block; user-select: none; }
          #pf-map-section .pf-map-overview { transform-origin: ${PIN.overview.x}% ${PIN.overview.y}%; }
          #pf-map-section .map-wrapper.is-office .pf-map-overview { transform: translate(-50%, -50%) scale(5); opacity: 0; transition-delay: 0ms, ${ZOOM_MS * 0.4}ms; }
          #pf-map-section .pf-map-closeup { opacity: 0; transform: translate(-50%, -50%) scale(0.55); }
          #pf-map-section .map-wrapper.is-office .pf-map-closeup { opacity: 1; transform: translate(-50%, -50%) scale(1); transition-delay: ${ZOOM_MS * 0.35}ms; }

          /* The pin's tip sits exactly on the spot; the label hangs below it. */
          #pf-map-section .pf-map-pin { position: absolute; transform: translate(-50%, -100%); pointer-events: none; }
          #pf-map-section .pf-map-pin-dot {
              position: relative; width: 22px; height: 22px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
              background: linear-gradient(135deg, #ff2f86, #a855f7); box-shadow: 0 6px 18px rgba(168,85,247,0.55);
          }
          #pf-map-section .pf-map-pin-dot.is-big { width: 30px; height: 30px; }
          #pf-map-section .pf-map-pin-dot::after { content: ''; position: absolute; inset: 30%; border-radius: 50%; background: #fff; }
          #pf-map-section .pf-map-pin-dot::before {
              content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; border-radius: 50%;
              border: 2px solid rgba(255,47,134,0.7); animation: pfMapPulse 2s ease-out infinite;
          }
          #pf-map-section .pf-map-pin-label {
              position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%);
              padding: 3px 10px; border-radius: 999px; background: rgba(0,0,0,0.78); color: #fff;
              font-size: 12px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          }
          @keyframes pfMapPulse { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.4); opacity: 0; } }
          @media (prefers-reduced-motion: reduce) {
              #pf-map-section .pf-map-stage { transition: none !important; }
              #pf-map-section .pf-map-pin-dot::before { animation: none; }
          }
          @media (max-width: 640px) {
              #pf-map-section .map-wrapper {
                  height: 450px;
                  border-radius: 24px;
              }
          }
        `}</style>

        {/* Clean Header with Gradient Flow */}
        <div className="text-center mb-8 md:mb-10 flex flex-col items-center">

          {/* Location badge — clean pin */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1A1A1E] border border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300 mb-5 group cursor-default">
             <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7.06 11.55 7.36 11.81a1 1 0 0 0 1.28 0C12.94 21.55 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#EA4335"/>
                <circle cx="12" cy="10" r="3" fill="#ffffff"/>
             </svg>
             <span className="text-sm font-bold text-white tracking-wide">Lucknow, India</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
              Find us on the
            </span>
            <span
              className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
              data-text="MAP."
            >
              MAP.
            </span>
          </div>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light px-4">
              Pureflow Studios HQ — Lucknow, Uttar Pradesh.
          </p>
        </div>

        <div className={`map-wrapper bg-[#1A1A1E] relative group ${atOffice ? 'is-office' : ''}`}>

          {/* India, Lucknow marked */}
          <div className="pf-map-stage pf-map-overview" aria-hidden={atOffice}>
            <img src="/map/office-overview.webp" width={IMG_W} height={IMG_H} loading="lazy" decoding="async" draggable={false} alt="Map of India with Lucknow marked" />
            <Pin x={PIN.overview.x} y={PIN.overview.y} label="Lucknow" />
          </div>

          {/* The office neighbourhood */}
          <div className="pf-map-stage pf-map-closeup" aria-hidden={!atOffice}>
            <img src="/map/office-closeup.webp" width={IMG_W} height={IMG_H} loading="lazy" decoding="async" draggable={false} alt="Map of the streets around the Pureflow Studios office in Dubagga, Lucknow" />
            <Pin x={PIN.closeup.x} y={PIN.closeup.y} label={OFFICE_LOCATION.name} big />
          </div>

          {/* Map data credit (ODbL) */}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 left-3 z-20 rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-black/70 hover:text-black"
          >
            © OpenStreetMap contributors
          </a>

          {/* Overlay Button (Overview Mode) */}
          {view === 'overview' && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 w-auto">
                  {/* Attractive Animated Button Wrapper */}
                  <div className="relative group/btn cursor-pointer">
                      {/* Pulse Ring */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#A452FF] to-[#FF20A0] rounded-full blur opacity-75 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200 animate-pulse"></div>

                      <button
                          type="button"
                          onClick={seeOffice}
                          className="
                              relative px-10 py-5 bg-white text-black rounded-full font-bold text-base tracking-wide
                              shadow-[0_0_40px_rgba(164,82,255,0.4)]
                              flex items-center justify-center gap-4 overflow-hidden
                              transform transition-all duration-300 hover:scale-105 active:scale-95
                          "
                      >
                          <Search className="w-5 h-5 relative z-10 shrink-0 text-[#A452FF] animate-bounce" />
                          <span className="relative z-10 whitespace-nowrap">See Our Office</span>
                          {/* Inner Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                      </button>
                  </div>
              </div>
          )}

          {/* Info Card (Office Mode) */}
          <div
              className={`
                  absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:top-6 md:bottom-auto md:w-[400px] z-30
                  bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]
                  p-0 rounded-[28px] overflow-hidden transform transition-all duration-700
                  ${view === 'office' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}
              `}
              aria-hidden={view !== 'office'}
          >
              <div className="absolute inset-0 border border-brand/30 rounded-[28px] pointer-events-none" />

              <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h3 className="text-white font-bold text-lg md:text-xl mb-1">{OFFICE_LOCATION.name}</h3>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 border border-brand/20">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                              <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Open Now</span>
                          </div>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-brand to-purple-800 flex items-center justify-center text-white shadow-lg shadow-brand/20 shrink-0">
                          <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                  </div>

                  <p className="text-gray-300 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed font-light border-l-2 border-white/10 pl-4">
                      {OFFICE_LOCATION.address}
                  </p>

                  <div className="space-y-3">
                      <a
                          href={OFFICE_LOCATION.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={view === 'office' ? 0 : -1}
                          className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-gray-200 py-3.5 md:py-4 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                      >
                          Open in Google Maps
                          <ExternalLink className="w-4 h-4" />
                      </a>
                      <div className="flex gap-3">
                          <a
                              href={DIRECTIONS_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={view === 'office' ? 0 : -1}
                              className="flex-1 py-3 md:py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-white text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-2 group"
                          >
                              <Navigation className="w-4 h-4 group-hover:text-brand transition-colors" /> Directions
                          </a>
                          <button
                              type="button"
                              onClick={back}
                              tabIndex={view === 'office' ? 0 : -1}
                              className="px-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                              aria-label="Back to the India map"
                          >
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};
