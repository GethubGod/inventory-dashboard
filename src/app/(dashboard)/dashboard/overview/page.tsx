import { redirect } from "next/navigation";

import { OverviewDashboard } from "@/components/dashboard/overview/overview-dashboard";
import { createServerApi } from "@/lib/api-client-server";
import { createClient } from "@/lib/supabase/server";

export default async function OverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const api = await createServerApi();
  const { data, error } = await api.getOverviewData({});

  if (error || !data) {
    return (
      <OverviewDashboard
        performanceTitle="Performance"
        performanceFilters={[]}
        chartData={[]}
        primaryKpi={{
          id: "net-sales",
          label: "Net sales",
          value: "$0.00",
          unavailable: true,
        }}
        secondaryKpis={[]}
        offerDescription="Unable to load overview data. Please try again."
        offerActionLabel="Retry"
        offerActionHref="/dashboard/overview"
        syncStatusLabel="Unknown"
        syncStatusTone="neutral"
        syncValue="$0.00"
        quickActions={[]}
        latestActivity={null}
        topAttention={error ?? null}
      />
    );
  }

  return (
    <OverviewDashboard
      performanceTitle={data.performanceTitle}
      performanceFilters={data.performanceFilters}
      chartData={data.chartData}
      primaryKpi={data.primaryKpi}
      secondaryKpis={data.secondaryKpis}
      offerDescription={data.offerDescription}
      offerActionLabel={data.offerActionLabel}
      offerActionHref={data.offerActionHref}
      syncStatusLabel={data.syncStatusLabel}
      syncStatusTone={data.syncStatusTone}
      syncValue={data.syncValue}
      quickActions={data.quickActions}
      latestActivity={data.latestActivity}
      topAttention={data.topAttention}
    />
  );
}
