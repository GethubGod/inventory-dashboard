import type { Database } from "@/types/database";

export const ITEM_CATEGORIES = [
  "fish",
  "protein",
  "produce",
  "dry",
  "dairy_cold",
  "frozen",
  "sauces",
  "packaging",
  "alcohol",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const SUPPLIER_CATEGORIES = [
  "fish_supplier",
  "main_distributor",
  "asian_market",
] as const;

export type SupplierCategory = (typeof SUPPLIER_CATEGORIES)[number];

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  fish: "Fish",
  protein: "Protein",
  produce: "Produce",
  dry: "Dry Goods",
  dairy_cold: "Dairy / Cold",
  frozen: "Frozen",
  sauces: "Sauces",
  packaging: "Packaging",
  alcohol: "Alcohol",
};

export const SUPPLIER_CATEGORY_LABELS: Record<SupplierCategory, string> = {
  fish_supplier: "Fish Supplier",
  main_distributor: "Main Distributor",
  asian_market: "Asian Market",
};

export type InventoryRow = Database["public"]["Tables"]["inventory_items"]["Row"];
export type InventoryInsert = Database["public"]["Tables"]["inventory_items"]["Insert"];
export type InventoryUpdate = Database["public"]["Tables"]["inventory_items"]["Update"];
export type SupplierRow = Database["public"]["Tables"]["suppliers"]["Row"];

export type InventoryItem = {
  id: string;
  orgId: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  supplierCategory: SupplierCategory | null;
  baseUnit: string;
  packUnit: string | null;
  packSize: number | null;
  supplierId: string | null;
  active: boolean;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SupplierOption = {
  id: string;
  name: string;
  category: SupplierCategory | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

const ITEM_CATEGORY_SET = new Set<string>(ITEM_CATEGORIES);
const SUPPLIER_CATEGORY_SET = new Set<string>(SUPPLIER_CATEGORIES);

export function toItemCategory(value: string | null | undefined): ItemCategory {
  if (value && ITEM_CATEGORY_SET.has(value)) {
    return value as ItemCategory;
  }

  return "dry";
}

export function toSupplierCategory(value: string | null | undefined): SupplierCategory | null {
  if (value && SUPPLIER_CATEGORY_SET.has(value)) {
    return value as SupplierCategory;
  }

  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function safeString(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function normalizeInventoryRow(row: InventoryRow): InventoryItem {
  const resolvedCategory = toItemCategory(row.item_category ?? row.category);

  return {
    id: row.id,
    orgId: row.org_id,
    name: safeString(row.name) || "Untitled item",
    emoji: safeString(row.emoji) || "📦",
    category: resolvedCategory,
    supplierCategory: toSupplierCategory(row.supplier_category),
    baseUnit: safeString(row.base_unit) || "unit",
    packUnit: safeString(row.pack_unit) || null,
    packSize: toNumber(row.pack_size),
    supplierId: safeString(row.supplier_id) || null,
    active: row.active ?? true,
    notes: safeString(row.notes) || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeSupplierRow(row: SupplierRow): SupplierOption {
  return {
    id: row.id,
    name: safeString(row.name) || "Unnamed supplier",
    category: toSupplierCategory(row.category),
    phone: safeString(row.phone) || null,
    email: safeString(row.email) || null,
    notes: safeString(row.notes) || null,
    active: row.active ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function labelForCategory(category: ItemCategory) {
  return ITEM_CATEGORY_LABELS[category] ?? category;
}

export function labelForSupplierCategory(category: SupplierCategory) {
  return SUPPLIER_CATEGORY_LABELS[category] ?? category;
}
