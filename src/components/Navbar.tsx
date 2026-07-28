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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-sm'
          : 'py-6 bg-gradient-to-b from-white/90 via-white/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <img
            src={logoImg}
            alt="SR TAKAT Logo"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-tech tracking-widest uppercase text-slate-700 bg-white/45 backdrop-blur-md px-6 py-2 rounded-full border border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:bg-white/60 transition-all duration-300">
          <a href="#chassis" className="hover:text-amber-700 transition-colors font-semibold">
            CHASSIS
          </a>
          <a href="#movement" className="hover:text-amber-700 transition-colors font-semibold">
            MOVEMENT
          </a>
          <a href="#specs" className="hover:text-amber-700 transition-colors font-semibold">
            SPECIFICATIONS
          </a>
          <a href="#craftsmanship" className="hover:text-amber-700 transition-colors font-semibold">
            CRAFTSMANSHIP
          </a>
        </nav>

        {/* Header Right Action */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-5 py-2 rounded-full bg-slate-900 hover:bg-amber-600 border border-slate-800 text-xs font-mono-tech text-white tracking-wider uppercase flex items-center space-x-2 transition-all shadow-md cursor-pointer">
            <span>PRE-ORDER</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 space-y-4 shadow-lg">
          <a
            href="#chassis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono-tech text-slate-800 hover:text-amber-700 font-medium"
          >
            01 // CHASSIS
          </a>
          <a
            href="#movement"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono-tech text-slate-800 hover:text-amber-700 font-medium"
          >
            02 // MOVEMENT
          </a>
          <a
            href="#specs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-mono-tech text-slate-800 hover:text-amber-700 font-medium"
          >
            03 // SPECIFICATIONS
          </a>
          <button className="w-full mt-4 py-3 rounded-full bg-slate-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-amber-600 transition-colors shadow-md">
            PRE-ORDER TIMEPIECE
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
