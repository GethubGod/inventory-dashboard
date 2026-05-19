"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { APPSTORE_COMPLIANCE_LINKS } from "@/config/external-links";
import { useMotionPreferences } from "@/lib/motion";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description:
      "Single-location ordering and core inventory workflows for teams tightening up operations.",
    features: [
      "Unlimited inventory ordering",
      "Quick search and browse",
      "Basic supplier routing",
      "Single location",
      "Mobile app access",
    ],
    cta: "Start Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$0",
    description:
      "Forecasting, routing, voice ordering, and multi-location oversight in one operating system.",
    features: [
      "Everything in Starter",
      "Voice ordering",
      "Demand forecasting",
      "POS integrations",
      "Live food-cost monitoring",
      "Multi-location support",
      "Priority onboarding support",
    ],
    cta: "Get Pro Free",
    href: "/signup",
    highlight: true,
    badge: "Free During Early Access",
  },
];

const motionEase = [0.22, 1, 0.36, 1] as const;

export function PricingSection() {
  const { shouldReduceMotion: motionPreference } = useMotionPreferences();
  const shouldReduceMotion = Boolean(motionPreference);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-black/5 bg-[#fafaf9] py-20 text-zinc-950 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-[12%] h-40 w-40 rounded-full bg-teal-500/8 blur-3xl" />
        <div className="absolute right-[12%] bottom-12 h-48 w-48 rounded-full bg-lime-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55, ease: motionEase }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase shadow-sm shadow-black/5 backdrop-blur">
            Pricing
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-balance text-zinc-950 md:text-6xl">
            Full platform access is still free during early rollout.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
            The product is being shaped with operators in the loop, so early access stays simple: no
            credit card, fast onboarding, and direct support while teams go live.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.aside
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, ease: motionEase, delay: 0.04 }}
            className="rounded-[30px] border border-black/8 bg-white/90 p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.35)] backdrop-blur md:p-7"
          >
            <p className="text-[11px] font-medium tracking-[0.26em] text-zinc-500 uppercase">
              Rollout Snapshot
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Live locations", "4"],
                ["Hours saved per shift", "2.5"],
                ["Invoice mapping accuracy", "99%"],
                ["Onboarding time", "< 1 week"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[22px] border border-black/6 bg-[#f5f5f4] px-4 py-4"
                >
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-zinc-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-black/6 bg-[#111315] p-5 text-white">
              <p className="text-[11px] font-medium tracking-[0.24em] text-zinc-500 uppercase">
                Included now
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Voice ordering",
                  "Forecasting",
                  "Supplier routing",
                  "POS sync",
                  "Food cost watch",
                  "Multi-location",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>

          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan, index) => (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.55,
                  ease: motionEase,
                  delay: 0.08 + index * 0.06,
                }}
                className={`relative flex h-full flex-col rounded-[30px] border p-6 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.35)] md:p-7 ${
                  plan.highlight
                    ? "border-teal-500/25 bg-[#0f1214] text-white"
                    : "border-black/8 bg-white/92 text-zinc-950"
                }`}
              >
                {plan.badge ? (
                  <div className="absolute top-6 left-6 rounded-full bg-gradient-to-r from-teal-500 to-lime-400 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-black uppercase">
                    {plan.badge}
                  </div>
                ) : null}

                <div className={plan.badge ? "pt-12" : ""}>
                  <p
                    className={`text-[11px] font-medium tracking-[0.24em] uppercase ${
                      plan.highlight ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {plan.name} Plan
                  </p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-[-0.06em]">{plan.price}</span>
                    <span className={plan.highlight ? "pb-2 text-zinc-400" : "pb-2 text-zinc-500"}>
                      / month
                    </span>
                  </div>
                  <p
                    className={`mt-4 text-sm leading-relaxed ${plan.highlight ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                          plan.highlight
                            ? "bg-teal-400/12 text-teal-300"
                            : "bg-teal-500/10 text-teal-700"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className={plan.highlight ? "text-zinc-200" : "text-zinc-700"}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-lime-400 text-black hover:bg-lime-300"
                      : "bg-zinc-950 text-white hover:bg-zinc-800"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: motionEase, delay: 0.08 }}
          className="mt-8 flex flex-col items-center justify-between gap-3 rounded-[28px] border border-black/8 bg-white/88 px-5 py-4 text-sm text-zinc-600 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.25)] backdrop-blur md:flex-row md:px-6"
        >
          <p>
            No credit card required. Early access includes direct support while onboarding stays
            collaborative.
          </p>
          <Link
            href={APPSTORE_COMPLIANCE_LINKS.contact}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 font-medium text-zinc-950 transition-colors hover:bg-zinc-50"
          >
            Talk to the team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
