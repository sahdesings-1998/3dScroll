import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-transparent text-white border-t border-white/10 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Transparent Newsletter CTA Card */}
        <div className="bg-white/[0.02] backdrop-blur-xs p-8 md:p-12 rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-mono-tech text-amber-400 tracking-widest uppercase">
              EXCLUSIVE ALLOCATION
            </span>
            <h3 className="text-2xl sm:text-4xl font-light text-white/90">
              JOIN THE PRIVATE REGISTRY
            </h3>
            <p className="text-sm text-white/50 max-w-md font-light">
              Receive priority access to limited batch drops and technical horology blueprints.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-80 px-5 py-3.5 rounded-full bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400 font-mono-tech placeholder:text-white/30"
            />
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-amber-400 text-black font-semibold text-xs tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-amber-300 transition-colors">
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10 text-xs font-mono-tech">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-sans font-light tracking-wide text-white/90">
                SR-TAKAT
              </span>
            </div>
            <p className="text-white/40 font-sans font-light leading-relaxed">
              Pioneering micro-mechanical precision and skeletal horological architecture.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-amber-400 tracking-widest uppercase">COLLECTIONS</div>
            <ul className="space-y-2 text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">EDITION 01 TITANIUM</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CALIBRE SR-01</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TOURBILLON SERIES</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-amber-400 tracking-widest uppercase">HOROLOGY</div>
            <ul className="space-y-2 text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">SKELETONIZATION</a></li>
              <li><a href="#" className="hover:text-white transition-colors">MATERIALS LAB</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CHRONOMETRY</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-amber-400 tracking-widest uppercase">LEGAL &amp; CONTACT</div>
            <ul className="space-y-2 text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TERMS OF ALLOCATION</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CONCIERGE@SR-TAKAT.COM</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-tech text-white/30 pt-8 border-t border-white/5 gap-4">
          <div>© {new Date().getFullYear()} SR-TAKAT HOROLOGY LABS. ALL RIGHTS RESERVED.</div>
          <div>SWISS DESIGNED // HIGH-PRECISION MANUFACTURE</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
