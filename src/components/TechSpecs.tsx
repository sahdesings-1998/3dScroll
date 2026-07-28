import React from 'react';
import { Shield, Zap, Watch, Maximize2, Cpu, CheckCircle2 } from 'lucide-react';

const specs = [
  {
    icon: Watch,
    title: 'CASE DIAMETER',
    value: '42.0 MM',
    detail: 'Grade 5 Skeletonized Titanium',
    tag: 'ULTRA-LIGHTWEIGHT',
  },
  {
    icon: Cpu,
    title: 'CALIBRE SR-01',
    value: '348 PARTS',
    detail: 'Manual Tourbillon Escapement',
    tag: 'HAND-FINISHED',
  },
  {
    icon: Zap,
    title: 'POWER RESERVE',
    value: '72 HOURS',
    detail: 'Twin Co-Axial Barrel System',
    tag: 'HIGH EFFICIENCY',
  },
  {
    icon: Shield,
    title: 'WATER RESISTANCE',
    value: '10 ATM / 100M',
    detail: 'Triple Gasket Screw-Down Crown',
    tag: 'HERMETICALLY SEALED',
  },
  {
    icon: Maximize2,
    title: 'CRYSTAL',
    value: 'SAPPHIRE',
    detail: 'Double Anti-Reflective Coating',
    tag: '9 MOHS HARDNESS',
  },
  {
    icon: CheckCircle2,
    title: 'STRAP INTEGRATION',
    value: 'FLUROELASTOMER',
    detail: 'Quick-Release Titanium Clasp',
    tag: 'ERGONOMIC FIT',
  },
];

export const TechSpecs: React.FC = () => {
  return (
    <section id="specs" className="relative z-10 py-20 px-6 bg-transparent text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-mono-tech text-amber-400 tracking-[0.25em] uppercase">
              TECHNICAL ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white/90">
              SPECIFICATIONS &amp; CRAFTSMANSHIP
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-md font-light">
            Every component of the SR-Takat is manufactured with micron-level precision, combining aerospace materials with Swiss horological heritage.
          </p>
        </div>

        {/* Transparent Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/[0.02] backdrop-blur-xs p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-amber-400/30 transition-colors">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono-tech text-white/40 tracking-wider">
                    {item.title}
                  </span>
                  <div className="text-3xl font-light text-white/90 group-hover:text-amber-400 transition-colors">
                    {item.value}
                  </div>
                </div>

                <p className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60 font-light">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechSpecs;
