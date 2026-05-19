/**
 * Square OAuth state management utilities.
 *
 * Generates, stores, and validates cryptographic state tokens
 * to prevent CSRF and replay attacks during Square OAuth flows.
 *
 * NOTE: The oauth_states table was added in migration 0019 but may not
 * be in the generated Database type yet. We use explicit typing here
 * to avoid depending on type generation timing.
 */

import { createClient } from "@/lib/supabase/server";

const STATE_EXPIRY_MINUTES = 10;
const STATE_BYTE_LENGTH = 32;

/** Row shape for the oauth_states table. */
type OAuthStateRow = {
  id: string;
  user_id: string;
  org_id: string | null;
  provider: string;
  state_hash: string;
  redirect_path: string | null;
  used: boolean;
  expires_at: string;
  created_at: string;
  used_at: string | null;
};

/**
 * Generate a cryptographically secure random state string.
 */
function generateRandomState(): string {
  const array = new Uint8Array(STATE_BYTE_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a state string using SHA-256 for storage.
 * We store the hash instead of the raw state to prevent
 * database-side exposure of the actual token.
 */
async function hashState(state: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(state);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a new OAuth state token bound to the current user and org.
 *
 * @returns The raw state string to include in the OAuth redirect URL
 */
export async function createOAuthState(
  userId: string,
  orgId?: string | null,
  redirectPath?: string | null,
): Promise<string> {
  const state = generateRandomState();
  const stateHash = await hashState(state);

  const supabase = await createClient();

  const expiresAt = new Date(Date.now() + STATE_EXPIRY_MINUTES * 60 * 1000).toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("oauth_states").insert({
    user_id: userId,
    org_id: orgId ?? null,
    provider: "square",
    state_hash: stateHash,
    redirect_path: redirectPath ?? null,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(`Failed to create OAuth state: ${(error as { message: string }).message}`);
  }

  return state;
}

export type OAuthStateValidation =
  | {
      valid: true;
      userId: string;
      orgId: string | null;
      redirectPath: string | null;
    }
  | {
      valid: false;
      reason: string;
    };

/**
 * Validate an OAuth state token from the callback.
 *
 * Checks:
 * - State exists in the database
 * - State has not been used before (replay protection)
 * - State has not expired
 * - State belongs to the correct user (CSRF protection)
 *
 * If valid, marks the state as used immediately.
 */
export async function validateOAuthState(
  state: string,
  currentUserId: string,
): Promise<OAuthStateValidation> {
  if (!state || typeof state !== "string" || state.length < 16) {
    return { valid: false, reason: "Invalid state parameter." };
  }

  const stateHash = await hashState(state);
  const supabase = await createClient();

  // Look up the state record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: record, error } = await (supabase as any)
    .from("oauth_states")
    .select("*")
    .eq("state_hash", stateHash)
    .eq("provider", "square")
    .single();

  if (error || !record) {
    return { valid: false, reason: "Unknown or invalid OAuth state." };
  }

  const row = record as OAuthStateRow;

  // Check if already used (replay protection)
  if (row.used) {
    return { valid: false, reason: "OAuth state has already been used." };
  }

  // Check expiration
  if (new Date(row.expires_at) < new Date()) {
    return { valid: false, reason: "OAuth state has expired." };
  }

  // Verify user binding (CSRF protection)
  if (row.user_id !== currentUserId) {
    return {
      valid: false,
      reason: "OAuth state does not belong to current user.",
    };
  }

  // Mark as used immediately (before proceeding with token exchange)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from("oauth_states")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("id", row.id);

  if (updateError) {
    return { valid: false, reason: "Failed to mark OAuth state as used." };
  }

  return {
    valid: true,
    userId: row.user_id,
    orgId: row.org_id ?? null,
    redirectPath: row.redirect_path ?? null,
  };
}
