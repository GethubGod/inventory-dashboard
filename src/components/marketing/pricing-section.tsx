"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { transitionVariations } from "@/lib/motion";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Basic voice ordering cap.",
      features: [
        "Limited voice conversations",
        "Basic supplier routing",
        "Single location",
        "Multi-location support",
        "Quick Order feature",
      ],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$10",
      description: "Higher voice capacity and advanced intelligence.",
      features: [
        "Everything in Starter Plan",
        "Higher voice limit",
        "Advanced demand forecasting",
        "POS integrations (Square, Toast)",
        "Real-time cost tracking",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
      highlight: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#fafaf9] text-zinc-900 border-t border-black/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            Start for free. Upgrade when you need more power. Cancel anytime.
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={`relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl border flex flex-col ${
                plan.highlight ? "border-teal-500/30" : "border-black/5"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-teal-500 to-lime-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name} Plan</h3>
                <p className="text-zinc-500 h-12">{plan.description}</p>
              </div>

              <div className="mb-8 border-b border-black/5 pb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-zinc-500 font-medium ml-2">/ month</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-zinc-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full rounded-xl py-4 font-semibold transition-all shadow-md ${
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
