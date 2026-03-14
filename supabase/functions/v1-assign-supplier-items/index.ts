import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { AssignSupplierItemsRequest } from "../_shared/types.ts";
import { isNonEmptyString, isStringArray } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: AssignSupplierItemsRequest = await req.json();

    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);
    if (!isStringArray(body.itemIds) || body.itemIds.length === 0)
      return err("itemIds must be a non-empty array", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    const { error: dbErr } = await db
      .from("inventory_items")
      .update({ supplier_id: body.supplierId ?? null })
      .eq("org_id", body.orgId)
      .in("id", body.itemIds);

    if (dbErr) return err("Failed to assign supplier to items", 500);

    return ok({ success: true, count: body.itemIds.length });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
