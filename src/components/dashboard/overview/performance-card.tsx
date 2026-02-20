"use client";

import { memo, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiStat } from "@/components/ui/kpi-stat";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

export type PerformanceFilterOption = {
  value: string;
  label: string;
};

export type PerformanceFilterGroup = {
  id: string;
  label: string;
  options: PerformanceFilterOption[];
  defaultValue: string;
};

export type PerformanceChartPoint = {
  label: string;
  current: number;
  prior: number;
};

export type PerformanceKpi = {
  id: string;
  label: string;
  value: string;
  unavailable?: boolean;
};

type PerformanceCardProps = {
  title: string;
  filterGroups: PerformanceFilterGroup[];
  chartData: PerformanceChartPoint[];
  primaryKpi: PerformanceKpi;
  secondaryKpis: PerformanceKpi[];
};

const CHART_MARGIN = { top: 6, right: 12, left: 0, bottom: 0 };
const AXIS_TICK_STYLE = { fill: "#8f8a82", fontSize: 12 };
const GRID_STROKE = "rgba(120, 113, 108, 0.2)";
const TODAY_BAR = "#2f6df3";
const PRIOR_BAR = "#b7d2f7";

const PERFORMANCE_TOOLTIP_STYLE = {
  border: "1px solid rgba(120, 113, 108, 0.2)",
  borderRadius: "12px",
  background: "#ffffff",
  color: "#1f1f1e",
  boxShadow: "0 8px 20px -18px rgba(28, 25, 23, 0.35)",
};

const MemoizedPerformanceChart = memo(function MemoizedPerformanceChart({
  data,
}: {
  data: PerformanceChartPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} width={42} />
        <Tooltip
          cursor={{ fill: "rgba(183, 210, 247, 0.16)" }}
          contentStyle={PERFORMANCE_TOOLTIP_STYLE}
          labelStyle={{ color: "#8f8a82", fontWeight: 500 }}
          formatter={(value, name) => {
            const numericValue = typeof value === "number" ? value : Number(value);
            const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
            const seriesLabel = name === "current" ? "Today" : "Prior day";
            return [safeValue.toLocaleString(undefined, { maximumFractionDigits: 2 }), seriesLabel];
          }}
        />
        <Bar dataKey="prior" fill={PRIOR_BAR} radius={[7, 7, 0, 0]} maxBarSize={8} />
        <Bar dataKey="current" fill={TODAY_BAR} radius={[7, 7, 0, 0]} maxBarSize={8} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export function PerformanceCard({
  title,
  filterGroups,
  chartData,
  primaryKpi,
  secondaryKpis,
}: PerformanceCardProps) {
  const initialFilters = useMemo(
    () =>
      Object.fromEntries(
        filterGroups.map((group) => [group.id, group.defaultValue] as const),
      ),
    [filterGroups],
  );

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(initialFilters);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
  }, []);

  function cycleGroup(group: PerformanceFilterGroup) {
    const activeValue = selectedFilters[group.id] ?? group.defaultValue;
    const activeIndex = group.options.findIndex((option) => option.value === activeValue);
    const nextIndex = activeIndex >= 0 ? (activeIndex + 1) % group.options.length : 0;
    const nextValue = group.options[nextIndex]?.value ?? group.defaultValue;

    setSelectedFilters((previous) => {
      if (previous[group.id] === nextValue) {
        return previous;
      }

      return {
        ...previous,
        [group.id]: nextValue,
      };
    });
  }

  return (
    <Card
      data-testid="overview-performance-card"
      className="rounded-2xl border-border bg-card shadow-soft"
    >
      <CardHeader className="space-y-4 pb-4">
        <CardTitle className="text-[34px] leading-none tracking-tight text-foreground">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {filterGroups.map((group) => {
            const activeValue = selectedFilters[group.id] ?? group.defaultValue;
            const activeOption =
              group.options.find((option) => option.value === activeValue) ?? group.options[0];

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => cycleGroup(group)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                )}
                aria-label={`Change ${group.label} filter`}
              >
                <span className="text-muted-foreground">{group.label}</span>
                <span>{activeOption?.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <div className="pt-2">
            <KpiStat
              label={primaryKpi.label}
              value={primaryKpi.value}
              unavailable={primaryKpi.unavailable}
            />
            <div className="mt-8 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-sm bg-[#2f6df3]" />
                Today
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-sm bg-[#b7d2f7]" />
                Prior day
              </div>
            </div>
          </div>

          <div className="h-[280px] min-w-0">
            {chartReady ? (
              <MemoizedPerformanceChart data={chartData} />
            ) : (
              <div className="h-full w-full rounded-xl bg-secondary/50" />
            )}
          </div>
        </div>

        <div className="grid gap-5 border-t border-border pt-6 sm:grid-cols-2 xl:grid-cols-4">
          {secondaryKpis.map((kpi) => (
            <div key={kpi.id} className="space-y-1.5">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-[34px] font-semibold leading-none tracking-tight text-foreground">
                {kpi.value}
              </p>
              {kpi.unavailable ? <Pill>N/A</Pill> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
