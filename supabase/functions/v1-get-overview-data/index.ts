import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, resolveAndVerifyOrg } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { GetOverviewDataRequest } from "../_shared/types.ts";

// ── Helpers ─────────────────────────────────────────

type Row = Record<string, unknown>;

function str(v: unknown): string | null {
  if (typeof v === "string") {
    const t = v.trim();
    return t.length > 0 ? t : null;
  }
  return null;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function toDate(v: unknown): Date | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function firstDate(row: Row, keys: string[]): Date | null {
  for (const k of keys) {
    const d = toDate(row[k]);
    if (d) return d;
  }
  return null;
}

function firstStr(row: Row, keys: string[]): string | null {
  for (const k of keys) {
    const s = str(row[k]);
    if (s) return s;
  }
  return null;
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function matchesDay(row: Row, keys: string[], target: string) {
  const d = firstDate(row, keys);
  return d ? dayKey(d) === target : false;
}

function sumMetric(rows: Row[], keys: string[]) {
  let total = 0;
  let found = false;
  for (const row of rows) {
    for (const k of keys) {
      const n = num(row[k]);
      if (n !== null) {
        total += n;
        found = true;
        break;
      }
    }
  }
  return found ? total : null;
}

function isActive(row: Row) {
  return typeof row.active === "boolean" ? row.active : true;
}

function formatCurrency(v: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v ?? 0);
}

function formatHour(h: number) {
  if (h === 0) return "12a";
  if (h < 12) return `${h}a`;
  if (h === 12) return "12p";
  return `${h - 12}p`;
}

const BUCKETS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] as const;
const NET_KEYS = ["net_sales", "net_amount", "net_total", "amount", "total_amount"];
const GROSS_KEYS = ["gross_sales", "gross_amount", "gross_total", "total_sales"];
const TXN_KEYS = ["square_order_id", "order_id", "order_number", "id"];

const CONFIDENCE_SCORE: Record<string, number> = {
  none: 0,
  low: 30,
  medium: 60,
  high: 85,
};

// ── Fetch helper ────────────────────────────────────

async function fetchTable(
  db: ReturnType<typeof createAdminClient>,
  table: string,
  orgId: string,
  limit = 2500,
): Promise<Row[]> {
  const { data, error } = await db
    .from(table)
    .select("*")
    .eq("org_id", orgId)
    .limit(limit);

  if (!error) return (data ?? []) as Row[];

  // Fallback if org_id column doesn't exist on the table
  if (error.code === "42703") {
    const { data: fb, error: fbErr } = await db
      .from(table)
      .select("*")
      .limit(limit);
    if (!fbErr) return (fb ?? []) as Row[];
  }

  return [];
}

