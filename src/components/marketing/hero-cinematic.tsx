"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useMotionPreferences } from "@/lib/motion";
import { DeviceStage } from "@/components/marketing/device-stage";
import { TextCallouts } from "@/components/marketing/text-callouts";
import { useIsMobile } from "@/components/marketing/mobile-constants";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────
// Custom scroll hooks (passive scroll events + MotionValue)
// ─────────────────────────────────────────────────

function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let elTop = 0;
    let totalScroll = 0;
    let ticking = false;

    function recache() {
      const rect = el!.getBoundingClientRect();
      elTop = rect.top + window.scrollY;
      totalScroll = el!.offsetHeight - window.innerHeight;
    }

    function update() {
      ticking = false;
      if (totalScroll <= 0) return;
      const scrolled = window.scrollY - elTop;
      progress.set(Math.max(0, Math.min(1, scrolled / totalScroll)));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      recache();
      update();
    }

    recache();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ref, progress]);

  return progress;
}

function useInSection(ref: React.RefObject<HTMLElement | null>) {
  const visible = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let elTop = 0;
    let elBottom = 0;
    let ticking = false;

    function recache() {
      const rect = el!.getBoundingClientRect();
      elTop = rect.top + window.scrollY;
      elBottom = elTop + el!.offsetHeight;
    }

    function update() {
      ticking = false;
      const sy = window.scrollY;
      visible.set(sy >= elTop && sy < elBottom ? 1 : 0);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      recache();
      update();
    }

    recache();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
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
  // Use opacity on a pre-rendered gradient instead of animating backgroundColor
  // (color interpolation triggers repaint every frame; opacity is GPU-composited)
  const bgLightOpacity = useTransform(scrollYProgress, [0.0, 0.6, 0.8, 1.0], [0, 0, 0.85, 1]);

  // ─── TEXT/CTA ──────────────────────────────────
  const textY = useTransform(scrollYProgress, [0.0, 0.08], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0.0, 0.08], [1, 0.92]);
  const textOpacity = useTransform(scrollYProgress, [0.0, 0.08], [1, 0]);

  // ─── AURORA BLOBS ──────────────────────────────
  const blobOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.5, 0]);

  // ─── VIGNETTE ──────────────────────────────────
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.6, 0.15, 0]);

  // ─── OVERLAY TEXT TRANSFORMS (hoisted from JSX) ─
  const overlayLine1Y = useTransform(scrollYProgress, [0.15, 0.28, 0.33], ["50vh", "0vh", "-30vh"]);
  const overlayLine1Opacity = useTransform(scrollYProgress, [0.15, 0.18, 0.25, 0.28], [0, 1, 1, 0]);
  const overlayLine2Y = useTransform(scrollYProgress, [0.2, 0.32, 0.36], ["50vh", "0vh", "-30vh"]);
  const overlayLine2Opacity = useTransform(scrollYProgress, [0.2, 0.23, 0.29, 0.32], [0, 1, 1, 0]);

  // ─── REDUCED MOTION FALLBACK ───────────────────
  if (shouldReduceMotion) {
    return <ReducedMotionFallback />;
  }

  const scrollHeight = isMobile ? "600vh" : "500vh";

  // ─── MAIN CINEMATIC ────────────────────────────
  return (
    <>
      {/* Scroll spacer */}
      <section ref={heroRef} style={{ height: scrollHeight, position: "relative" }} />

      {/* Fixed overlay */}
      <motion.div
        className="pointer-events-none fixed inset-0 h-screen w-full overflow-hidden will-change-transform"
        style={{ opacity: inSection, zIndex: 5 }}
      >
        {/* Black base background (always present) */}
        <div className="absolute inset-0 z-0 bg-black" />
        {/* Light overlay — fades in via GPU-composited opacity */}
        <motion.div
          className="absolute inset-0 z-0 will-change-[opacity]"
          style={{
            opacity: bgLightOpacity,
            background: "linear-gradient(180deg, #e5e5e5 0%, #fafaf9 100%)",
          }}
        />

        {/* Content stage */}
        <div className="pointer-events-auto relative h-full w-full overflow-hidden">
          {/* Aurora blobs — reduced blur radii for GPU perf */}
          <motion.div
            className="pointer-events-none absolute top-[15%] left-[20%] z-0 h-[40vw] max-h-[500px] w-[40vw] max-w-[500px] transform-gpu rounded-full bg-teal-500/10 blur-[80px]"
            style={{ opacity: blobOpacity }}
          />
          <motion.div
            className="pointer-events-none absolute right-[15%] bottom-[20%] z-0 h-[35vw] max-h-[420px] w-[35vw] max-w-[420px] transform-gpu rounded-full bg-lime-500/8 blur-[60px]"
            style={{ opacity: blobOpacity }}
          />

          {/* Vignette */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{
              opacity: vignetteOpacity,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* ── Device Stage (z-30) ── */}
          <DeviceStage progress={scrollYProgress} isMobile={isMobile} />

          {/* ── Overlay Text (Phase 1 & 2) ── */}
          <motion.div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center">
            <motion.h1
              className="absolute transform-gpu text-[14vw] leading-none font-bold tracking-tighter text-white md:text-[12vw]"
              style={{ y: overlayLine1Y, opacity: overlayLine1Opacity }}
            >
              All in one
            </motion.h1>
            <motion.h1
              className="absolute mt-[12vw] transform-gpu bg-gradient-to-br from-white to-zinc-200 bg-clip-text text-[16vw] leading-none font-black tracking-tighter text-transparent md:text-[14vw]"
              style={{ y: overlayLine2Y, opacity: overlayLine2Opacity }}
            >
              solution
            </motion.h1>
          </motion.div>

          {/* ── Headline/CTA Group (z-20 — behind phone) ── */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 -mt-16 flex flex-col items-center justify-center px-4"
            style={{
              y: textY,
              scale: textScale,
              opacity: textOpacity,
            }}
          >
            <h1 className="mb-6 text-center text-5xl leading-[1.05] font-bold tracking-tighter text-white sm:text-6xl md:text-8xl">
              Inventory that runs <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
                itself.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-center text-lg font-light text-zinc-400 md:text-2xl">
              Order with your voice. Forecast with AI.
              <br className="hidden sm:block" />
              Never guess what to prep again.
            </p>

            <Link
              href="/signup"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-lime-500 px-8 py-4 text-lg font-medium text-black shadow-[0_0_30px_rgba(132,204,22,0.3)] transition-colors hover:bg-lime-400"
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
                accent:
                  "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400",
              },
              {
                eyebrow: "WASTE REDUCED",
                value: "−18%",
                supporting: "from smarter forecasting",
                accent: "text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500",
              },
              {
                eyebrow: "LIVE SYNC",
                value: "< 2 min",
                supporting: "always up to date inventory",
                accent:
                  "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400",
              },
              {
                eyebrow: "ACCURACY",
                value: "99%",
                supporting: "invoice parsing precision",
                accent: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400",
              },
            ]}
            windows={[
              [0.38, 0.46],
              [0.46, 0.54],
              [0.54, 0.62],
              [0.62, 0.7],
            ]}
          />
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
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 py-28 text-white">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#fafaf9]" />

      <div className="relative z-10 mb-16 max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          Inventory that runs{" "}
          <span className="bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
            itself.
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-zinc-400">
          Order with your voice. Forecast with AI. Never guess what to prep again.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-8 py-4 text-lg font-medium text-black transition-colors hover:bg-lime-400"
        >
          Start for free <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Static phone mock */}
      <div className="relative z-10 mb-10 w-full max-w-xs">
        <div className="aspect-[9/19.5] overflow-hidden rounded-[42px] border-[3px] border-zinc-700 bg-[#0a0a0a] p-4 shadow-xl shadow-black/40">
          <div className="mx-auto mb-4 h-6 w-16 rounded-full bg-zinc-800" />
          <div className="space-y-3 px-2">
            <div className="h-6 w-3/4 rounded-lg bg-zinc-800" />
            <div className="h-4 w-full rounded-lg bg-zinc-800/60" />
            <div className="h-4 w-5/6 rounded-lg bg-zinc-800/60" />
            <div className="mt-4 h-10 rounded-xl bg-teal-900/40" />
            <div className="h-10 rounded-xl bg-teal-900/30" />
          </div>
        </div>
      </div>

      {/* Static benefit tiles */}
      <div className="relative z-10 mb-16 flex flex-wrap justify-center gap-4">
        <div className="flex h-[130px] w-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 shadow-lg shadow-black/20 backdrop-blur-sm">
          <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">Time Saved</p>
          <p className="text-3xl font-bold text-teal-500">2.5 hrs</p>
        </div>
        <div className="flex h-[130px] w-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 shadow-lg shadow-black/20 backdrop-blur-sm">
          <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
            Waste Reduced
          </p>
          <p className="text-3xl font-bold text-lime-500">−18%</p>
        </div>
      </div>

      {/* Static desktop preview */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
          <div className="mb-4 flex gap-4">
            {["Revenue", "Orders", "COGS"].map((label) => (
              <div key={label} className="flex-1 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="mt-1 text-lg font-bold text-zinc-900">$12.4k</p>
              </div>
            ))}
          </div>
          <div className="h-24 rounded-xl border border-zinc-100 bg-zinc-50" />
        </div>
      </div>
    </section>
  );
}
