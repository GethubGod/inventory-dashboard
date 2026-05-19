import { DashboardPagePlaceholder } from "@/components/layout/dashboard-page-placeholder";

export default function QuickOrderPage() {
  return (
    <DashboardPagePlaceholder
      title="Quick Order Rules"
      description="Configure ordering rules, allowed units, limits, and aliases for the Quick Order system."
      comingSoonItems={[
        "Manage item allowed units (e.g., lb, case, bag)",
        "Set order limits (soft max, hard max, manager approval threshold)",
        "Configure item aliases for natural language ordering",
        "Review and approve AI parser suggestions",
        "Safety guardrails for automated ordering",
      ]}
    />
  );
}
