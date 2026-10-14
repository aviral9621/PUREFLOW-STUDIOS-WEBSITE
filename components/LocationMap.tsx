
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Navigation, Search, X, Loader2 } from 'lucide-react';
import { OFFICE_LOCATION } from '../constants';

declare global {
  interface Window {
    google: any;
  }
}

// Browser key for the Maps JavaScript API. It is read from the environment at build time
// (VITE_GOOGLE_MAPS_API_KEY in .env locally and in Vercel) and never committed. The key must be
// restricted in Google Cloud to this site's referrers and to the Maps JavaScript API only.
// Without a key the section still renders: the info card with the address and map links.
const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

export const LocationMap: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewState, setViewState] = useState<'overview' | 'zooming' | 'interactive'>(GOOGLE_MAPS_API_KEY ? 'overview' : 'interactive');
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Load Google Maps Script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;
    // Check if window.google is already available
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Check if the script is already appended to the DOM (by GoogleReviews or other components)
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

    if (existingScript) {
      // If script exists but window.google not ready, poll for it
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          setMapLoaded(true);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }

    // If neither, append the script
    // NOTE: Added '&v=weekly' to support modern importLibrary used in GoogleReviews
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      setMapLoaded(true);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (mapLoaded && mapContainerRef.current && !mapInstance) {
      initMap();
    }
  }, [mapLoaded]);

  const initMap = () => {
    if (!window.google || !mapContainerRef.current) return;

    // Stage 1: India View
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: 22.3511148, lng: 78.6677428 },
      zoom: 4.8,
      minZoom: 4.5,
      maxZoom: 18,
      gestureHandling: "greedy",
      mapTypeId: "roadmap",
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false, 
      styles: [] // Clean default styles
    });

    setMapInstance(map);

    // Correct resizing on load
    window.google.maps.event.addListenerOnce(map, "idle", () => {
       window.google.maps.event.trigger(map, "resize");
       map.setCenter({ lat: 22.3511148, lng: 78.6677428 });
    });
  };

  // Custom Smooth Fly-To Animation
  const smoothFlyTo = (map: any, target: { lat: number, lng: number, zoom: number }, duration: number) => {
    return new Promise<void>((resolve) => {
        const startZoom = map.getZoom();
        const startCenter = map.getCenter();
        const startLat = startCenter.lat();
        const startLng = startCenter.lng();
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease in-out cubic for ultra smooth feel
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentLat = startLat + (target.lat - startLat) * ease;
            const currentLng = startLng + (target.lng - startLng) * ease;
            const currentZoom = startZoom + (target.zoom - startZoom) * ease;

            map.moveCamera({
                center: { lat: currentLat, lng: currentLng },
                zoom: currentZoom
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        };
        requestAnimationFrame(animate);
    });
  };

  const handleZoomSequence = async () => {
    if (!mapInstance) return;
    
    setViewState('zooming');

    // Disable interactions during animation
    mapInstance.setOptions({ gestureHandling: 'none' });

    // Stage 2: Uttar Pradesh (Smooth Fly)
    await smoothFlyTo(mapInstance, { lat: 26.5, lng: 80.5, zoom: 7.2 }, 1500);

    // Stage 3: Lucknow (Smooth Fly)
    await smoothFlyTo(mapInstance, { lat: 26.85, lng: 80.95, zoom: 12 }, 1500);

    // Stage 4: Pureflow Studios (Smooth Fly)
    await smoothFlyTo(mapInstance, { lat: OFFICE_LOCATION.lat, lng: OFFICE_LOCATION.lng, zoom: 18 }, 1800);

    // Drop Marker
    new window.google.maps.Marker({
      position: { lat: OFFICE_LOCATION.lat, lng: OFFICE_LOCATION.lng },
      map: mapInstance,
      animation: window.google.maps.Animation.DROP,
      title: OFFICE_LOCATION.name
    });

    setViewState('interactive');
    mapInstance.setOptions({ gestureHandling: 'greedy', zoomControl: true });
  };

  return (
    // FULL WIDTH WRAPPER for Continuous Gradient Flow
    <div className="w-full">
      <section id="pf-map-section" ref={sectionRef} className="py-14 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-8 relative">
        <style>{`
          @keyframes textFlow {
             0% { background-position: 0% 50%; }
             100% { background-position: 200% 50%; }
          }
          .animate-text-flow {
             background-size: 200% auto;
             animation: textFlow 3s linear infinite;
          }

          #pf-map-section .map-wrapper {
              width: 100%;
              height: 520px;
              position: relative;
              overflow: hidden;
              border-radius: 32px;
              border: 1px solid rgba(255,255,255,0.1);
              box-shadow: 0 0 60px -15px rgba(164,82,255,0.3);
          }

          #pf-map-section #map {
              width: 100% !important;
              height: 100% !important;
              display: block !important;
          }

          #pf-map-section .gm-style {
              transform: none !important;
          }

          #pf-map-section canvas {
              max-width: none !important;
          }

          /* Mobile Adjustments for Maps UI */
          @media (max-width: 640px) {
              #pf-map-section .map-wrapper {
                  height: 450px;
                  border-radius: 24px;
              }
          }
        `}</style>

        {/* Clean Header with Gradient Flow */}
        <div className="text-center mb-8 md:mb-10 flex flex-col items-center">
          
          {/* Google Maps Badge — clean pin */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1A1A1E] border border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300 mb-5 group cursor-default">
             <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7.06 11.55 7.36 11.81a1 1 0 0 0 1.28 0C12.94 21.55 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#EA4335"/>
                <circle cx="12" cy="10" r="3" fill="#ffffff"/>
             </svg>
             <span className="text-sm font-bold text-white tracking-wide">Google Maps</span>
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

        <div className="map-wrapper bg-[#1A1A1E] relative group">
          
          {/* Map Container */}
          <div ref={mapContainerRef} id="map" className="w-full h-full" />

          {/* Overlay Button (Overview Mode) */}
          {viewState === 'overview' && mapLoaded && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 w-auto">
                  {/* Attractive Animated Button Wrapper */}
                  <div className="relative group/btn cursor-pointer">
                      {/* Pulse Ring */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#A452FF] to-[#FF20A0] rounded-full blur opacity-75 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200 animate-pulse"></div>
                      
                      <button
                          onClick={handleZoomSequence}
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

          {/* Zooming Indicator */}
          {viewState === 'zooming' && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
                  Locating HQ...
              </div>
          )}

          {/* Info Card (Interactive Mode) */}
          <div 
              className={`
                  absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:top-6 md:bottom-auto md:w-[400px] 
                  bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]
                  p-0 rounded-[28px] overflow-hidden transform transition-all duration-700 
                  ${viewState === 'interactive' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}
              `}
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
                          className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-gray-200 py-3.5 md:py-4 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                      >
                          Open in Google Maps 
                          <ExternalLink className="w-4 h-4" />
                      </a>
                      <div className="flex gap-3">
                          <a 
                              href={OFFICE_LOCATION.googleMapsUrl}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 py-3 md:py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-white text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-2 group"
                          >
                              <Navigation className="w-4 h-4 group-hover:text-brand transition-colors" /> Directions
                          </a>
                          <button 
                              onClick={() => {
                                  setViewState('overview');
                                  if (mapInstance) {
                                      // Smooth reset
                                      smoothFlyTo(mapInstance, { lat: 22.3511148, lng: 78.6677428, zoom: 4.8 }, 1000);
                                      mapInstance.setOptions({ gestureHandling: 'greedy', zoomControl: false });
                                  }
                              }}
                              className="px-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                              aria-label="Reset Map"
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
