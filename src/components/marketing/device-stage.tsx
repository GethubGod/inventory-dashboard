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
  // ─── ENTRY ───────────────────────────────────
  const stageOpacity = useTransform(progress, [0.16, 0.24], [0, 1]);
  const stageY = useTransform(progress, [0.16, 0.30], [200, 0]);

  // ─── SCALE (phone → desktop) ─────────────────
  const stageScale = useTransform(
    progress,
    [0, 0.74, 0.90, 1],
    [0.34, 0.34, 1, 1]
  );

  // ─── BORDER RADIUS morph ─────────────────────
  const borderRadius = useTransform(progress, [0.74, 0.90], [42, 18]);
  const borderWidth = useTransform(progress, [0.74, 0.90], [6, 2]);

  // ─── NOTCH / LAPTOP BASE ─────────────────────
  const notchOpacity = useTransform(progress, [0.74, 0.82], [1, 0]);
  const laptopBaseOpacity = useTransform(progress, [0.82, 0.90], [0, 1]);

  // ─── SCREEN CROSSFADES ───────────────────────
  const s1 = useTransform(progress, [0.16, 0.24, 0.38, 0.42], [0, 1, 1, 0]);
  const s2 = useTransform(progress, [0.40, 0.44, 0.50, 0.54], [0, 1, 1, 0]);
  const s3 = useTransform(progress, [0.50, 0.54, 0.60, 0.64], [0, 1, 1, 0]);
  const s4 = useTransform(progress, [0.60, 0.64, 0.70, 0.74], [0, 1, 1, 0]);
  const s5 = useTransform(progress, [0.72, 0.78, 0.95, 1.00], [0, 1, 1, 0]);

  // ─── EXIT ────────────────────────────────────
  const exitOpacity = useTransform(progress, [0.92, 1.0], [1, 0]);

  return (
    <>
      {/* Wrapper div handles centering via CSS only - no Framer transform conflicts */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[min(960px,92vw)] aspect-[16/9] origin-center transform-gpu"
          style={{
            opacity: stageOpacity,
            y: stageY,
            scale: stageScale,
          }}
        >
          {/* Exit fade wrapper */}
          <motion.div className="w-full h-full relative" style={{ opacity: exitOpacity }}>
            {/* ── Device Frame ── */}
            <motion.div
              className="relative w-full h-full bg-[#0a0a0a] overflow-hidden transform-gpu"
              style={{
                borderRadius,
                borderWidth,
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.18)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 40px 120px -20px rgba(0,0,0,0.7), 0 0 80px 0 rgba(20,184,166,0.08)",
              }}
            >
              {/* Glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none z-50" />

              {/* Phone notch */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-black rounded-b-2xl z-40"
                style={{ opacity: notchOpacity }}
              >
                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/10" />
              </motion.div>

              {/* ── Screen Layers ── */}
              <motion.div className="absolute inset-0" style={{ opacity: s1 }}>
                <Screen1Suggestions />
              </motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: s2 }}>
                <Screen2Voice />
              </motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: s3 }}>
                <Screen3Fulfillment />
              </motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: s4 }}>
                <Screen4Sales />
              </motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: s5 }}>
                <Screen5WebDashboard />
              </motion.div>
            </motion.div>

            {/* ── Laptop Base ── */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-5 rounded-b-[20px] rounded-t-sm bg-gradient-to-b from-[#e5e5e5] to-[#caced1] shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-white/40"
              style={{ opacity: laptopBaseOpacity }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b bg-black/10" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
