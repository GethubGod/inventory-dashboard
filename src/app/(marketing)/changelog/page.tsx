import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Changelog | Babytuna Systems",
  description:
    "See what's new in Babytuna Systems. Product updates, bug fixes, and improvements.",
};

interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: "added" | "improved" | "fixed"; text: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "v1.2.0",
    date: "February 2026",
    changes: [
      { type: "added", text: "Voice ordering now supports multi-language input with improved accuracy." },
      { type: "improved", text: "Dashboard load time reduced by 40% with optimized queries." },
      { type: "fixed", text: "Resolved an issue where supplier routing would occasionally assign items to the wrong vendor." },
    ],
  },
  {
    version: "v1.1.2",
    date: "January 2026",
    changes: [
      { type: "improved", text: "Refined the manager approval workflow for draft orders." },
      { type: "fixed", text: "Fixed push notification delivery delays on iOS devices." },
    ],
  },
  {
    version: "v1.1.1",
    date: "January 2026",
    changes: [
      { type: "fixed", text: "Corrected unit conversion for weight-based items during CSV import." },
      { type: "improved", text: "Updated onboarding flow with clearer step indicators." },
    ],
  },
  {
    version: "v1.1.0",
    date: "December 2025",
    changes: [
      { type: "added", text: "New demand forecasting module using historical sales and weather data." },
      { type: "added", text: "Square POS integration now available for Pro plan users." },
      { type: "improved", text: "Inventory list now supports bulk editing and filtering by supplier." },
    ],
  },
  {
    version: "v1.0.1",
    date: "November 2025",
    changes: [
      { type: "fixed", text: "Resolved a display issue with pricing cards on smaller screens." },
      { type: "improved", text: "Improved accessibility across all dashboard views with better contrast ratios." },
    ],
  },
  {
    version: "v1.0.0",
    date: "October 2025",
    changes: [
      { type: "added", text: "Initial release of Babytuna Systems with voice ordering, inventory tracking, and supplier routing." },
      { type: "added", text: "Mobile app available on iOS with access code authentication." },
    ],
  },
];

const typeLabels: Record<string, { label: string; className: string }> = {
  added: { label: "Added", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  improved: { label: "Improved", className: "bg-blue-50 text-blue-700 border-blue-200" },
  fixed: { label: "Fixed", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function ChangelogPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="What's new."
        subtitle="Product updates, improvements, and fixes. We ship continuously to make your kitchen run smoother."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Coming soon overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm border border-black/5 rounded-2xl px-8 py-6 shadow-lg text-center">
                <p className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
                  Coming Soon
                </p>
                <p className="text-sm md:text-base text-zinc-500">
                  Changelog updates will appear here as we ship.
                </p>
              </div>
            </div>

            {/* Blurred changelog content */}
            <div className="select-none pointer-events-none blur-[6px]" aria-hidden="true">
              <div className="absolute left-[7px] top-2 bottom-0 w-px bg-zinc-200 hidden md:block" />

              <div className="space-y-12 md:space-y-16">
                {changelog.map((entry) => (
                  <div key={entry.version} className="relative md:pl-10">
                    <div className="hidden md:block absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-zinc-300 bg-[#fafaf9]" />

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-4">
                      <span className="text-sm font-mono font-bold text-zinc-900 bg-zinc-100 rounded-md px-2.5 py-1 w-fit">
                        {entry.version}
                      </span>
                      <span className="text-sm text-zinc-500">{entry.date}</span>
                    </div>

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
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
