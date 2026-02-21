"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { generateStaggerConfig } from "@/lib/motion";
import { Mic } from "lucide-react";

export const Screen2Voice = memo(function Screen2Voice() {
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Dynamic Voice Rings */}
      <div className="relative flex items-center justify-center mb-12">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-teal-500/20 blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full border border-teal-400/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />
        <div className="relative z-10 w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.4)]">
          <Mic className="h-8 w-8 text-black" />
        </div>
      </div>

      <motion.div 
        className="w-full max-w-sm"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={generateStaggerConfig(0.4)}
      >
        <div className="space-y-4 text-center">
          <motion.p
            variants={{
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
            }}
            className="text-2xl font-light text-zinc-300 leading-relaxed"
          >
            "I need <span className="text-teal-400 font-medium font-mono">20 lb</span> of ground beef, and let's add <span className="text-teal-400 font-medium font-mono">15 cases</span> of standard fries."
          </motion.p>
          
          <motion.div
            variants={{
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 mt-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            Processing order...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});
