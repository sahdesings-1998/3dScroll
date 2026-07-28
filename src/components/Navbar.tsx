import React, { useState, useEffect } from 'react';
import { Compass, ArrowUpRight, Menu, X } from 'lucide-react';

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-[#050508]/90 backdrop-blur-2xl border-b border-white/15 shadow-xl'
          : 'py-6 bg-gradient-to-b from-[#050505]/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center group-hover:border-amber-400 transition-colors shadow-md">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-light tracking-tight text-white group-hover:text-amber-300 transition-colors drop-shadow-sm">
              SR-TAKAT
            </span>
            <span className="text-[9px] font-mono-tech text-amber-300/80 tracking-widest uppercase font-medium">
              HOROLOGY LABS
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-tech tracking-widest uppercase text-gray-200 bg-[#0a0a0f]/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/15">
          <a href="#chassis" className="hover:text-amber-300 transition-colors font-medium">
            CHASSIS
          </a>
          <a href="#movement" className="hover:text-amber-300 transition-colors font-medium">
            MOVEMENT
          </a>
          <a href="#specs" className="hover:text-amber-300 transition-colors font-medium">
            SPECIFICATIONS
          </a>
          <a href="#craftsmanship" className="hover:text-amber-300 transition-colors font-medium">
            CRAFTSMANSHIP
          </a>
        </nav>

        {/* Header Right Action */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-5 py-2 rounded-full bg-[#0a0a0f]/80 backdrop-blur-md hover:bg-amber-400/20 border border-amber-400/40 text-xs font-mono-tech text-white tracking-wider uppercase flex items-center space-x-2 transition-all shadow-md cursor-pointer">
            <span>PRE-ORDER</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0c]/95 border-b border-white/10 px-6 py-6 space-y-4">
          <a
            href="#chassis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono-tech text-white/70 hover:text-amber-400"
          >
            01 // CHASSIS
          </a>
          <a
            href="#movement"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono-tech text-white/70 hover:text-amber-400"
          >
            02 // MOVEMENT
          </a>
          <a
            href="#specs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono-tech text-white/70 hover:text-amber-400"
          >
            03 // SPECIFICATIONS
          </a>
          <button className="w-full mt-4 py-3 rounded-full bg-amber-400 text-black text-xs font-bold tracking-widest uppercase">
            PRE-ORDER TIMEPIECE
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
