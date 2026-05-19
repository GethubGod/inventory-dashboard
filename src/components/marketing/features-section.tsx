"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Building2,
  Mic,
  ReceiptText,
  Store,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { useMotionPreferences } from "@/lib/motion";
import { cn } from "@/lib/utils";

const reveal = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function FeaturesSection() {
  const { shouldReduceMotion: motionPreference } = useMotionPreferences();
  const shouldReduceMotion = Boolean(motionPreference);

  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-black/5 bg-[#fafaf9] py-20 text-zinc-950 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-[8%] h-48 w-48 rounded-full bg-teal-500/8 blur-3xl" />
        <div className="absolute top-20 right-[10%] h-56 w-56 rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={reveal}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase shadow-sm shadow-black/5 backdrop-blur">
            Product Showcase
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-balance text-zinc-950 md:text-6xl">
            Built to compress the full inventory cycle into one calm workflow.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
            Voice requests, forecasting, supplier routing, food cost monitoring, POS sync, and
            multi-location oversight sit in one operating surface. The section is tighter because
            the product story should scan quickly.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <ShowcaseCard
            title="Capture messy requests and turn them into clean draft orders."
            description="Operators can speak naturally on the line or in the walk-in, then review normalized quantities before anything is sent."
            eyebrow="Voice Ordering"
            icon={Mic}
            points={["Natural language capture", "Draft orders auto-structured"]}
            className="lg:col-span-7"
            shouldReduceMotion={shouldReduceMotion}
            index={0}
          >
            <VoiceDraftVisual />
          </ShowcaseCard>

          <ShowcaseCard
            title="Forecast prep before service turns reactive."
            description="Demand curves, daypart signals, and prep thresholds stay visible in one place so teams can move earlier with more confidence."
            eyebrow="Forecasting"
            icon={TrendingUp}
            points={["Sales and demand signals", "Prep thresholds before rush"]}
            className="lg:col-span-5"
            shouldReduceMotion={shouldReduceMotion}
            index={1}
          >
            <ForecastVisual />
          </ShowcaseCard>

          <ShowcaseCard
            title="Route vendor decisions with margin context attached."
            description="Supplier lanes and cost watch live together, so sourcing decisions stay tied to margin impact instead of spreadsheet cleanup."
            eyebrow="Routing + COGS"
            icon={ReceiptText}
            points={["Supplier-aware draft routing", "Live food cost monitoring"]}
            className="lg:col-span-5"
            shouldReduceMotion={shouldReduceMotion}
            index={2}
          >
            <RoutingCostVisual />
          </ShowcaseCard>

          <ShowcaseCard
            title="Keep sales, stock, and every location aligned in real time."
            description="POS depletion, transfer visibility, and group-level oversight stay connected so operators work from one source of truth."
            eyebrow="POS + Multi-Location"
            icon={Store}
            points={["Bidirectional sales sync", "Multi-location command view"]}
            className="lg:col-span-7"
            shouldReduceMotion={shouldReduceMotion}
            index={3}
          >
            <SyncNetworkVisual />
          </ShowcaseCard>
        </div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...reveal, delay: 0.06 }}
          className="mt-6 grid gap-3 rounded-[28px] border border-black/8 bg-white/85 p-4 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.25)] backdrop-blur md:grid-cols-3 md:p-5"
        >
          <MetaTile
            icon={ArrowLeftRight}
            label="Supplier-ready drafts"
            value="31 routed items"
            supporting="Grouped by vendor, pack size, and preference."
          />
          <MetaTile
            icon={ReceiptText}
            label="Live cost watch"
            value="28.4% dairy"
            supporting="Margin drift surfaces before the weekend close."
          />
          <MetaTile
            icon={Building2}
            label="Group oversight"
            value="4 locations synced"
            supporting="Transfers and sales movement stay visible together."
          />
        </motion.div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  title,
  description,
  eyebrow,
  icon: Icon,
  points,
  className,
  children,
  shouldReduceMotion,
  index,
}: {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  points: string[];
  className?: string;
  children: ReactNode;
  shouldReduceMotion: boolean;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...reveal, delay: index * 0.05 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-[30px] border border-white/70 bg-[#0b0d0f] p-5 text-white shadow-[0_30px_80px_-48px_rgba(15,23,42,0.6)] md:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_36%)]" />

      <div className="relative flex h-full flex-col">
        {children}

        <div className="mt-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium tracking-[0.24em] text-zinc-400 uppercase">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-teal-300">
              <Icon className="h-4 w-4" />
            </span>
            {eyebrow}
          </div>

          <h3 className="mt-5 max-w-[18ch] text-3xl font-semibold tracking-[-0.05em] text-balance text-white md:text-[2rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {points.map((point) => (
              <span
                key={point}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MetaTile({
  icon: Icon,
  label,
  value,
  supporting,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  supporting: string;
}) {
  return (
    <div className="rounded-[22px] border border-black/6 bg-[#f5f5f4] px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-zinc-700">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-medium tracking-[0.22em] text-zinc-500 uppercase">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-950">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{supporting}</p>
    </div>
  );
}

function VisualFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,23,24,0.92),rgba(8,10,11,0.98))] p-4 md:p-5",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%)]" />
      {children}
    </div>
  );
}

