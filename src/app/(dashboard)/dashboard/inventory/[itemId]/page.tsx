import { notFound } from "next/navigation";

import { createServerApi } from "@/lib/api-client-server";

/**
 * Inventory item detail page.
 *
 * TODO: This is a typed skeleton for the future item detail view.
 * In the next phase, this will display:
 * - Basic item info (name, emoji, category)
 * - Supplier assignment
 * - Location mapping
 * - Unit configuration (base unit, pack unit, pack size)
 * - Active/inactive status
 * - Allowed units editor
 * - Default order unit
 * - Soft max / hard max / manager approval threshold
 * - Aliases
 * - Recent order history
 * - Parser/AI suggestions (future)
 */
export default async function InventoryItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  // Validate UUID format
  if (!/^[a-f0-9-]{32,36}$/i.test(itemId)) {
    notFound();
  }

  // TODO: Load item data from API in next phase
  const _api = await createServerApi();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Item Detail</h1>
        <p className="text-muted-foreground text-sm">Item ID: {itemId}</p>
      </header>

      <div className="border-border bg-secondary rounded-xl border border-dashed p-10 text-center">
        <p className="text-foreground text-sm font-medium">Item detail view coming soon</p>
        <p className="text-muted-foreground mt-1 text-sm">
          This page will show full item information, allowed units, order limits, aliases, and
          recent order history.
        </p>
      </div>
    </div>
  );
}
