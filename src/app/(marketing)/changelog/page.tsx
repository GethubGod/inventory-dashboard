import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Changelog | Babytuna Systems",
  description:
    "See what's new in Babytuna Systems. Product updates, planned releases, and what's coming next.",
};

interface ChangelogEntry {
  version: string;
  title: string;
  date: string;
  comingSoon?: boolean;
  summary: string;
  changes: { type: "added" | "improved" | "coming"; text: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "v2.0",
    title: "The Smart Update",
    date: "Coming Soon",
    comingSoon: true,
    summary:
      "Intelligence meets inventory. AI-powered voice ordering and predictive tools that learn how your restaurant operates.",
    changes: [
      { type: "coming", text: "Tuna Specialist \u2014 speak your order in English or Chinese and let AI parse it into structured line items, matched against your full inventory." },
      { type: "coming", text: "Demand forecasting that analyzes order history, seasonality, and sales trends to suggest what to reorder and when." },
      { type: "coming", text: "Smart reorder suggestions based on stock levels, upcoming events, and historical usage patterns." },
      { type: "coming", text: "Multilingual support with on-device speech recognition for fast, private transcription in noisy kitchens." },
    ],
  },
  {
    version: "v1.5",
    title: "The UI Update",
    date: "Coming Soon",
    comingSoon: true,
    summary:
      "A refreshed, modernized interface designed to be faster and easier to use \u2014 especially on the go.",
    changes: [
      { type: "coming", text: "Redesigned navigation with fewer taps to get to the items you order most." },
      { type: "coming", text: "Modernized visual design with improved typography, spacing, and touch targets for kitchen use." },
      { type: "coming", text: "Streamlined cart experience with inline quantity editing and swipe-to-remove." },
      { type: "coming", text: "Enhanced accessibility with better contrast, larger hit areas, and refined text scaling." },
    ],
  },
  {
    version: "v1.0",
    title: "App Launch",
    date: "February 2026",
    summary:
      "The first release of Babytuna Systems \u2014 a complete inventory ordering app built from real restaurant operations.",
    changes: [
      { type: "added", text: "Browse tab with a category grid that drills into item lists organized by Fish & Seafood, Produce, Sauces, and more." },
      { type: "added", text: "Quick Search tab with fast autocomplete showing results as you type, complete with category badges and unit info." },
      { type: "added", text: "Cart tab with quantity controls, item review, and one-tap order submission." },
      { type: "added", text: "Location selector so employees choose their restaurant before ordering." },
      { type: "added", text: "Access code authentication \u2014 managers create codes, employees join without individual signups." },
      { type: "added", text: "Full inventory database with 113+ items across categories, each with reorder units, min/max stock levels, and storage areas." },
      { type: "added", text: "Settings with display and accessibility controls including text size scaling (0.8\u00d7 to 1.4\u00d7), UI scale, button size, theme, and haptic feedback." },
      { type: "added", text: "Google Sheets sync for managing and updating inventory data from a familiar spreadsheet." },
      { type: "added", text: "CSV import for bulk uploading items, suppliers, and storage areas." },
      { type: "added", text: "Square and Toast POS integrations for syncing sales data with inventory." },
      { type: "improved", text: "Supplier routing that automatically groups items by vendor \u2014 Restaurant Depot, Asian Markets, Smart & Final, and local suppliers." },
    ],
  },
];

const typeLabels: Record<string, { label: string; className: string }> = {
  added: { label: "Added", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  improved: { label: "Improved", className: "bg-blue-50 text-blue-700 border-blue-200" },
  coming: { label: "Planned", className: "bg-violet-50 text-violet-700 border-violet-200" },
};

export default function ChangelogPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="What's new."
        subtitle="What we've shipped and what's coming next."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-zinc-200 hidden md:block" />

          <div className="space-y-16 md:space-y-20">
            {changelog.map((entry) => (
              <div key={entry.version} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <span className="text-sm font-mono font-bold text-zinc-900 bg-zinc-100 rounded-md px-2.5 py-1 w-fit">
                    {entry.version}
                  </span>
                  {entry.comingSoon && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-0.5 w-fit">
                      Coming Soon
                    </span>
                  )}
                  <span className="text-sm text-zinc-500">{entry.date}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                  {entry.title}
                </h2>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                  {entry.summary}
                </p>

                <div className="space-y-3">
                  {entry.changes.map((change, i) => {
                    const badge = typeLabels[change.type];
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 border shrink-0 mt-0.5 ${badge.className}`}>
                          {badge.label}
                        </span>
                        <p className="text-zinc-700 text-sm md:text-base leading-relaxed">
                          {change.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
