import { createClient } from "@/lib/supabase/server";
import { createApiClient, type ApiClient } from "@/lib/api-client";

/**
 * Create a server-side API client. Reads the user's access token from
 * the cookie-based Supabase session so edge functions can authenticate
 * the request.
 */
export async function createServerApi(): Promise<ApiClient> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token ?? null;

  return createApiClient(async () => token);
}
