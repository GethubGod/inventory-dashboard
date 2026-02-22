import type { Metadata } from "next";
import Link from "next/link";
import {
  Mic,
  Package,
  ClipboardList,
  GitBranch,
  Bell,
  Building2,
  ArrowRight,
} from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Features | Babytuna Systems",
  description:
    "Voice-first ordering, inventory tracking, supplier routing, and more. Everything you need to run restaurant inventory.",
};

const features = [
  {
    icon: Mic,
    title: "Voice-First Ordering",
    description:
      "Speak your order in any language. Tuna Specialist converts it instantly into structured, accurate line items routed to the right suppliers.",
    details: [
      "Natural language processing in any language",
      "Automatic unit and quantity parsing",
      "Conversation limits scale with your plan",
    ],
  },
  {
    icon: Package,
    title: "Inventory Tracking & Stock Thresholds",
    description:
      "Real-time visibility into every item across your operation. Set par levels and get alerts before you run out.",
    details: [
      "Live stock counts synced with POS sales",
      "Configurable par levels per item",
      "Automatic low-stock alerts",
    ],
  },
  {
    icon: ClipboardList,
    title: "Orders & Fulfillment Workflow",
    description:
      "From draft to delivery, every order is tracked. Review AI-generated carts, approve with one tap, and monitor fulfillment status.",
    details: [
      "AI-generated draft orders",
      "One-tap approval workflow",
      "Delivery tracking and confirmation",
    ],
  },
  {
    icon: GitBranch,
    title: "Supplier Routing & Grouping",
    description:
      "Items are automatically grouped by supplier. No more splitting orders manually across vendor catalogs.",
    details: [
      "Automatic supplier assignment",
      "Grouped order summaries",
      "Preferred vendor configuration",
    ],
  },
  {
    icon: Bell,
    title: "Notifications & Reminders",
    description:
      "Stay ahead of deadlines and stock-outs. Get push notifications for order windows, low inventory, and delivery updates.",
    details: [
      "Push notifications for critical events",
      "Customizable reminder schedules",
      "Order window deadline alerts",
    ],
  },
  {
    icon: Building2,
    title: "Multi-Location Readiness",
    badge: "Coming Soon",
    description:
      "Manage inventory across multiple locations from a single dashboard. Centralized reporting, location-specific settings.",
    details: [
      "Unified dashboard across locations",
      "Per-location stock and ordering",
      "Consolidated reporting",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title={
          <>
            Everything you need
            <br />
            <span className="text-zinc-500">to run inventory.</span>
          </>
        }
        subtitle="From voice-first ordering to real-time cost tracking — a complete system built for how restaurants actually work."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:gap-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-black/5 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-teal-600" />
                    </div>
                    {feature.badge && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-3 py-0.5">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                    {feature.title}
                  </h2>
                  <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                        <span className="text-zinc-700 text-sm md:text-base">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`aspect-4/3 rounded-2xl bg-white border border-black/5 shadow-lg flex items-center justify-center ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="text-center px-8">
                    <feature.icon className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                    <p className="text-sm text-zinc-400 font-medium">
                      {feature.title}
                    </p>
                  </div>
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
            Ready to streamline your kitchen?
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8 md:mb-12 max-w-lg mx-auto">
            Start free. Upgrade when your operation demands it.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-lime-500 hover:bg-lime-400 px-8 py-3 md:py-4 text-sm md:text-lg font-semibold text-black transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:shadow-[0_0_40px_rgba(132,204,22,0.5)]"
          >
            View Pricing
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
