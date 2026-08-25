
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onOpenContact: (title: string, rect: DOMRect) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNav = (view: ViewState) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Minimal Floating Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 md:px-10 md:py-8 flex justify-between items-center bg-transparent">
        {/* Logo - Increased size slightly */}
        <div 
          className="cursor-pointer select-none relative z-50 group"
          onClick={() => handleNav('home')}
        >
          <span className="font-anton text-3xl md:text-4xl tracking-wider uppercase text-white transition-opacity duration-300 group-hover:opacity-80">
            PURE<span className="text-mask-flow">FLOW</span> STUDIOS
          </span>
        </div>

        {/* Minimal Hamburger - Made slightly bolder (strokeWidth 2.5) */}
        <button 
          onClick={() => setIsOpen(true)}
          className="relative z-50 p-2 text-white hover:text-[#C720FF] transition-colors duration-300 focus:outline-none"
          aria-label="Open Menu"
        >
          <Menu className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
        </button>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Close Icon */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 md:top-8 md:right-10 p-2 text-white hover:text-[#C720FF] transition-colors duration-300 focus:outline-none"
        >
          <X className="w-10 h-10" strokeWidth={1.5} />
        </button>

        {/* Menu Items */}
        <div className="flex flex-col items-center gap-8 md:gap-10">
          {[
            { label: 'Work', view: 'home' }, 
            { label: 'Services', view: 'services' },
            { label: 'Contact', view: 'contact' }
          ].map((item, idx) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.view as ViewState)}
              className={`
                text-4xl md:text-6xl font-anton tracking-wide text-white 
                hover:text-[#C720FF] transition-colors duration-300
                transform transition-all duration-700 ease-out
                ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
              `}
              style={{ transitionDelay: `${100 + idx * 100}ms` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
