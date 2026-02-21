"use client";

import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { Clock, Leaf, Hand, Target, Truck, AlertTriangle, Wifi, DollarSign } from "lucide-react";

// ─────────────────────────────────────────────────
// Tile content per feature phase
// ─────────────────────────────────────────────────

interface TileContent {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  accentText: string;
}

const leftTiles: TileContent[] = [
  { icon: <Clock className="h-5 w-5" />, label: "Time Saved", value: "2.5 hrs", accent: "bg-teal-500/15", accentText: "text-teal-500" },
  { icon: <Hand className="h-5 w-5" />, label: "Hands-free", value: "1 tap", accent: "bg-violet-500/15", accentText: "text-violet-500" },
  { icon: <Truck className="h-5 w-5" />, label: "Auto-routing", value: "3 suppliers", accent: "bg-blue-500/15", accentText: "text-blue-500" },
  { icon: <Wifi className="h-5 w-5" />, label: "Live sync", value: "< 2 min", accent: "bg-orange-500/15", accentText: "text-orange-500" },
];

const rightTiles: TileContent[] = [
  { icon: <Leaf className="h-5 w-5" />, label: "Waste Reduced", value: "−18%", accent: "bg-lime-500/15", accentText: "text-lime-500" },
  { icon: <Target className="h-5 w-5" />, label: "Parse accuracy", value: "99%", accent: "bg-violet-500/15", accentText: "text-violet-500" },
  { icon: <AlertTriangle className="h-5 w-5" />, label: "Fewer mistakes", value: "−32%", accent: "bg-blue-500/15", accentText: "text-blue-500" },
  { icon: <DollarSign className="h-5 w-5" />, label: "COGS tracked", value: "real-time", accent: "bg-orange-500/15", accentText: "text-orange-500" },
];

// Phase boundaries (scroll progress where flip happens)
// Phase 0: 0.28–0.40  Phase 1: 0.40–0.52  Phase 2: 0.52–0.64  Phase 3: 0.64–0.74
const FLIP_AT = [0.40, 0.52, 0.64];

// ─────────────────────────────────────────────────
// FlipTiles container
// ─────────────────────────────────────────────────

interface FlipTilesProps {
  progress: MotionValue<number>;
}

export const FlipTiles = memo(function FlipTiles({ progress }: FlipTilesProps) {
  const tilesOpacity = useTransform(progress, [0.26, 0.30, 0.70, 0.74], [0, 1, 1, 0]);
  const tilesY = useTransform(progress, [0.26, 0.30], [24, 0]);

  return (
    <motion.div
      className="absolute inset-0 z-20 pointer-events-none hidden md:block"
      style={{ opacity: tilesOpacity, y: tilesY }}
    >
      <div className="absolute top-[50%] -translate-y-1/2 left-[3%] lg:left-[5%] xl:left-[7%]">
        <FlipTile progress={progress} contents={leftTiles} />
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 right-[3%] lg:right-[5%] xl:right-[7%]">
        <FlipTile progress={progress} contents={rightTiles} />
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────
// FlipTile — one tile with 4 faces, clean flip
//
// Each face is visible during exactly one phase.
// Flip effect: outgoing face rotates -90deg (exits upward),
// incoming face rotates from 90deg to 0 (enters from below).
// Opacity snaps between faces to prevent overlap.
// ─────────────────────────────────────────────────

const FlipTile = memo(function FlipTile({
  progress,
  contents,
}: {
  progress: MotionValue<number>;
  contents: TileContent[];
}) {
  // Face opacities — near-instant swap (0.005 window = ~16px scroll)
  // This eliminates visible overlap between faces
  const d = 0.005;
  const f0 = useTransform(progress, [FLIP_AT[0] - d, FLIP_AT[0]], [1, 0]);
  const f1 = useTransform(
    progress,
    [FLIP_AT[0], FLIP_AT[0] + d, FLIP_AT[1] - d, FLIP_AT[1]],
    [0, 1, 1, 0]
  );
  const f2 = useTransform(
    progress,
    [FLIP_AT[1], FLIP_AT[1] + d, FLIP_AT[2] - d, FLIP_AT[2]],
    [0, 1, 1, 0]
  );
  const f3 = useTransform(progress, [FLIP_AT[2], FLIP_AT[2] + d], [0, 1]);

  // Flip rotations — slightly wider window to see the rotation effect
  const rw = 0.012;
  const r0exit = useTransform(progress, [FLIP_AT[0] - rw, FLIP_AT[0] + rw], [0, -90]);
  const r1enter = useTransform(progress, [FLIP_AT[0] - rw, FLIP_AT[0] + rw], [90, 0]);
  const r2enter = useTransform(progress, [FLIP_AT[1] - rw, FLIP_AT[1] + rw], [90, 0]);
  const r3enter = useTransform(progress, [FLIP_AT[2] - rw, FLIP_AT[2] + rw], [90, 0]);

  return (
    <div className="w-[200px] lg:w-[220px] h-[130px] lg:h-[140px] relative" style={{ perspective: "800px" }}>
      <FlipFace content={contents[0]} opacity={f0} rotateX={r0exit} />
      <FlipFace content={contents[1]} opacity={f1} rotateX={r1enter} />
      <FlipFace content={contents[2]} opacity={f2} rotateX={r2enter} />
      <FlipFace content={contents[3]} opacity={f3} rotateX={r3enter} />
    </div>
  );
});

// ─────────────────────────────────────────────────
// FlipFace — single face with transform
// ─────────────────────────────────────────────────

const FlipFace = memo(function FlipFace({
  content,
  opacity,
  rotateX,
}: {
  content: TileContent;
  opacity: MotionValue<number>;
  rotateX: MotionValue<number>;
}) {
  return (
    <motion.div
      className="absolute inset-0 transform-gpu"
      style={{
        opacity,
        rotateX,
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="w-full h-full rounded-xl bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-2.5 px-4 py-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${content.accent} ${content.accentText}`}>
          {content.icon}
        </div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider leading-none">
          {content.label}
        </p>
        <p className={`text-2xl lg:text-3xl font-bold ${content.accentText} leading-none tracking-tight`}>
          {content.value}
        </p>
      </div>
    </motion.div>
  );
});
