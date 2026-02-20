import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div />,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
}));

import { OverviewDashboard } from "@/components/dashboard/overview/overview-dashboard";

describe("OverviewDashboard", () => {
  it("renders a single performance card and omits the old overview grid cards", () => {
    render(
      <OverviewDashboard
        performanceTitle="Performance"
        performanceFilters={[
          {
            id: "date",
            label: "Date",
            defaultValue: "today",
            options: [{ value: "today", label: "Feb 20" }],
          },
          {
            id: "comparison",
            label: "vs",
            defaultValue: "prior-day",
            options: [{ value: "prior-day", label: "Prior day" }],
          },
          {
            id: "checks",
            label: "Checks",
            defaultValue: "closed",
            options: [{ value: "closed", label: "Closed" }],
          },
        ]}
        chartData={[
          { label: "12a", current: 0, prior: 2 },
          { label: "2a", current: 1, prior: 1 },
          { label: "4a", current: 3, prior: 2 },
        ]}
        primaryKpi={{ id: "net-sales", label: "Net sales", value: "$0.00", unavailable: true }}
        secondaryKpis={[
          { id: "gross-sales", label: "Gross sales", value: "$0.00", unavailable: true },
          { id: "transactions", label: "Transactions", value: "0", unavailable: true },
          { id: "average-sale", label: "Average sale", value: "$0.00", unavailable: true },
          { id: "forecast", label: "Forecast confidence", value: "0%", unavailable: true },
        ]}
        offerDescription="Launch app to activate live metrics."
        offerActionLabel="Launch app"
        offerActionHref="/dashboard/square"
        syncStatusLabel="Not connected"
        syncStatusTone="neutral"
        syncValue="$0.00"
        quickActions={[
          { label: "Launch app", href: "/dashboard/square", primary: true },
          { label: "Import inventory data", href: "/dashboard/import" },
          { label: "Start recipe mapping", href: "/dashboard/recipes" },
        ]}
        latestActivity={null}
        topAttention={null}
      />,
    );

    expect(screen.getAllByTestId("overview-performance-card")).toHaveLength(1);
    expect(screen.queryByText("Total Inventory Items")).not.toBeInTheDocument();
    expect(screen.queryByText("Mapped Recipes")).not.toBeInTheDocument();
    expect(screen.queryByText("Recent Activity")).not.toBeInTheDocument();
    expect(screen.queryByText("Attention Needed")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Launch app" }).length).toBeGreaterThan(0);
    expect(screen.queryByText("Connect Square")).not.toBeInTheDocument();
  });
});
