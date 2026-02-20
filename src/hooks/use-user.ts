"use client";

import { useOrg } from "@/components/providers/org-provider";
import { useSupabase } from "@/components/providers/supabase-provider";

export function useUser() {
  const { user, session, isLoading } = useSupabase();
  const org = useOrg();

  return {
    user,
    session,
    isLoading,
    profile: org?.profile ?? null,
    membership: org?.membership ?? null,
    organization: org?.organization ?? null,
  };
}
