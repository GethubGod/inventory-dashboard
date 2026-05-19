"use client";

import { memo, useEffect, useRef, useState } from "react";
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

const PHONE_AR = 2.16;
const DASHBOARD_W = 1280;
const DASHBOARD_H = 800;
const LAPTOP_AR = DASHBOARD_W / DASHBOARD_H;

interface StageMetrics {
  phoneWidth: number;
  phoneHeight: number;
  laptopWidth: number;
  laptopHeight: number;
  desktopShift: number;
}

function clampToCapacity(target: number, minimum: number, capacity: number) {
  const safeCapacity = Math.max(capacity, 0);
  return Math.max(Math.min(target, safeCapacity), Math.min(minimum, safeCapacity));
}

function computeStageMetrics(
  availableWidth: number,
  availableHeight: number,
  isMobile: boolean,
): StageMetrics {
  const safeWidth = Math.max(availableWidth, 240);
  const safeHeight = Math.max(availableHeight, 320);

  const phoneTargetWidth = Math.min(isMobile ? 300 : 340, safeWidth * (isMobile ? 0.82 : 0.42));
  const phoneHeightLimit = Math.max((safeHeight - (isMobile ? 20 : 28)) / PHONE_AR, 160);
  const phoneMinWidth = isMobile ? 216 : 248;
  const phoneCapacity = Math.min(phoneHeightLimit, safeWidth);
  const phoneWidth = clampToCapacity(phoneTargetWidth, phoneMinWidth, phoneCapacity);
  const phoneHeight = phoneWidth * PHONE_AR;

  const keyboardReserve = isMobile ? 30 : 36;
  const laptopTargetWidth = isMobile ? 480 : 1040;
  const laptopMinWidth = isMobile ? 280 : 720;
  const laptopCapacity = Math.min(
    isMobile ? 560 : 1120,
    safeWidth,
    Math.max((safeHeight - keyboardReserve) * LAPTOP_AR, 0),
  );
  const laptopWidth = clampToCapacity(laptopTargetWidth, laptopMinWidth, laptopCapacity);
  const laptopHeight = laptopWidth / LAPTOP_AR;
  const desktopShift = isMobile ? 0 : Math.min(safeWidth * 0.18, 240);

  return {
    phoneWidth,
    phoneHeight,
    laptopWidth,
    laptopHeight,
    desktopShift,
  };
}

interface DeviceStageProps {
  progress: MotionValue<number>;
  isMobile: boolean;
}

