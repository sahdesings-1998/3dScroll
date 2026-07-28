import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, ChevronDown, Compass, Cpu, Layers, ShieldCheck } from 'lucide-react';
import TechSpecs from './TechSpecs';
import Footer from './Footer';

const TOTAL_FRAMES = 40;
const BACKGROUND_COLOR = '#050505';

// Pre-import frames for Vite bundler optimization
const frameModules = import.meta.glob('/src/assets/SR-watch/ezgif-frame-*.jpg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

// Fallback path builder
const getFramePath = (index: number): string => {
  const frameNum = String(index + 1).padStart(3, '0');
  const key = `/src/assets/SR-watch/ezgif-frame-${frameNum}.jpg`;
  if (frameModules[key]) {
    return frameModules[key];
  }
  return `/src/assets/SR-watch/ezgif-frame-${frameNum}.jpg`;
};

export const WatchExplodeScroll: React.FC = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickFrameRef = useRef<number>(0);

  // Audio feedback synthesizer on scroll ticks
  const triggerTickSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100 + Math.random() * 300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio playback silently ignored if restricted
    }
  }, [isMuted]);

  // Preload image sequence into memory
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (!isMounted) return;
        loadedImages[i] = img;
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));

        if (loadedCount === TOTAL_FRAMES) {
          setImages(loadedImages);
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImages(loadedImages);
          setIsLoading(false);
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Window scroll progress across the entire page height
  const { scrollYProgress } = useScroll();

  const frameIndexMotion = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_FRAMES - 1]
  );

  // High-performance canvas renderer
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndex)));
    const img = images[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const clientWidth = window.innerWidth;
    const clientHeight = window.innerHeight;

    if (canvas.width !== Math.floor(clientWidth * dpr) || canvas.height !== Math.floor(clientHeight * dpr)) {
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear background cleanly
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, clientWidth, clientHeight);

    // Full Viewport Cover Math (100% viewport coverage on desktop, tablet, and mobile with zero gaps)
    const imgRatio = img.width / img.height;
    const canvasRatio = clientWidth / clientHeight;

    let drawW: number;
    let drawH: number;

    if (canvasRatio > imgRatio) {
      drawW = clientWidth;
      drawH = clientWidth / imgRatio;
    } else {
      drawH = clientHeight;
      drawW = clientHeight * imgRatio;
    }

    const drawX = (clientWidth - drawW) / 2;
    const drawY = (clientHeight - drawH) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    ctx.restore();
  }, [images]);

  const rafIdRef = useRef<number | null>(null);

  // Sync motion frame index with window scroll with 60 FPS RAF throttling
  useMotionValueEvent(frameIndexMotion, 'change', (latest) => {
    const targetIdx = Math.round(latest);
    if (targetIdx !== currentFrameIndex) {
      setCurrentFrameIndex(targetIdx);
      if (Math.abs(targetIdx - lastTickFrameRef.current) >= 1) {
        triggerTickSound();
        lastTickFrameRef.current = targetIdx;
      }
    }
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      renderFrame(latest);
      rafIdRef.current = null;
    });
  });

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrameIndex, renderFrame]);

  // Initial render when images finish preloading
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      renderFrame(0);
    }
  }, [isLoading, images, renderFrame]);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white">
      {/* 1. Fullscreen Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white"
          >
            <div className="absolute w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-6">
              <div className="relative flex items-center justify-center w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#d4af37"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * loadProgress) / 100}
                    strokeLinecap="round"
                    transition={{ ease: 'linear' }}
                  />
                </svg>
                <Compass className="absolute w-8 h-8 text-amber-400 animate-pulse" />
              </div>

              <div className="text-center space-y-2">
                <span className="text-xs font-mono-tech tracking-[0.3em] uppercase text-amber-400/80 font-medium">
                  Initializing Horological Engine
                </span>
                <h2 className="text-2xl font-light tracking-tight text-white">
                  SR-TAKAT <span className="text-amber-400 font-semibold">CHRONO</span>
                </h2>
              </div>

              <div className="w-64 space-y-2">
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-200"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono-tech text-white/60">
                  <span>PRELOADING 4K FRAMES</span>
                  <span>{loadProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Persistent Full-Viewport Cover Canvas with Adaptive Darkness Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Dynamic Darkness & Contrast Overlay Gradients for 100% Readability */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15)_0%,_rgba(5,5,5,0.65)_65%,_rgba(5,5,5,0.92)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-transparent to-[#050505]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050508]/90 via-[#050508]/30 to-transparent pointer-events-none" />
      </div>

      {/* 3. Persistent Floating Telemetry HUD */}
      {!isLoading && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {/* Top Bar HUD */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-3 bg-[#0a0a0f]/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono-tech text-white/90 uppercase tracking-wider font-medium">
                SR-TAKAT // CALIBRE 01
              </span>
            </div>

            <div className="flex items-center space-x-3 pointer-events-auto">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-[#0a0a0f]/80 backdrop-blur-xl p-2.5 rounded-full text-white/80 hover:text-white border border-white/20 hover:border-amber-400 transition-all duration-300 shadow-lg group"
                title={isMuted ? 'Unmute mechanical ticks' : 'Mute audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Bar HUD */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-2 bg-[#0a0a0f]/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 text-xs font-mono-tech text-white/90 shadow-lg">
              <span className="text-amber-400 font-semibold">FRAME</span>
              <span>{String(currentFrameIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/70">{TOTAL_FRAMES}</span>
            </div>

            <div className="hidden sm:flex items-center space-x-3 bg-[#0a0a0f]/80 backdrop-blur-xl px-5 py-2 rounded-full border border-white/20 shadow-lg">
              <span className="text-[11px] font-mono-tech text-white/70 uppercase tracking-widest font-medium">
                DISASSEMBLY STATE
              </span>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-75"
                  style={{ width: `${((currentFrameIndex + 1) / TOTAL_FRAMES) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono-tech text-amber-400 font-semibold">
                {Math.round(((currentFrameIndex + 1) / TOTAL_FRAMES) * 100)}%
              </span>
            </div>
          </div>

          {/* Corner Crosshair Accents */}
          <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-white/30 pointer-events-none" />
          <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-white/30 pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-white/30 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-white/30 pointer-events-none" />
        </div>
      )}

      {/* 4. Minimalist Bottom-Left Aligned Hero Section */}
      <div className="relative z-10 w-full bg-transparent">

        {/* SECTION 1: MINIMALIST HERO (BOTTOM-LEFT ALIGNED) */}
        <section className="relative min-h-screen flex items-end justify-start px-6 sm:px-12 md:px-16 pb-16 sm:pb-24 pt-32 bg-transparent">
          <div className="max-w-xl space-y-4 bg-[#050508]/75 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="inline-flex items-center space-x-2 bg-amber-400/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-amber-400/40 text-amber-300 text-[11px] font-mono-tech uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CALIBRE SR-01</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tighter text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              SR-TAKAT
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light tracking-wide leading-relaxed drop-shadow-md">
              PRECISION HOROLOGY UNVEILED
            </p>

            <div className="pt-3 flex items-center space-x-3 text-amber-300/90 text-xs font-mono-tech tracking-widest uppercase font-medium">
              <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
              <span>SCROLL TO DISASSEMBLE</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURE #1 - CHASSIS */}
        <section id="chassis" className="min-h-screen flex items-center px-4 sm:px-12 md:px-20 py-20 bg-transparent">
          <div className="max-w-lg bg-[#08080d]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/15 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center space-x-3 text-amber-300 text-xs font-mono-tech tracking-widest uppercase font-semibold">
              <Cpu className="w-4 h-4" />
              <span>01 // CHASSIS ARCHITECTURE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight drop-shadow-md">
              TITANIUM CORE
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
              Forged from Grade 5 titanium. Watch components expand and separate smoothly in the background, exposing 348 micro-engineered internal elements with extreme resolution.
            </p>

            <div className="pt-4 flex items-center gap-4 text-xs font-mono-tech text-gray-300 border-t border-white/15">
              <div>WEIGHT: <span className="text-amber-300 font-semibold">64G</span></div>
              <div className="text-white/30">•</div>
              <div>TOLERANCE: <span className="text-amber-300 font-semibold">0.002MM</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURE #2 - ESCAPEMENT */}
        <section id="movement" className="min-h-screen flex items-center justify-end px-4 sm:px-12 md:px-20 py-20 bg-transparent">
          <div className="max-w-lg bg-[#08080d]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/15 space-y-5 text-right shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-end space-x-3 text-amber-300 text-xs font-mono-tech tracking-widest uppercase font-semibold">
              <span>02 // ESCAPEMENT</span>
              <Layers className="w-4 h-4" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight drop-shadow-md">
              MICRO-MECHANICAL TOURBILLON
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
              As you scroll further down, the internal floating tourbillon cage reaches maximum explosion in the backdrop, oscillating at 28,800 vibrations per hour.
            </p>

            <div className="pt-4 flex items-center justify-end gap-4 text-xs font-mono-tech text-gray-300 border-t border-white/15">
              <div>POWER RESERVE: <span className="text-amber-300 font-semibold">72 HOURS</span></div>
              <div className="text-white/30">•</div>
              <div>FREQUENCY: <span className="text-amber-300 font-semibold">4HZ</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 4: REASSEMBLY & CTA */}
        <section id="craftsmanship" className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-transparent">
          <div className="bg-[#08080d]/85 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-amber-400/40 space-y-6 max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <div className="inline-flex items-center space-x-2 text-amber-300 text-xs font-mono-tech tracking-widest uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>REASSEMBLED PERFECTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase drop-shadow-md">
              SCULPTED FOR ETERNITY
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-md mx-auto font-normal">
              The watch movement smoothly converges back into its titanium housing as you approach the technical specifications below.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
                RESERVE EDITION 01
              </button>
              <a href="#specs" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 text-white text-sm font-semibold tracking-wider uppercase hover:bg-white/20 border border-white/25 transition-all duration-300 inline-block">
                EXPLORE SPECIFICATIONS
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 5: TECHNICAL SPECIFICATIONS */}
        <TechSpecs />

        {/* SECTION 6: FOOTER */}
        <Footer />

      </div>
    </div>
  );
};

export default WatchExplodeScroll;