function VoiceDraftVisual() {
  return (
    <VisualFrame className="min-h-[260px]">
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="rounded-[20px] border border-white/10 bg-black/25 px-4 py-3">
          <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Voice capture</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
              <Mic className="h-5 w-5" />
            </span>
            <p className="text-lg text-white">“Add six cases of roma tomatoes.”</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 rounded-[20px] border border-white/10 bg-black/25 px-4 py-4">
          {[28, 44, 36, 60, 34, 72, 48, 38, 64, 30, 52, 34].map((height, index) => (
            <span
              key={index}
              className="rounded-full bg-gradient-to-r from-teal-300 to-lime-200"
              style={{ height, alignSelf: "end" }}
            />
          ))}
        </div>

        <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Draft order</p>
              <p className="mt-2 text-xl font-semibold text-white">Voice converted to line items</p>
            </div>
            <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-sm text-lime-200">
              Ready
            </span>
          </div>
          <div className="mt-4 h-px bg-white/8" />
          <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
              Roma tomatoes
              <span className="block text-zinc-500">6 cases · produce</span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
              Salmon fillets
              <span className="block text-zinc-500">2 boxes · seafood</span>
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function ForecastVisual() {
  return (
    <VisualFrame className="min-h-[260px]">
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between rounded-[20px] border border-white/10 bg-black/25 px-4 py-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Forecast pulse</p>
            <p className="mt-3 max-w-[12ch] text-2xl font-semibold text-white">
              Friday dinner demand is trending up.
            </p>
          </div>
          <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xl font-semibold text-cyan-200">
            +12%
          </span>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between text-[11px] tracking-[0.24em] text-zinc-500 uppercase">
            <span>Actual</span>
            <span>Projected</span>
          </div>
          <div className="relative mt-4 h-[120px] overflow-hidden rounded-[18px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]">
            <div className="absolute inset-x-0 top-1/4 border-t border-white/6" />
            <div className="absolute inset-x-0 top-2/4 border-t border-white/6" />
            <div className="absolute inset-x-0 top-3/4 border-t border-white/6" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 120" fill="none">
              <path
                d="M28 84C70 78 92 84 130 82C172 80 198 62 232 52C266 42 298 50 332 26"
                stroke="rgba(45,212,191,0.9)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M28 70C66 66 104 64 140 58C174 54 212 42 252 40C288 38 314 36 332 30"
                stroke="rgba(192,132,252,0.65)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute right-8 bottom-4 h-5 w-5 rounded-full bg-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.45)]" />
          </div>
        </div>

        <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <div className="rounded-[18px] border border-white/10 bg-black/25 px-4 py-3">
            <span className="text-zinc-500">Prep alert</span>
            <p className="mt-2 text-white">Boost tuna rice prep by 8 trays before 4 PM.</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-black/25 px-4 py-3">
            <span className="text-zinc-500">Ordering window</span>
            <p className="mt-2 text-white">Dairy spend is still 12% under the weekly budget.</p>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function RoutingCostVisual() {
  return (
    <VisualFrame className="min-h-[260px]">
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="relative rounded-[20px] border border-white/10 bg-black/25 p-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-[20px] border border-lime-300/12 bg-lime-400/[0.06] p-4">
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Premium lane</p>
              <p className="mt-3 text-2xl font-semibold text-white">Seafood</p>
              <p className="mt-2 text-sm text-zinc-400">2 items</p>
            </div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] border border-teal-300/18 bg-teal-400/[0.08] text-center">
              <span className="text-[11px] tracking-[0.24em] text-teal-200 uppercase">Router</span>
              <div className="absolute inset-y-1/2 -left-7 h-px w-7 bg-teal-300/50" />
              <div className="absolute inset-y-1/2 -right-7 h-px w-7 bg-teal-300/50" />
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Core catalog</p>
              <p className="mt-3 text-2xl font-semibold text-white">Sysco</p>
              <p className="mt-2 text-sm text-zinc-400">7 items</p>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">
                Live margin watch
              </p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-white">28.4%</p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-base text-emerald-200">
              Under target
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
                <span>Dairy</span>
                <span>42%</span>
              </div>
              <div className="h-3 rounded-full bg-white/8">
                <div className="h-3 w-[42%] rounded-full bg-gradient-to-r from-emerald-300 to-teal-300" />
              </div>
            </div>
            <div className="rounded-[18px] border border-amber-300/14 bg-amber-300/[0.08] px-4 py-3 text-sm text-amber-50">
              Tuna rolls are trending 3.2% above target. Route salmon to premium lane on the next
              draft.
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function SyncNetworkVisual() {
  return (
    <VisualFrame className="min-h-[260px]">
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">POS feed</p>
              <p className="mt-2 text-2xl font-semibold text-white">Square sales</p>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200">
              Synced
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Lunch", "214 covers"],
              ["Dinner", "318 covers"],
              ["Variance", "+8.6%"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">{label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Group view</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                4 kitchens, 1 command surface
              </p>
            </div>
            <Building2 className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Santa Monica", "58%"],
              ["Pasadena", "88%"],
              ["Silver Lake", "62%"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={cn(
                  "rounded-[18px] border px-4 py-3",
                  index === 1
                    ? "border-teal-300/18 bg-teal-300/[0.08]"
                    : "border-white/10 bg-white/[0.03]",
                )}
              >
                <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Location</p>
                <p className="mt-2 text-2xl font-semibold text-white">{label}</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
