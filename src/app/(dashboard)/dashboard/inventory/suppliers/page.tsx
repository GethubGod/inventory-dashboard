import { redirect } from "next/navigation";

import { SuppliersPageClient } from "@/components/dashboard/inventory/suppliers-page-client";
import { createServerApi } from "@/lib/api-client-server";
import { createClient } from "@/lib/supabase/server";

export default async function InventorySuppliersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const api = await createServerApi();

  const [suppliersResult, inventoryResult] = await Promise.all([
    api.listSuppliers({}),
    api.listInventory({}),
  ]);

  const initialSuppliers = suppliersResult.data?.suppliers ?? [];
  const initialItems = inventoryResult.data?.items ?? [];
  const orgId = suppliersResult.data?.orgId ?? inventoryResult.data?.orgId ?? "demo-org";

  return (
    <SuppliersPageClient
      orgId={orgId}
      initialSuppliers={initialSuppliers}
      initialItems={initialItems}
    />
  );
}