export const DeviceStage = memo(function DeviceStage({ progress, isMobile }: DeviceStageProps) {
  const NAV_H = isMobile ? MOBILE_NAV_H : DESKTOP_NAV_H;
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageMetrics, setStageMetrics] = useState<StageMetrics>(() =>
    computeStageMetrics(isMobile ? 390 : 1200, isMobile ? 760 : 820, isMobile),
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let frame = 0;
    const updateMetrics = (width: number, height: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setStageMetrics(computeStageMetrics(width, height, isMobile));
      });
    };

    const rect = el.getBoundingClientRect();
    updateMetrics(rect.width, rect.height);

    const ro = new ResizeObserver(([entry]) => {
      updateMetrics(entry.contentRect.width, entry.contentRect.height);
    });

    ro.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [isMobile]);

  // ―――――――――――――――――――――――――――――――――――――――――
  //  PHONE RISE & POSITIONING
  //  Desktop: rises from 550, pans left at 0.30–0.40
  //  Mobile: rises from 450 (peek visible earlier), stays centered
  // ―――――――――――――――――――――――――――――――――――――――――
  const phoneY = useTransform(progress, [0.08, 0.2], [isMobile ? 420 : 550, 0]);
  const phoneX = useTransform(
    progress,
    [0.3, 0.4, 0.75, 0.9],
    isMobile ? [0, 0, 0, 0] : [0, -stageMetrics.desktopShift, -stageMetrics.desktopShift, 0],
  );

  // Opacity & Shadow during initial rise
  const phoneOpacity = useTransform(progress, [0.1, 0.15], [0.85, 1]);
  const phoneShadowOpacity = useTransform(
    progress,
    isMobile ? [0.1, 0.2, 0.83, 0.86] : [0.1, 0.2, 0.75, 0.8],
    [0, 0.55, 0.55, 0],
  );

  // Overall phone scale
  const phoneScale = useTransform(
    progress,
    isMobile ? [0.1, 0.2, 0.83, 0.86] : [0.1, 0.2, 0.75, 0.8],
    [0.95, 1.0, 1.0, 1.0],
  );

  // Screen dimmer during early reveal
  const screenDimOpacity = useTransform(progress, [0.2, 0.3], [0.85, 0]);

  // Dynamic island fades during morph
  const dynamicIslandOpacity = useTransform(
    progress,
    isMobile ? [0.83, 0.88] : [0.7, 0.76],
    [1, 0],
  );

  // ―――――――――――――――――――――――――――――――――――――――――
  //  PHONE SCREEN CROSSFADES
  //  Mobile: wider windows to match callout timing
  // ―――――――――――――――――――――――――――――――――――――――――
  const s1 = useTransform(
    progress,
    isMobile ? [0.35, 0.37, 0.455, 0.47] : [0.38, 0.4, 0.455, 0.46],
    [0, 1, 1, 0],
  );
  const s2 = useTransform(
    progress,
    isMobile ? [0.47, 0.475, 0.575, 0.59] : [0.46, 0.465, 0.535, 0.54],
    [0, 1, 1, 0],
  );
  const s3 = useTransform(
    progress,
    isMobile ? [0.59, 0.595, 0.695, 0.71] : [0.54, 0.545, 0.615, 0.62],
    [0, 1, 1, 0],
  );
  const s4 = useTransform(
    progress,
    isMobile ? [0.71, 0.715, 0.815, 0.83] : [0.62, 0.625, 0.7, 0.72],
    [0, 1, 1, 0],
  );

  // ―――――――――――――――――――――――――――――――――――――――――
  //  PHONE → LAPTOP STRETCH MORPH
  //  Mobile: later timing to accommodate longer callout phase
  // ―――――――――――――――――――――――――――――――――――――――――
  const morphStart = isMobile ? 0.86 : 0.75;
  const morphEnd = isMobile ? 0.97 : 0.9;

  const screenBlackout = useTransform(
    progress,
    [morphStart, morphStart + 0.03, morphEnd - 0.02, morphEnd],
    [0, 1, 1, 0],
  );

  const morphP = useTransform(progress, [morphStart, morphEnd], [0, 1]);

  const phoneShellOpacity = useTransform(progress, [morphStart + 0.01, morphEnd - 0.02], [1, 0]);
  const laptopShellOpacity = useTransform(progress, [morphStart + 0.03, morphEnd], [0, 1]);

  const s5 = useTransform(progress, [morphEnd - 0.05, morphEnd], [0, 1]);

  const baseOpacity = useTransform(progress, [morphEnd - 0.05, morphEnd + 0.02], [0, 1]);
  const baseY = useTransform(progress, [morphEnd - 0.05, morphEnd + 0.02], [20, 0]);

  // Laptop close
  const hingeRotate = useTransform(progress, [0.9, 1.0], [0, 0]);
  const closeFade = useTransform(progress, [0.92, 1.0], [1, 1]);

  const overlayStart = isMobile ? 0.89 : 0.8;
  const overlayHoldStart = isMobile ? 0.95 : 0.87;
  const overlayHoldEnd = isMobile ? 0.975 : 0.9;
  const overlayEnd = isMobile ? 1.0 : 0.96;
  const overlayTextOpacity = useTransform(
    progress,
    [overlayStart, overlayHoldStart, overlayHoldEnd, overlayEnd],
    [0, 1, 1, 0],
  );
  const overlayTextY = useTransform(
    progress,
    [overlayStart, overlayHoldStart, overlayEnd],
    [isMobile ? 42 : 60, 0, isMobile ? -34 : -54],
  );
  const overlayTextScale = useTransform(
    progress,
    [overlayStart, overlayHoldStart, overlayEnd],
    [0.96, 1, 1.03],
  );
  const overlayScrimOpacity = useTransform(
    progress,
    [overlayStart, overlayHoldStart, overlayEnd],
    [0, 0.24, 0],
  );

  const screenAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screenAreaRef.current;
    if (!el) return;
    let frame = 0;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scale = Math.min(width / DASHBOARD_W, height / DASHBOARD_H);
        const offsetX = (width - DASHBOARD_W * scale) / 2;
        const offsetY = (height - DASHBOARD_H * scale) / 2;
        el.style.setProperty("--dash-scale", String(scale));
        el.style.setProperty("--dash-x", `${offsetX}px`);
        el.style.setProperty("--dash-y", `${offsetY}px`);
      });
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);
  const stageInlinePadding = isMobile ? "clamp(14px, 4vw, 20px)" : "clamp(28px, 5vw, 64px)";
  const phoneWidth = `${stageMetrics.phoneWidth}px`;
  const phoneHeight = `${stageMetrics.phoneHeight}px`;
  const laptopWidth = `${stageMetrics.laptopWidth}px`;
  const laptopHeight = `${stageMetrics.laptopHeight}px`;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          paddingTop: NAV_H + SAFE_PAD,
          paddingBottom: SAFE_PAD,
          paddingInline: stageInlinePadding,
        }}
      >
        <motion.div
          className="relative origin-center transform-gpu"
          style={
            {
              "--morph-p": morphP,
              "--phone-w": phoneWidth,
              "--phone-h": phoneHeight,
              width: `calc( var(--phone-w) + (${laptopWidth} - var(--phone-w)) * var(--morph-p) )`,
              height: `calc( var(--phone-h) + (${laptopHeight} - var(--phone-h)) * var(--morph-p) )`,
              x: phoneX,
              y: phoneY,
              opacity: phoneOpacity,
              scale: phoneScale,
            } as any
          }
        >
          {/* Depth shadow below device */}
          <motion.div
            className="pointer-events-none absolute right-[8%] -bottom-8 left-[8%] z-[-1] h-16 rounded-[50%]"
            style={{
              opacity: phoneShadowOpacity,
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
            }}
          />

          {/* Hinge wrapper for laptop close */}
          <div style={{ perspective: "1200px" }} className="relative h-full w-full">
            <motion.div
              className="h-full w-full origin-bottom transform-gpu"
              style={{ rotateX: hingeRotate, opacity: closeFade }}
            >
              {/* ─── Shell A: Phone (rounded corners, dynamic island) ─── */}
              <motion.div
                className="absolute inset-0 transform-gpu overflow-hidden"
                style={{
                  opacity: phoneShellOpacity,
                  borderRadius: "calc(52px + (20px - 52px) * var(--morph-p))",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px rgba(0,0,0,0.7), 0 4px 20px -2px rgba(0,0,0,0.4)",
                }}
              >
                {/* Metallic band */}
                <div
                  className="pointer-events-none absolute inset-0 z-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(160,160,170,0.4) 0%, rgba(100,100,110,0.2) 30%, rgba(80,80,90,0.3) 70%, rgba(60,60,70,0.4) 100%)",
                  }}
                />
                {/* Bezel */}
                <motion.div
                  className="absolute inset-[3px] z-[1] bg-[#0a0a0a]"
                  style={{ borderRadius: "calc(48px + (16px - 48px) * var(--morph-p))" }}
                />
              </motion.div>

              {/* ─── Shell B: Laptop (smaller corners) ─── */}
              <motion.div
                className="absolute inset-0 transform-gpu overflow-hidden"
                style={{
                  opacity: laptopShellOpacity,
                  borderRadius: "calc(52px + (20px - 52px) * var(--morph-p))",
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
                ref={screenAreaRef}
                style={{ borderRadius: "calc(48px + (16px - 48px) * var(--morph-p))" }}
              >
                {/* Dynamic Island — proportional sizing */}
                <motion.div
                  className="absolute top-[12px] left-1/2 z-40 -translate-x-1/2"
                  style={{ opacity: dynamicIslandOpacity }}
                >
                  <div
                    className={`relative overflow-hidden rounded-full ${
                      isMobile ? "h-[26px] w-[90px]" : "h-[34px] w-[120px]"
                    }`}
                    style={{
                      background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-[1px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
                      }}
                    />
                    <div
                      className={`absolute top-1/2 right-3 -translate-y-1/2 rounded-full ${
                        isMobile ? "h-[5px] w-[5px]" : "h-[7px] w-[7px]"
                      }`}
                      style={{
                        background: "radial-gradient(circle, #1a1a3a 30%, #0a0a0a 70%)",
                        boxShadow:
                          "0 0 3px rgba(60,60,120,0.4), inset 0 0 2px rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                </motion.div>

                {/* Speaker slit */}
                <div
                  className="pointer-events-none absolute top-[6px] left-1/2 z-40 h-[3px] w-[50px] -translate-x-1/2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                  }}
                />

                {/* Glass sheen */}
                <div
                  className="pointer-events-none absolute inset-0 z-50"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 45%, transparent 60%)",
                  }}
                />

                {/* Edge highlight */}
                <div
                  className="pointer-events-none absolute top-0 right-[10%] left-[10%] z-50 h-[1px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  }}
                />

                <motion.div
                  className="absolute inset-0 z-[10] will-change-[opacity]"
                  style={{ opacity: s1 }}
                >
                  <Screen1Suggestions />
                </motion.div>
                <motion.div
                  className="absolute inset-0 z-[10] will-change-[opacity]"
                  style={{ opacity: s2 }}
                >
                  <Screen2Voice />
                </motion.div>
                <motion.div
                  className="absolute inset-0 z-[10] will-change-[opacity]"
                  style={{ opacity: s3 }}
                >
                  <Screen3Fulfillment />
                </motion.div>
                <motion.div
                  className="absolute inset-0 z-[10] will-change-[opacity]"
                  style={{ opacity: s4 }}
                >
                  <Screen4Sales />
                </motion.div>

                {/* Dashboard content — scale-to-fit inside laptop frame */}
                <motion.div
                  className="absolute inset-0 z-[10] overflow-hidden"
                  style={{ opacity: s5 }}
                >
                  <div
                    className="absolute top-0 left-0 transform-gpu"
                    style={{
                      transform: "translate3d(var(--dash-x, 0px), var(--dash-y, 0px), 0)",
                    }}
                  >
                    <div
                      className="origin-top-left transform-gpu bg-white"
                      style={{
                        width: DASHBOARD_W,
                        height: DASHBOARD_H,
                        transform: "scale(var(--dash-scale, 1))",
                      }}
                    >
                      <Screen5WebDashboard />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="pointer-events-none absolute inset-0 z-[16]"
                  style={{
                    opacity: overlayScrimOpacity,
                    background:
                      "radial-gradient(circle at 50% 44%, rgba(6, 182, 212, 0.16) 0%, rgba(15, 23, 42, 0.18) 24%, rgba(15, 23, 42, 0) 66%)",
                  }}
                />

                <motion.div
                  className="pointer-events-none absolute inset-0 z-[18] flex items-center justify-center px-4 text-center"
                  style={{
                    opacity: overlayTextOpacity,
                    y: overlayTextY,
                    scale: overlayTextScale,
                  }}
                >
                  <div className="max-w-[88%] text-white [text-shadow:0_18px_32px_rgba(15,23,42,0.32)]">
                    <span className="block text-[clamp(2.1rem,9vw,5.3rem)] leading-[0.88] font-light tracking-[-0.08em]">
                      monitor
                    </span>
                    <span className="block text-[clamp(2.05rem,8.2vw,4.7rem)] leading-[0.92] font-semibold tracking-[-0.08em] text-white/90">
                      from anywhere
                    </span>
                  </div>
                </motion.div>

                {/* Screen dimmer (early reveal) */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-[20] bg-black"
                  style={{ opacity: screenDimOpacity }}
                />

                {/* Screen blackout (morph transition) */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-[25] bg-black"
                  style={{ opacity: screenBlackout }}
                />
              </motion.div>
            </motion.div>

            {/* ── Keyboard base (separate, below screen hinge) ── */}
            <motion.div
              className="absolute -bottom-5 left-1/2 z-[6] -translate-x-1/2"
              style={{
                width: "110%",
                opacity: baseOpacity,
                y: baseY,
              }}
            >
              <div
                className="h-5 w-full rounded-t-sm rounded-b-[20px] border border-white/40 bg-gradient-to-b from-[#e5e5e5] to-[#caced1]"
                style={{ boxShadow: "0 8px 16px rgba(0,0,0,0.15)" }}
              >
                {/* Trackpad indent */}
                <div className="absolute top-0 left-1/2 h-1.5 w-28 -translate-x-1/2 rounded-b bg-black/10" />
              </div>
              {/* Hinge shadow line */}
              <div
                className="absolute -top-[2px] right-[5%] left-[5%] h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ═══ MOBILE CALLOUT OVERLAYS ═══ */}
        {isMobile && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
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
    [0, 0.3, 1, 1, 0],
  );
  const y = useTransform(progress, [start - pad, start + pad, end - pad, end], [60, 0, 0, -40]);

  return (
    <motion.div
      className="pointer-events-none absolute flex flex-col items-center text-center"
      style={{
        opacity,
        y,
        top: "50%",
      }}
    >
      {/* Frosted glass spotlight panel — localized readable zone */}
      <motion.div
        className="relative overflow-hidden rounded-3xl px-8 py-7"
        style={{
          scale: useTransform(
            progress,
            [start - pad, start + pad, end - pad, end],
            [0.92, 1, 1, 0.95],
          ),
        }}
      >
        {/* Glass backing */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            {callout.eyebrow}
          </span>
          <span
            className={`bg-clip-text text-5xl leading-none font-bold tracking-tighter text-transparent ${callout.accentClass}`}
          >
            {callout.value}
          </span>
          <span className="mt-1 max-w-[240px] text-base leading-snug font-light text-zinc-200">
            {callout.supporting}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
});
