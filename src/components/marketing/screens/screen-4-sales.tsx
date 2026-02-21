"use client";

import { memo } from "react";
import { motion } from "framer-motion";

export const Screen4Sales = memo(function Screen4Sales() {
  const chartHeights = [40, 60, 45, 80, 50, 90, 100]; // percentages
  
  return (
    <div className="w-full h-full bg-[#1c1c1e] text-white p-6 pt-12 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-12 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-400">POS Intergation</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-lg font-semibold tracking-tight">Square Active</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-400">Total Sales (Today)</p>
          <p className="text-2xl font-semibold">$3,492.50</p>
        </div>
      </div>

      <div className="w-full h-48 flex items-end justify-between gap-2 px-4 mt-auto border-b border-white/10">
        {chartHeights.map((h, i) => (
          <motion.div
            key={i}
            className="w-full bg-teal-500 rounded-t-sm"
            style={{ originY: 1 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: h / 100 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 100,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
      
      <div className="w-full flex justify-between px-4 pt-4 text-xs font-mono text-zinc-500">
        <span>10A</span>
        <span>12P</span>
        <span>2P</span>
        <span>4P</span>
        <span>6P</span>
        <span>8P</span>
        <span>10P</span>
      </div>
    </div>
  );
});
