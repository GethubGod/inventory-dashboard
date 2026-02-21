"use client";

import { motion } from "framer-motion";
import { Mic, BrainCircuit, LineChart, TrendingUp, Zap, Users } from "lucide-react";
import { generateStaggerConfig, transitionVariations } from "@/lib/motion";

const features = [
  {
    title: "Voice-First Ordering",
    description: "Speak your prep list in any language. We convert it instantly.",
    visual: (
      <div className="flex items-center gap-3 w-full p-3 bg-white border border-black/5 rounded-xl shadow-sm">
        <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
          <Mic className="h-4 w-4 text-teal-600" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-3/4 bg-zinc-200 rounded-full" />
          <div className="h-2 w-1/2 bg-zinc-100 rounded-full" />
        </div>
      </div>
    )
  },
  {
    title: "AI Demand Forecasting",
    description: "Predict exactly what you'll sell based on weather and history.",
    visual: (
      <div className="relative h-14 w-full bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden flex items-end px-3">
        <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,80 Q20,60 40,70 T80,30 T100,10" fill="none" stroke="#14b8a6" strokeWidth="4" className="opacity-50" />
          <path d="M0,90 Q20,80 40,85 T80,45 T100,20" fill="none" stroke="#000000" strokeWidth="4" />
        </svg>
      </div>
    )
  },
  {
    title: "Smart Auto-Routing",
    description: "Ingredients are automatically grouped and routed to preferred suppliers.",
    visual: (
      <div className="flex gap-2 w-full p-2 bg-white border border-black/5 rounded-xl shadow-sm">
        <div className="flex-1 bg-zinc-50 border border-black/5 rounded-lg p-2 text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Sysco</span>
          <div className="mt-1 flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          </div>
        </div>
        <div className="flex-1 bg-zinc-50 border border-black/5 rounded-lg p-2 text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Local</span>
          <div className="mt-1 flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Real-Time COGS",
    description: "Invoices mapped directly to menu items. Watch margins live.",
    visual: (
      <div className="flex items-center justify-between w-full p-3 bg-white border border-black/5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-rose-50 flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-rose-500" />
          </div>
          <span className="text-xs font-medium text-zinc-600">Food Cost</span>
        </div>
        <span className="text-sm font-bold text-zinc-900">28.4%</span>
      </div>
    )
  },
  {
    title: "POS Integration",
    description: "Two-way sync. Sales deplete stock accurately to the ounce.",
    visual: (
      <div className="flex items-center justify-center gap-4 w-full h-14 bg-white border border-black/5 rounded-xl shadow-sm">
         <div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-sm"/></div>
         <div className="flex gap-1">
           <div className="w-1 h-1 rounded-full bg-zinc-300" />
           <div className="w-1 h-1 rounded-full bg-zinc-300" />
           <div className="w-1 h-1 rounded-full bg-teal-400" />
         </div>
         <div className="text-xl font-bold">🐟</div>
      </div>
    )
  },
  {
    title: "Multi-Location Ready",
    description: "Manage fifty restaurants from a single dashboard.",
    visual: (
      <div className="relative w-full h-14 bg-white border border-black/5 rounded-xl shadow-sm flex items-center justify-center gap-2 px-3 overflow-hidden">
        <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
             <div key={i} className={`h-8 w-12 rounded bg-zinc-100 border border-black/5 shrink-0 transition ${i === 3 ? "scale-110 shadow-sm border-teal-500/20" : ""}`} />
          ))}
        </div>
      </div>
    )
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#fafaf9] text-zinc-900 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={generateStaggerConfig(0.1)}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.h2
            variants={transitionVariations.fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Everything you need. <br />
            <span className="text-zinc-500 font-normal">Nothing you don't.</span>
          </motion.h2>
          <motion.p
            variants={transitionVariations.fadeUp}
            className="text-lg text-zinc-600 leading-relaxed"
          >
            Babytuna isn't just a spreadsheet in the cloud. It's an active intelligence engine built specifically for the chaos of commercial kitchens.
          </motion.p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scaleX: 0 }}
           whileInView={{ opacity: 1, scaleX: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeInOut" }}
           className="w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent mb-16 origin-left"
        />

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={generateStaggerConfig(0.1)}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={transitionVariations.fadeUp} className="group relative pr-4">
              <div className="mb-6 w-full max-w-[200px] bg-zinc-50 border border-black/5 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-teal-50/50 transition-colors">
                 {/* Visual Micro-component injection */}
                 <div className="w-full relative z-10">
                   {feature.visual}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
