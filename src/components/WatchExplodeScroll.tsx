import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, ChevronDown, Compass, Cpu, Layers, ShieldCheck } from 'lucide-react';
import TechSpecs from './TechSpecs';
import Footer from './Footer';
import logoImg from '../assets/logo.png';

const TOTAL_FRAMES = 40;
const BACKGROUND_COLOR = '#ffffff';

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

    // Clear background cleanly in white
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, clientWidth, clientHeight);

    // Viewport Aspect-Adaptive Scaling Math (Responsive watch bg framer)
    const imgRatio = img.width / img.height;
    const canvasRatio = clientWidth / clientHeight;

    let drawW: number;
    let drawH: number;

    // Responsive scale factor based on viewport width
    let scaleFactor: number;
    if (clientWidth < 500) {
      // Under 500px: drawW = clientWidth * 1.2 for immersive mobile experience
      scaleFactor = 1.5;
    } else if (clientWidth < 640) {
      scaleFactor = 1.0;
    } else if (clientWidth < 1024) {
      scaleFactor = 0.9;
    } else if (clientWidth < 1440) {
      scaleFactor = 0.85;
    } else {
      scaleFactor = 0.8;
    }

    if (clientWidth < 640 || canvasRatio < 1.8) {
      // Mobile, tablet, and portrait viewports
      drawW = clientWidth * scaleFactor;
      drawH = drawW / imgRatio;
    } else if (canvasRatio > imgRatio) {
      // Widescreen landscape viewports
      drawW = clientWidth * scaleFactor;
      drawH = drawW / imgRatio;
      if (drawH > clientHeight * 0.95) {
        drawH = clientHeight * 0.95;
        drawW = drawH * imgRatio;
      }
    } else {
      drawH = clientHeight * scaleFactor;
      drawW = drawH * imgRatio;
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
    <div className="relative w-full min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* 1. Fullscreen White Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 px-4"
          >
            <div className="absolute w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-6 text-center max-w-sm">
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#b45309"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * loadProgress) / 100}
                    strokeLinecap="round"
                    transition={{ ease: 'linear' }}
                  />
                </svg>
                <img
                  src={logoImg}
                  alt="SR TAKAT Logo"
                  className="absolute w-9 h-9 sm:w-12 sm:h-12 object-contain animate-pulse"
                />
              </div>

              <div className="text-center space-y-2">
                <span className="text-[10px] sm:text-xs font-mono-tech tracking-[0.3em] uppercase text-amber-700 font-semibold block">
                  Initializing Horological Engine
                </span>
                <h2 className="text-xl sm:text-2xl font-light tracking-tight text-slate-900">
                  TAKAT <span className="text-amber-600 font-semibold">CHRONO</span>
                </h2>
              </div>

              <div className="w-56 sm:w-64 space-y-2">
                <div className="w-full h-[2px] bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] font-mono-tech text-slate-500 font-medium">
                  <span>PRELOADING 4K FRAMES</span>
                  <span>{loadProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Persistent Full-Viewport Canvas in True 4K Crisp Quality */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* 3. Persistent Floating Telemetry Corner Accents */}
      {!isLoading && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-slate-300/80 pointer-events-none" />
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-slate-300/80 pointer-events-none" />
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-slate-300/80 pointer-events-none" />
          <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-slate-300/80 pointer-events-none" />
        </div>
      )}

      {/* 4. Scroll Experience Container with Ultra-wide Bounds */}
      <div className="relative z-10 w-full bg-transparent">

        {/* SECTION 1: HERO (BOTTOM-LEFT ALIGNED WITH FLUID FONT SIZES) */}
        <section className="relative min-h-screen flex items-end justify-start px-4 xs:px-6 sm:px-12 md:px-16 lg:px-20 pb-16 sm:pb-28 pt-28 sm:pt-36 bg-transparent">
          <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] w-full mx-auto ">
            <div className="space-y-3 max-w-lg">
              <span className="text-[10px] xs:text-[11px] font-mono-tech uppercase tracking-[0.3em] text-amber-800 font-bold block">
                CALIBRE SR-01
              </span>

              <h1 className="text-fluid-hero font-extralight tracking-tighter text-slate-900 uppercase leading-none">
                SR-TAKAT
              </h1>

              <p className="text-xs sm:text-sm font-mono-tech text-slate-600 tracking-[0.2em] uppercase pt-1 font-medium">
                PRECISION HOROLOGY UNVEILED
              </p>

              <div className="pt-4 flex items-center space-x-2 text-slate-700 text-xs font-mono-tech tracking-widest uppercase font-semibold">
                <ChevronDown className="w-4 h-4 animate-bounce text-amber-700 flex-shrink-0" />
                <span>SCROLL TO DISASSEMBLE</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURE #1 - CHASSIS */}
        <section id="chassis" className="min-h-screen flex items-center px-4 xs:px-6 sm:px-12 md:px-20 py-16 sm:py-24 bg-transparent">
          <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] w-full mx-auto">
            <div className="w-full max-w-lg bg-white/80 sm:bg-white/45 backdrop-blur-xl sm:backdrop-blur-md p-6 xs:p-8 sm:p-10 rounded-3xl border border-slate-200/90 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:bg-white/80 hover:border-amber-500/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2.5 text-amber-700 text-xs font-mono-tech tracking-widest uppercase font-semibold">
                <Cpu className="w-4 h-4 flex-shrink-0" />
                <span>01 // CHASSIS ARCHITECTURE</span>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
                TITANIUM CORE
              </h2>

              <p className="text-xs xs:text-sm sm:text-base text-slate-700 sm:text-slate-600 leading-relaxed font-normal">
                Forged from Grade 5 titanium. Watch components expand and separate smoothly in the background, exposing 348 micro-engineered internal elements with extreme resolution.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono-tech text-slate-600 border-t border-slate-200">
                <div>WEIGHT: <span className="text-amber-700 font-bold">64G</span></div>
                <div className="text-slate-300 hidden xs:inline">•</div>
                <div>TOLERANCE: <span className="text-amber-700 font-bold">0.002MM</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURE #2 - ESCAPEMENT */}
        <section id="movement" className="min-h-screen flex items-center justify-end px-4 xs:px-6 sm:px-12 md:px-20 py-16 sm:py-24 bg-transparent">
          <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] w-full mx-auto flex justify-center md:justify-end">
            <div className="w-full max-w-lg bg-white/80 sm:bg-white/45 backdrop-blur-xl sm:backdrop-blur-md p-6 xs:p-8 sm:p-10 rounded-3xl border border-slate-200/90 space-y-5 text-left md:text-right shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:bg-white/80 hover:border-amber-500/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-start md:justify-end space-x-2.5 text-amber-700 text-xs font-mono-tech tracking-widest uppercase font-semibold">
                <span className="order-2 md:order-1">02 // ESCAPEMENT</span>
                <Layers className="w-4 h-4 flex-shrink-0 order-1 md:order-2" />
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
                MICRO-MECHANICAL TOURBILLON
              </h2>

              <p className="text-xs xs:text-sm sm:text-base text-slate-700 sm:text-slate-600 leading-relaxed font-normal">
                As you scroll further down, the internal floating tourbillon cage reaches maximum explosion in the backdrop, oscillating at 28,800 vibrations per hour.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-start md:justify-end gap-3 sm:gap-4 text-xs font-mono-tech text-slate-600 border-t border-slate-200">
                <div>POWER RESERVE: <span className="text-amber-700 font-bold">72 HOURS</span></div>
                <div className="text-slate-300 hidden xs:inline">•</div>
                <div>FREQUENCY: <span className="text-amber-700 font-bold">4HZ</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: REASSEMBLY & CTA */}
        <section id="craftsmanship" className="min-h-screen flex flex-col items-center justify-center text-center px-4 xs:px-6 py-16 sm:py-24 bg-transparent">
          <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] w-full mx-auto flex justify-center">
            <div className="w-full max-w-xl bg-white/80 sm:bg-white/45 backdrop-blur-xl sm:backdrop-blur-md p-6 xs:p-8 sm:p-12 rounded-3xl border border-amber-500/30 space-y-6 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:bg-white/80 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 text-center">
              <div className="inline-flex items-center space-x-2 text-amber-700 text-xs font-mono-tech tracking-widest uppercase font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>REASSEMBLED PERFECTION</span>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-5xl font-light tracking-tight text-slate-900 uppercase">
                SCULPTED FOR ETERNITY
              </h2>

              <p className="text-xs xs:text-sm sm:text-base text-slate-700 sm:text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
                The watch movement smoothly converges back into its titanium housing as you approach the technical specifications below.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-600 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-lg">
                  RESERVE EDITION 01
                </button>
                <a href="#specs" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-white/80 text-slate-900 text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-white border border-slate-300 transition-all duration-300 inline-block">
                  EXPLORE SPECIFICATIONS
                </a>
              </div>
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
