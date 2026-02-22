"use client";

import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { Screen1Suggestions } from "./screens/screen-1-suggestions";
import { Screen2Voice } from "./screens/screen-2-voice";
import { Screen3Fulfillment } from "./screens/screen-3-fulfillment";
import { Screen4Sales } from "./screens/screen-4-sales";
import { Screen5WebDashboard } from "./screens/screen-5-web-dashboard";
import { DESKTOP_NAV_H, MOBILE_NAV_H, SAFE_PAD } from "./mobile-constants";

// ═══════════════════════════════════════════════════════════
// DeviceStage — phone peek → full phone → callouts → morph → laptop
//
// Mobile choreography:
//   • Phone is larger (80vw), centered, never pans left
//   • Callout overlays slide up OVER the phone
//   • Dashboard scales proportionally (no stretch)
//
// Desktop choreography:
//   • Phone at 40vw, pans left for side callouts
//   • Full stretch morph into laptop
// ═══════════════════════════════════════════════════════════

// ─── Callout content ────────────────────────────────
const MOBILE_CALLOUTS = [
  {
    eyebrow: "TIME SAVED",
    value: "2.5 hrs",
    supporting: "per shift on ordering & prep",
    accentClass: "bg-gradient-to-r from-teal-400 to-emerald-400",
  },
  {
    eyebrow: "WASTE REDUCED",
    value: "−18%",
    supporting: "from smarter forecasting",
    accentClass: "bg-gradient-to-r from-lime-400 to-green-500",
  },
  {
    eyebrow: "LIVE SYNC",
    value: "< 2 min",
    supporting: "always up to date inventory",
    accentClass: "bg-gradient-to-r from-violet-400 to-indigo-400",
  },
  {
    eyebrow: "ACCURACY",
    value: "99%",
    supporting: "invoice parsing precision",
    accentClass: "bg-gradient-to-r from-blue-400 to-cyan-400",
  },
];

// Mobile callout windows — wider for more dwell time (12% each vs desktop 8%)
const MOBILE_CALLOUT_WINDOWS: [number, number][] = [
  [0.35, 0.47],
  [0.47, 0.59],
  [0.59, 0.71],
  [0.71, 0.83],
];

interface DeviceStageProps {
  progress: MotionValue<number>;
  isMobile: boolean;
}

