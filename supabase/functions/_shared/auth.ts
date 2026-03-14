import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createAdminClient, type AdminClient } from "./supabase-client.ts";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

/**
 * Extract the JWT from the Authorization header and verify it against
 * Supabase Auth. Returns the user on success, null on failure.
 */
export async function getUser(
  req: Request,
): Promise<AuthenticatedUser | null> {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.slice(7);

  // Use the anon key client purely for JWT verification
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return { id: user.id, email: user.email ?? "" };
}

/**
 * Resolve the user's primary org from their earliest membership. Falls
 * back to the first organization in the system for demo/dev environments.
 */
export async function resolveOrgId(
  db: AdminClient,
  userId: string,
): Promise<string | null> {
  const { data: membership } = await db
    .from("org_memberships")
    .select("org_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membership?.org_id) return membership.org_id;

  const { data: org } = await db
    .from("organizations")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return org?.id ?? null;
}

/**
 * Verify that the given user is a member of the given org.
 */
export async function verifyOrgAccess(
  db: AdminClient,
  userId: string,
  orgId: string,
): Promise<boolean> {
  const { data, error } = await db
    .from("org_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("org_id", orgId)
    .maybeSingle();

  return !error && !!data;
}

/**
 * Resolve orgId from the request body (if provided) or from the user's
 * membership. Returns null when no org can be determined.
 */
export async function resolveAndVerifyOrg(
  db: AdminClient,
  userId: string,
  requestedOrgId?: string | null,
): Promise<string | null> {
  if (requestedOrgId) {
    const hasAccess = await verifyOrgAccess(db, userId, requestedOrgId);
    return hasAccess ? requestedOrgId : null;
  }

  return resolveOrgId(db, userId);
}
