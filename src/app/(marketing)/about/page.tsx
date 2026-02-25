import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "About Us | Babytuna Systems",
  description:
    "Born from the kitchens of Babytuna Sushi and Babytuna Poki & Pho. We built the inventory system we wished existed, then opened it up for every restaurant.",
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
      "The system should be obvious. No training manuals, no onboarding calls. Open it and go.",
  },
  {
    title: "Built in the kitchen",
    description:
      "Every feature comes from real operational pain. We test in restaurants, not labs.",
  },
  {
    title: "Automation that earns trust",
    description:
      "We automate the repetitive stuff but always give you the final say. You review before it ships.",
  },
  {
    title: "Honest by default",
    description:
      "Transparent pricing, no hidden fees, no dark patterns. We sell a product, not a trap.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title={
          <>
            Built by a restaurant owner,
            <br />
            <span className="text-zinc-500">for every restaurant.</span>
          </>
        }
        subtitle="We didn't set out to build a software company. We set out to fix ordering at our own restaurants."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
            Babytuna Systems was built to solve real inventory and ordering
            problems we faced running our own restaurants &mdash; then we
            opened it up for every restaurant that deals with the same
            challenges.
          </p>
        </div>
      </section>

      <section className="bg-white text-zinc-900 py-16 md:py-24 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Our mission
          </h2>
          <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-12 md:mb-16">
            Eliminate inventory waste and ordering friction for every
            restaurant &mdash; starting with the small, independent operators
            who need it most and have the fewest tools built for them.
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

      <section className="bg-zinc-900 text-white py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
            Try it for yourself.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Free during early access. Set up your restaurant in minutes.
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
