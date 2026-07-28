import React from 'react';
import { Compass, ArrowRight, ChevronRight, Mail } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-transparent text-slate-900 border-t border-slate-200/80 pt-16 pb-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* White Theme 45% Opacity Newsletter CTA Card */}
        <div className="bg-white/45 backdrop-blur-md p-8 sm:p-10 md:p-12 rounded-3xl border border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:bg-white/60 hover:border-amber-500/40 hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2.5 text-center lg:text-left">
            <span className="text-xs font-mono-tech text-amber-800 tracking-[0.25em] uppercase font-bold flex items-center justify-center lg:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>EXCLUSIVE ALLOCATION</span>
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-slate-900 tracking-tight">
              JOIN THE PRIVATE REGISTRY
            </h3>
            <p className="text-sm text-slate-700 max-w-md font-normal leading-relaxed">
              Receive priority access to limited batch drops, technical horology blueprints, and concierge updates.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-80 px-5 py-3.5 rounded-full bg-white/70 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 font-mono-tech placeholder:text-slate-500 transition-all duration-200 shadow-inner"
            />
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center space-x-2.5 hover:bg-amber-600 hover:shadow-[0_4px_20px_rgba(180,83,9,0.3)] transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5">
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* White Theme 45% Opacity Links Grid Card */}
        <div className="bg-white/45 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.05)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-mono-tech">
          {/* Brand Column */}
          <div className="space-y-4">
            <img
              src={logoImg}
              alt="SR TAKAT Logo"
              className="h-10 w-auto object-contain drop-shadow-xs"
            />
            <p className="text-slate-600 font-sans font-normal leading-relaxed text-xs">
              Pioneering micro-mechanical precision and skeletal horological architecture engineered for eternity.
            </p>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <div className="text-amber-800 tracking-[0.2em] uppercase font-bold text-[11px]">
              COLLECTIONS
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>EDITION 01 TITANIUM</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>CALIBRE SR-01</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>TOURBILLON SERIES</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Horology Column */}
          <div className="space-y-3">
            <div className="text-amber-800 tracking-[0.2em] uppercase font-bold text-[11px]">
              HOROLOGY
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>SKELETONIZATION</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>MATERIALS LAB</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>CHRONOMETRY</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact Column */}
          <div className="space-y-3">
            <div className="text-amber-800 tracking-[0.2em] uppercase font-bold text-[11px]">
              LEGAL &amp; CONTACT
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>PRIVACY POLICY</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>TERMS OF ALLOCATION</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700 transition-all duration-200 flex items-center space-x-1 group">
                  <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  <span>CONCIERGE@SR-TAKAT.COM</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono-tech text-slate-600 pt-6 px-2 border-t border-slate-200/80 gap-4">
          <div className="font-medium">© {new Date().getFullYear()} SR-TAKAT HOROLOGY LABS. ALL RIGHTS RESERVED.</div>
          <div className="font-semibold text-amber-800 tracking-wider">SWISS DESIGNED // HIGH-PRECISION MANUFACTURE</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
