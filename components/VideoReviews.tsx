
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    url: "https://jnytayxxwaydlmeuvtqr.supabase.co/storage/v1/object/sign/Review%20Videos/1.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDg2YjZhNS0wYzE4LTQ4ZGUtYjZlZi02Nzc1ZmYxNDgyYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXZpZXcgVmlkZW9zLzEubXA0IiwiaWF0IjoxNzY1NDQyODk3LCJleHAiOjMzNDIyNDI4OTd9.i3bIcIgj6XnV8ix2ScfQWlhRu8CfmtR_buMCYOAQDMk"
  },
  {
    id: 2,
    url: "https://jnytayxxwaydlmeuvtqr.supabase.co/storage/v1/object/sign/Review%20Videos/4.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDg2YjZhNS0wYzE4LTQ4ZGUtYjZlZi02Nzc1ZmYxNDgyYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXZpZXcgVmlkZW9zLzQubXA0IiwiaWF0IjoxNzY1NDQyOTE4LCJleHAiOjMzNDIyNDI5MTh9.AoHg7KZinyB4doXsFGwr8fIOGpZyuqqLUlEanebEOoI"
  },
  {
    id: 3,
    url: "https://jnytayxxwaydlmeuvtqr.supabase.co/storage/v1/object/sign/Review%20Videos/3.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNDg2YjZhNS0wYzE4LTQ4ZGUtYjZlZi02Nzc1ZmYxNDgyYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZXZpZXcgVmlkZW9zLzMubXA0IiwiaWF0IjoxNzY1NDQyOTQ5LCJleHAiOjMzNDIyNDI5NDl9.Lar87PHZnM1KE8KKUiuWAeImc4kCs631n5PIMzk-mZA"
  }
];

