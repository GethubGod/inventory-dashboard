import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "About Us | Babytuna Systems",
  description:
    "Built by restaurant owners for restaurant operations. Our mission is to reduce inventory waste and ordering friction.",
};

const principles = [
  {
    title: "Speed over ceremony",
    description:
      "Every interaction is designed to be faster than the old way. If it slows you down, we cut it.",
  },
  {
    title: "Clarity over cleverness",
    description:
      "The system should be obvious. No training manuals, no onboarding calls. Open and go.",
  },
  {
    title: "Automation that earns trust",
    description:
      "We automate repetitive tasks but always give you the final say. Review before it ships.",
  },
  {
    title: "Built in the kitchen",
    description:
      "Every feature comes from real operational pain. We test in restaurants, not labs.",
  },
  {
    title: "Honest by default",
    description:
      "Transparent pricing. No hidden fees. No dark patterns. We sell a product, not a trap.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title={
          <>
            Built by restaurant owners,
            <br />
            <span className="text-zinc-500">for restaurant operations.</span>
          </>
        }
        subtitle="We've been in the trenches — so we know the problems restaurants face better than anyone."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-zinc max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              The story
            </h2>
            <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
              Babytuna Systems was born out of restaurant kitchens — not a
              startup accelerator. We ran restaurants and spent more time
              managing spreadsheets, texting suppliers, and guessing par levels
              than actually cooking.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-zinc-900 py-16 md:py-24 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Our mission
          </h2>
          <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-12 md:mb-16">
            Reduce inventory waste and ordering friction for every restaurant,
            starting with the ones that need it most — small, independent
            operators.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
            Principles
          </h2>
          <div className="space-y-8">
            {principles.map((principle, i) => (
              <div key={i} className="flex gap-4 md:gap-6 items-start">
                <div className="h-8 w-8 rounded-lg bg-zinc-100 border border-black/5 flex items-center justify-center shrink-0 font-mono text-sm font-bold text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1">
                    {principle.title}
                  </h3>
                  <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
