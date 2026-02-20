import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react";

import {
  PerformanceCard,
  type PerformanceChartPoint,
  type PerformanceFilterGroup,
  type PerformanceKpi,
} from "@/components/dashboard/overview/performance-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

type QuickAction = {
  label: string;
  href: string;
  primary?: boolean;
};

type OverviewDashboardProps = {
  performanceTitle: string;
  performanceFilters: PerformanceFilterGroup[];
  chartData: PerformanceChartPoint[];
  primaryKpi: PerformanceKpi;
  secondaryKpis: PerformanceKpi[];
  offerDescription: string;
  offerActionLabel: string;
  offerActionHref: string;
  syncStatusLabel: string;
  syncStatusTone: "healthy" | "warning" | "error" | "neutral";
  syncValue: string;
  quickActions: QuickAction[];
  latestActivity: string | null;
  topAttention: string | null;
};

function syncToneClass(tone: OverviewDashboardProps["syncStatusTone"]) {
  if (tone === "healthy") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  }

  if (tone === "warning") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  }

  if (tone === "error") {
    return "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  }

  return "bg-secondary text-muted-foreground";
}

export function OverviewDashboard({
  performanceTitle,
  performanceFilters,
  chartData,
  primaryKpi,
  secondaryKpis,
  offerDescription,
  offerActionLabel,
  offerActionHref,
  syncStatusLabel,
  syncStatusTone,
  syncValue,
  quickActions,
  latestActivity,
  topAttention,
}: OverviewDashboardProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
      <PerformanceCard
        title={performanceTitle}
        filterGroups={performanceFilters}
        chartData={chartData}
        primaryKpi={primaryKpi}
        secondaryKpis={secondaryKpis}
      />

      <aside className="space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">You&apos;re pre-approved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{offerDescription}</p>
            <Button asChild variant="outline" className="h-11 w-full rounded-full bg-secondary">
              <Link href={offerActionHref}>{offerActionLabel}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Banking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Total balance</p>
              <p className="text-xl font-semibold text-foreground">{syncValue}</p>
            </div>
            <Pill className={cn("w-fit", syncToneClass(syncStatusTone))}>{syncStatusLabel}</Pill>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.href}
                asChild
                variant={action.primary ? "default" : "ghost"}
                className="h-11 w-full justify-start rounded-xl text-left text-base"
              >
                <Link href={action.href}>
                  {action.primary ? <CreditCard className="h-[18px] w-[18px]" /> : null}
                  {action.label}
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            ))}

            {latestActivity ? (
              <div className="mt-3 rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Recent activity
                </p>
                <p className="mt-1 text-sm text-foreground">{latestActivity}</p>
              </div>
            ) : null}

            {topAttention ? (
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Attention
                </p>
                <p className="mt-1 text-sm text-foreground">{topAttention}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="flex items-center gap-2 text-sm text-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Nothing urgent right now.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
