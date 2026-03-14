import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";
import type { CompleteOnboardingRequest } from "../_shared/types.ts";
import { isNonEmptyString } from "../_shared/validation.ts";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();
  if (req.method !== "POST") return err("Method not allowed", 405);

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const body: CompleteOnboardingRequest = await req.json();

    // Validate required fields
    if (!body.organization?.name?.trim())
      return err("Organization name is required", 400);
    if (!body.organization?.type?.trim())
      return err("Organization type is required", 400);
    if (!body.organization?.timezone?.trim())
      return err("Timezone is required", 400);
    if (!Array.isArray(body.locations) || body.locations.length === 0)
      return err("At least one location is required", 400);

    for (const loc of body.locations) {
      if (!loc.name?.trim()) return err("Location name is required", 400);
      if (!loc.address?.trim()) return err("Location address is required", 400);
    }

    const db = createAdminClient();
    const now = new Date().toISOString();

    // 1. Create organization (retry on slug collision)
    let orgId: string | null = null;
    const baseSlug = slugify(body.organization.name) || "babytuna-org";

    for (let attempt = 0; attempt < 5; attempt++) {
      const suffix =
        attempt === 0 ? "" : `-${Math.random().toString(36).slice(2, 7)}`;
      const slug = `${baseSlug}${suffix}`;

      const { data, error } = await db
        .from("organizations")
        .insert({
          name: body.organization.name.trim(),
          slug,
          plan: "free",
          settings: {
            org_type: body.organization.type,
            timezone: body.organization.timezone,
            onboarding_completed_at: now,
          },
        })
        .select("id")
        .single();

      if (!error && data) {
        orgId = data.id;
        break;
      }

      // 23505 = unique_violation (slug collision)
      if (error?.code !== "23505") {
        return err(error?.message ?? "Failed to create organization", 500);
      }
    }

    if (!orgId) return err("Could not generate a unique organization slug", 500);

    // 2. Create org membership for the current user
    const { error: memberErr } = await db.from("org_memberships").upsert(
      {
        org_id: orgId,
        user_id: user.id,
        role: "owner",
        invited_at: now,
        accepted_at: now,
      },
      { onConflict: "org_id,user_id" },
    );

    if (memberErr) return err(memberErr.message, 500);

    // 3. Upsert profile
    const { error: profileErr } = await db.from("profiles").upsert(
      {
        id: user.id,
        org_id: orgId,
        full_name: null, // Will be filled from auth metadata on the client
      },
      { onConflict: "id" },
    );

    if (profileErr) return err(profileErr.message, 500);

    // 4. Create locations
    const locationPayloads = body.locations.map((loc) => ({
      org_id: orgId!,
      name: loc.name.trim(),
      address: loc.address.trim(),
      phone: loc.phone?.trim() || null,
    }));

    const { error: locErr } = await db
      .from("locations")
      .insert(locationPayloads);

    if (locErr) return err(locErr.message, 500);

    // 5. Create invites (if any)
    const invites = (body.invites ?? [])
      .map((i) => ({
        email: i.email.trim().toLowerCase(),
        role: i.role,
      }))
      .filter((i) => i.email.length > 0);

    if (invites.length > 0) {
      const { error: invErr } = await db.from("user_roles").upsert(
        invites.map((i) => ({
          org_id: orgId!,
          email: i.email,
          role: i.role,
          status: "pending",
          invited_by: user.id,
        })),
        { onConflict: "org_id,email" },
      );

      if (invErr) return err(invErr.message, 500);
    }

    // 6. Link Square integration if connected
    if (body.square?.status === "connected") {
      const intId = body.square.integrationId;
      const intState = body.square.oauthState;

      if (isNonEmptyString(intId)) {
        await db
          .from("integrations")
          .update({ org_id: orgId, status: "connected", updated_at: now })
          .eq("id", intId)
          .eq("user_id", user.id);
      } else if (isNonEmptyString(intState)) {
        await db
          .from("integrations")
          .update({ org_id: orgId, status: "connected", updated_at: now })
          .eq("oauth_state", intState)
          .eq("user_id", user.id);
      }
    }

    return ok({ orgId }, 201);
  } catch (e) {
    if (e instanceof SyntaxError) return err("Invalid request body", 400);
    return err("Internal server error", 500);
  }
});
