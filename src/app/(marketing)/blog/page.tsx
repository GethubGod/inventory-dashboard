import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Blog | Babytuna Systems",
  description:
    "Updates, operating insights, and ideas on reducing inventory waste in restaurants.",
};

export default function BlogPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title={
          <>
            Updates and
            <br />
            <span className="text-zinc-500">operating insights.</span>
          </>
        }
        subtitle="Ideas on reducing waste, streamlining ordering, and building better tools for restaurants."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Stay in the loop.
          </h2>
          <p className="text-zinc-600 text-base md:text-lg mb-8 max-w-lg mx-auto">
            We&apos;ll share updates on new features, integrations, and
            operational insights as we build.
          </p>
          <a
            href="mailto:babytunalovessushi@gmail.com?subject=Subscribe to Babytuna updates"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white transition-all"
          >
            Email us to get updates
          </a>
        </div>
      </section>
    </MarketingPageShell>
  );
}
