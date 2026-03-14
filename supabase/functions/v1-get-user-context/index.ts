import { createAdminClient } from "../_shared/supabase-client.ts";
import { getUser } from "../_shared/auth.ts";
import { ok, err, handleCors } from "../_shared/response.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return handleCors();

  try {
    const user = await getUser(req);
    if (!user) return err("Unauthorized", 401);

    const db = createAdminClient();

    const [{ data: dbProfile }, { data: dbMembership }] = await Promise.all([
      db.from("profiles").select("id, full_name").eq("id", user.id).maybeSingle(),
      db
        .from("org_memberships")
        .select("org_id, role, accepted_at")
        .eq("user_id", user.id)
        .not("accepted_at", "is", null)
        .order("accepted_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    let organization: { id: string; name: string } | null = null;

    if (dbMembership?.org_id) {
      const { data: dbOrg } = await db
        .from("organizations")
        .select("id, name")
        .eq("id", dbMembership.org_id)
        .maybeSingle();

      if (dbOrg) {
        organization = { id: dbOrg.id, name: dbOrg.name };
      }
    }

    return ok({
      profile: {
        id: user.id,
        fullName: dbProfile?.full_name ?? null,
      },
      membership: dbMembership
        ? { orgId: dbMembership.org_id, role: dbMembership.role ?? "member" }
        : null,
      organization,
    });
  } catch {
    return err("Internal server error", 500);
  }
});
