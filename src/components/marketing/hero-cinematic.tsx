"use client";

import { useRef, useEffect, memo } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useMotionPreferences } from "@/lib/motion";
import { DeviceStage } from "@/components/marketing/device-stage";
import { FlipTiles } from "@/components/marketing/flip-tiles";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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

  const scrollYProgress = useSectionProgress(heroRef);
  const inSection = useInSection(heroRef);

  // ─── BACKGROUND ────────────────────────────────
  const bg = useTransform(
    scrollYProgress,
    [0.00, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.96, 1.00],
    [
      "#000000", "#000000", "#050505", "#0c0c0c",
      "#181818", "#2a2a2a", "#484848", "#6a6a6a",
      "#999999", "#d0d0d0", "#efece4", "#fafaf9",
    ]
  );

  // ─── TEXT/CTA ──────────────────────────────────
  // Text must fade out BEFORE phone reaches center (z-20 behind z-30 phone)
  // Adjusted text coordinates to fade exactly as phone rises, removing overlap
  const textY = useTransform(scrollYProgress, [0.05, 0.18], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0.05, 0.18], [1, 0.92]);
  const textOpacity = useTransform(scrollYProgress, [0.00, 0.08, 0.18], [1, 1, 0]);

  // ─── AURORA BLOBS ──────────────────────────────
  const blobOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.5, 0]);

  // ─── VIGNETTE ──────────────────────────────────
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.6, 0.15, 0]);

  // ─── REDUCED MOTION FALLBACK ───────────────────
  if (shouldReduceMotion) {
    return <ReducedMotionFallback />;
  }

  // ─── MAIN CINEMATIC ────────────────────────────
  return (
    <>
      {/* Scroll spacer */}
      <section ref={heroRef} style={{ height: "400vh", position: "relative" }} />

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

          {/* ── Device Stage (z-30) — always in front of text ── */}
          <DeviceStage progress={scrollYProgress} />

          {/* ── Headline/CTA Group (z-20 — behind phone) ── */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
            style={{
              y: textY,
              scale: textScale,
              opacity: textOpacity,
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 pointer-events-auto">
              <Sparkles className="h-4 w-4 text-lime-400" />
              <span className="text-sm font-medium tracking-wide uppercase text-white/80">
                Next Gen Inventory
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] mb-6 text-center text-white">
              Inventory that runs <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-lime-400">
                itself.
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto text-center text-zinc-400">
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

          {/* ── Flip-Clock Tiles ── */}
          <FlipTiles progress={scrollYProgress} />

          {/* ── Feature Label (fixed spacing below phone) ── */}
          <FeatureLabel progress={scrollYProgress} />
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────

const FeatureLabel = memo(function FeatureLabel({
  progress,
}: {
  progress: ReturnType<typeof useMotionValue<number>>;
}) {
  const opacity = useTransform(progress, [0.28, 0.32, 0.72, 0.76], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.28, 0.32], [16, 0]);
  const labelColor = useTransform(progress, [0.72, 0.90], ["#ffffff", "#18181b"]);

  return (
    <motion.div
      className="absolute bottom-7 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center"
      style={{ opacity, y, color: labelColor }}
    >
      <div className="relative h-8 w-[280px] flex items-center justify-center text-sm md:text-base font-medium tracking-wide">
        <FadeLabel progress={progress} from={0.28} to={0.40} text="Smart Prep List" />
        <FadeLabel progress={progress} from={0.40} to={0.52} text="Voice AI Engine" />
        <FadeLabel progress={progress} from={0.52} to={0.64} text="Smart Fulfillment" />
        <FadeLabel progress={progress} from={0.64} to={0.74} text="Square POS Integration" />
        <FadeLabel progress={progress} from={0.82} to={0.96} text="Management Dashboard" />
      </div>
    </motion.div>
  );
});

function FadeLabel({
  progress,
  from,
  to,
  text,
}: {
  progress: ReturnType<typeof useMotionValue<number>>;
  from: number;
  to: number;
  text: string;
}) {
  const pad = 0.005;
  const opacity = useTransform(
    progress,
    [from, from + pad, to - pad, to],
    [0, 1, 1, 0]
  );
  return (
    <motion.span style={{ opacity }} className="absolute whitespace-nowrap">
      {text}
    </motion.span>
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
