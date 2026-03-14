import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { GetIntegrationRequest } from "../_shared/types.ts";
import { isNonEmptyString } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: GetIntegrationRequest = await req.json();

    if (!isNonEmptyString(body.provider))
      return err("provider is required", 400);
    if (!isNonEmptyString(body.oauthState))
      return err("oauthState is required", 400);

    const db = createAdminClient();

    const { data, error: dbErr } = await db
      .from("integrations")
      .select("id, merchant_id")
      .eq("provider", body.provider)
      .eq("oauth_state", body.oauthState)
      .maybeSingle();

    if (dbErr) return err("Failed to fetch integration", 500);

    if (!data) return ok({ integration: null });

    return ok({
      integration: {
        id: data.id,
        merchantId: data.merchant_id,
      },
    });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
