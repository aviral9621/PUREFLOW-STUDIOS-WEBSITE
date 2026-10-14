
import React, { useEffect, useState, useRef } from 'react';
import { Star, Quote, X } from 'lucide-react';
import { OFFICE_LOCATION } from '../constants';
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEWS } from '../lib/googleReviews';

// Every written review from the Google Business Profile (lib/googleReviews.ts).
// The Places API only ever returns 5, so the full list is kept in the repo instead.
interface Review {
  author_name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
}

/** Cards show this many words (and at most CHARS characters); "Read more" opens the rest in a pop-up. */
const WORDS = 15;
const CHARS = 72;
const clip = (text: string) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  let words = flat.split(' ');
  if (words.length <= WORDS && flat.length <= CHARS) return { short: text, cut: false };
  words = words.slice(0, WORDS);
  while (words.length > 1 && words.join(' ').length > CHARS) words.pop();
  return { short: words.join(' ').replace(/[,.;:!—-]+$/, '') + '…', cut: true };
};

const REVIEWS: Review[] = GOOGLE_REVIEWS.map((r) => ({
  author_name: r.name,
  initials: r.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join(''),
  rating: r.rating,
  date: r.date,
  text: r.text,
}));

// Inline Google Logo for reliability
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 4.08 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const GoogleReviews: React.FC = () => {
  const reviews = REVIEWS;
  const rating = Number(GOOGLE_RATING);
  const totalRatings = GOOGLE_REVIEW_COUNT;

  const [open, setOpen] = useState<Review | null>(null);
  const dragged = useRef(false);

  // Pop-up: close on Escape, and stop the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  // Scroll State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Infinite Auto-Scroll Logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    // Don't animate if no container or no reviews; pause while the user is interacting
    if (!container || reviews.length === 0) return;

    let animationId: number;
    
    const animate = () => {
      if (!isPaused && !isMouseDown) {
        // Increment scroll
        container.scrollLeft += 0.8; // Slightly reduced speed for smoother reading
        
        // Loop Logic:
        // We duplicate reviews multiple times. 
        // When we pass the halfway point (end of 2nd set), we reset to 0 seamlessly.
        const seam = container.querySelector<HTMLElement>('[data-loop-start]');
        const first = container.firstElementChild as HTMLElement | null;
        const loopAt = seam && first ? seam.offsetLeft - first.offsetLeft : container.scrollWidth / 2;
        if (container.scrollLeft >= loopAt) {
            container.scrollLeft -= loopAt;
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isMouseDown, reviews]);

  // --- Mouse Drag Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsMouseDown(true);
    setIsPaused(true);
    dragged.current = false;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftState(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    if (Math.abs(walk) > 8) dragged.current = true;
    container.scrollLeft = scrollLeftState - walk;
  };

  // --- Touch Handlers (Thumb Scrolling) ---
  const handleTouchStart = () => {
     setIsPaused(true);
  };

  const handleTouchEnd = () => {
     // Small delay before resuming auto-scroll to let momentum settle/feels natural
     setTimeout(() => setIsPaused(false), 1000);
  };


  // Two copies back to back: the scroll wraps at the start of the second copy, which is seamless.
  const displayReviews = [...reviews, ...reviews];

  return (
    <section className="relative w-full py-14 md:py-16 overflow-hidden border-t border-white/5">
      
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
        
        /* Ensure cursor indicates interactivity */
        .grab-cursor { cursor: grab; }
        .grab-cursor:active { cursor: grabbing; }
      `}</style>

      {/* Background Ambience handled by parent flow wrapper */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-8 md:mb-10 flex flex-col items-center text-center">
         
         {/* Google Badge - Updated Style with proper Logo */}
         <div className="mb-5 md:mb-6 animate-fade-in hover:scale-105 transition-transform duration-300">
            <a 
              href={OFFICE_LOCATION.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-full pl-2 pr-6 py-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer"
            >
               {/* Logo Circle */}
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <div className="w-6 h-6">
                     <GoogleLogo />
                  </div>
               </div>
               
               {/* Text Info */}
               <div className="flex flex-col items-start leading-none gap-1">
                   <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-sm">Excellent</span>
                      <div className="flex">
                          {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                          ))}
                      </div>
                   </div>
                   <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <span className="text-gray-900 font-bold">{rating.toFixed(1)}/5</span>
                      <span>•</span>
                      <span>Based on {totalRatings} reviews</span>
                   </div>
               </div>
            </a>
         </div>

         <div className="flex flex-col items-center">
            <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
              What people say
            </span>
            <span
              className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.1rem,4.8vw,4.5rem)]"
              data-text="BEHIND OUR BACK."
            >
              BEHIND OUR BACK.
            </span>
         </div>
         <p className="mt-5 text-gray-400 text-sm md:text-base font-light tracking-wide leading-relaxed max-w-xl mx-auto">
            Don't take our word for it. Trust the internet.
         </p>
      </div>

      {/* Scrollable Container */}
      <div className="relative w-full">
         
         {/* Fade Masks for Edges */}
         <div className="absolute top-0 left-0 h-full w-12 md:w-32 bg-gradient-to-r from-black/95 to-transparent z-20 pointer-events-none" />
         <div className="absolute top-0 right-0 h-full w-12 md:w-32 bg-gradient-to-l from-black/95 to-transparent z-20 pointer-events-none" />

         <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar pb-8 px-4 grab-cursor"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ 
                scrollBehavior: 'auto', // Disable smooth scroll to allow JS frame updates
                WebkitOverflowScrolling: 'touch' // Smooth momentum on iOS
            }} 
         >
            {displayReviews.map((review, i) => (
               <div 
                  key={i} 
                  data-loop-start={i === reviews.length ? '' : undefined}
                  aria-hidden={i >= reviews.length || undefined}
                  className="
                    w-[264px] sm:w-[300px] md:w-[330px] h-[188px] md:h-[196px] flex-shrink-0 
                    bg-[#0F0F12]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5
                    transition-all duration-300 hover:border-[#A452FF]/40 hover:bg-[#141419]
                    flex flex-col justify-between select-none
                  "
               >
                  {/* Header: Author Info */}
                  <div className="flex items-center gap-3 mb-3 min-w-0">
                     <div className="w-9 h-9 shrink-0 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                        {review.initials}
                     </div>
                     <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate">{review.author_name}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                           <span className="flex gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                              {[...Array(5)].map((_, starIndex) => (
                                 <Star
                                    key={starIndex}
                                    className={`w-3 h-3 ${starIndex < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
                                 />
                              ))}
                           </span>
                           <span className="text-gray-500 text-[11px]">{review.date}</span>
                        </div>
                     </div>
                  </div>

                  {/* Body: Review Text */}
                  <div className="relative flex-1">
                     {(() => {
                        const { short, cut } = clip(review.text);
                        return (
                           <>
                              <Quote className="absolute -top-1 -left-1 w-4 h-4 text-gray-700 transform scale-x-[-1] opacity-50" />
                              <p className="text-gray-300 text-sm leading-relaxed pl-4 line-clamp-3 font-light">{short}</p>
                              {cut && (
                                 <button
                                    type="button"
                                    tabIndex={i >= reviews.length ? -1 : undefined}
                                    onClick={() => { if (!dragged.current) setOpen(review); }}
                                    className="mt-1 pl-4 text-[13px] font-semibold text-[#C084FC] hover:text-white transition-colors"
                                 >
                                    Read more
                                 </button>
                              )}
                           </>
                        );
                     })()}
                  </div>
                  
                  {/* Google Icon Footer */}
                  <div className="mt-2 flex items-center gap-2 opacity-50">
                     <div className="w-4 h-4 grayscale opacity-70">
                        <GoogleLogo />
                     </div>
                     <span className="text-[11px] text-gray-500 font-medium">Posted on Google</span>
                  </div>

               </div>
            ))}
            
            {/* View All Card - Helps address the 'not all reviews' issue by linking out */}
            <div className="
                w-[264px] sm:w-[300px] md:w-[330px] h-[188px] md:h-[196px] flex-shrink-0 
                bg-[#0F0F12]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5
                flex flex-col justify-center items-center text-center gap-4
                cursor-pointer hover:border-[#A452FF] transition-all group
            "
            onClick={() => window.open(OFFICE_LOCATION.googleMapsUrl, '_blank')}
            >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-7 h-7">
                        <GoogleLogo />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white">Read All {totalRatings} Reviews</h3>
                <p className="text-gray-400 text-sm">See what everyone else is saying on our Google Business Profile.</p>
                <span className="text-brand font-bold text-sm mt-2">View on Maps &rarr;</span>
            </div>

         </div>
      </div>

      {/* Full review pop-up */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Review by ${open.author_name}`}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[560px] max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111015] p-6 md:p-8 shadow-2xl"
          >
            <button type="button" aria-label="Close" onClick={() => setOpen(null)} autoFocus className="absolute top-3 right-3 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 pr-10">
              <div className="w-11 h-11 shrink-0 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold">{open.initials}</div>
              <div>
                <div className="font-bold text-white">{open.author_name}</div>
                <div className="text-gray-500 text-xs">{open.date}</div>
              </div>
            </div>
            <div className="flex gap-0.5 mt-4">
              {[...Array(5)].map((_, k) => (
                <Star key={k} className={`w-4 h-4 ${k < open.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
              ))}
            </div>
            <p className="mt-3 text-gray-200 text-[15px] leading-relaxed whitespace-pre-line">{open.text}</p>
            <a href={OFFICE_LOCATION.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C084FC] hover:text-white transition-colors">
              <span className="w-4 h-4"><GoogleLogo /></span> Posted on Google ↗
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
