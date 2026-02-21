"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useMotionPreferences } from "@/lib/motion";
import { DeviceStage } from "@/components/marketing/device-stage";
import { FloatingWidget } from "@/components/marketing/floating-widget";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Custom hook that tracks the scroll progress of a section manually.
 * Uses getBoundingClientRect instead of Framer Motion's useScroll({ target })
 * which requires positioned offset parents that Next.js breaks.
 */
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

/**
 * Custom hook to track whether the hero section is in the viewport.
 * Returns a MotionValue<number> that is 1 when visible, 0 when not.
 */
function useInSection(ref: React.RefObject<HTMLElement | null>) {
  const visible = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Section is "active" when its top is at or above viewport top
      // and its bottom is below the viewport top
      const isIn = rect.top <= 0 && rect.bottom > 0;
      visible.set(isIn ? 1 : 0);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ref, visible]);

  return visible;
}

export function HeroCinematic() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { shouldReduceMotion } = useMotionPreferences();

  const scrollYProgress = useSectionProgress(heroRef);
  const inSection = useInSection(heroRef);

  // ─── BACKGROUND: 12-stop gradual dark → light ─────────────
  const bg = useTransform(
    scrollYProgress,
    [0.00, 0.10, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.74, 0.88, 1.00],
    [
      "#000000", "#000000", "#050505", "#0b0b0b",
      "#151515", "#222222", "#3a3a3a", "#5a5a5a",
      "#8a8a8a", "#cfcfcf", "#efece4", "#fafaf9",
    ]
  );

  // ─── HEADLINE ANIMATIONS ──────────────────────────────────
  const headlineY = useTransform(scrollYProgress, [0, 0.16, 0.30], [0, 0, -180]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.16, 0.30], [1, 1, 0.85]);
  const headlineOpacity = useTransform(scrollYProgress, [0.16, 0.30, 0.38], [1, 0.4, 0]);

  // ─── AURORA BLOB FADE ─────────────────────────────────────
  const blobOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.5, 0]);

  // ─── VIGNETTE ─────────────────────────────────────────────
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.6, 0.15, 0]);

  // ─── REDUCED MOTION STATIC FALLBACK ───────────────────────
  if (shouldReduceMotion) {
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

  // ─── MAIN CINEMATIC HERO ──────────────────────────────────
  return (
    <>
      {/* Scroll spacer: 650vh tall, provides the scroll distance */}
      <section ref={heroRef} style={{ height: "650vh", position: "relative" }}>
        {/* This section is intentionally empty - it only provides scroll height.
            All visuals are rendered in the fixed overlay below. */}
      </section>

      {/* ── Fixed overlay: always covers viewport, visibility controlled by inSection ── */}
      <motion.div
        className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none"
        style={{
          opacity: inSection,
          zIndex: 5,
        }}
      >
        {/* Animated background */}
        <motion.div className="absolute inset-0 z-0" style={{ backgroundColor: bg }} />

        {/* Content stage */}
        <div className="relative h-full w-full overflow-hidden pointer-events-auto">

          {/* ── Background visuals ── */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
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
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* ── Headline Group ── */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
            style={{
              y: headlineY,
              scale: headlineScale,
              opacity: headlineOpacity,
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

          {/* ── Device Stage ── */}
          <DeviceStage progress={scrollYProgress} />

          {/* ── Floating Widgets ── */}
          <FloatingWidget
            progress={scrollYProgress}
            inPoint={0.34}
            outPoint={0.72}
            side="left"
            title="Alex (Manager)"
            subtitle="Reviewed prep list"
            icon="user"
          />
          <FloatingWidget
            progress={scrollYProgress}
            inPoint={0.36}
            outPoint={0.72}
            side="right"
            title="Auto-ordering"
            subtitle="Saved 2.5 hours"
            icon="clock"
          />
          <FloatingWidget
            progress={scrollYProgress}
            inPoint={0.44}
            outPoint={0.72}
            side="left"
            title="Voice Parse"
            subtitle="EN & 中文 Detected"
            icon="mic"
          />
          <FloatingWidget
            progress={scrollYProgress}
            inPoint={0.46}
            outPoint={0.72}
            side="right"
            title="Translation"
            subtitle="100% Accuracy"
            icon="bot"
          />

          {/* ── Feature Label ── */}
          <FeatureLabel progress={scrollYProgress} />
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────

function FeatureLabel({ progress }: { progress: ReturnType<typeof useMotionValue<number>> }) {
  const opacity = useTransform(progress, [0.28, 0.34, 0.88, 0.92], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.28, 0.34], [30, 0]);
  const labelColor = useTransform(progress, [0.68, 0.85], ["#ffffff", "#18181b"]);

  return (
    <motion.div
      className="absolute bottom-[8%] md:bottom-[12%] left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center"
      style={{ opacity, y, color: labelColor }}
    >
      <div className="relative h-8 w-[280px] flex items-center justify-center text-sm md:text-base font-medium tracking-wide">
        <FadeLabel progress={progress} from={0.34} to={0.44} text="Smart Ordering" />
        <FadeLabel progress={progress} from={0.44} to={0.54} text="Voice AI Engine" />
        <FadeLabel progress={progress} from={0.54} to={0.64} text="Smart Fulfillment" />
        <FadeLabel progress={progress} from={0.64} to={0.74} text="Square POS Integration" />
        <FadeLabel progress={progress} from={0.76} to={0.92} text="Management Dashboard" />
      </div>
    </motion.div>
  );
}

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
  const pad = 0.02;
  const opacity = useTransform(
    progress,
    [from - pad, from + pad, to - pad, to + pad],
    [0, 1, 1, 0]
  );
  return (
    <motion.span style={{ opacity }} className="absolute whitespace-nowrap">
      {text}
    </motion.span>
  );
}
