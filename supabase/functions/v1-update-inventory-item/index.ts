import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { UpdateInventoryItemRequest } from "../_shared/types.ts";
import { isNonEmptyString, normalizeInventoryRow } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: UpdateInventoryItemRequest = await req.json();

    if (!isNonEmptyString(body.id)) return err("id is required", 400);
    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    // Build the update payload from fields that were actually provided
    const values: Record<string, unknown> = {};
    if (body.name !== undefined) values.name = body.name.trim();
    if (body.emoji !== undefined) values.emoji = body.emoji?.trim() || null;
    if (body.category !== undefined) {
      values.category = body.category;
      values.item_category = body.category;
    }
    if (body.supplierCategory !== undefined)
      values.supplier_category = body.supplierCategory;
    if (body.baseUnit !== undefined) values.base_unit = body.baseUnit.trim();
    if (body.packUnit !== undefined)
      values.pack_unit = body.packUnit?.trim() || null;
    if (body.packSize !== undefined) values.pack_size = body.packSize;
    if (body.supplierId !== undefined)
      values.supplier_id = body.supplierId?.trim() || null;
    if (body.notes !== undefined) values.notes = body.notes?.trim() || null;
    if (body.active !== undefined) values.active = body.active;

    const { data, error: dbErr } = await db
      .from("inventory_items")
      .update(values)
      .eq("id", body.id)
      .eq("org_id", body.orgId)
      .select("*")
      .single();

    if (dbErr || !data) return err("Failed to update inventory item", 500);

    return ok({ item: normalizeInventoryRow(data as Record<string, unknown>) });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
