import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { BulkUpdateInventoryRequest } from "../_shared/types.ts";
import {
  isNonEmptyString,
  isStringArray,
  normalizeInventoryRow,
} from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: BulkUpdateInventoryRequest = await req.json();

    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);
    if (!isStringArray(body.ids) || body.ids.length === 0)
      return err("ids must be a non-empty array of strings", 400);
    if (!body.values || typeof body.values !== "object")
      return err("values is required", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    const dbValues: Record<string, unknown> = {};
    const v = body.values;
    if (v.category !== undefined) {
      dbValues.category = v.category;
      dbValues.item_category = v.itemCategory ?? v.category;
    }
    if (v.supplierCategory !== undefined)
      dbValues.supplier_category = v.supplierCategory;
    if (v.supplierId !== undefined)
      dbValues.supplier_id = v.supplierId?.trim() || null;
    if (v.active !== undefined) dbValues.active = v.active;

    const { data, error: dbErr } = await db
      .from("inventory_items")
      .update(dbValues)
      .eq("org_id", body.orgId)
      .in("id", body.ids)
      .select("*");

    if (dbErr) return err("Failed to bulk update inventory items", 500);

    const items = ((data ?? []) as Record<string, unknown>[]).map(
      normalizeInventoryRow,
    );

    return ok({ items });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
