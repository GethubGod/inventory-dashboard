"use client";

import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

export interface CalloutContent {
  eyebrow: string;
  value: string;
  supporting: string;
  accent: string; // e.g. "text-teal-500", "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-lime-400"
}

interface TextCalloutsProps {
  progress: MotionValue<number>;
  contents: CalloutContent[];
  // Time window bounds for each callout
  windows: [number, number][];
}

export const TextCallouts = memo(function TextCallouts({ progress, contents, windows }: TextCalloutsProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
      {/* Container anchored to the right side */}
      <div className="absolute top-[50%] -translate-y-1/2 right-[10%] w-[320px] flex flex-col justify-center">
        {contents.map((content, i) => (
          <CalloutItem 
            key={i} 
            content={content} 
            progress={progress} 
            window={windows[i]} 
          />
        ))}
      </div>
    </div>
  );
});

const CalloutItem = memo(function CalloutItem({ 
  content, 
  progress, 
  window 
}: { 
  content: CalloutContent; 
  progress: MotionValue<number>; 
  window: [number, number];
}) {
  const [start, end] = window;
  const pad = 0.02; // Fade duration

  // Opacity peaks through the middle of the window
  const opacity = useTransform(
    progress,
    [start - pad, start, end, end + pad],
    [0, 1, 1, 0]
  );
  
  // Slight slide up effect on enter
  const y = useTransform(
    progress,
    [start - pad, start],
    [20, 0]
  );

  return (
    <motion.div 
      className="absolute w-full"
      style={{ opacity, y }}
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
          {content.eyebrow}
        </span>
        <span className={`text-6xl font-bold tracking-tighter leading-none ${content.accent}`}>
          {content.value}
        </span>
        <span className="text-xl font-light text-zinc-400 mt-2 leading-snug">
          {content.supporting}
        </span>
      </div>
    </motion.div>
  );
});
