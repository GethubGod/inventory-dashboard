import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSpreadsheet, FileUp, Store, CreditCard } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Integrations | Babytuna Systems",
  description:
    "Connect Babytuna Systems with Google Sheets, Square, Toast, and more. Import, sync, and streamline your restaurant operations.",
};

const integrations = [
  {
    icon: FileSpreadsheet,
    name: "Google Sheets",
    description:
      "Sync your inventory data directly from Google Sheets. Update items, categories, suppliers, and stock levels from a spreadsheet your team already knows.",
    tags: ["Inventory sync", "Two-way"],
  },
  {
    icon: FileUp,
    name: "CSV Import",
    description:
      "Bulk import inventory items, supplier lists, and storage areas from CSV files. Great for initial setup or migrating from another system.",
    tags: ["Bulk import", "One-time or recurring"],
  },
  {
    icon: Store,
    name: "Square POS",
    description:
      "Connect your Square point-of-sale to track sales data alongside inventory. See what\u2019s selling and let demand inform your ordering.",
    tags: ["Sales data", "POS sync"],
  },
  {
    icon: CreditCard,
    name: "Toast POS",
    description:
      "Integrate with Toast to pull real-time sales and menu data into Babytuna. Keep your inventory in sync with what\u2019s moving in the kitchen.",
    tags: ["Sales data", "POS sync"],
  },
];

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
        subtitle="Babytuna works with the systems you already use. Import data, sync sales, and streamline ordering from one place."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
            Available integrations
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-black/5 flex items-center justify-center shrink-0">
                    <integration.icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">
                    {integration.name}
                  </h3>
                </div>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-4 flex-1">
                  {integration.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {integration.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-3 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
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
            Need something else?
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Tell us what tools your restaurant uses and we&apos;ll prioritize
            it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-lime-500 hover:bg-lime-400 px-8 py-3 md:py-4 text-sm md:text-lg font-semibold text-black transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:shadow-[0_0_40px_rgba(132,204,22,0.5)]"
          >
            Request an Integration
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
