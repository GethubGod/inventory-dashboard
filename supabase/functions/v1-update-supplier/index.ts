import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { UpdateSupplierRequest } from "../_shared/types.ts";
import { isNonEmptyString, normalizeSupplierRow } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: UpdateSupplierRequest = await req.json();

    if (!isNonEmptyString(body.id)) return err("id is required", 400);
    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    const values: Record<string, unknown> = {};
    if (body.name !== undefined) values.name = body.name.trim();
    if (body.category !== undefined) values.category = body.category;
    if (body.phone !== undefined) values.phone = body.phone?.trim() || null;
    if (body.email !== undefined) values.email = body.email?.trim() || null;
    if (body.notes !== undefined) values.notes = body.notes?.trim() || null;
    if (body.active !== undefined) values.active = body.active;

    const { data, error: dbErr } = await db
      .from("suppliers")
      .update(values)
      .eq("id", body.id)
      .eq("org_id", body.orgId)
      .select("*")
      .single();

    if (dbErr || !data) return err("Failed to update supplier", 500);

    return ok({ supplier: normalizeSupplierRow(data as Record<string, unknown>) });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
