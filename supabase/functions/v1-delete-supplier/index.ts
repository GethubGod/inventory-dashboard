import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { DeleteSupplierRequest } from "../_shared/types.ts";
import { isNonEmptyString } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: DeleteSupplierRequest = await req.json();

    if (!isNonEmptyString(body.id)) return err("id is required", 400);
    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    // Check for linked inventory items before deleting
    const { count, error: countErr } = await db
      .from("inventory_items")
      .select("id", { count: "exact", head: true })
      .eq("org_id", body.orgId)
      .eq("supplier_id", body.id);

    if (countErr) return err("Failed to check linked items", 500);

    if ((count ?? 0) > 0) {
      return err(
        `Cannot delete supplier: ${count} inventory item(s) are still linked`,
        409,
      );
    }

    const { error: dbErr } = await db
      .from("suppliers")
      .delete()
      .eq("id", body.id)
      .eq("org_id", body.orgId);

    if (dbErr) return err("Failed to delete supplier", 500);

    return ok({ success: true });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
