"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { generateStaggerConfig } from "@/lib/motion";

export const Screen1Suggestions = memo(function Screen1Suggestions() {
  // Static wrapper with internal inView staggered reveals
  return (
    <div className="w-full h-full bg-[#0b0b0b] text-white font-sans p-6 pt-16 flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-medium">Smart Prep List</h3>
          <p className="text-sm text-zinc-500">Updated 2m ago by AI</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20">
          <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
        </div>
      </div>

      <motion.div
        className="flex-1 space-y-3"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={generateStaggerConfig(0.1)}
      >
        <SuggestionRow name="Buns (Brioche)" qty="12 doz" status="low" />
        <SuggestionRow name="Tomatoes (Roma)" qty="4.5 kg" status="ok" />
        <SuggestionRow name="Lettuce (Iceberg)" qty="6 heads" status="low" />
        <SuggestionRow name="Onions (Red)" qty="10 kg" status="ok" />
        <SuggestionRow name="Cheese (Cheddar)" qty="2.1 kg" status="low" />
      </motion.div>
      
      <div className="mt-auto pt-4 flex justify-between">
        <div className="h-12 w-[65%] rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-medium text-teal-400">
          Review 3 Low Items
        </div>
        <div className="h-12 w-[30%] rounded-lg bg-white/5 flex items-center justify-center font-medium">
          Ignore
        </div>
      </div>
    </div>
  );
});

function SuggestionRow({ name, qty, status }: { name: string; qty: string; status: "low" | "ok" }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      }}
      className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5"
    >
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${status === "low" ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "bg-emerald-400"}`} />
        <span className="font-medium text-lg">{name}</span>
      </div>
      <span className="text-zinc-400 font-mono">{qty}</span>
    </motion.div>
  );
}
