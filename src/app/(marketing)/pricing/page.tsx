import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Pricing | Babytuna Systems",
  description:
    "Simple, transparent pricing. Start free with basic voice ordering, or upgrade to Pro for higher limits and advanced features.",
};

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "Basic voice ordering cap. Perfect for getting started.",
    features: [
      "Limited voice conversations",
      "Basic supplier routing",
      "Single location",
      "Multi-location support",
      "Access to mobile app",
    ],
    cta: "Start Free",
    ctaHref: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/ month",
    description: "Higher voice capacity and advanced intelligence.",
    features: [
      "Everything in Starter",
      "Higher voice limit",
      "Advanced demand forecasting",
      "POS integrations (Square, Toast)",
      "Real-time cost tracking",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/signup",
    highlight: true,
  },
];

const faqs = [
  {
    question: "What counts as a voice request?",
    answer:
      "A voice request is a single conversation with Tuna Specialist where you dictate items to order. Each conversation — regardless of how many items you mention — counts as one request.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Absolutely. You can upgrade from Starter to Pro at any time from your account settings. Your data and configuration carry over seamlessly.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No contracts. Pro is billed monthly and you can cancel anytime. When you cancel, you keep access through the end of your billing period.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Starter plan is completely free — no credit card required. You only need payment info if you choose to upgrade to Pro.",
  },
];

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title={
          <>
            Simple pricing for
            <br />
            <span className="text-zinc-500">serious operations.</span>
          </>
        }
        subtitle="Start for free. Upgrade when you need more power. Cancel anytime."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-xl md:shadow-2xl border flex flex-col ${
                  plan.highlight ? "border-teal-500/30" : "border-black/5"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-teal-500 to-lime-500 px-3 py-0.5 md:px-4 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                    Recommended
                  </div>
                )}

                <div className="flex items-baseline justify-between mb-3 md:mb-0">
                  <div className="md:mb-8">
                    <h2 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-2">
                      {plan.name} Plan
                    </h2>
                    <p className="text-zinc-500 text-xs md:text-base md:h-12">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex items-baseline md:hidden shrink-0 ml-4">
                    <span className="text-3xl font-black tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500 text-xs font-medium ml-1">
                      / mo
                    </span>
                  </div>
                </div>

                <div className="hidden md:block mb-8 border-b border-black/5 pb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500 font-medium ml-2">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="md:hidden h-px bg-black/5 mb-3" />

                <div className="flex-1 space-y-2 md:space-y-4 mb-4 md:mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-zinc-700 text-xs md:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`w-full rounded-xl py-3 md:py-4 text-sm md:text-base font-semibold transition-all shadow-md text-center block ${
                    plan.highlight
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-zinc-900 py-16 md:py-24 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-10 md:mb-16 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-8 md:space-y-12">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  {faq.question}
                </h3>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 text-white py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
            Start running smarter today.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Free to start. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-lime-500 hover:bg-lime-400 px-8 py-3 md:py-4 text-sm md:text-lg font-semibold text-black transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:shadow-[0_0_40px_rgba(132,204,22,0.5)]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
