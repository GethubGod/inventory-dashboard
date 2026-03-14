import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { UpdateIntegrationRequest } from "../_shared/types.ts";
import { isNonEmptyString } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: UpdateIntegrationRequest = await req.json();

    if (!isNonEmptyString(body.orgId)) return err("orgId is required", 400);
    if (!isNonEmptyString(body.status)) return err("status is required", 400);
    if (!body.id && !body.oauthState)
      return err("Either id or oauthState is required", 400);

    const db = createAdminClient();
    const now = new Date().toISOString();

    let query = db
      .from("integrations")
      .update({ org_id: body.orgId, status: body.status, updated_at: now })
      .eq("user_id", user.id);

    if (body.id) {
      query = query.eq("id", body.id);
    } else {
      query = query.eq("oauth_state", body.oauthState!);
    }

    const { error: dbErr } = await query;

    if (dbErr) return err("Failed to update integration", 500);

    return ok({ success: true });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