export const VideoReviews: React.FC = () => {
  const [[activeIndex, direction], setActive] = useState<[number, number]>([1, 0]);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Touch state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Helper to handle wrapping indices correctly for the loop
  const getIndex = (index: number) => {
    const len = REVIEWS.length;
    return ((index % len) + len) % len;
  };

  const handleNext = useCallback((isAuto = false) => {
    setActive(([prev]) => [prev + 1, 1]);
    setIsMuted(true); // Always mute on transition
    if (!isAuto) {
      setIsAutoScrolling(true);
    }
  }, []);

  const handlePrev = useCallback(() => {
    setActive(([prev]) => [prev - 1, -1]);
    setIsMuted(true);
    setIsAutoScrolling(true);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext(false); // Manual swipe -> resume auto scroll
    }
    if (isRightSwipe) {
      handlePrev(); // Manual swipe -> resume auto scroll
    }
  };

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      handleNext(true); // indicate auto transition
    }, 5000); // 5 seconds per slide
  }, [handleNext]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  // Manage Auto-Scroll Lifecycle
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isAutoScrolling, startAutoPlay, stopAutoPlay]);

  // Restart video from beginning when it becomes the center slide
  useEffect(() => {
    const currentIndex = getIndex(activeIndex);
    const videoEl = videoRefs.current[currentIndex];
    if (videoEl) {
      videoEl.currentTime = 0;
      // Ensure it plays (it should be playing due to autoPlay, but explicit play is safer after seek)
      videoEl.play().catch(() => {});
    }
  }, [activeIndex]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // If user unmutes, pause auto-scroll immediately.
    // The center video remains fixed.
    if (!newMutedState) {
      setIsAutoScrolling(false);
    }
    // Note: We do NOT resume auto-scroll if they re-mute. 
    // It only resumes on manual navigation (arrows).
  };

  // Active video index
  const current = getIndex(activeIndex);

  // Compute shortest cyclic offset between any slide i and the current slide.
  const offsetOf = (i: number) => {
    const len = REVIEWS.length;
    let off = i - current;
    if (off > len / 2) off -= len;
    if (off < -len / 2) off += len;
    return off;
  };

  // Position styles per offset
  const positionFor = (off: number) => {
    if (off === 0) {
      return { x: '0%', scale: 1, opacity: 1, blur: 0, z: 30 };
    }
    if (off === -1) {
      return { x: '-65%', scale: 0.85, opacity: 0.35, blur: 3, z: 10 };
    }
    if (off === 1) {
      return { x: '65%', scale: 0.85, opacity: 0.35, blur: 3, z: 10 };
    }
    // far off-screen
    return { x: off < 0 ? '-140%' : '140%', scale: 0.7, opacity: 0, blur: 6, z: 0 };
  };

  return (
    <section className="relative w-full py-14 md:py-16 overflow-hidden">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes textFlow {
           0% { background-position: 0% 50%; }
           100% { background-position: 200% 50%; }
        }
        .animate-text-flow {
           background-size: 200% auto;
           animation: textFlow 3s linear infinite;
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center">
        
        {/* Header — matches hero style */}
        <div className="text-center mb-10 md:mb-12 relative w-full flex flex-col items-center">
          <div className="flex flex-col items-center">
            <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
              Clients turned
            </span>
            <span
              className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
              data-text="INFLUENCERS."
            >
              INFLUENCERS.
            </span>
          </div>
          <p className="mt-5 text-gray-400 text-sm md:text-base font-light tracking-wide leading-relaxed max-w-xl mx-auto">
             Real stories from businesses that chose to lead, not follow.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full max-w-[1200px] h-[470px] flex items-center justify-center touch-pan-y md:h-[580px] overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          {/* Cards layer — flex-centered so transforms operate from true center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {REVIEWS.map((review, i) => {
              const off = offsetOf(i);
              const pos = positionFor(off);
              const isCenter = off === 0;

              return (
                <motion.div
                  key={review.id}
                  className="absolute w-[260px] h-[420px] md:w-[320px] md:h-[560px] will-change-transform pointer-events-auto"
                  style={{ zIndex: pos.z }}
                  animate={{
                    x: pos.x,
                    scale: pos.scale,
                    opacity: pos.opacity,
                    filter: `blur(${pos.blur}px)`,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => {
                    if (off === -1) handlePrev();
                    else if (off === 1) handleNext(false);
                  }}
                >
                  {/* Glow backdrop on center only */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-[#A452FF] blur-[60px] opacity-40 rounded-[32px] pointer-events-none" />
                  )}

                  {/* Card */}
                  <div
                    className={`relative w-full h-full overflow-hidden rounded-[24px] border bg-[#0C0C0E] ${
                      isCenter
                        ? 'border-[#A452FF]/70 shadow-[0_0_40px_-8px_rgba(164,82,255,0.45)]'
                        : 'border-white/10 cursor-pointer'
                    }`}
                  >
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={review.url}
                      className="w-full h-full object-cover"
                      playsInline
                      loop
                      muted={isCenter ? isMuted : true}
                      autoPlay
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />

                    {isCenter && (
                      <button
                        onClick={toggleMute}
                        className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#A452FF] hover:border-[#A452FF] hover:scale-110 transition-all duration-300 group z-50 cursor-pointer md:bottom-6 md:right-6 md:h-12 md:w-12"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => handlePrev()}
            className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-white/60 bg-black/50 text-white hover:bg-[#A452FF] hover:border-[#A452FF] hover:shadow-[0_0_20px_rgba(164,82,255,0.4)] transition-all duration-300 flex items-center justify-center backdrop-blur-sm group md:h-14 md:w-14 bg-black/40 backdrop-blur-md"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNext(false)}
            className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-white/60 bg-black/50 text-white hover:bg-[#A452FF] hover:border-[#A452FF] hover:shadow-[0_0_20px_rgba(164,82,255,0.4)] transition-all duration-300 flex items-center justify-center backdrop-blur-sm group md:h-14 md:w-14 bg-black/40 backdrop-blur-md"
            aria-label="Next Review"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Slide dots — OUTSIDE the carousel, below */}
        <div className="mt-2 flex items-center justify-center">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(([prev]) => [i + Math.floor(prev / REVIEWS.length) * REVIEWS.length, i > current ? 1 : -1])}
              className="group flex h-11 min-w-[44px] items-center justify-center px-1"
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 group-hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
