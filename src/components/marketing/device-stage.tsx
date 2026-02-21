"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Screen1Suggestions } from "./screens/screen-1-suggestions";
import { Screen2Voice } from "./screens/screen-2-voice";
import { Screen3Fulfillment } from "./screens/screen-3-fulfillment";
import { Screen4Sales } from "./screens/screen-4-sales";
import { Screen5WebDashboard } from "./screens/screen-5-web-dashboard";

interface DeviceStageProps {
  progress: MotionValue<number>;
}

export function DeviceStage({ progress }: DeviceStageProps) {
  // ═══════════════════════════════════════════════
  // PHONE SHELL – portrait iPhone 17 Pro Max
  // ═══════════════════════════════════════════════

  // Phone entry: starts completely below viewport, only top edge peeks
  const phoneOpacity = useTransform(progress, [0.24, 0.28, 0.74, 0.80], [0, 1, 1, 0]);
  const phoneY = useTransform(progress, [0.24, 0.34, 0.46], [950, 620, 20]);

  // Screen content overlay: keeps screen dark during peek phase
  const screenDimOpacity = useTransform(progress, [0.28, 0.46], [0.92, 0]);

  // Phone screen crossfades (5 screens in phone phase)
  const s1 = useTransform(progress, [0.24, 0.30, 0.46, 0.50], [0, 1, 1, 0]);
  const s2 = useTransform(progress, [0.44, 0.48, 0.54, 0.58], [0, 1, 1, 0]);
  const s3 = useTransform(progress, [0.54, 0.58, 0.64, 0.68], [0, 1, 1, 0]);
  const s4 = useTransform(progress, [0.64, 0.68, 0.74, 0.78], [0, 1, 1, 0]);

  // ═══════════════════════════════════════════════
  // DESKTOP SHELL – landscape dashboard
  // ═══════════════════════════════════════════════

  const desktopOpacity = useTransform(progress, [0.72, 0.80], [0, 1]);
  const desktopScale = useTransform(progress, [0.72, 0.82], [0.92, 1]);
  const laptopBaseOpacity = useTransform(progress, [0.80, 0.88], [0, 1]);

  const s5 = useTransform(progress, [0.76, 0.82], [0, 1]);

  // Desktop stays visible until hero section scrolls out — no explicit exit fade
  const desktopExitOpacity = useTransform(progress, [0.76, 0.82], [0, 1]);

  return (
    <>
      {/* ═══ PHONE SHELL ═══ */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          className="h-[82vh] max-h-[860px] w-auto aspect-[9/19.5] origin-center transform-gpu"
          style={{
            opacity: phoneOpacity,
            y: phoneY,
          }}
        >
          {/* iPhone Frame */}
          <div
            className="relative w-full h-full rounded-[52px] overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px rgba(0,0,0,0.7), 0 0 60px 0 rgba(20,184,166,0.06), 0 4px 20px -2px rgba(0,0,0,0.4)",
            }}
          >
            {/* Metallic border frame */}
            <div className="absolute inset-0 rounded-[52px] pointer-events-none z-0"
              style={{
                background: "linear-gradient(180deg, rgba(160,160,170,0.4) 0%, rgba(100,100,110,0.2) 30%, rgba(80,80,90,0.3) 70%, rgba(60,60,70,0.4) 100%)",
              }}
            />

            {/* Inner bezel */}
            <div className="absolute inset-[3px] rounded-[48px] bg-[#0a0a0a] z-[1] overflow-hidden">

              {/* ── Dynamic Island ── */}
              <div className="absolute top-[12px] left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
                <div className="relative w-[120px] h-[34px] rounded-full overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="absolute inset-[1px] rounded-full pointer-events-none"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%)" }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full"
                    style={{
                      background: "radial-gradient(circle, #1a1a3a 30%, #0a0a0a 70%)",
                      boxShadow: "0 0 3px rgba(60,60,120,0.4), inset 0 0 2px rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              </div>

              {/* ── Speaker slit ── */}
              <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[50px] h-[3px] rounded-full z-40 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
              />

              {/* ── Glass sheen ── */}
              <div className="absolute inset-0 z-50 pointer-events-none"
                style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 45%, transparent 60%)" }}
              />

              {/* ── Edge reflection ── */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[1px] z-50 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
              />

              {/* ── Screen Content ── */}
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

              {/* ── Screen dimmer: keeps content invisible during peek ── */}
              <motion.div
                className="absolute inset-0 z-[30] pointer-events-none bg-black"
                style={{ opacity: screenDimOpacity }}
              />
            </div>
          </div>

          {/* Phone depth shadow */}
          <div className="absolute -bottom-6 left-[15%] right-[15%] h-12 rounded-[50%] pointer-events-none z-[-1]"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)" }}
          />
        </motion.div>
      </div>

      {/* ═══ DESKTOP SHELL ═══ */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[min(1040px,92vw)] aspect-[16/9] origin-center transform-gpu"
          style={{
            opacity: desktopOpacity,
            scale: desktopScale,
          }}
        >
          <motion.div className="w-full h-full relative" style={{ opacity: desktopExitOpacity }}>
            {/* Desktop frame */}
            <div
              className="relative w-full h-full bg-[#0a0a0a] rounded-[18px] overflow-hidden"
              style={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px -20px rgba(0,0,0,0.7), 0 4px 20px -2px rgba(0,0,0,0.3)",
              }}
            >
              {/* Glass sheen */}
              <div className="absolute inset-0 z-50 pointer-events-none"
                style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.04) 45%, transparent 60%)" }}
              />

              {/* Desktop screen content */}
              <motion.div className="absolute inset-0 z-[10]" style={{ opacity: s5 }}>
                <Screen5WebDashboard />
              </motion.div>
            </div>

            {/* Laptop base */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-5 rounded-b-[20px] rounded-t-sm bg-gradient-to-b from-[#e5e5e5] to-[#caced1] border border-white/40"
              style={{
                opacity: laptopBaseOpacity,
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b bg-black/10" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
