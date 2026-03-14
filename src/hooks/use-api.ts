"use client";

import { useMemo } from "react";

import { useSupabase } from "@/components/providers/supabase-provider";
import { createApiClient, type ApiClient } from "@/lib/api-client";

/**
 * React hook that returns a typed API client wired to the current
 * user's session. Use this in client components instead of calling
 * Supabase directly.
 */
export function useApi(): ApiClient {
  const { supabase } = useSupabase();

  return useMemo(
    () =>
      createApiClient(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token ?? null;
      }),
    [supabase],
  );
}
