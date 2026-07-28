import React, { useState, useEffect } from 'react';
import { Compass, ArrowUpRight, Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'py-2.5 sm:py-3 bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-xs'
          : 'py-4 sm:py-6 bg-gradient-to-b from-white/95 via-white/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 xs:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Crisp, Scaled & Aspect Ratio Preserved */}
        <a href="#" className="flex items-center space-x-2.5 group flex-shrink-0 py-1" aria-label="SR TAKAT Home">
          <img
            src={logoImg}
            alt="SR TAKAT Logo"
            className="h-8 xs:h-9 sm:h-10 md:h-11 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 text-[11px] lg:text-xs font-mono-tech tracking-widest uppercase text-slate-700 bg-white/60 backdrop-blur-md px-5 lg:px-7 py-2 rounded-full border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:bg-white/80 transition-all duration-300">
          <a href="#chassis" className="hover:text-amber-700 transition-colors font-semibold py-1 px-1">
            CHASSIS
          </a>
          <a href="#movement" className="hover:text-amber-700 transition-colors font-semibold py-1 px-1">
            MOVEMENT
          </a>
          <a href="#specs" className="hover:text-amber-700 transition-colors font-semibold py-1 px-1">
            SPECIFICATIONS
          </a>
          <a href="#craftsmanship" className="hover:text-amber-700 transition-colors font-semibold py-1 px-1">
            CRAFTSMANSHIP
          </a>
        </nav>

        {/* Header Right Action */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-4 lg:px-6 py-2 rounded-full bg-slate-900 hover:bg-amber-600 border border-slate-800 text-[11px] lg:text-xs font-mono-tech text-white tracking-wider uppercase flex items-center space-x-2 transition-all shadow-md cursor-pointer hover:shadow-amber-500/20">
            <span>PRE-ORDER</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-800 hover:text-amber-700 focus:outline-none touch-target flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
        </button>
      </div>

      {/* Mobile Menu Overlay Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[100%] bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 px-6 py-8 space-y-5 shadow-2xl transition-all duration-300 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-4">
            <a
              href="#chassis"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-amber-50/80 text-sm font-mono-tech text-slate-900 hover:text-amber-700 font-semibold transition-colors"
            >
              <span>01 // CHASSIS</span>
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
            </a>
            <a
              href="#movement"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-amber-50/80 text-sm font-mono-tech text-slate-900 hover:text-amber-700 font-semibold transition-colors"
            >
              <span>02 // MOVEMENT</span>
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
            </a>
            <a
              href="#specs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-amber-50/80 text-sm font-mono-tech text-slate-900 hover:text-amber-700 font-semibold transition-colors"
            >
              <span>03 // SPECIFICATIONS</span>
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
            </a>
            <a
              href="#craftsmanship"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-amber-50/80 text-sm font-mono-tech text-slate-900 hover:text-amber-700 font-semibold transition-colors"
            >
              <span>04 // CRAFTSMANSHIP</span>
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-4 py-3.5 rounded-full bg-slate-900 text-white text-xs font-mono-tech font-bold tracking-widest uppercase hover:bg-amber-600 transition-colors shadow-lg flex items-center justify-center space-x-2"
          >
            <span>PRE-ORDER TIMEPIECE</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
