"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { transitionVariations } from "@/lib/motion";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#fafaf9] text-zinc-900 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 variants={transitionVariations.fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Simple pricing for serious operations.
          </motion.h2>
          <motion.p variants={transitionVariations.fadeUp} className="text-lg text-zinc-600">
            One flat tier. Unlimited users. Unlimited invoices. Cancel anytime.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-black/5 flex flex-col md:flex-row gap-12 relative overflow-hidden">
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <p className="text-zinc-500 mb-8">Everything you need to automate inventory across your business.</p>
              
              <div className="space-y-4">
                {["Unlimited AI voice parsing", "POS integrations (Square, Toast)", "Unlimited team accounts", "Automated supplier routing", "Real-time cost tracking"].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-zinc-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-black/10 pt-8 md:pt-0 md:pl-12 relative z-10">
              <div className="mb-2">
                <span className="text-5xl font-bold tracking-tight">$149</span>
                <span className="text-zinc-500 font-medium ml-2">/ month</span>
              </div>
              <p className="text-sm text-zinc-500 mb-8">Per location. Billed monthly.</p>
              
              <button className="w-full bg-zinc-900 text-white rounded-xl py-4 font-semibold hover:bg-teal-600 transition-colors shadow-lg">
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
