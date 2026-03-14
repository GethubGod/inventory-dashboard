import { redirect } from "next/navigation";

import { InventoryPageClient } from "@/components/dashboard/inventory/inventory-page-client";
import { createServerApi } from "@/lib/api-client-server";
import { createClient } from "@/lib/supabase/server";

export default async function InventoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const api = await createServerApi();

  const [inventoryResult, suppliersResult] = await Promise.all([
    api.listInventory({}),
    api.listSuppliers({}),
  ]);

  const initialItems = inventoryResult.data?.items ?? [];
  const initialSuppliers = suppliersResult.data?.suppliers ?? [];
  const orgId = inventoryResult.data?.orgId ?? suppliersResult.data?.orgId ?? "demo-org";

  return (
    <InventoryPageClient
      orgId={orgId}
      initialItems={initialItems}
      initialSuppliers={initialSuppliers}
    />
  );
}
