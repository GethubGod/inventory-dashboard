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

// Phase boundaries — flip happens over ~8% progress window for readability
// Phase 0: 0.28–0.40  Phase 1: 0.40–0.52  Phase 2: 0.52–0.64  Phase 3: 0.64–0.74
// Flip windows: 0.36–0.44, 0.48–0.56, 0.60–0.68
const FLIP_CENTER = [0.40, 0.52, 0.64];
const FLIP_HALF = 0.04; // Half-width of flip window (8% total)

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
        <SplitFlapTile progress={progress} contents={leftTiles} />
      </div>
      <div className="absolute top-[50%] -translate-y-1/2 right-[3%] lg:right-[5%] xl:right-[7%]">
        <SplitFlapTile progress={progress} contents={rightTiles} />
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────
// SplitFlapTile — true airport departure board flip
//
// Each "flip" consists of:
//   1. Current top half rotates down (rotateX 0→-90, origin-bottom)
//   2. Next bottom half rotates up (rotateX 90→0, origin-top)
//   3. Shadow sweeps across the flipping halves
//   4. Static halves behind show current/next content
//
// The flip window is 8% of scroll progress (readable).
// ─────────────────────────────────────────────────

const SplitFlapTile = memo(function SplitFlapTile({
  progress,
  contents,
}: {
  progress: MotionValue<number>;
  contents: TileContent[];
}) {
  return (
    <div
      className="w-[200px] lg:w-[220px] h-[130px] lg:h-[140px] relative"
      style={{ perspective: "1000px" }}
    >
      {/* Static frame background */}
      <div className="absolute inset-0 rounded-xl bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]" />

      {/* Hinge seam line */}
      <div
        className="absolute left-2 right-2 top-1/2 -translate-y-[0.5px] h-[1px] z-[15] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.08) 80%, transparent 95%)",
        }}
      />

      {/* Each flip transition renders between consecutive content pairs */}
      {FLIP_CENTER.map((center, i) => (
        <SplitFlapFlip
          key={i}
          progress={progress}
          outgoing={contents[i]}
          incoming={contents[i + 1]}
          flipCenter={center}
          isFirst={i === 0}
          isLast={i === FLIP_CENTER.length - 1}
        />
      ))}

      {/* First face (static until first flip begins) */}
      <FlapFaceStatic
        content={contents[0]}
        progress={progress}
        visibleRange={[0, FLIP_CENTER[0] - FLIP_HALF]}
      />

      {/* Last face (static after last flip ends) */}
      <FlapFaceStatic
        content={contents[contents.length - 1]}
        progress={progress}
        visibleRange={[FLIP_CENTER[FLIP_CENTER.length - 1] + FLIP_HALF, 1]}
      />
    </div>
  );
});

// ─────────────────────────────────────────────────
// SplitFlapFlip — one flip transition animation
// ─────────────────────────────────────────────────

const SplitFlapFlip = memo(function SplitFlapFlip({
  progress,
  outgoing,
  incoming,
  flipCenter,
  isFirst: _isFirst,
  isLast: _isLast,
}: {
  progress: MotionValue<number>;
  outgoing: TileContent;
  incoming: TileContent;
  flipCenter: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const start = flipCenter - FLIP_HALF;
  const end = flipCenter + FLIP_HALF;

  // Flip visibility: only render during flip window (±0.02 buffer)
  const flipVisible = useTransform(
    progress,
    [start - 0.02, start, end, end + 0.02],
    [0, 1, 1, 0]
  );

  // Top half of outgoing flips down: rotateX 0 → -90
  const topFlipRotate = useTransform(progress, [start, flipCenter], [0, -90]);
  const topFlipOpacity = useTransform(progress, [start, flipCenter], [1, 0]);

  // Bottom half of incoming flips up: rotateX 90 → 0
  const bottomFlipRotate = useTransform(progress, [flipCenter, end], [90, 0]);
  const bottomFlipOpacity = useTransform(progress, [flipCenter, end], [0, 1]);

  // Shadow sweep on flipping halves (darkens near 45deg)
  const flipShadow = useTransform(
    progress,
    [start, flipCenter - 0.01, flipCenter, flipCenter + 0.01, end],
    [0, 0.35, 0.4, 0.35, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 z-[10]"
      style={{ opacity: flipVisible }}
    >
      {/* ── Static bottom half: shows OUTGOING content (visible behind top flip) ── */}
      <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ clipPath: "inset(50% 0 0 0)" }}>
        <FlapContent content={outgoing} />
      </div>

      {/* ── Static top half: shows INCOMING content (visible behind bottom flip) ── */}
      <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ clipPath: "inset(0 0 50% 0)" }}>
        <FlapContent content={incoming} />
      </div>

      {/* ── Flipping top half (outgoing rotates down, origin=bottom) ── */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-xl transform-gpu"
        style={{
          clipPath: "inset(0 0 50% 0)",
          rotateX: topFlipRotate,
          opacity: topFlipOpacity,
          transformOrigin: "center bottom",
          backfaceVisibility: "hidden",
        }}
      >
        <FlapContent content={outgoing} />
        {/* Shadow sweep */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: flipShadow }}
        />
      </motion.div>

      {/* ── Flipping bottom half (incoming rotates up, origin=top) ── */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-xl transform-gpu"
        style={{
          clipPath: "inset(50% 0 0 0)",
          rotateX: bottomFlipRotate,
          opacity: bottomFlipOpacity,
          transformOrigin: "center top",
          backfaceVisibility: "hidden",
        }}
      >
        <FlapContent content={incoming} />
        {/* Shadow sweep */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: flipShadow }}
        />
      </motion.div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────
// FlapFaceStatic — non-flipping face visible during a stable phase
// ─────────────────────────────────────────────────

const FlapFaceStatic = memo(function FlapFaceStatic({
  content,
  progress,
  visibleRange,
}: {
  content: TileContent;
  progress: MotionValue<number>;
  visibleRange: [number, number];
}) {
  const [from, to] = visibleRange;
  const opacity = useTransform(
    progress,
    [from - 0.01, from + 0.01, to - 0.01, to + 0.01],
    [0, 1, 1, 0]
  );

  return (
    <motion.div className="absolute inset-0 z-[5] rounded-xl overflow-hidden" style={{ opacity }}>
      <FlapContent content={content} />
    </motion.div>
  );
});

// ─────────────────────────────────────────────────
// FlapContent — the visual content inside a flap half
// ─────────────────────────────────────────────────

function FlapContent({ content }: { content: TileContent }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 px-4 py-3">
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
  );
}