export const DeviceStage = memo(function DeviceStage({ progress, isMobile }: DeviceStageProps) {
  const NAV_H = isMobile ? MOBILE_NAV_H : DESKTOP_NAV_H;

  // ―――――――――――――――――――――――――――――――――――――――――
  //  PHONE RISE & POSITIONING
  //  Desktop: rises from 550, pans left at 0.30–0.40
  //  Mobile: rises from 450 (peek visible earlier), stays centered
  // ―――――――――――――――――――――――――――――――――――――――――
  const phoneY = useTransform(
    progress,
    [0.08, 0.20],
    [isMobile ? 420 : 550, 0]
  );
  const phoneX = useTransform(
    progress,
    [0.30, 0.40, 0.75, 0.90],
    isMobile ? ["0vw", "0vw", "0vw", "0vw"] : ["0vw", "-22vw", "-22vw", "0vw"]
  );

  // Opacity & Shadow during initial rise
  const phoneOpacity = useTransform(progress, [0.10, 0.15], [0.85, 1]);
  const phoneShadowOpacity = useTransform(
    progress,
    isMobile ? [0.10, 0.20, 0.83, 0.86] : [0.10, 0.20, 0.75, 0.80],
    [0, 0.55, 0.55, 0]
  );

  // Overall phone scale
  const phoneScale = useTransform(
    progress,
    isMobile ? [0.10, 0.20, 0.83, 0.86] : [0.10, 0.20, 0.75, 0.80],
    [0.95, 1.0, 1.0, 1.0]
  );

  // Screen dimmer during early reveal
  const screenDimOpacity = useTransform(progress, [0.20, 0.30], [0.85, 0]);

  // Dynamic island fades during morph
  const dynamicIslandOpacity = useTransform(
    progress,
    isMobile ? [0.83, 0.88] : [0.70, 0.76],
    [1, 0]
  );

  // ―――――――――――――――――――――――――――――――――――――――――
  //  PHONE SCREEN CROSSFADES
  //  Mobile: wider windows to match callout timing
  // ―――――――――――――――――――――――――――――――――――――――――
  const s1 = useTransform(
    progress,
    isMobile ? [0.35, 0.37, 0.455, 0.47] : [0.38, 0.40, 0.455, 0.46],
    [0, 1, 1, 0]
  );
  const s2 = useTransform(
    progress,
    isMobile ? [0.47, 0.475, 0.575, 0.59] : [0.46, 0.465, 0.535, 0.54],
    [0, 1, 1, 0]
  );
  const s3 = useTransform(
    progress,
    isMobile ? [0.59, 0.595, 0.695, 0.71] : [0.54, 0.545, 0.615, 0.62],
    [0, 1, 1, 0]
  );
  const s4 = useTransform(
    progress,
    isMobile ? [0.71, 0.715, 0.815, 0.83] : [0.62, 0.625, 0.70, 0.72],
    [0, 1, 1, 0]
  );

  // ―――――――――――――――――――――――――――――――――――――――――
  //  PHONE → LAPTOP STRETCH MORPH
  //  Mobile: later timing to accommodate longer callout phase
  // ―――――――――――――――――――――――――――――――――――――――――
  const morphStart = isMobile ? 0.86 : 0.75;
  const morphEnd = isMobile ? 0.97 : 0.90;

  const screenBlackout = useTransform(
    progress,
    [morphStart, morphStart + 0.03, morphEnd - 0.02, morphEnd],
    [0, 1, 1, 0]
  );

  const morphP = useTransform(progress, [morphStart, morphEnd], [0, 1]);

  const phoneShellOpacity = useTransform(
    progress,
    [morphStart + 0.01, morphEnd - 0.02],
    [1, 0]
  );
  const laptopShellOpacity = useTransform(
    progress,
    [morphStart + 0.03, morphEnd],
    [0, 1]
  );

  const s5 = useTransform(progress, [morphEnd - 0.05, morphEnd], [0, 1]);

  const baseOpacity = useTransform(progress, [morphEnd - 0.05, morphEnd + 0.02], [0, 1]);
  const baseY = useTransform(progress, [morphEnd - 0.05, morphEnd + 0.02], [20, 0]);

  // Laptop close
  const hingeRotate = useTransform(progress, [0.90, 1.00], [0, 0]);
  const closeFade = useTransform(progress, [0.92, 1.00], [1, 1]);

  // ─── "Manage anywhere" headline ───────────────────
  const headlineOpacity = useTransform(
    progress,
    isMobile ? [morphStart, morphEnd - 0.02, morphEnd] : [0.78, 0.86, 0.90],
    [0, 0, 1]
  );
  const headlineY = useTransform(
    progress,
    isMobile ? [morphStart, morphEnd] : [0.78, 0.90],
    [60, 0]
  );

  // ─── Phone CSS vars ───────────────────────────────
  const phoneWidth = isMobile ? "min(300px, 80vw)" : "min(340px, 40vw)";
  // Desktop: stretch to fill. Mobile: use fixed 16/10 AR scaled to fit viewport.
  // The desktop dashboard is ~16:10 AR — preserve this exactly on mobile.
  const DESKTOP_LAPTOP_AR = 16 / 10;
  const laptopWidth = isMobile ? "85vw" : "85vw";
  const laptopHeight = isMobile ? `calc(85vw / ${DESKTOP_LAPTOP_AR})` : "80vh";

  // Dashboard intrinsic dimensions (match Screen5WebDashboard design)
  const DASHBOARD_W = 1280;
  const DASHBOARD_H = 800;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* ═══ "MANAGE ANYWHERE" HEADLINE ═══ */}
      <motion.div
        className="absolute left-0 right-0 z-50 pointer-events-none flex flex-col items-center text-center"
        style={{
          opacity: headlineOpacity,
          y: headlineY,
          top: isMobile ? "6%" : "4%",
        }}
      >
        <span className="block text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
          Manage
        </span>
        <span className="block text-3xl md:text-5xl font-bold tracking-tight text-zinc-400 leading-[1.1]">
          anywhere.
        </span>
      </motion.div>

      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ paddingTop: NAV_H + SAFE_PAD, paddingBottom: SAFE_PAD }}
      >
        <motion.div
          className="relative origin-center transform-gpu"
          style={{
            "--morph-p": morphP,
            "--phone-w": phoneWidth,
            "--phone-h": `calc(var(--phone-w) * 2.16)`,
            width: `calc( var(--phone-w) + (${laptopWidth} - var(--phone-w)) * var(--morph-p) )`,
            height: `calc( var(--phone-h) + (${laptopHeight} - var(--phone-h)) * var(--morph-p) )`,
            x: phoneX,
            y: phoneY,
            opacity: phoneOpacity,
            scale: phoneScale,
          } as any}
        >
          {/* Depth shadow below device */}
          <motion.div
            className="absolute -bottom-8 left-[8%] right-[8%] h-16 rounded-[50%] pointer-events-none z-[-1]"
            style={{
              opacity: phoneShadowOpacity,
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
            }}
          />

          {/* Hinge wrapper for laptop close */}
          <div style={{ perspective: "1200px" }} className="w-full h-full relative">
            <motion.div
              className="w-full h-full transform-gpu origin-bottom"
              style={{ rotateX: hingeRotate, opacity: closeFade }}
            >

              {/* ─── Shell A: Phone (rounded corners, dynamic island) ─── */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  opacity: phoneShellOpacity,
                  borderRadius: "calc(52px + (18px - 52px) * var(--morph-p))",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px rgba(0,0,0,0.7), 0 4px 20px -2px rgba(0,0,0,0.4)",
                }}
              >
                {/* Metallic band */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(160,160,170,0.4) 0%, rgba(100,100,110,0.2) 30%, rgba(80,80,90,0.3) 70%, rgba(60,60,70,0.4) 100%)",
                  }}
                />
                {/* Bezel */}
                <motion.div
                  className="absolute inset-[3px] bg-[#0a0a0a] z-[1]"
                  style={{ borderRadius: "calc(48px + (15px - 48px) * var(--morph-p))" }}
                />
              </motion.div>

              {/* ─── Shell B: Laptop (smaller corners) ─── */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  opacity: laptopShellOpacity,
                  borderRadius: "calc(52px + (18px - 52px) * var(--morph-p))",
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.15)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px -20px rgba(0,0,0,0.7)",
                }}
              >
                <div className="absolute inset-0 bg-[#0a0a0a]" />
              </motion.div>

              {/* ─── Screen area (shared between phone & laptop) ─── */}
              <motion.div
                className="absolute inset-[3px] z-[5] overflow-hidden"
                ref={(el: HTMLDivElement | null) => {
                  if (el) {
                    const ro = new ResizeObserver(([entry]) => {
                      const { width, height } = entry.contentRect;
                      const scale = Math.min(width / DASHBOARD_W, height / DASHBOARD_H);
                      el.style.setProperty('--dash-scale', String(scale));
                    });
                    ro.observe(el);
                  }
                }}
                style={{ borderRadius: "calc(48px + (15px - 48px) * var(--morph-p))" }}
              >
                {/* Dynamic Island — proportional sizing */}
                <motion.div
                  className="absolute top-[12px] left-1/2 -translate-x-1/2 z-40"
                  style={{ opacity: dynamicIslandOpacity }}
                >
                  <div
                    className={`relative overflow-hidden rounded-full ${
                      isMobile ? "w-[90px] h-[26px]" : "w-[120px] h-[34px]"
                    }`}
                    style={{
                      background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="absolute inset-[1px] rounded-full pointer-events-none"
                      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%)" }}
                    />
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full ${
                        isMobile ? "w-[5px] h-[5px]" : "w-[7px] h-[7px]"
                      }`}
                      style={{
                        background: "radial-gradient(circle, #1a1a3a 30%, #0a0a0a 70%)",
                        boxShadow: "0 0 3px rgba(60,60,120,0.4), inset 0 0 2px rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                </motion.div>

                {/* Speaker slit */}
                <div
                  className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[50px] h-[3px] rounded-full z-40 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
                />

                {/* Glass sheen */}
                <div
                  className="absolute inset-0 z-50 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 45%, transparent 60%)" }}
                />

                {/* Edge highlight */}
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-[1px] z-50 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                />

                {/* Mobile screen content */}
                <motion.div className="absolute inset-0 z-[10]" style={{ opacity: s1 }}>
                  <Screen1Suggestions />
                </motion.div>
                <motion.div className="absolute inset-0 z-[10]" style={{ opacity: s2 }}>
                  <Screen2Voice />
                </motion.div>
                <motion.div className="absolute inset-0 z-[10]" style={{ opacity: s3 }}>
                  <Screen3Fulfillment />
                </motion.div>
                <motion.div className="absolute inset-0 z-[10]" style={{ opacity: s4 }}>
                  <Screen4Sales />
                </motion.div>

                {/* Dashboard content — scale-to-fit inside laptop frame */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-[10] overflow-hidden"
                  style={{ opacity: s5 }}
                >
                  <div
                    className="origin-top-left bg-white"
                    style={{
                      width: DASHBOARD_W,
                      height: DASHBOARD_H,
                      transform: `scale(var(--dash-scale, 1))`,
                    }}
                  >
                    <Screen5WebDashboard />
                  </div>
                </motion.div>

                {/* Screen dimmer (early reveal) */}
                <motion.div
                  className="absolute inset-0 z-[20] pointer-events-none bg-black"
                  style={{ opacity: screenDimOpacity }}
                />

                {/* Screen blackout (morph transition) */}
                <motion.div
                  className="absolute inset-0 z-[25] pointer-events-none bg-black"
                  style={{ opacity: screenBlackout }}
                />
              </motion.div>
            </motion.div>

            {/* ── Keyboard base (separate, below screen hinge) ── */}
            <motion.div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-[6]"
              style={{
                width: "110%",
                opacity: baseOpacity,
                y: baseY,
              }}
            >
              <div
                className="w-full h-5 rounded-b-[20px] rounded-t-sm bg-gradient-to-b from-[#e5e5e5] to-[#caced1] border border-white/40"
                style={{ boxShadow: "0 8px 16px rgba(0,0,0,0.15)" }}
              >
                {/* Trackpad indent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b bg-black/10" />
              </div>
              {/* Hinge shadow line */}
              <div
                className="absolute -top-[2px] left-[5%] right-[5%] h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ═══ MOBILE CALLOUT OVERLAYS ═══ */}
        {isMobile && (
          <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
            {MOBILE_CALLOUTS.map((callout, i) => (
              <MobileCalloutOverlay
                key={i}
                callout={callout}
                progress={progress}
                window={MOBILE_CALLOUT_WINDOWS[i]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────
// Mobile Callout Overlay — slides up over the phone
// ─────────────────────────────────────────────────

interface MobileCallout {
  eyebrow: string;
  value: string;
  supporting: string;
  accentClass: string;
}

const MobileCalloutOverlay = memo(function MobileCalloutOverlay({
  callout,
  progress,
  window: [start, end],
}: {
  callout: MobileCallout;
  progress: MotionValue<number>;
  window: [number, number];
}) {
  const pad = 0.025;

  // Slide up from below center, hold, then continue up and fade
  const opacity = useTransform(
    progress,
    [start - pad, start, start + pad, end - pad, end],
    [0, 0.3, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start - pad, start + pad, end - pad, end],
    [60, 0, 0, -40]
  );

  return (
    <motion.div
      className="absolute flex flex-col items-center text-center pointer-events-none"
      style={{
        opacity,
        y,
        top: "50%",
      }}
    >
      {/* Frosted glass spotlight panel — localized readable zone */}
      <motion.div
        className="relative rounded-3xl px-8 py-7 overflow-hidden"
        style={{
          scale: useTransform(
            progress,
            [start - pad, start + pad, end - pad, end],
            [0.92, 1, 1, 0.95]
          ),
        }}
      >
        {/* Glass backing */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            {callout.eyebrow}
          </span>
          <span
            className={`text-5xl font-bold tracking-tighter leading-none text-transparent bg-clip-text ${callout.accentClass}`}
          >
            {callout.value}
          </span>
          <span className="text-base font-light text-zinc-200 mt-1 leading-snug max-w-[240px]">
            {callout.supporting}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
});
