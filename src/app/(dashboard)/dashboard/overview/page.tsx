import Link from "next/link";
import { formatDistanceToNow, subHours } from "date-fns";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  ClipboardCheck,
  Database as DatabaseIcon,
  Link2,
  PackageSearch,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { OverviewCategoryCharts } from "@/components/dashboard/overview/overview-category-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";
type GenericRow = Record<string, Json | undefined>;

type ActivityKind = "order" | "stock_check" | "recipe" | "import" | "sync";

type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  description: string;
  occurredAt: Date;
  actorId: string | null;
};

type AttentionItem = {
  id: string;
  icon: LucideIcon;
  message: string;
  href?: string;
  actionLabel?: string;
  tone: "warning" | "error" | "info";
};

const CONFIDENCE_SCORE: Record<string, number> = {
  none: 0,
  low: 30,
  medium: 60,
  high: 85,
};

const ACTIVITY_ICON: Record<ActivityKind, LucideIcon> = {
  order: ShoppingCart,
  stock_check: ClipboardCheck,
  recipe: ChefHat,
  import: DatabaseIcon,
  sync: RefreshCcw,
};

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

function getCategoryLabel(row: GenericRow) {
  return getFirstString(row, ["item_category", "category", "type", "group"]) ?? "Uncategorized";
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

function confidenceTone(score: number | null) {
  if (score === null) {
    return {
      text: "Not yet available",
      colorClass: "text-slate-500 dark:text-slate-400",
      pillClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    };
  }

  if (score > 70) {
    return {
      text: "Healthy",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      pillClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    };
  }

  if (score > 40) {
    return {
      text: "Moderate",
      colorClass: "text-amber-600 dark:text-amber-400",
      pillClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    };
  }

  return {
    text: "Low",
    colorClass: "text-red-600 dark:text-red-400",
    pillClass: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
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

  const categoryCounts = new Map<string, number>();
  const inventoryCategoryById = new Map<string, string>();
  for (const row of inventoryRows) {
    const rowId = toStringValue(row.id);
    const category = getCategoryLabel(row);

    if (rowId) {
      inventoryCategoryById.set(rowId, category);
    }

    if (isItemActive(row)) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  }

  const inventoryByCategory = Array.from(categoryCounts.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((left, right) => right.value - left.value);

  const uniqueCategoryCount = categoryCounts.size;

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
    soldCatalogItemCount > 0 ? Math.min(100, Math.round((mappedRecipeCount / soldCatalogItemCount) * 100)) : 0;

  const squareConnection = [...squareConnectionRows]
    .sort((left, right) => {
      const leftDate =
        getLatestDate(left, ["updated_at", "last_synced_at", "created_at"])?.getTime() ??
        0;
      const rightDate =
        getLatestDate(right, ["updated_at", "last_synced_at", "created_at"])?.getTime() ??
        0;
      return rightDate - leftDate;
    })
    .at(0);

  const isSquareConnected = Boolean(squareConnection);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todaysForecastRows = forecastRows.filter((row) => toStringValue(row.forecast_date) === todayIso);
  const confidenceScores = todaysForecastRows.map((row) => {
    const confidenceValue = toStringValue(row.confidence) ?? "none";
    return CONFIDENCE_SCORE[confidenceValue] ?? 0;
  });

  const averageConfidence =
    confidenceScores.length > 0
      ? confidenceScores.reduce((total, value) => total + value, 0) / confidenceScores.length
      : null;

  const confidenceVisual = confidenceTone(averageConfidence);

  const lastSyncedAt = squareConnection ? getLatestDate(squareConnection, ["last_synced_at"]) : null;
  const syncStatus = squareConnection ? toStringValue(squareConnection.sync_status) ?? "active" : "not_connected";
  const syncErrorMessage = squareConnection ? toStringValue(squareConnection.sync_error_message) : null;

  const syncIndicatorClass =
    syncStatus === "active"
      ? "bg-emerald-500"
      : syncStatus === "paused"
        ? "bg-amber-500"
        : syncStatus === "error"
          ? "bg-red-500"
          : "bg-slate-400";

  const recipeCategoriesByCatalog = new Map<string, Set<string>>();
  for (const recipe of recipeRows) {
    const catalogId = toStringValue(recipe.square_catalog_item_id);
    const inventoryItemId = toStringValue(recipe.inventory_item_id);

    if (!catalogId) {
      continue;
    }

    const resolvedCategory = inventoryItemId
      ? inventoryCategoryById.get(inventoryItemId) ?? "Unmapped"
      : "Unmapped";

    if (!recipeCategoriesByCatalog.has(catalogId)) {
      recipeCategoriesByCatalog.set(catalogId, new Set());
    }

    recipeCategoriesByCatalog.get(catalogId)?.add(resolvedCategory);
  }

  const usageByCategoryMap = new Map<string, number>();
  for (const saleRow of dailySalesRows) {
    const quantitySold = toNumberValue(saleRow.quantity_sold) ?? 0;
    if (quantitySold <= 0) {
      continue;
    }

    const catalogId = toStringValue(saleRow.square_catalog_item_id);
    const resolvedCategories = catalogId
      ? Array.from(recipeCategoriesByCatalog.get(catalogId) ?? ["Unmapped"])
      : ["Unmapped"];

    const splitQuantity = quantitySold / Math.max(resolvedCategories.length, 1);
    for (const category of resolvedCategories) {
      usageByCategoryMap.set(category, (usageByCategoryMap.get(category) ?? 0) + splitQuantity);
    }
  }

  const usageByCategory = Array.from(usageByCategoryMap.entries())
    .map(([category, value]) => ({
      category,
      value: Number(value.toFixed(2)),
    }))
    .sort((left, right) => right.value - left.value);

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
      actorId: getFirstString(order, ["submitted_by", "created_by", "user_id"]),
    });
  }

  for (const stockSession of stockSessionRows) {
    const occurredAt = getLatestDate(stockSession, ["completed_at", "updated_at", "created_at"]);
    if (!occurredAt) {
      continue;
    }

    rawActivity.push({
      id: `stock-${toStringValue(stockSession.id) ?? occurredAt.getTime()}`,
      kind: "stock_check",
      description: "Stock count session completed",
      occurredAt,
      actorId: getFirstString(stockSession, ["completed_by", "created_by", "user_id"]),
    });
  }

  for (const recipe of recipeRows) {
    const occurredAt = getLatestDate(recipe, ["updated_at", "created_at"]);
    if (!occurredAt) {
      continue;
    }

    const recipeName = getFirstString(recipe, ["square_item_name"]);
    rawActivity.push({
      id: `recipe-${toStringValue(recipe.id) ?? occurredAt.getTime()}`,
      kind: "recipe",
      description: recipeName
        ? `Recipe mapping updated for ${recipeName}`
        : "Recipe mapping added or updated",
      occurredAt,
      actorId: getFirstString(recipe, ["confirmed_by", "updated_by", "created_by"]),
    });
  }

  for (const batch of importBatchRows) {
    const status = toStringValue(batch.status);
    if (status !== "completed") {
      continue;
    }

    const occurredAt = getLatestDate(batch, ["completed_at", "created_at"]);
    if (!occurredAt) {
      continue;
    }

    const fileName = getFirstString(batch, ["file_name"]);
    rawActivity.push({
      id: `import-${toStringValue(batch.id) ?? occurredAt.getTime()}`,
      kind: "import",
      description: fileName ? `Data import completed (${fileName})` : "Data import completed",
      occurredAt,
      actorId: getFirstString(batch, ["uploaded_by", "created_by"]),
    });
  }

  for (const connection of squareConnectionRows) {
    const occurredAt = getLatestDate(connection, ["last_synced_at", "updated_at", "created_at"]);
    if (!occurredAt) {
      continue;
    }

    const status = toStringValue(connection.sync_status) ?? "active";
    const description =
      status === "error"
        ? "Square sync reported an error"
        : status === "paused"
          ? "Square sync paused"
          : "Square sync event completed";

    rawActivity.push({
      id: `sync-${toStringValue(connection.id) ?? occurredAt.getTime()}`,
      kind: "sync",
      description,
      occurredAt,
      actorId: null,
    });
  }

  const actorIds = Array.from(
    new Set(rawActivity.map((item) => item.actorId).filter(isNonEmptyString)),
  );

  let actorNameMap = new Map<string, string>();
  if (actorIds.length > 0) {
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", actorIds);

    if (profileRows) {
      actorNameMap = new Map(
        profileRows
          .map((profile) => [profile.id, profile.full_name ?? "Team member"] as const)
          .filter(([id]) => isNonEmptyString(id)),
      );
    }
  }

  const recentActivity = rawActivity
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, 10)
    .map((item) => ({
      ...item,
      actorName: item.actorId ? actorNameMap.get(item.actorId) ?? "Team member" : "System",
    }));

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
      icon: PackageSearch,
      message: `${unmappedItemCount} new menu items need recipe mapping`,
      href: "/dashboard/recipes",
      actionLabel: "Open recipes",
      tone: "warning",
    });
  }

  if (lowConfidenceCount > 0) {
    attentionItems.push({
      id: "low-confidence-forecasts",
      icon: TrendingUp,
      message: `${lowConfidenceCount} items have low forecast confidence`,
      href: "/dashboard/forecasts",
      actionLabel: "Review forecasts",
      tone: "warning",
    });
  }

  if (staleStockCount > 0) {
    attentionItems.push({
      id: "stale-stock-counts",
      icon: ClipboardCheck,
      message: `${staleStockCount} items haven't been counted in 3+ days`,
      href: "/dashboard/inventory",
      actionLabel: "Open inventory",
      tone: "info",
    });
  }

  if (syncStatus === "error") {
    attentionItems.push({
      id: "square-sync-error",
      icon: AlertTriangle,
      message: `Square sync error${syncErrorMessage ? `: ${syncErrorMessage}` : ""}`,
      href: "/dashboard/square",
      actionLabel: "Fix Square sync",
      tone: "error",
    });
  }

  if (needsReviewCount > 0) {
    attentionItems.push({
      id: "imports-needing-review",
      icon: DatabaseIcon,
      message: `${needsReviewCount} data import${needsReviewCount > 1 ? "s" : ""} need your review`,
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

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quick health check of inventory coverage, data quality, and sync reliability for your restaurant operation.
        </p>
      </header>

      {onboardingPrompt ? (
        <Card className="border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4 text-[#0d9488]" />
              Welcome to Babytuna Systems
            </CardTitle>
            <CardDescription>
              Your workspace is ready. Connect Square and import baseline inventory to start seeing operational insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="bg-[#0f172a] hover:bg-slate-800">
              <Link href="/dashboard/square">Connect Square</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/import">Import inventory data</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/recipes">Start recipe mapping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardDescription>Total Inventory Items</CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {totalInventoryItems.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {uniqueCategoryCount.toLocaleString()} {uniqueCategoryCount === 1 ? "category" : "categories"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardDescription>Mapped Recipes</CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isSquareConnected ? `${mappedRecipeCount} / ${soldCatalogItemCount} mapped` : "Connect Square"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isSquareConnected ? (
              <>
                <Progress value={mappingProgress} className="h-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {soldCatalogItemCount > 0
                    ? `${mappingProgress}% of sold menu items have recipe mappings.`
                    : "Sales synced, but no catalog items found yet."}
                </p>
              </>
            ) : (
              <Link href="/dashboard/square" className="text-sm font-medium text-[#0d9488] hover:underline">
                Connect Square to calculate mapping coverage
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardDescription>Forecast Confidence</CardDescription>
            <CardTitle className={cn("text-3xl font-bold", confidenceVisual.colorClass)}>
              {averageConfidence === null ? "Not yet available" : `${Math.round(averageConfidence)}%`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <span className={cn("inline-flex rounded-full px-2 py-1 text-xs font-medium", confidenceVisual.pillClass)}>
              {confidenceVisual.text}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on {todaysForecastRows.length.toLocaleString()} forecast item
              {todaysForecastRows.length === 1 ? "" : "s"} for today.
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardDescription>Last Square Sync</CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {lastSyncedAt ? formatDistanceToNow(lastSyncedAt, { addSuffix: true }) : "Not connected"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className={cn("h-2 w-2 rounded-full", syncIndicatorClass)} />
              <span className="capitalize">{syncStatus === "not_connected" ? "Not connected" : syncStatus}</span>
            </div>
            {!isSquareConnected ? (
              <Link href="/dashboard/square" className="text-sm font-medium text-[#0d9488] hover:underline">
                Set up Square integration
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest operational actions across orders, stock checks, mapping, imports, and syncs.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No recent activity yet. Start by importing data or syncing Square to populate this timeline.
              </div>
            ) : (
              <ul className="relative ml-3 border-l border-slate-200 pl-5 dark:border-slate-700">
                {recentActivity.map((activity) => {
                  const Icon = ACTIVITY_ICON[activity.kind];

                  return (
                    <li key={activity.id} className="relative pb-5 last:pb-0">
                      <span className="absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                        <Icon className="h-3 w-3 text-slate-500 dark:text-slate-300" />
                      </span>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.actorName} • {formatDistanceToNow(activity.occurredAt, { addSuffix: true })}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attention Needed</CardTitle>
            <CardDescription>Prioritized actions to keep your data and forecasting pipeline healthy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attentionItems.length === 0 ? (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-900/20">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">All caught up!</p>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                    Nothing needs attention right now.
                  </p>
                </div>
              </div>
            ) : (
              attentionItems.map((item) => {
                const Icon = item.icon;
                const toneClass =
                  item.tone === "error"
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
                    : item.tone === "warning"
                      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

                return (
                  <div key={item.id} className={cn("rounded-lg border p-4", toneClass)}>
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.message}</p>
                        {item.href ? (
                          <Button asChild size="sm" variant="outline" className="mt-3 border-current/30 bg-transparent">
                            <Link href={item.href}>
                              {item.actionLabel ?? "Review"}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>
              Distribution of active inventory items by category, with optional sales usage if Square data is available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryByCategory.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <PackageSearch className="mx-auto mb-2 h-6 w-6 text-slate-500 dark:text-slate-400" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No inventory categories yet</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add inventory items or import a sheet to generate category analytics.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button asChild size="sm" className="bg-[#0f172a] hover:bg-slate-800">
                    <Link href="/dashboard/import">Import Data</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard/inventory">Go to Inventory</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <OverviewCategoryCharts
                inventoryData={inventoryByCategory}
                usageData={usageByCategory.length > 0 ? usageByCategory : null}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {syncStatus === "error" && syncErrorMessage ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20">
          <CardContent className="flex items-start gap-3 p-4">
            <TriangleAlert className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-300" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Square sync needs attention</p>
              <p className="text-xs text-red-700/80 dark:text-red-300/80">{syncErrorMessage}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
