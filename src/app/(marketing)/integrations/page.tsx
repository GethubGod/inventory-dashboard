import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Integrations | Babytuna Systems",
  description:
    "Connect Babytuna Systems with your POS, suppliers, and notification tools.",
};

export default function IntegrationsPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title={
          <>
            Connect your
            <br />
            <span className="text-zinc-500">tools.</span>
          </>
        }
        subtitle="Babytuna works with the systems you already use. Import data, sync sales, and get notified — all from one place."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Need an integration?
          </h2>
          <p className="text-zinc-600 text-base md:text-lg mb-8 max-w-lg mx-auto">
            We&apos;re building integrations based on what restaurants actually
            need. Tell us what tools you use.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white transition-all"
          >
            Request an Integration
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
