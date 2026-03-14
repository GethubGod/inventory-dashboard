/**
 * Lightweight runtime validation helpers. We avoid heavy libraries like
 * zod in edge functions to minimise cold-start time.
 */

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isOptionalString(v: unknown): v is string | null | undefined {
  return v === null || v === undefined || typeof v === "string";
}

export function isOptionalNumber(v: unknown): v is number | null | undefined {
  return v === null || v === undefined || (typeof v === "number" && Number.isFinite(v));
}

export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}

export function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((i) => typeof i === "string");
}

export function clampInt(
  v: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return fallback;
  return Math.max(min, Math.min(max, Math.round(v)));
}

// ── Row normalization ──────────────────────────────────────
// Convert snake_case DB rows to camelCase DTOs so every client
// receives a consistent shape regardless of schema changes.

type GenericRow = Record<string, unknown>;

function safeStr(v: unknown): string | null {
  if (typeof v === "string") {
    const t = v.trim();
    return t.length > 0 ? t : null;
  }
  return null;
}

function safeNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

const ITEM_CATEGORIES = new Set([
  "fish", "protein", "produce", "dry", "dairy_cold",
  "frozen", "sauces", "packaging", "alcohol",
]);

const SUPPLIER_CATEGORIES = new Set([
  "fish_supplier", "main_distributor", "asian_market",
]);

function toItemCategory(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  return ITEM_CATEGORIES.has(s) ? s : "dry";
}

function toSupplierCategory(v: unknown): string | null {
  const s = typeof v === "string" ? v : "";
  return SUPPLIER_CATEGORIES.has(s) ? s : null;
}

export function normalizeInventoryRow(row: GenericRow) {
  return {
    id: row.id as string,
    orgId: row.org_id as string,
    name: safeStr(row.name) ?? "Untitled item",
    emoji: safeStr(row.emoji) ?? "📦",
    category: toItemCategory(row.item_category ?? row.category),
    supplierCategory: toSupplierCategory(row.supplier_category),
    baseUnit: safeStr(row.base_unit) ?? "unit",
    packUnit: safeStr(row.pack_unit),
    packSize: safeNum(row.pack_size),
    supplierId: safeStr(row.supplier_id),
    active: typeof row.active === "boolean" ? row.active : true,
    notes: safeStr(row.notes),
    createdAt: (row.created_at as string) ?? null,
    updatedAt: (row.updated_at as string) ?? null,
  };
}

export function normalizeSupplierRow(row: GenericRow) {
  return {
    id: row.id as string,
    name: safeStr(row.name) ?? "Unnamed supplier",
    category: toSupplierCategory(row.category),
    phone: safeStr(row.phone),
    email: safeStr(row.email),
    notes: safeStr(row.notes),
    active: typeof row.active === "boolean" ? row.active : true,
    createdAt: (row.created_at as string) ?? null,
    updatedAt: (row.updated_at as string) ?? null,
  };
}
