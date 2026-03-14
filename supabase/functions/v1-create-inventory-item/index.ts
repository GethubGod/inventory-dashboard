import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { CreateInventoryItemRequest } from "../_shared/types.ts";
import { isNonEmptyString, normalizeInventoryRow } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: CreateInventoryItemRequest = await req.json();

    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);
    if (!isNonEmptyString(body.name)) return err("name is required", 400);
    if (!isNonEmptyString(body.baseUnit))
      return err("baseUnit is required", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    const payload = {
      org_id: body.orgId,
      name: body.name.trim(),
      emoji: body.emoji?.trim() || null,
      category: body.category ?? "dry",
      item_category: body.category ?? "dry",
      supplier_category: body.supplierCategory ?? null,
      base_unit: body.baseUnit.trim(),
      pack_unit: body.packUnit?.trim() || null,
      pack_size:
        typeof body.packSize === "number" && Number.isFinite(body.packSize)
          ? body.packSize
          : null,
      supplier_id: body.supplierId?.trim() || null,
      notes: body.notes?.trim() || null,
      active: body.active ?? true,
    };

    const { data, error: dbErr } = await db
      .from("inventory_items")
      .insert(payload)
      .select("*")
      .single();

    if (dbErr || !data)
      return err("Failed to create inventory item", 500);

    return ok({ item: normalizeInventoryRow(data as Record<string, unknown>) }, 201);
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
