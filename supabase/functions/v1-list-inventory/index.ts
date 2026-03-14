import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser, resolveAndVerifyOrg } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { ListInventoryRequest } from "../_shared/types.ts";
import { clampInt, normalizeInventoryRow } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: ListInventoryRequest =
      req.method === "GET" ? {} : await req.json();

    const db = createAdminClient();
    const orgId = await resolveAndVerifyOrg(db, user.id, body.orgId);
    if (!orgId) return err("Organization not found or access denied", 403);

    const limit = clampInt(body.limit, 1, 5000, 2500);
    const offset = clampInt(body.offset, 0, 100_000, 0);

    const { data, error: dbErr, count } = await db
      .from("inventory_items")
      .select("*", { count: "exact" })
      .eq("org_id", orgId)
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (dbErr) return err("Failed to fetch inventory items", 500);

    const items = ((data ?? []) as Record<string, unknown>[]).map(
      normalizeInventoryRow,
    );

    return ok({ items, total: count ?? items.length, orgId });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
