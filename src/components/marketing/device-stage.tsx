"use client";

import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { Screen1Suggestions } from "./screens/screen-1-suggestions";
import { Screen2Voice } from "./screens/screen-2-voice";
import { Screen3Fulfillment } from "./screens/screen-3-fulfillment";
import { Screen4Sales } from "./screens/screen-4-sales";
import { Screen5WebDashboard } from "./screens/screen-5-web-dashboard";

// ═══════════════════════════════════════════════════════════
// DeviceStage — ONE phone shell → stretch morph → laptop close
//
// Architecture (no duplication):
//   • Single phone shell (z-30, always above text)
//   • Bottom-anchored clip container creates "peek" effect
//   • Phone stretches via scaleX/scaleY into laptop proportions
//   • Shell A (phone curves) crossfades to Shell B (laptop curves)
//   • Screen blackout → dashboard reveal during morph
//   • Keyboard base slides in from below
//   • Laptop closes with rotateX capped at -45deg
// ═══════════════════════════════════════════════════════════

const NAV_H = 72;        // Desktop nav height
const SAFE_PAD = 24;     // Padding above & below device
const PHONE_OFFSET = 18; // Extra Y offset to center phone in safe area

interface DeviceStageProps {
  progress: MotionValue<number>;
}

export const DeviceStage = memo(function DeviceStage({ progress }: DeviceStageProps) {

  // ―――――――――――――――――――――――――――――――――――――――――――
  //  PHONE RISE (peek → full view)
  //  At p=0: phone is far below, only top ~12% visible through clip
  //  At p=0.28: phone fully risen into center position
  // ―――――――――――――――――――――――――――――――――――――――――――
  const phoneY = useTransform(progress, [0.00, 0.12, 0.28], [380, 280, 0]);
  const phoneOpacity = useTransform(progress, [0.00, 0.04], [0.7, 1]);
  const phoneScale = useTransform(progress, [0.12, 0.28, 0.72, 0.76], [0.98, 1.06, 1.06, 1]);

  // Shadow depth during rise
  const phoneShadowOpacity = useTransform(progress, [0.10, 0.28, 0.72, 0.78], [0, 0.55, 0.55, 0]);

  // Screen dimmer during early reveal (keeps content dark)
  const screenDimOpacity = useTransform(progress, [0.20, 0.30], [0.85, 0]);

  // Dynamic island fades during morph
  const dynamicIslandOpacity = useTransform(progress, [0.70, 0.76], [1, 0]);

  // ―――――――――――――――――――――――――――――――――――――――――――
  //  PHONE SCREEN CROSSFADES
  //  4 mobile screens — sequential, near-instant swap
  // ―――――――――――――――――――――――――――――――――――――――――――
  const s1 = useTransform(progress, [0.26, 0.30, 0.395, 0.40], [0, 1, 1, 0]);
  const s2 = useTransform(progress, [0.40, 0.405, 0.515, 0.52], [0, 1, 1, 0]);
  const s3 = useTransform(progress, [0.52, 0.525, 0.635, 0.64], [0, 1, 1, 0]);
  const s4 = useTransform(progress, [0.64, 0.645, 0.72, 0.74], [0, 1, 1, 0]);

  // ―――――――――――――――――――――――――――――――――――――――――――
  //  PHONE → LAPTOP STRETCH MORPH (0.72 – 0.88)
  //  Screen blackout → scale stretch → shell crossfade → reveal
  // ―――――――――――――――――――――――――――――――――――――――――――

  // Screen blackout: quick fade to black at morph start, then reveal dashboard
  const screenBlackout = useTransform(progress, [0.72, 0.76, 0.80, 0.86], [0, 1, 1, 0]);

  // Scale stretch: phone proportions → laptop proportions
  const morphScaleX = useTransform(progress, [0.74, 0.86], [1, 2.6]);
  const morphScaleY = useTransform(progress, [0.74, 0.86], [1, 0.58]);

  // Shell crossfade: phone shell (rounded) fades out, laptop shell fades in
  const phoneShellOpacity = useTransform(progress, [0.76, 0.84], [1, 0]);
  const laptopShellOpacity = useTransform(progress, [0.78, 0.86], [0, 1]);

  // Dashboard screen content
  const s5 = useTransform(progress, [0.82, 0.88], [0, 1]);

  // Keyboard base slides up
  const baseOpacity = useTransform(progress, [0.84, 0.90], [0, 1]);
  const baseY = useTransform(progress, [0.84, 0.90], [20, 0]);

  // ―――――――――――――――――――――――――――――――――――――――――――
  //  LAPTOP CLOSE (0.90 – 1.00)
  //  Capped at -45deg so next section covers it mid-close
  // ―――――――――――――――――――――――――――――――――――――――――――
  const hingeRotate = useTransform(progress, [0.90, 1.00], [0, -45]);
  const closeFade = useTransform(progress, [0.92, 1.00], [1, 0.6]);

  // Overall device visibility (hides when hero leaves viewport)
  const deviceVisible = useTransform(progress, [0, 0.01, 0.98, 1.00], [0, 1, 1, 0]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* ═══ SINGLE DEVICE CONTAINER ═══
          Clip container anchored to bottom for peek effect.
          The phone starts translated far down; only top portion peeks through. */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ paddingTop: NAV_H + SAFE_PAD, paddingBottom: SAFE_PAD }}
      >
        <motion.div
          className="relative origin-center transform-gpu"
          style={{
            // Phone proportions at rest, stretches during morph
            width: "min(380px, 48vw)",
            aspectRatio: "9 / 19.5",
            y: phoneY,
            opacity: deviceVisible,
            scale: phoneScale,
            scaleX: morphScaleX,
            scaleY: morphScaleY,
          }}
        >
          {/* Depth shadow below device */}
          <motion.div
            className="absolute -bottom-8 left-[8%] right-[8%] h-16 rounded-[50%] pointer-events-none z-[-1]"
            style={{
              opacity: phoneShadowOpacity,
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
            }}
          />

          {/* ── Hinge wrapper for laptop close ── */}
          <div style={{ perspective: "1200px" }} className="w-full h-full relative">
            <motion.div
              className="w-full h-full transform-gpu origin-bottom"
              style={{ rotateX: hingeRotate, opacity: closeFade }}
            >

              {/* ─── Shell A: Phone (rounded corners, dynamic island) ─── */}
              <motion.div
                className="absolute inset-0 rounded-[52px] overflow-hidden"
                style={{
                  opacity: phoneShellOpacity,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px rgba(0,0,0,0.7), 0 4px 20px -2px rgba(0,0,0,0.4)",
                }}
              >
                {/* Metallic band */}
                <div
                  className="absolute inset-0 rounded-[52px] pointer-events-none z-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(160,160,170,0.4) 0%, rgba(100,100,110,0.2) 30%, rgba(80,80,90,0.3) 70%, rgba(60,60,70,0.4) 100%)",
                  }}
                />
                {/* Bezel */}
                <div className="absolute inset-[3px] rounded-[48px] bg-[#0a0a0a] z-[1]" />
              </motion.div>

              {/* ─── Shell B: Laptop (smaller corners) ─── */}
              <motion.div
                className="absolute inset-0 rounded-[18px] overflow-hidden"
                style={{
                  opacity: laptopShellOpacity,
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.15)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px -20px rgba(0,0,0,0.7)",
                }}
              >
                <div className="absolute inset-0 bg-[#0a0a0a]" />
              </motion.div>

              {/* ─── Screen area (shared between phone & laptop) ─── */}
              <div className="absolute inset-[3px] z-[5] overflow-hidden rounded-[48px]">
                {/* Dynamic Island */}
                <motion.div
                  className="absolute top-[12px] left-1/2 -translate-x-1/2 z-40"
                  style={{ opacity: dynamicIslandOpacity }}
                >
                  <div
                    className="relative w-[120px] h-[34px] rounded-full overflow-hidden"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full"
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

                {/* Desktop screen content (appears after blackout) */}
                <motion.div className="absolute inset-0 z-[10]" style={{ opacity: s5 }}>
                  <Screen5WebDashboard />
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
              </div>
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
      </div>
    </div>
  );
});
