import { formatDistanceToNow, subHours } from "date-fns";

import { OverviewDashboard } from "@/components/dashboard/overview/overview-dashboard";
import type {
  PerformanceChartPoint,
  PerformanceFilterGroup,
  PerformanceKpi,
} from "@/components/dashboard/overview/performance-card";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

type GenericRow = Record<string, Json | undefined>;
type ActivityKind = "order" | "stock_check" | "recipe" | "import" | "sync";

type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  description: string;
  occurredAt: Date;
};

type AttentionItem = {
  id: string;
  message: string;
  href: string;
  actionLabel: string;
  tone: "warning" | "error" | "info";
};

const CONFIDENCE_SCORE: Record<string, number> = {
  none: 0,
  low: 30,
  medium: 60,
  high: 85,
};

const TWO_HOUR_BUCKETS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] as const;

const NET_SALES_KEYS = ["net_sales", "net_amount", "net_total", "amount", "total_amount"];
const GROSS_SALES_KEYS = ["gross_sales", "gross_amount", "gross_total", "total_sales"];
const TRANSACTION_ID_KEYS = ["square_order_id", "order_id", "order_number", "id"];

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function isNonEmptyString(value: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toStringValue(value: Json | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function toNumberValue(value: Json | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toDateValue(value: Json | undefined): Date | null {
  const stringValue = toStringValue(value);

  if (!stringValue) {
    return null;
  }

  const date = new Date(stringValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getLatestDate(row: GenericRow, keys: string[]): Date | null {
  for (const key of keys) {
    const parsedDate = toDateValue(row[key]);
    if (parsedDate) {
      return parsedDate;
    }
  }

  return null;
}

function getFirstString(row: GenericRow, keys: string[]): string | null {
  for (const key of keys) {
    const parsedValue = toStringValue(row[key]);
    if (parsedValue) {
      return parsedValue;
    }
  }

  return null;
}

function isItemActive(row: GenericRow) {
  const activeValue = row.active;
  return typeof activeValue === "boolean" ? activeValue : true;
}

function toDayKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function rowMatchesDay(row: GenericRow, keys: string[], targetDay: string) {
  const date = getLatestDate(row, keys);
  return date ? toDayKey(date) === targetDay : false;
}

function formatCurrency(value: number | null) {
  return CURRENCY_FORMATTER.format(value ?? 0);
}

function sumMetric(rows: GenericRow[], keys: string[]) {
  let total = 0;
  let foundAny = false;

  for (const row of rows) {
    for (const key of keys) {
      const numericValue = toNumberValue(row[key]);
      if (numericValue !== null) {
        total += numericValue;
        foundAny = true;
        break;
      }
    }
  }

  return foundAny ? total : null;
}

function formatHourLabel(hour: number) {
  if (hour === 0) {
    return "12a";
  }

  if (hour < 12) {
    return `${hour}a`;
  }

  if (hour === 12) {
    return "12p";
  }

  return `${hour - 12}p`;
}

function buildPerformanceChartData(
  dailySalesRows: GenericRow[],
  orderRows: GenericRow[],
  todayKey: string,
  priorDayKey: string,
) {
  const buckets = new Map<number, { current: number; prior: number }>();

  for (const hour of TWO_HOUR_BUCKETS) {
    buckets.set(hour, { current: 0, prior: 0 });
  }

  for (const row of dailySalesRows) {
    const soldAt = getLatestDate(row, ["sold_at", "created_at", "updated_at"]);
    if (!soldAt) {
      continue;
    }

    const dateKey = toDayKey(soldAt);
    if (dateKey !== todayKey && dateKey !== priorDayKey) {
      continue;
    }

    const quantitySold = toNumberValue(row.quantity_sold) ?? toNumberValue(row.quantity) ?? 0;
    if (quantitySold <= 0) {
      continue;
    }

    const bucketHour = Math.floor(soldAt.getHours() / 2) * 2;
    if (!buckets.has(bucketHour)) {
      continue;
    }

    if (dateKey === todayKey) {
      buckets.get(bucketHour)!.current += quantitySold;
    } else {
      buckets.get(bucketHour)!.prior += quantitySold;
    }
  }

  const hasSalesData = Array.from(buckets.values()).some(
    (item) => item.current > 0 || item.prior > 0,
  );

  if (!hasSalesData) {
    for (const row of orderRows) {
      const occurredAt = getLatestDate(row, ["submitted_at", "created_at", "updated_at", "order_date"]);
      if (!occurredAt) {
        continue;
      }

      const dateKey = toDayKey(occurredAt);
      if (dateKey !== todayKey && dateKey !== priorDayKey) {
        continue;
      }

      const bucketHour = Math.floor(occurredAt.getHours() / 2) * 2;
      if (!buckets.has(bucketHour)) {
        continue;
      }

      if (dateKey === todayKey) {
        buckets.get(bucketHour)!.current += 1;
      } else {
        buckets.get(bucketHour)!.prior += 1;
      }
    }
  }

  return TWO_HOUR_BUCKETS.map((hour) => ({
    label: formatHourLabel(hour),
    current: Number((buckets.get(hour)?.current ?? 0).toFixed(2)),
    prior: Number((buckets.get(hour)?.prior ?? 0).toFixed(2)),
  })) satisfies PerformanceChartPoint[];
}

async function resolveOrgId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string | null,
) {
  if (userId) {
    const { data: membership } = await supabase
      .from("org_memberships")
      .select("org_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (membership?.org_id) {
      return membership.org_id;
    }
  }

  const { data: firstOrganization } = await supabase
    .from("organizations")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstOrganization?.id) {
    return firstOrganization.id;
  }

  return "demo-org";
}

async function safeOrgFetch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  orgId: string,
  limit = 2500,
) {
  const scopedQuery = supabase.from(table).select("*").eq("org_id", orgId).limit(limit);
  const { data: scopedData, error: scopedError } = await scopedQuery;

  if (!scopedError) {
    return (scopedData as GenericRow[] | null) ?? [];
  }

  if (scopedError.code === "42703") {
    const fallbackQuery = supabase.from(table).select("*").limit(limit);
    const { data: fallbackData, error: fallbackError } = await fallbackQuery;
    if (!fallbackError) {
      return (fallbackData as GenericRow[] | null) ?? [];
    }
  }

  return [] as GenericRow[];
}

export default async function OverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const orgId = await resolveOrgId(supabase, user?.id ?? null);

  const [
    inventoryRowsRaw,
    recipeRowsRaw,
    dailySalesRowsRaw,
    forecastRowsRaw,
    squareConnectionRowsRaw,
    importBatchRowsRaw,
    unmappedMenuRowsRaw,
    orderRowsRaw,
    stockSessionRowsRaw,
    stockUpdateRowsRaw,
  ] = await Promise.all([
    safeOrgFetch(supabase, "inventory_items", orgId),
    safeOrgFetch(supabase, "recipes", orgId),
    safeOrgFetch(supabase, "daily_sales", orgId),
    safeOrgFetch(supabase, "demand_forecasts", orgId),
    safeOrgFetch(supabase, "square_connections", orgId, 20),
    safeOrgFetch(supabase, "import_batches", orgId, 200),
    safeOrgFetch(supabase, "unmapped_menu_items", orgId, 200),
    safeOrgFetch(supabase, "orders", orgId, 200),
    safeOrgFetch(supabase, "stock_check_sessions", orgId, 200),
    safeOrgFetch(supabase, "stock_updates", orgId, 4000),
  ]);

  const inventoryRows = inventoryRowsRaw as GenericRow[];
  const recipeRows = recipeRowsRaw as GenericRow[];
  const dailySalesRows = dailySalesRowsRaw as GenericRow[];
  const forecastRows = forecastRowsRaw as GenericRow[];
  const squareConnectionRows = squareConnectionRowsRaw as GenericRow[];
  const importBatchRows = importBatchRowsRaw as GenericRow[];
  const unmappedMenuRows = unmappedMenuRowsRaw as GenericRow[];
  const orderRows = orderRowsRaw as GenericRow[];
  const stockSessionRows = stockSessionRowsRaw as GenericRow[];
  const stockUpdateRows = stockUpdateRowsRaw as GenericRow[];

  const activeInventoryRows = inventoryRows.filter(isItemActive);
  const totalInventoryItems = activeInventoryRows.length;

  const mappedRecipeCatalogIds = new Set(
    recipeRows
      .map((row) => toStringValue(row.square_catalog_item_id))
      .filter(isNonEmptyString),
  );

  const uniqueSoldCatalogIds = new Set(
    dailySalesRows
      .map((row) => toStringValue(row.square_catalog_item_id))
      .filter(isNonEmptyString),
  );

  const mappedRecipeCount = mappedRecipeCatalogIds.size;
  const soldCatalogItemCount = uniqueSoldCatalogIds.size;
  const mappingProgress =
    soldCatalogItemCount > 0
      ? Math.min(100, Math.round((mappedRecipeCount / soldCatalogItemCount) * 100))
      : 0;

  const squareConnection = [...squareConnectionRows]
    .sort((left, right) => {
      const leftDate =
        getLatestDate(left, ["updated_at", "last_synced_at", "created_at"])?.getTime() ?? 0;
      const rightDate =
        getLatestDate(right, ["updated_at", "last_synced_at", "created_at"])?.getTime() ?? 0;
      return rightDate - leftDate;
    })
    .at(0);

  const isSquareConnected = Boolean(squareConnection);
  const syncStatus = squareConnection ? toStringValue(squareConnection.sync_status) ?? "active" : "not_connected";
  const syncErrorMessage = squareConnection ? toStringValue(squareConnection.sync_error_message) : null;
  const lastSyncedAt = squareConnection ? getLatestDate(squareConnection, ["last_synced_at"]) : null;

  const syncStatusTone =
    syncStatus === "active"
      ? "healthy"
      : syncStatus === "paused"
        ? "warning"
        : syncStatus === "error"
          ? "error"
          : "neutral";

  const syncStatusLabel =
    syncStatus === "not_connected"
      ? "Not connected"
      : `${syncStatus.charAt(0).toUpperCase()}${syncStatus.slice(1)}${
          lastSyncedAt ? ` • ${formatDistanceToNow(lastSyncedAt, { addSuffix: true })}` : ""
        }`;

  const now = new Date();
  const todayKey = toDayKey(now);
  const priorDayDate = new Date(now);
  priorDayDate.setDate(priorDayDate.getDate() - 1);
  const priorDayKey = toDayKey(priorDayDate);

  const todaysSalesRows = dailySalesRows.filter((row) =>
    rowMatchesDay(row, ["sold_at", "created_at", "updated_at"], todayKey),
  );
  const todaysOrderRows = orderRows.filter((row) =>
    rowMatchesDay(row, ["submitted_at", "created_at", "updated_at", "order_date"], todayKey),
  );

  const netSales =
    sumMetric(todaysSalesRows, NET_SALES_KEYS) ?? sumMetric(todaysOrderRows, NET_SALES_KEYS);
  const grossSales =
    sumMetric(todaysSalesRows, GROSS_SALES_KEYS) ?? sumMetric(todaysOrderRows, GROSS_SALES_KEYS);

  const transactionIds = new Set(
    [...todaysSalesRows, ...todaysOrderRows]
      .map((row) => getFirstString(row, TRANSACTION_ID_KEYS))
      .filter(isNonEmptyString),
  );
  const transactionCount = transactionIds.size > 0 ? transactionIds.size : null;
  const averageSale =
    netSales !== null && transactionCount !== null && transactionCount > 0
      ? netSales / transactionCount
      : null;

  const chartData = buildPerformanceChartData(
    dailySalesRows,
    orderRows,
    todayKey,
    priorDayKey,
  );

  const todaysForecastRows = forecastRows.filter((row) => toStringValue(row.forecast_date) === todayKey);
  const confidenceScores = todaysForecastRows.map((row) => {
    const confidenceValue = toStringValue(row.confidence) ?? "none";
    return CONFIDENCE_SCORE[confidenceValue] ?? 0;
  });
  const averageConfidence =
    confidenceScores.length > 0
      ? confidenceScores.reduce((total, value) => total + value, 0) / confidenceScores.length
      : null;

  const performanceFilters: PerformanceFilterGroup[] = [
    {
      id: "date",
      label: "Date",
      defaultValue: "today",
      options: [
        {
          value: "today",
          label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(now),
        },
      ],
    },
    {
      id: "comparison",
      label: "vs",
      defaultValue: "prior-day",
      options: [
        { value: "prior-day", label: "Prior day" },
        { value: "prior-week", label: "Prior week" },
      ],
    },
    {
      id: "checks",
      label: "Checks",
      defaultValue: "closed",
      options: [
        { value: "closed", label: "Closed" },
        { value: "all", label: "All" },
      ],
    },
  ];

  const primaryKpi: PerformanceKpi = {
    id: "net-sales",
    label: "Net sales",
    value: formatCurrency(netSales),
    unavailable: netSales === null,
  };

  const secondaryKpis: PerformanceKpi[] = [
    {
      id: "gross-sales",
      label: "Gross sales",
      value: formatCurrency(grossSales),
      unavailable: grossSales === null,
    },
    {
      id: "transactions",
      label: "Transactions",
      value: (transactionCount ?? 0).toLocaleString(),
      unavailable: transactionCount === null,
    },
    {
      id: "average-sale",
      label: "Average sale",
      value: formatCurrency(averageSale),
      unavailable: averageSale === null,
    },
    {
      id: "forecast-confidence",
      label: "Forecast confidence",
      value: averageConfidence === null ? "0%" : `${Math.round(averageConfidence)}%`,
      unavailable: averageConfidence === null,
    },
  ];

  const activityWindowStart = subHours(new Date(), 24);
  const rawActivity: ActivityEntry[] = [];

  for (const order of orderRows) {
    const occurredAt = getLatestDate(order, ["submitted_at", "created_at", "updated_at", "order_date"]);
    if (!occurredAt || occurredAt < activityWindowStart) {
      continue;
    }

    const orderReference = getFirstString(order, ["order_number", "display_id"]);
    rawActivity.push({
      id: `order-${toStringValue(order.id) ?? occurredAt.getTime()}`,
      kind: "order",
      description: orderReference ? `Order ${orderReference} submitted` : "New order submitted",
      occurredAt,
    });
  }

  for (const stockSession of stockSessionRows) {
    const occurredAt = getLatestDate(stockSession, ["completed_at", "updated_at", "created_at"]);
    if (!occurredAt || occurredAt < activityWindowStart) {
      continue;
    }

    rawActivity.push({
      id: `stock-${toStringValue(stockSession.id) ?? occurredAt.getTime()}`,
      kind: "stock_check",
      description: "Stock count session completed",
      occurredAt,
    });
  }

  for (const recipe of recipeRows) {
    const occurredAt = getLatestDate(recipe, ["updated_at", "created_at"]);
    if (!occurredAt || occurredAt < activityWindowStart) {
      continue;
    }

    const recipeName = getFirstString(recipe, ["square_item_name"]);
    rawActivity.push({
      id: `recipe-${toStringValue(recipe.id) ?? occurredAt.getTime()}`,
      kind: "recipe",
      description: recipeName
        ? `Recipe mapping updated for ${recipeName}`
        : "Recipe mapping updated",
      occurredAt,
    });
  }

  for (const batch of importBatchRows) {
    if ((toStringValue(batch.status) ?? "") !== "completed") {
      continue;
    }

    const occurredAt = getLatestDate(batch, ["completed_at", "created_at"]);
    if (!occurredAt || occurredAt < activityWindowStart) {
      continue;
    }

    const fileName = getFirstString(batch, ["file_name"]);
    rawActivity.push({
      id: `import-${toStringValue(batch.id) ?? occurredAt.getTime()}`,
      kind: "import",
      description: fileName ? `Data import completed (${fileName})` : "Data import completed",
      occurredAt,
    });
  }

  for (const connection of squareConnectionRows) {
    const occurredAt = getLatestDate(connection, ["last_synced_at", "updated_at", "created_at"]);
    if (!occurredAt || occurredAt < activityWindowStart) {
      continue;
    }

    const status = toStringValue(connection.sync_status) ?? "active";
    rawActivity.push({
      id: `sync-${toStringValue(connection.id) ?? occurredAt.getTime()}`,
      kind: "sync",
      description:
        status === "error"
          ? "Square sync reported an error"
          : status === "paused"
            ? "Square sync paused"
            : "Square sync completed",
      occurredAt,
    });
  }

  const recentActivity = rawActivity
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, 5);

  const lowConfidenceItems = new Set(
    forecastRows
      .filter((row) => {
        const confidenceValue = toStringValue(row.confidence) ?? "none";
        return confidenceValue === "low" || confidenceValue === "none";
      })
      .map((row) => toStringValue(row.inventory_item_id))
      .filter(isNonEmptyString),
  );

  const lowConfidenceCount =
    lowConfidenceItems.size > 0
      ? lowConfidenceItems.size
      : forecastRows.filter((row) => {
          const confidenceValue = toStringValue(row.confidence) ?? "none";
          return confidenceValue === "low" || confidenceValue === "none";
        }).length;

  const unmappedItemCount = unmappedMenuRows.filter(
    (row) => (toStringValue(row.status) ?? "needs_mapping") === "needs_mapping",
  ).length;

  const needsReviewCount = importBatchRows.filter(
    (row) => (toStringValue(row.status) ?? "") === "needs_review",
  ).length;

  const staleThreshold = subHours(new Date(), 72);
  let staleStockCount = 0;
  const hasLastCountedColumn = inventoryRows.some((row) => row.last_counted_at !== undefined);

  if (hasLastCountedColumn && activeInventoryRows.length > 0) {
    staleStockCount = activeInventoryRows.filter((row) => {
      const lastCountedAt = toDateValue(row.last_counted_at);
      return !lastCountedAt || lastCountedAt < staleThreshold;
    }).length;
  } else if (stockUpdateRows.length > 0 && activeInventoryRows.length > 0) {
    const countedRecentlyIds = new Set(
      stockUpdateRows
        .filter((row) => {
          const updatedAt = getLatestDate(row, ["created_at", "updated_at"]);
          return updatedAt !== null && updatedAt >= staleThreshold;
        })
        .map((row) => toStringValue(row.inventory_item_id))
        .filter(isNonEmptyString),
    );

    staleStockCount = Math.max(activeInventoryRows.length - countedRecentlyIds.size, 0);
  }

  const attentionItems: AttentionItem[] = [];

  if (unmappedItemCount > 0) {
    attentionItems.push({
      id: "unmapped-menu-items",
      message: `${unmappedItemCount} menu item${unmappedItemCount > 1 ? "s" : ""} need recipe mapping`,
      href: "/dashboard/recipes",
      actionLabel: "Open recipes",
      tone: "warning",
    });
  }

  if (lowConfidenceCount > 0) {
    attentionItems.push({
      id: "low-confidence-forecasts",
      message: `${lowConfidenceCount} item${lowConfidenceCount > 1 ? "s" : ""} have low forecast confidence`,
      href: "/dashboard/forecasts",
      actionLabel: "Review forecasts",
      tone: "warning",
    });
  }

  if (staleStockCount > 0) {
    attentionItems.push({
      id: "stale-stock-counts",
      message: `${staleStockCount} inventory item${staleStockCount > 1 ? "s" : ""} not counted in 3+ days`,
      href: "/dashboard/inventory",
      actionLabel: "Open inventory",
      tone: "info",
    });
  }

  if (syncStatus === "error") {
    attentionItems.push({
      id: "square-sync-error",
      message: `Square sync error${syncErrorMessage ? `: ${syncErrorMessage}` : ""}`,
      href: "/dashboard/square",
      actionLabel: "Fix sync",
      tone: "error",
    });
  }

  if (needsReviewCount > 0) {
    attentionItems.push({
      id: "imports-needing-review",
      message: `${needsReviewCount} import${needsReviewCount > 1 ? "s" : ""} need review`,
      href: "/dashboard/import",
      actionLabel: "Review imports",
      tone: "warning",
    });
  }

  const onboardingPrompt =
    totalInventoryItems === 0 &&
    mappedRecipeCount === 0 &&
    soldCatalogItemCount === 0 &&
    todaysForecastRows.length === 0;

  const offerDescription = onboardingPrompt
    ? "Launch app and import inventory data to activate live operations tracking."
    : isSquareConnected
      ? `${mappedRecipeCount} of ${soldCatalogItemCount || 0} sold items are mapped to recipes (${mappingProgress}%).`
      : "Square connection is offline. Reconnect to restore automated data syncs.";

  const offerActionLabel = "Launch app";

  const offerActionHref = !isSquareConnected
    ? "/dashboard/square"
    : mappingProgress < 100
      ? "/dashboard/recipes"
      : "/dashboard/forecasts";

  const latestActivity = recentActivity[0]
    ? `${recentActivity[0].description} • ${formatDistanceToNow(recentActivity[0].occurredAt, {
        addSuffix: true,
      })}`
    : null;

  const topAttention = attentionItems[0]?.message ?? null;

  const quickActions = [
    {
      label: "Launch app",
      href: "/dashboard/square",
      primary: true,
    },
    { label: "Import inventory data", href: "/dashboard/import" },
    { label: "Start recipe mapping", href: "/dashboard/recipes" },
  ];

  return (
    <OverviewDashboard
      performanceTitle="Performance"
      performanceFilters={performanceFilters}
      chartData={chartData}
      primaryKpi={primaryKpi}
      secondaryKpis={secondaryKpis}
      offerDescription={offerDescription}
      offerActionLabel={offerActionLabel}
      offerActionHref={offerActionHref}
      syncStatusLabel={syncStatusLabel}
      syncStatusTone={syncStatusTone}
      syncValue={formatCurrency(grossSales)}
      quickActions={quickActions}
      latestActivity={latestActivity}
      topAttention={topAttention}
    />
  );
}
