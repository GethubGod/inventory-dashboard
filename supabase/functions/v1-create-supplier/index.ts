import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, verifyOrgAccess } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { CreateSupplierRequest } from "../_shared/types.ts";
import { isNonEmptyString, normalizeSupplierRow } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: CreateSupplierRequest = await req.json();

    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);
    if (!isNonEmptyString(body.name)) return err("name is required", 400);

    const db = createAdminClient();
    if (!(await verifyOrgAccess(db, user.id, body.orgId)))
      return err("Access denied", 403);

    const payload = {
      org_id: body.orgId,
      name: body.name.trim(),
      category: body.category ?? "main_distributor",
      phone: body.phone?.trim() || null,
      email: body.email?.trim() || null,
      notes: body.notes?.trim() || null,
      active: body.active ?? true,
    };

    const { data, error: dbErr } = await db
      .from("suppliers")
      .insert(payload)
      .select("*")
      .single();

    if (dbErr || !data) return err("Failed to create supplier", 500);

    return ok(
      { supplier: normalizeSupplierRow(data as Record<string, unknown>) },
      201,
    );
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
