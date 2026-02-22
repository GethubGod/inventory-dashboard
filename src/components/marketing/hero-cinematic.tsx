"use client";

import { useRef, useEffect, memo } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useMotionPreferences } from "@/lib/motion";
import { DeviceStage } from "@/components/marketing/device-stage";
import { TextCallouts } from "@/components/marketing/text-callouts";
import { useIsMobile } from "@/components/marketing/mobile-constants";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────────
// Custom scroll hooks (passive scroll events + MotionValue)
// ─────────────────────────────────────────────────

function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScroll = el.offsetHeight - windowH;
      if (totalScroll <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      progress.set(p);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, progress]);

  return progress;
}

function useInSection(ref: React.RefObject<HTMLElement | null>) {
  const visible = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isIn = rect.top <= 0 && rect.bottom > 0;
      visible.set(isIn ? 1 : 0);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ref, visible]);

  return visible;
}

// ─────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────

export function HeroCinematic() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { shouldReduceMotion } = useMotionPreferences();
  const isMobile = useIsMobile();

  const scrollYProgress = useSectionProgress(heroRef);
  const inSection = useInSection(heroRef);

  // ─── BACKGROUND ────────────────────────────────
  const bg = useTransform(
    scrollYProgress,
    [0.00, 0.20, 0.40, 0.60, 0.70, 0.80, 0.90, 1.00],
    [
      "#000000", "#020202", "#050505", "#0a0a0a",
      "#1a1a1a", "#4a4a4a", "#e5e5e5", "#fafaf9",
    ]
  );

  // ─── TEXT/CTA ──────────────────────────────────
  const textY = useTransform(scrollYProgress, [0.00, 0.08], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0.00, 0.08], [1, 0.92]);
  const textOpacity = useTransform(scrollYProgress, [0.00, 0.08], [1, 0]);

  // ─── AURORA BLOBS ──────────────────────────────
  const blobOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.5, 0]);

  // ─── VIGNETTE ──────────────────────────────────
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.6, 0.15, 0]);

  // ─── SCROLL INDICATOR ──────────────────────────
  const indicatorOpacity = useTransform(scrollYProgress, [0.00, 0.05], [0.6, 0]);

  // ─── REDUCED MOTION FALLBACK ───────────────────
  if (shouldReduceMotion) {
    return <ReducedMotionFallback />;
  }

  // ─── Scroll spacer height — longer on mobile for more dwell time ───
  const scrollHeight = isMobile ? "750vh" : "600vh";

  // ─── MAIN CINEMATIC ────────────────────────────
  return (
    <>
      {/* Scroll spacer */}
      <section ref={heroRef} style={{ height: scrollHeight, position: "relative" }} />

      {/* Fixed overlay */}
      <motion.div
        className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none"
        style={{ opacity: inSection, zIndex: 5 }}
      >
        {/* Animated background */}
        <motion.div className="absolute inset-0 z-0" style={{ backgroundColor: bg }} />

        {/* Content stage */}
        <div className="relative h-full w-full overflow-hidden pointer-events-auto">

          {/* ── Background noise texture ── */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Aurora blobs */}
          <motion.div
            className="absolute top-[15%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none z-0"
            style={{ opacity: blobOpacity }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[15%] w-[35vw] h-[35vw] max-w-[420px] max-h-[420px] rounded-full bg-lime-500/8 blur-[100px] pointer-events-none z-0"
            style={{ opacity: blobOpacity }}
          />

          {/* Vignette */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              opacity: vignetteOpacity,
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* ── Device Stage (z-30) ── */}
          <DeviceStage progress={scrollYProgress} isMobile={isMobile} />

          {/* ── Overlay Text (Phase 1 & 2) ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
          >
            {/* Line 1 */}
            <motion.h1
              className="absolute text-[14vw] md:text-[12vw] leading-none font-bold tracking-tighter text-white drop-shadow-2xl"
              style={{
                y: useTransform(scrollYProgress, [0.15, 0.28, 0.33], ["50vh", "0vh", "-30vh"]),
                opacity: useTransform(scrollYProgress, [0.15, 0.18, 0.25, 0.28], [0, 1, 1, 0])
              }}
            >
              All in one
            </motion.h1>
            
            {/* Line 2 (Staggered later entry) */}
            <motion.h1
              className="absolute text-[16vw] md:text-[14vw] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-200 drop-shadow-2xl mt-[12vw]"
              style={{
                y: useTransform(scrollYProgress, [0.20, 0.32, 0.36], ["50vh", "0vh", "-30vh"]),
                opacity: useTransform(scrollYProgress, [0.20, 0.23, 0.29, 0.32], [0, 1, 1, 0])
              }}
            >
              solution
            </motion.h1>
          </motion.div>

          {/* ── Headline/CTA Group (z-20 — behind phone) ── */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 -mt-16"
            style={{
              y: textY,
              scale: textScale,
              opacity: textOpacity,
            }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] mb-6 text-center text-white">
              Inventory that runs <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-lime-400">
                itself.
              </span>
            </h1>

            <p className="text-lg md:text-2xl font-light mb-10 max-w-2xl mx-auto text-center text-zinc-400">
              Order with your voice. Forecast with AI.
              <br className="hidden sm:block" />
              Never guess what to prep again.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-8 py-4 text-lg font-medium text-black hover:bg-lime-400 transition-colors shadow-[0_0_30px_rgba(132,204,22,0.3)] pointer-events-auto"
            >
              Start for free <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          {/* ── Text Callouts (Phase 3) — Desktop only ── */}
          <TextCallouts 
            progress={scrollYProgress} 
            contents={[
              {
                eyebrow: "TIME SAVED",
                value: "2.5 hrs",
                supporting: "per shift on ordering & prep",
                accent: "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400"
              },
              {
                eyebrow: "WASTE REDUCED",
                value: "−18%",
                supporting: "from smarter forecasting",
                accent: "text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500"
              },
              {
                eyebrow: "LIVE SYNC",
                value: "< 2 min",
                supporting: "always up to date inventory",
                accent: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400"
              },
              {
                eyebrow: "ACCURACY",
                value: "99%",
                supporting: "invoice parsing precision",
                accent: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
              }
            ]}
            windows={[
              [0.38, 0.46],
              [0.46, 0.54],
              [0.54, 0.62],
              [0.62, 0.70]
            ]}
          />

          {/* ── Scroll Indicator (Fades out early) ── */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50"
              style={{ opacity: indicatorOpacity }}
            >
              <span className="text-xs font-medium text-white/50 tracking-widest uppercase mb-2">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ChevronDown className="h-4 w-4 text-white/50" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────
// Reduced Motion Fallback
// ─────────────────────────────────────────────────

function ReducedMotionFallback() {
  return (
    <section className="bg-[#fafaf9] text-zinc-900 relative min-h-screen py-32 flex flex-col items-center justify-center">
      <div className="text-center z-10 max-w-4xl px-4 mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Inventory that runs{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-lime-400">
            itself.
          </span>
        </h1>
        <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto">
          Order with your voice. Forecast with AI. Never guess what to prep again.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-8 py-4 text-lg font-medium text-black hover:bg-lime-400 transition-colors"
        >
          Start for free <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Static phone mock */}
      <div className="w-full max-w-xs mx-auto px-4 mb-10">
        <div className="aspect-[9/19.5] bg-[#0a0a0a] rounded-[42px] border-[3px] border-zinc-700 overflow-hidden p-4 shadow-xl">
          <div className="w-16 h-6 mx-auto rounded-full bg-zinc-800 mb-4" />
          <div className="space-y-3 px-2">
            <div className="h-6 bg-zinc-800 rounded-lg w-3/4" />
            <div className="h-4 bg-zinc-800/60 rounded-lg w-full" />
            <div className="h-4 bg-zinc-800/60 rounded-lg w-5/6" />
            <div className="h-10 bg-teal-900/40 rounded-xl mt-4" />
            <div className="h-10 bg-teal-900/30 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Static benefit tiles */}
      <div className="flex gap-4 flex-wrap justify-center px-4 mb-16">
        <div className="w-[200px] h-[130px] rounded-xl bg-white border border-zinc-200 shadow-lg flex flex-col items-center justify-center gap-2 px-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Time Saved</p>
          <p className="text-3xl font-bold text-teal-500">2.5 hrs</p>
        </div>
        <div className="w-[200px] h-[130px] rounded-xl bg-white border border-zinc-200 shadow-lg flex flex-col items-center justify-center gap-2 px-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Waste Reduced</p>
          <p className="text-3xl font-bold text-lime-500">−18%</p>
        </div>
      </div>

      {/* Static desktop preview */}
      <div className="w-full max-w-4xl px-4 relative">
        <div className="w-full aspect-[16/9] bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden p-6">
          <div className="flex gap-4 mb-4">
            {["Revenue", "Orders", "COGS"].map((label) => (
              <div key={label} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="text-lg font-bold text-zinc-900 mt-1">$12.4k</p>
              </div>
            ))}
          </div>
          <div className="h-24 bg-zinc-50 rounded-xl border border-zinc-100" />
        </div>
      </div>
    </section>
  );
}