// ── Main ────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: GetOverviewDataRequest =
      req.method === "GET" ? {} : await req.json();

    const db = createAdminClient();
    const orgId = await resolveAndVerifyOrg(db, user.id, body.orgId);
    if (!orgId) return err("Organization not found or access denied", 403);

    // Fetch all tables in parallel
    const [
      inventoryRows,
      recipeRows,
      dailySalesRows,
      forecastRows,
      squareConnRows,
      importBatchRows,
      unmappedRows,
      orderRows,
      stockSessionRows,
      stockUpdateRows,
    ] = await Promise.all([
      fetchTable(db, "inventory_items", orgId),
      fetchTable(db, "recipes", orgId),
      fetchTable(db, "daily_sales", orgId),
      fetchTable(db, "demand_forecasts", orgId),
      fetchTable(db, "square_connections", orgId, 20),
      fetchTable(db, "import_batches", orgId, 200),
      fetchTable(db, "unmapped_menu_items", orgId, 200),
      fetchTable(db, "orders", orgId, 200),
      fetchTable(db, "stock_check_sessions", orgId, 200),
      fetchTable(db, "stock_updates", orgId, 4000),
    ]);

    const activeItems = inventoryRows.filter(isActive);
    const totalInventoryItems = activeItems.length;

    // Recipe mapping progress
    const mappedIds = new Set(
      recipeRows.map((r) => str(r.square_catalog_item_id)).filter(Boolean),
    );
    const soldIds = new Set(
      dailySalesRows.map((r) => str(r.square_catalog_item_id)).filter(Boolean),
    );
    const mappedCount = mappedIds.size;
    const soldCount = soldIds.size;
    const mappingProgress =
      soldCount > 0
        ? Math.min(100, Math.round((mappedCount / soldCount) * 100))
        : 0;

    // Square connection
    const sqConn = [...squareConnRows]
      .sort((a, b) => {
        const ta =
          firstDate(a, ["updated_at", "last_synced_at", "created_at"])?.getTime() ?? 0;
        const tb =
          firstDate(b, ["updated_at", "last_synced_at", "created_at"])?.getTime() ?? 0;
        return tb - ta;
      })
      .at(0);

    const isSquareConnected = Boolean(sqConn);
    const syncStatus = sqConn ? str(sqConn.sync_status) ?? "active" : "not_connected";
    const syncErrorMsg = sqConn ? str(sqConn.sync_error_message) : null;
    const lastSyncedAt = sqConn ? firstDate(sqConn, ["last_synced_at"]) : null;

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
            lastSyncedAt
              ? ` • ${Math.round((Date.now() - lastSyncedAt.getTime()) / 60_000)}m ago`
              : ""
          }`;

    // Today / prior day keys
    const now = new Date();
    const todayKey = dayKey(now);
    const priorDate = new Date(now);
    priorDate.setDate(priorDate.getDate() - 1);
    const priorDayKey = dayKey(priorDate);

    const todaySales = dailySalesRows.filter((r) =>
      matchesDay(r, ["sold_at", "created_at", "updated_at"], todayKey),
    );
    const todayOrders = orderRows.filter((r) =>
      matchesDay(r, ["submitted_at", "created_at", "updated_at", "order_date"], todayKey),
    );

    const netSales = sumMetric(todaySales, NET_KEYS) ?? sumMetric(todayOrders, NET_KEYS);
    const grossSales =
      sumMetric(todaySales, GROSS_KEYS) ?? sumMetric(todayOrders, GROSS_KEYS);

    const txnIds = new Set(
      [...todaySales, ...todayOrders]
        .map((r) => firstStr(r, TXN_KEYS))
        .filter(Boolean),
    );
    const txnCount = txnIds.size > 0 ? txnIds.size : null;
    const avgSale =
      netSales !== null && txnCount !== null && txnCount > 0
        ? netSales / txnCount
        : null;

    // Chart data
    const buckets = new Map<number, { current: number; prior: number }>();
    for (const h of BUCKETS) buckets.set(h, { current: 0, prior: 0 });

    for (const row of dailySalesRows) {
      const d = firstDate(row, ["sold_at", "created_at", "updated_at"]);
      if (!d) continue;
      const dk = dayKey(d);
      if (dk !== todayKey && dk !== priorDayKey) continue;
      const qty = num(row.quantity_sold) ?? num(row.quantity) ?? 0;
      if (qty <= 0) continue;
      const bh = Math.floor(d.getHours() / 2) * 2;
      if (!buckets.has(bh)) continue;
      if (dk === todayKey) buckets.get(bh)!.current += qty;
      else buckets.get(bh)!.prior += qty;
    }

    const hasSales = Array.from(buckets.values()).some(
      (b) => b.current > 0 || b.prior > 0,
    );

    if (!hasSales) {
      for (const row of orderRows) {
        const d = firstDate(row, [
          "submitted_at",
          "created_at",
          "updated_at",
          "order_date",
        ]);
        if (!d) continue;
        const dk = dayKey(d);
        if (dk !== todayKey && dk !== priorDayKey) continue;
        const bh = Math.floor(d.getHours() / 2) * 2;
        if (!buckets.has(bh)) continue;
        if (dk === todayKey) buckets.get(bh)!.current += 1;
        else buckets.get(bh)!.prior += 1;
      }
    }

    const chartData = BUCKETS.map((h) => ({
      label: formatHour(h),
      current: Number((buckets.get(h)?.current ?? 0).toFixed(2)),
      prior: Number((buckets.get(h)?.prior ?? 0).toFixed(2)),
    }));

    // Forecast confidence
    const todayForecasts = forecastRows.filter(
      (r) => str(r.forecast_date) === todayKey,
    );
    const confScores = todayForecasts.map(
      (r) => CONFIDENCE_SCORE[str(r.confidence) ?? "none"] ?? 0,
    );
    const avgConf =
      confScores.length > 0
        ? confScores.reduce((a, b) => a + b, 0) / confScores.length
        : null;

    // Performance filters
    const dateLabel = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(now);

    const performanceFilters = [
      {
        id: "date",
        label: "Date",
        defaultValue: "today",
        options: [{ value: "today", label: dateLabel }],
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

    const primaryKpi = {
      id: "net-sales",
      label: "Net sales",
      value: formatCurrency(netSales),
      unavailable: netSales === null,
    };

    const secondaryKpis = [
      {
        id: "gross-sales",
        label: "Gross sales",
        value: formatCurrency(grossSales),
        unavailable: grossSales === null,
      },
      {
        id: "transactions",
        label: "Transactions",
        value: (txnCount ?? 0).toLocaleString(),
        unavailable: txnCount === null,
      },
      {
        id: "average-sale",
        label: "Average sale",
        value: formatCurrency(avgSale),
        unavailable: avgSale === null,
      },
      {
        id: "forecast-confidence",
        label: "Forecast confidence",
        value: avgConf === null ? "0%" : `${Math.round(avgConf)}%`,
        unavailable: avgConf === null,
      },
    ];

    // Activity (24h window)
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
    type Activity = { id: string; kind: string; description: string; occurredAt: string };
    const activity: Activity[] = [];

    for (const o of orderRows) {
      const d = firstDate(o, ["submitted_at", "created_at", "updated_at", "order_date"]);
      if (!d || d < windowStart) continue;
      const ref = firstStr(o, ["order_number", "display_id"]);
      activity.push({
        id: `order-${str(o.id) ?? d.getTime()}`,
        kind: "order",
        description: ref ? `Order ${ref} submitted` : "New order submitted",
        occurredAt: d.toISOString(),
      });
    }
    for (const s of stockSessionRows) {
      const d = firstDate(s, ["completed_at", "updated_at", "created_at"]);
      if (!d || d < windowStart) continue;
      activity.push({
        id: `stock-${str(s.id) ?? d.getTime()}`,
        kind: "stock_check",
        description: "Stock count session completed",
        occurredAt: d.toISOString(),
      });
    }
    for (const r of recipeRows) {
      const d = firstDate(r, ["updated_at", "created_at"]);
      if (!d || d < windowStart) continue;
      const name = firstStr(r, ["square_item_name"]);
      activity.push({
        id: `recipe-${str(r.id) ?? d.getTime()}`,
        kind: "recipe",
        description: name
          ? `Recipe mapping updated for ${name}`
          : "Recipe mapping updated",
        occurredAt: d.toISOString(),
      });
    }
    for (const b of importBatchRows) {
      if ((str(b.status) ?? "") !== "completed") continue;
      const d = firstDate(b, ["completed_at", "created_at"]);
      if (!d || d < windowStart) continue;
      const fn = firstStr(b, ["file_name"]);
      activity.push({
        id: `import-${str(b.id) ?? d.getTime()}`,
        kind: "import",
        description: fn ? `Data import completed (${fn})` : "Data import completed",
        occurredAt: d.toISOString(),
      });
    }
    for (const c of squareConnRows) {
      const d = firstDate(c, ["last_synced_at", "updated_at", "created_at"]);
      if (!d || d < windowStart) continue;
      const st = str(c.sync_status) ?? "active";
      activity.push({
        id: `sync-${str(c.id) ?? d.getTime()}`,
        kind: "sync",
        description:
          st === "error"
            ? "Square sync reported an error"
            : st === "paused"
              ? "Square sync paused"
              : "Square sync completed",
        occurredAt: d.toISOString(),
      });
    }

    activity.sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
    const recentActivity = activity.slice(0, 5);

    const latestActivity = recentActivity[0]
      ? `${recentActivity[0].description} • ${Math.round(
          (Date.now() - new Date(recentActivity[0].occurredAt).getTime()) / 60_000,
        )}m ago`
      : null;

    // Attention items
    const attentionItems: {
      id: string;
      message: string;
      href: string;
      actionLabel: string;
      tone: string;
    }[] = [];

    const unmappedCount = unmappedRows.filter(
      (r) => (str(r.status) ?? "needs_mapping") === "needs_mapping",
    ).length;
    if (unmappedCount > 0) {
      attentionItems.push({
        id: "unmapped-menu-items",
        message: `${unmappedCount} menu item${unmappedCount > 1 ? "s" : ""} need recipe mapping`,
        href: "/dashboard/recipes",
        actionLabel: "Open recipes",
        tone: "warning",
      });
    }

    const lowConfItems = new Set(
      forecastRows
        .filter((r) => {
          const c = str(r.confidence) ?? "none";
          return c === "low" || c === "none";
        })
        .map((r) => str(r.inventory_item_id))
        .filter(Boolean),
    );
    const lowConfCount =
      lowConfItems.size > 0
        ? lowConfItems.size
        : forecastRows.filter((r) => {
            const c = str(r.confidence) ?? "none";
            return c === "low" || c === "none";
          }).length;

    if (lowConfCount > 0) {
      attentionItems.push({
        id: "low-confidence-forecasts",
        message: `${lowConfCount} item${lowConfCount > 1 ? "s" : ""} have low forecast confidence`,
        href: "/dashboard/forecasts",
        actionLabel: "Review forecasts",
        tone: "warning",
      });
    }

    const staleThreshold = new Date(Date.now() - 72 * 60 * 60 * 1000);
    let staleCount = 0;
    const hasLastCounted = inventoryRows.some(
      (r) => r.last_counted_at !== undefined,
    );
    if (hasLastCounted && activeItems.length > 0) {
      staleCount = activeItems.filter((r) => {
        const d = toDate(r.last_counted_at);
        return !d || d < staleThreshold;
      }).length;
    } else if (stockUpdateRows.length > 0 && activeItems.length > 0) {
      const recent = new Set(
        stockUpdateRows
          .filter((r) => {
            const d = firstDate(r, ["created_at", "updated_at"]);
            return d !== null && d >= staleThreshold;
          })
          .map((r) => str(r.inventory_item_id))
          .filter(Boolean),
      );
      staleCount = Math.max(activeItems.length - recent.size, 0);
    }

    if (staleCount > 0) {
      attentionItems.push({
        id: "stale-stock-counts",
        message: `${staleCount} inventory item${staleCount > 1 ? "s" : ""} not counted in 3+ days`,
        href: "/dashboard/inventory",
        actionLabel: "Open inventory",
        tone: "info",
      });
    }

    if (syncStatus === "error") {
      attentionItems.push({
        id: "square-sync-error",
        message: `Square sync error${syncErrorMsg ? `: ${syncErrorMsg}` : ""}`,
        href: "/dashboard/square",
        actionLabel: "Fix sync",
        tone: "error",
      });
    }

    const needsReview = importBatchRows.filter(
      (r) => (str(r.status) ?? "") === "needs_review",
    ).length;
    if (needsReview > 0) {
      attentionItems.push({
        id: "imports-needing-review",
        message: `${needsReview} import${needsReview > 1 ? "s" : ""} need review`,
        href: "/dashboard/import",
        actionLabel: "Review imports",
        tone: "warning",
      });
    }

    const topAttention = attentionItems[0]?.message ?? null;

    const onboardingPrompt =
      totalInventoryItems === 0 &&
      mappedCount === 0 &&
      soldCount === 0 &&
      todayForecasts.length === 0;

    const offerDescription = onboardingPrompt
      ? "Launch app and import inventory data to activate live operations tracking."
      : isSquareConnected
        ? `${mappedCount} of ${soldCount || 0} sold items are mapped to recipes (${mappingProgress}%).`
        : "Square connection is offline. Reconnect to restore automated data syncs.";

    const offerActionHref = !isSquareConnected
      ? "/dashboard/square"
      : mappingProgress < 100
        ? "/dashboard/recipes"
        : "/dashboard/forecasts";

    return ok({
      performanceTitle: "Performance",
      performanceFilters,
      chartData,
      primaryKpi,
      secondaryKpis,
      offerDescription,
      offerActionLabel: "Launch app",
      offerActionHref,
      syncStatusLabel,
      syncStatusTone,
      syncValue: formatCurrency(grossSales),
      quickActions: [
        { label: "Launch app", href: "/dashboard/square", primary: true },
        { label: "Import inventory data", href: "/dashboard/import" },
        { label: "Start recipe mapping", href: "/dashboard/recipes" },
      ],
      latestActivity,
      topAttention,
    });
  } catch {
    return err("Internal server error", 500);
  }
});
