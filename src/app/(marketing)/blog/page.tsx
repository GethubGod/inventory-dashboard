import type { Metadata } from "next";
import { Rss } from "lucide-react";
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

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-10 shadow-sm text-center mb-12">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-black/5 flex items-center justify-center mx-auto mb-5">
              <Rss className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Coming soon
            </h2>
            <p className="text-zinc-600 text-base md:text-lg mb-6 max-w-md mx-auto">
              We&apos;re writing about what we&apos;ve learned running
              restaurants and building inventory tools. Sign up to get notified
              when we publish.
            </p>
            <a
              href="mailto:babytunalovessushi@gmail.com?subject=Subscribe to Babytuna blog updates"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 px-8 py-3 text-sm md:text-base font-semibold text-white transition-all"
            >
              Get notified
            </a>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
