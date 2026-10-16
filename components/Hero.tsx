
import React, { useLayoutEffect, useRef } from 'react';
import { ViewState } from '../types';
import gsap from 'gsap';

interface HeroProps {
  onViewChange: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Subtle fade-in for text elements
      const tl = gsap.timeline();
      tl.from(".hero-anim", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.1
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  const handleAutomateClick = () => {
    // Switch to the video automation page
    onViewChange('automation-video');
  };

  return (
    <section ref={comp} className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 pt-20 md:pt-0">
      
      {/* CSS for specific gradient animations and button glow */}
      <style>{`
        @keyframes buttonPulse {
           0% { box-shadow: 0 0 15px rgba(199, 32, 255, 0.3); }
           50% { box-shadow: 0 0 25px rgba(199, 32, 255, 0.5); }
           100% { box-shadow: 0 0 15px rgba(199, 32, 255, 0.3); }
        }

        @keyframes drawArrow {
          from { stroke-dashoffset: 100; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }

        .hero-btn-glow {
          box-shadow: 0 0 15px rgba(199, 32, 255, 0.3);
          animation: buttonPulse 3s ease-in-out infinite;
        }
        
        .hero-btn-glow:hover {
          box-shadow: 0 0 30px rgba(199, 32, 255, 0.6);
          animation: none;
        }

        .arrow-svg path {
           stroke-dasharray: 100;
           stroke-dashoffset: 100;
           animation: drawArrow 1.5s ease-out forwards 1.2s;
        }
      `}</style>

      {/* Main Content Container - Added lg:mt-24 for desktop spacing */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-full mt-8 md:mt-0 lg:mt-24">
        
        {/* H2: Connecting Phrase - Fixed to one line on mobile with clamp and nowrap */}
        <h2 className="hero-anim w-full max-w-5xl mx-auto text-white text-[clamp(18px,6vw,30px)] md:text-5xl font-bold tracking-wide mb-4 md:mb-6 relative z-20 px-2 leading-tight whitespace-nowrap">
          Where Business Meets
        </h2>

        {/* H1: Giant Animated Word - Increased mobile size to 17vw and added safe padding */}
        <div className="hero-anim w-full flex justify-center mt-0 px-[10px]">
            <h1 className="text-mask-flow text-[17vw] md:text-[140px] lg:text-[170px] leading-[0.9] tracking-normal md:tracking-wide select-none py-2 w-full text-center font-bold">
            AUTOMATION
            </h1>
        </div>

        {/* Subheading & Curved Arrow */}
        <div className="hero-anim mt-10 md:mt-12 relative flex flex-col items-center">
            <p className="text-[#B3B3B3] font-normal text-lg md:text-xl leading-relaxed relative z-20">
              What is Automation? <span className="text-white font-medium border-b border-white/20 pb-0.5 ml-1 cursor-pointer hover:border-white transition-colors">See here</span>
            </p>

            {/* Hand-drawn style curved arrow - Corrected Position */}
            <div className="absolute top-full left-1/2 w-16 h-16 ml-14 mt-1 md:ml-36 md:mt-2 md:w-20 md:h-20 pointer-events-none z-10">
                <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" className="w-full h-full text-white arrow-svg opacity-80" style={{ transform: 'rotate(10deg)' }}>
                   {/* Curve pointing down and left towards button */}
                   <path d="M 10 10 Q 50 10 40 80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                   {/* Arrowhead */}
                   <path d="M 25 65 L 40 80 L 60 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>

        {/* Premium CTA Button */}
        <div className="hero-anim mt-20 md:mt-24 w-full px-4 flex justify-center relative z-20">
          <button 
            onClick={handleAutomateClick}
            className="
              hero-btn-glow
              bg-black text-white 
              border border-white/20
              rounded-full 
              px-10 py-4 md:px-12 md:py-5
              text-base md:text-lg font-bold tracking-widest uppercase
              transition-transform duration-300 transform hover:scale-105 active:scale-95
              focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0abfc]
            "
          >
            LET'S AUTOMATE
          </button>
        </div>

      </div>

      {/* Subtle bottom vignette gradient */}
      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-[#C720FF]/10 to-transparent pointer-events-none" />

    </section>
  );
};
