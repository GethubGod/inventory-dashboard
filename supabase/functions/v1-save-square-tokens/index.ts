import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { SaveSquareTokensRequest } from "../_shared/types.ts";
import { isNonEmptyString } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: SaveSquareTokensRequest = await req.json();

    if (!isNonEmptyString(body.oauthState))
      return err("oauthState is required", 400);
    if (!isNonEmptyString(body.accessToken))
      return err("accessToken is required", 400);

    const db = createAdminClient();

    const { error: dbErr } = await db.from("integrations").upsert(
      {
        user_id: user.id,
        provider: "square",
        status: "connected",
        oauth_state: body.oauthState,
        merchant_id: body.merchantId ?? null,
        access_token: body.accessToken,
        refresh_token: body.refreshToken ?? null,
        token_expires_at: body.tokenExpiresAt ?? null,
        metadata: body.metadata ?? null,
      },
      { onConflict: "oauth_state" },
    );

    if (dbErr) return err("Failed to save Square tokens", 500);

    return ok({ success: true });
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
