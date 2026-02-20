import { SuppliersPageClient } from "@/components/dashboard/inventory/suppliers-page-client";
import {
  normalizeInventoryRow,
  normalizeSupplierRow,
  type InventoryRow,
  type SupplierRow,
} from "@/components/dashboard/inventory/inventory-types";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type FetchableTable = "inventory_items" | "suppliers";

async function resolveOrgId(supabase: SupabaseServerClient, userId: string | null) {
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

  return firstOrganization?.id ?? "demo-org";
}

async function fetchOrgRows(
  supabase: SupabaseServerClient,
  table: FetchableTable,
  orgId: string,
  limit = 2500,
) {
  const { data, error } = await supabase.from(table).select("*").eq("org_id", orgId).limit(limit);

  if (!error) {
    return data ?? [];
  }

  if (error.code === "42703") {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from(table)
      .select("*")
      .limit(limit);

    if (!fallbackError) {
      return fallbackData ?? [];
    }
  }

  return [];
}

export default async function InventorySuppliersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const orgId = await resolveOrgId(supabase, user?.id ?? null);

  const [supplierRowsRaw, inventoryRowsRaw] = await Promise.all([
    fetchOrgRows(supabase, "suppliers", orgId, 1000),
    fetchOrgRows(supabase, "inventory_items", orgId, 5000),
  ]);

  const supplierRows = supplierRowsRaw as SupplierRow[];
  const inventoryRows = inventoryRowsRaw as InventoryRow[];

  const initialSuppliers = supplierRows
    .map(normalizeSupplierRow)
    .sort((left, right) => left.name.localeCompare(right.name));

  const initialItems = inventoryRows
    .map(normalizeInventoryRow)
    .sort((left, right) => left.name.localeCompare(right.name));

  return (
    <SuppliersPageClient
      orgId={orgId}
      initialSuppliers={initialSuppliers}
      initialItems={initialItems}
    />
  );
}
