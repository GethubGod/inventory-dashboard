"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { transitionVariations } from "@/lib/motion";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Everything you need to start ordering smarter.",
    badge: null,
    features: [
      "Unlimited inventory ordering",
      "Browse & quick search",
      "Basic supplier routing",
      "Single location",
      "Access to mobile app",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$0",
    description: "Advanced features for growing operations.",
    badge: "Free During Early Access",
    features: [
      "Everything in Starter",
      "Multi-location support",
      "Voice ordering (coming soon)",
      "Advanced demand forecasting",
      "POS integrations (Square, Toast)",
      "Real-time cost tracking",
      "Priority support",
    ],
    cta: "Get Pro Free",
    highlight: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-14 md:py-32 bg-[#fafaf9] text-zinc-900 border-t border-black/5 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-8 md:mb-16"
        >
          <motion.h2 variants={transitionVariations.fadeUp} className="text-2xl md:text-5xl font-bold tracking-tight mb-3 md:mb-6">
            Free during early access.
          </motion.h2>
          <motion.p variants={transitionVariations.fadeUp} className="text-sm md:text-lg text-zinc-600">
            Get full Pro features at no cost while we grow. No credit card required.
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={`relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-xl md:shadow-2xl border flex flex-col ${
                plan.highlight ? "border-teal-500/30" : "border-black/5"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-teal-500 to-lime-500 px-3 py-0.5 md:px-4 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-baseline justify-between mb-3 md:mb-0">
                <div className="md:mb-8">
                  <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-2">{plan.name} Plan</h3>
                  <p className="text-zinc-500 text-xs md:text-base md:h-12">{plan.description}</p>
                </div>
                <div className="flex items-baseline md:hidden shrink-0 ml-4">
                  <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-zinc-500 text-xs font-medium ml-1">/ mo</span>
                </div>
              </div>

              <div className="hidden md:block mb-8 border-b border-black/5 pb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-zinc-500 font-medium ml-2">/ month</span>
                </div>
              </div>

              <div className="md:hidden h-px bg-black/5 mb-3" />

              <div className="flex-1 space-y-2 md:space-y-4 mb-4 md:mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-zinc-700 text-xs md:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full rounded-xl py-3 md:py-4 text-sm md:text-base font-semibold transition-all shadow-md ${
                  plan.highlight
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
