"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CategoryChartDatum = {
  category: string;
  value: number;
};

type OverviewCategoryChartsProps = {
  inventoryData: CategoryChartDatum[];
  usageData: CategoryChartDatum[] | null;
};

const CATEGORY_COLORS = [
  "#1c1917",
  "#78716c",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
];

function getColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

function CategoryBarChart({
  title,
  data,
  valueLabel,
}: {
  title: string;
  data: CategoryChartDatum[];
  valueLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={120}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
              contentStyle={{
                border: "1px solid rgba(148, 163, 184, 0.3)",
                borderRadius: "10px",
                background: "#0f172a",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value) => {
                const numericValue = typeof value === "number" ? value : Number(value);
                const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
                return [`${safeValue.toLocaleString()} ${valueLabel}`, "Value"];
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`${entry.category}-${index}`} fill={getColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function OverviewCategoryCharts({ inventoryData, usageData }: OverviewCategoryChartsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <CategoryBarChart title="Items by Category" data={inventoryData} valueLabel="items" />
      {usageData && usageData.length > 0 ? (
        <CategoryBarChart title="Usage by Category" data={usageData} valueLabel="units sold" />
      ) : (
        <div className="flex h-[384px] items-center justify-center rounded-xl border border-dashed border-border bg-secondary p-6 text-center">
          <div>
            <p className="text-sm font-medium text-foreground">Usage data not available yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Launch app and sync sales to unlock usage analytics by category.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
